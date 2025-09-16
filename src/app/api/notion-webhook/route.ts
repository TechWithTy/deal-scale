import { type NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { WebClient } from "@slack/web-api";
import { mapNotionPageToLinkTree } from "@/utils/notion/linktreeMapper";

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

// Initialize Slack
const slack = process.env.SLACK_TOKEN
	? new WebClient(process.env.SLACK_TOKEN)
	: null;
const slackChannel =
	process.env.SLACK_REDIRECT_CHANNEL || "notion-webhook-errors";

// Rate limiter: 10 requests per minute per IP
const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(10, "1 m"),
});

// Drop null/undefined keys from an object (for Redis HSET safety)
function removeNullUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}

// Safely read plain text from a rich_text property on a Notion page
function getRichTextPlain(
  props: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  if (!props) return undefined;
  const node = props[key] as { type?: string; rich_text?: Array<{ plain_text?: string }> } | undefined;
  if (node && node.type === "rich_text") {
    return node.rich_text?.[0]?.plain_text ?? undefined;
  }
  return undefined;
}

type NotionCheckbox = { type: "checkbox"; checkbox?: boolean };
type NotionSelect = { type: "select"; select?: { name?: string } };
function isCheckbox(v: unknown): v is NotionCheckbox {
	return (
		typeof v === "object" &&
		v !== null &&
		(v as { type?: string }).type === "checkbox"
	);
}
function isSelect(v: unknown): v is NotionSelect {
	return (
		typeof v === "object" &&
		v !== null &&
		(v as { type?: string }).type === "select"
	);
}
function boolFromSelectOrCheckbox(v: unknown): boolean {
    if (!v) return false;
    if (isCheckbox(v)) return Boolean(v.checkbox);
    if (isSelect(v)) {
        const name = (v.select?.name ?? "").toString().toLowerCase();
        return name === "true" || name === "yes" || name === "enabled";
    }
    return false;
}

async function sendSlackAlert(error: string, pageId?: string) {
    if (!slack) return;
    try {
        await slack.chat.postMessage({
            channel: slackChannel,
            text: `Notion webhook failed: ${error}${pageId ? `\nPage: ${pageId}` : ""}`,
        });
    } catch (err) {
        console.error("Slack alert failed:", err);
    }
}

async function fetchNotionPage(pageId: string) {
	const resp = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
		headers: {
			Authorization: `Bearer ${process.env.NOTION_KEY}`,
			"Notion-Version": NOTION_VERSION,
			"Content-Type": "application/json",
		},
		cache: "no-store",
	});
	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(`Notion page fetch failed ${resp.status}: ${text}`);
	}
	return resp.json();
}

export async function POST(req: NextRequest) {
	// Rate limit by IP (derive from headers; NextRequest has no `ip` property)
	const forwardedFor =
		req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
	const ip = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
	const { success } = await ratelimit.limit(`notion_wh:${ip}`);
	if (!success) {
		return NextResponse.json(
			{ ok: false, error: "rate limited" },
			{ status: 429 },
		);
	}

	let pageId: string | undefined;
	try {
		// Verify secret
		const provided =
			req.headers.get("x-webhook-secret") ||
			req.headers.get("X-Webhook-Secret");
		const expected = process.env.NOTION_WEBHOOK_SECRET;
		if (!expected || provided !== expected) {
			return NextResponse.json(
				{ ok: false, error: "unauthorized" },
				{ status: 401 },
			);
		}

		type WebhookBody = { page_id?: string; pageId?: string; id?: string };
		let body: WebhookBody = {};
		try {
			body = (await req.json()) as WebhookBody;
		} catch {
			body = {};
		}
		pageId = body.page_id ?? body.pageId ?? body.id;
		if (!pageId) {
			return NextResponse.json(
				{ ok: false, error: "missing page_id" },
				{ status: 400 },
			);
		}

		const page = await fetchNotionPage(pageId);
		const mapped = mapNotionPageToLinkTree(page);
		const { slug, destination } = mapped;

		if (!slug || !destination) {
			return NextResponse.json(
				{ ok: false, error: "missing slug or destination" },
				{ status: 400 },
			);
		}

		const redis = Redis.fromEnv();
		const key = `campaign:${slug}`;

		// Remove stale media fields if absent now
		if (!mapped.imageUrl) { try { await redis.hdel(key, "imageUrl"); } catch { /* noop */ } }
		if (!mapped.videoUrl) { try { await redis.hdel(key, "videoUrl"); } catch { /* noop */ } }
		if (!mapped.files || mapped.files.length === 0) { try { await redis.hdel(key, "files"); } catch { /* noop */ } }

		const propsRec = page?.properties as Record<string, unknown> | undefined;
		const utm = {
			utm_source: getRichTextPlain(propsRec, 'utm_source'),
			utm_campaign: getRichTextPlain(propsRec, 'utm_campaign'),
			utm_medium: getRichTextPlain(propsRec, 'utm_medium'),
		};
		const payload = removeNullUndefined({
			destination,
			utm: JSON.stringify(utm),
			linkTreeEnabled: mapped.linkTreeEnabled,
			title: mapped.title,
			description: mapped.description,
			details: mapped.details,
			iconEmoji: mapped.iconEmoji,
			imageUrl: mapped.imageUrl,
			category: mapped.category,
			pinned: mapped.pinned,
			videoUrl: mapped.videoUrl,
			files: mapped.files ? JSON.stringify(mapped.files) : undefined,
		});
		await redis.hset(key, payload);

		// Trigger UI revalidation (ensure your data fetch uses this tag)
		try { revalidateTag("link-tree"); } catch { /* best effort */ }

		return NextResponse.json({ ok: true, slug });
	} catch (err: unknown) {
		const errorMsg = err instanceof Error ? err.message : "internal error";
		await sendSlackAlert(errorMsg, pageId);
		return NextResponse.json({ ok: false, error: errorMsg }, { status: 500 });
	}
}

export async function GET() {
	return NextResponse.json({ ok: true, message: "notion webhook alive" });
}
