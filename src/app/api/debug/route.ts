import { NextResponse } from "next/server";

// ---- Types (minimal, only what's needed for diagnostics) ----
interface LinktreePreviewRow {
	pageId: string | null;
	slug: string | null;
	destination: string | null;
	title: string | null;
	highlighted: boolean;
	category: string | null;
}

// ---- Type guards ----
function isRichText(
	p: NotionProperty | undefined,
): p is Extract<NotionProperty, { type: "rich_text" }> {
	return Boolean(p && p.type === "rich_text");
}
function isTitle(
	p: NotionProperty | undefined,
): p is Extract<NotionProperty, { type: "title" }> {
	return Boolean(p && p.type === "title");
}
function isUrl(
	p: NotionProperty | undefined,
): p is Extract<NotionProperty, { type: "url" }> {
	return Boolean(p && p.type === "url");
}
function isCheckbox(
	p: NotionProperty | undefined,
): p is Extract<NotionProperty, { type: "checkbox" }> {
	return Boolean(p && p.type === "checkbox");
}
function isSelect(
	p: NotionProperty | undefined,
): p is Extract<NotionProperty, { type: "select" }> {
	return Boolean(p && p.type === "select");
}

type LinktreeItem = Record<string, unknown>;

type NotionTextSpan = { plain_text?: string };
type NotionSelect = { name?: string };

type NotionProperty =
	| { type: "rich_text"; rich_text?: NotionTextSpan[] }
	| { type: "title"; title?: NotionTextSpan[] }
	| { type: "url"; url?: string }
	| { type: "checkbox"; checkbox?: boolean }
	| { type: "select"; select?: NotionSelect }
	| { type: string };

interface NotionPage {
	id: string;
	properties?: Record<string, NotionProperty>;
}

interface NotionQueryResponse {
	results?: NotionPage[];
}

interface DebugRow {
	pageId: string;
	title: string | null;
	slug: string | null;
	destination: string | null;
	destination_sanitized: string | null;
	enabled: boolean;
	raw: {
		lte: {
			type: string | null;
			checkbox: boolean | null;
			select: string | null;
		};
		slug: { type: string | null };
		destination: { type: string | null };
	};
	reasons: string[];
}

