import { type NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { WebClient } from "@slack/web-api";

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

type NotionTitle = { type?: string; title?: Array<{ plain_text?: string }> };
type NotionRichText = {
	type?: string;
	rich_text?: Array<{ plain_text?: string }>;
};
type NotionUrl = { type?: string; url?: string };

function isTitle(v: unknown): v is NotionTitle {
	return (
		typeof v === "object" &&
		v !== null &&
		(v as { type?: string }).type === "title"
	);
}
function isRichText(v: unknown): v is NotionRichText {
	return (
		typeof v === "object" &&
		v !== null &&
		(v as { type?: string }).type === "rich_text"
	);
}
function isUrl(v: unknown): v is NotionUrl {
	return (
		typeof v === "object" &&
		v !== null &&
		(v as { type?: string }).type === "url"
	);
}

function coerceString(v: unknown): string | undefined {
	if (typeof v === "string") return v || undefined;
	if (isTitle(v)) return v.title?.[0]?.plain_text;
	if (isRichText(v)) return v.rich_text?.[0]?.plain_text;
	if (isUrl(v)) return v.url;
	return undefined;
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
		const props = page.properties ?? {};

		const slug = props?.Slug?.title?.[0]?.plain_text as string | undefined;
		const destination = props?.Destination?.rich_text?.[0]?.plain_text as
			| string
			| undefined;
		const title =
			(props?.Title?.title?.[0]?.plain_text as string | undefined) || slug;
		const description = props?.Description?.rich_text?.[0]?.plain_text as
			| string
			| undefined;
		const details = props?.Details?.rich_text?.[0]?.plain_text as
			| string
			| undefined;
		const iconEmoji = page?.icon?.emoji as string | undefined;

		// image from Image/Thumbnail property or cover (no `any` casts)
		type UrlProp = { type?: string; url?: string };
		type RichTextProp = {
			type?: string;
			rich_text?: Array<{ plain_text?: string }>;
		};
		const asRecord = props as Record<string, unknown>;
		const rawImage =
			(asRecord?.Image as unknown) ?? (asRecord?.Thumbnail as unknown);

		function isUrlProp(v: unknown): v is UrlProp {
			return (
				typeof v === "object" &&
				v !== null &&
				(v as { type?: string }).type === "url"
			);
		}
		function isRichTextProp(v: unknown): v is RichTextProp {
			return (
				typeof v === "object" &&
				v !== null &&
				(v as { type?: string }).type === "rich_text"
			);
		}

		let imageUrl: string | undefined = undefined;
		if (isUrlProp(rawImage)) {
			imageUrl = rawImage.url;
		} else if (isRichTextProp(rawImage)) {
			imageUrl = rawImage.rich_text?.[0]?.plain_text;
		} else if (page?.cover?.external?.url) {
			imageUrl = page.cover.external.url as string;
		}

		// toggles and extras
		const linkTreeEnabled = boolFromSelectOrCheckbox(
			props?.["Link Tree Enabled"],
		);
		const category = props?.Category?.select?.name as string | undefined;
		type CheckboxProp = { checkbox?: boolean };
		type SelectProp = { select?: { name?: string } };
		const pinnedCheckbox = (
			props?.Pinned as unknown as CheckboxProp | undefined
		)?.checkbox;
		const pinnedSelectName = (
			props?.Pinned as unknown as SelectProp | undefined
		)?.select?.name;
		const pinned = Boolean(
			pinnedCheckbox || pinnedSelectName?.toString().toLowerCase() === "true",
		);
		const videoUrl = coerceString(props?.Video);

		// Files property
		let files: Array<{ name: string; url: string }> | undefined;
		type NotionFile =
			| { type: "file"; name?: string; file?: { url?: string } }
			| { type: "external"; name?: string; external?: { url?: string } };
		type FilesProp = { type?: string; files?: NotionFile[] };
		const filesProp = (props as Record<string, unknown>)?.Files as
			| FilesProp
			| undefined;
		if (filesProp?.type === "files" && Array.isArray(filesProp.files)) {
			files = filesProp.files
				.map((f) => {
					if (f.type === "file" && f.file?.url)
						return { name: f.name ?? "file", url: f.file.url };
					if (f.type === "external" && f.external?.url)
						return { name: f.name ?? "file", url: f.external.url };
					return undefined;
				})
				.filter((v): v is { name: string; url: string } => Boolean(v));
		}

		if (!slug || !destination) {
			return NextResponse.json(
				{ ok: false, error: "missing slug or destination" },
				{ status: 400 },
			);
		}

		const redis = Redis.fromEnv();
		await redis.hset(`campaign:${slug}`, {
			destination,
			utm: JSON.stringify({
				utm_source: props.utm_source?.rich_text?.[0]?.plain_text,
				utm_campaign: props.utm_campaign?.rich_text?.[0]?.plain_text,
				utm_medium: props.utm_medium?.rich_text?.[0]?.plain_text,
			}),
			linkTreeEnabled,
			title,
			description,
			details,
			iconEmoji,
			imageUrl,
			category,
			pinned,
			videoUrl,
			files: files ? JSON.stringify(files) : undefined,
		});

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