function parseDevRedirects(): Record<string, string> {
	const out: Record<string, string> = {};
	const raw = process.env.DEV_REDIRECTS?.trim();
	if (raw) {
		try {
			const obj = JSON.parse(raw) as Record<string, string>;
			for (const [k, v] of Object.entries(obj))
				out[k.toLowerCase()] = String(v);
			return out;
		} catch {
			for (const pair of raw.split(",")) {
				const [k, v] = pair.split("=");
				if (k && v) out[k.trim().toLowerCase()] = v.trim();
			}
			if (Object.keys(out).length) return out;
		}
	}
	return out;
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const q = url.searchParams;
	const slug = (q.get("slug") || "").toLowerCase().replace(/^\//, "");
	const echoTo = q.get("to") || undefined;
	const limitParam = q.get("limit");
	const limit = limitParam
		? Math.max(1, Math.min(500, Number(limitParam) || 0))
		: undefined;
	const requestHeaders = Object.fromEntries(new Headers(req.headers).entries());

	const devRedirects = parseDevRedirects();
	const notionConfigured =
		Boolean(process.env.NOTION_KEY) && Boolean(process.env.NOTION_REDIRECTS_ID);

	// Try to sample the LinkTree API
	let linktreeSample: { count?: number; ok: boolean; error?: string } = {
		ok: true,
	};
	let linktreeHeaders: Record<string, string> | undefined;
	let linktreePreview: LinktreePreviewRow[] | undefined;
	let linktreeItems: LinktreeItem[] | undefined;
	let notionInvalids: DebugRow[] | undefined;
	let notionAllRows: DebugRow[] | undefined;
	try {
		const res = await fetch(`${url.origin}/api/linktree`, {
			cache: "no-store",
		});
		if (res.ok) {
			const data = (await res.json()) as unknown;
			const items: LinktreeItem[] = Array.isArray(
				(data as Record<string, unknown>)?.items,
			)
				? ((data as Record<string, unknown>).items as LinktreeItem[])
				: Array.isArray(data)
					? (data as LinktreeItem[])
					: [];
			linktreeSample = { ok: true, count: items.length };
			linktreeHeaders = Object.fromEntries(res.headers.entries());
			linktreePreview = items.slice(0, 5).map(
				(it: LinktreeItem): LinktreePreviewRow => ({
					pageId:
						(it.pageId as string | undefined) ??
						(it.id as string | undefined) ??
						null,
					slug: (it.slug as string | undefined) ?? null,
					destination: (it.destination as string | undefined) ?? null,
					title: (it.title as string | undefined) ?? null,
					highlighted: Boolean(it.highlighted),
					category: (it.category as string | undefined) ?? null,
				}),
			);
			linktreeItems = limit ? items.slice(0, limit) : items;
		} else {
			linktreeSample = { ok: false, error: `linktree status ${res.status}` };
		}
	} catch (e) {
		linktreeSample = { ok: false, error: (e as Error).message };
	}

	const sampleResolution = slug
		? { slug, devHit: devRedirects[slug] ?? null }
		: undefined;

	// Notion diagnostics: show rows that are Link Tree Enabled but have missing slug or invalid destination
	try {
		const NOTION_KEY = process.env.NOTION_KEY;
		const NOTION_DB = process.env.NOTION_REDIRECTS_ID;
		if (NOTION_KEY && NOTION_DB) {
			const res = await fetch(
				`https://api.notion.com/v1/databases/${NOTION_DB}/query`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${NOTION_KEY}`,
						"Notion-Version": "2022-06-28",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ page_size: 100 }),
				},
			);
			if (res.ok) {
				const data = (await res.json()) as NotionQueryResponse;
				const sanitize = (s: string | undefined): string =>
					(s ?? "")
						.replace(/\uFEFF/g, "")
						.replace(/\u00A0/g, " ")
						.trim();
				const readTxt = (
					prop: NotionProperty | undefined,
				): string | undefined => {
					try {
						if (!prop) return undefined;
						if (isRichText(prop)) {
							const arr = (prop.rich_text ?? []) as NotionTextSpan[];
							const joined = arr
								.map((t) => t.plain_text ?? "")
								.join("")
								.trim();
							return joined || undefined;
						}
						if (isTitle(prop)) {
							const arr = (prop.title ?? []) as NotionTextSpan[];
							const joined = arr
								.map((t) => t.plain_text ?? "")
								.join("")
								.trim();
							return joined || undefined;
						}
						if (isUrl(prop)) return (prop.url as string | undefined)?.trim();
						return undefined;
					} catch {
						return undefined;
					}
				};
				const isValidAbsoluteHttpUrl = (s: string): boolean => {
					try {
						const u = new URL(s);
						return (
							(u.protocol === "http:" || u.protocol === "https:") &&
							Boolean(u.hostname)
						);
					} catch {
						return false;
					}
				};
				const invalids: DebugRow[] = [];
				const allRows: DebugRow[] = [];
				for (const page of (data.results ?? []) as NotionPage[]) {
					const props =
						page.properties ?? ({} as Record<string, NotionProperty>);
					const lte = props?.["Link Tree Enabled"] as
						| NotionProperty
						| undefined;
					let enabled = false;
					if (isCheckbox(lte)) enabled = Boolean(lte.checkbox);
					else if (isSelect(lte)) {
						const name = (lte.select?.name ?? "").toString().toLowerCase();
						enabled = name === "true" || name === "yes" || name === "enabled";
					}
					const typeProp = props.Type as NotionProperty | undefined;
					if (
						!enabled &&
						isSelect(typeProp) &&
						typeProp.select?.name === "LinkTree"
					)
						enabled = true;
					const slugTxt = readTxt(props.Slug as NotionProperty | undefined);
					const titleTxt = readTxt(props.Title as NotionProperty | undefined);
					const destTxtRaw = readTxt(
						props.Destination as NotionProperty | undefined,
					);
					const destTxt = sanitize(destTxtRaw);
					const reasons: string[] = [];
					if (!slugTxt && !(titleTxt || "").startsWith("/"))
						reasons.push("missing slug");
					if (!destTxt) reasons.push("missing destination");
					else if (
						/^https?:/i.test(destTxt) &&
						!isValidAbsoluteHttpUrl(destTxt)
					)
						reasons.push("invalid absolute destination");
					const row: DebugRow = {
						pageId: page.id,
						title: titleTxt ?? null,
						slug: slugTxt ?? null,
						destination: destTxtRaw ?? null,
						destination_sanitized: destTxt || null,
						enabled,
						raw: {
							lte: {
								type: lte?.type ?? null,
								checkbox: isCheckbox(lte) ? (lte.checkbox ?? null) : null,
								select: isSelect(lte) ? (lte.select?.name ?? null) : null,
							},
							slug: { type: props.Slug?.type ?? null },
							destination: { type: props.Destination?.type ?? null },
						},
						reasons,
					};
					allRows.push(row);
					if (enabled && reasons.length) invalids.push(row);
				}
				notionInvalids = invalids;
				notionAllRows = allRows.slice(0, 50);
			}
		}
	} catch {
		// ignore debug errors
	}

	return NextResponse.json({
		ok: true,
		now: new Date().toISOString(),
		nodeEnv: process.env.NODE_ENV,
		request: {
			pathname: url.pathname,
			query: Object.fromEntries(url.searchParams.entries()),
			headers: requestHeaders,
		},
		notion: {
			hasKey: Boolean(process.env.NOTION_KEY),
			hasRedirectsDb: Boolean(process.env.NOTION_REDIRECTS_ID),
			configured: notionConfigured,
		},
		devRedirects: { keys: Object.keys(devRedirects), sampleResolution },
		linktree: {
			...linktreeSample,
			headers: linktreeHeaders,
			preview: linktreePreview,
			items: linktreeItems,
			invalids: notionInvalids,
			allRows: notionAllRows,
		},
		echo: { to: echoTo },
	});
}
