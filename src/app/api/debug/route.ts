import { NextResponse } from "next/server";

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
	const limit = limitParam ? Math.max(1, Math.min(500, Number(limitParam) || 0)) : undefined;
	const requestHeaders = Object.fromEntries(new Headers(req.headers).entries());

	const devRedirects = parseDevRedirects();
	const notionConfigured =
		Boolean(process.env.NOTION_KEY) && Boolean(process.env.NOTION_REDIRECTS_ID);

	// Try to sample the LinkTree API
	let linktreeSample: { count?: number; ok: boolean; error?: string } = {
		ok: true,
	};
	let linktreeHeaders: Record<string, string> | undefined;
	let linktreePreview: any[] | undefined;
	let linktreeItems: any[] | undefined;
	let notionInvalids: any[] | undefined;
	let notionAllRows: any[] | undefined;
	try {
		const res = await fetch(`${url.origin}/api/linktree`, {
			cache: "no-store",
		});
		if (res.ok) {
			const data = (await res.json()) as unknown;
			const items = Array.isArray((data as any)?.items)
				? (data as any).items
				: Array.isArray(data)
					? data
					: [];
			linktreeSample = { ok: true, count: items.length };
			linktreeHeaders = Object.fromEntries(res.headers.entries());
			linktreePreview = items.slice(0, 5).map((it: any) => ({
				pageId: it.pageId ?? it.id ?? null,
				slug: it.slug ?? null,
				destination: it.destination ?? null,
				title: it.title ?? null,
				highlighted: !!it.highlighted,
				category: it.category ?? null,
			}));
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
				const data = (await res.json()) as any;
				const sanitize = (s: string | undefined): string =>
					(s ?? "")
						.replace(/\uFEFF/g, "")
						.replace(/\u00A0/g, " ")
						.trim();
				const readTxt = (prop: any): string | undefined => {
					try {
						if (!prop) return undefined;
						if (prop.type === "rich_text") {
							const arr = (prop.rich_text ?? []) as Array<{
								plain_text?: string;
							}>;
							const joined = arr
								.map((t) => t.plain_text ?? "")
								.join("")
								.trim();
							return joined || undefined;
						}
						if (prop.type === "title") {
							const arr = (prop.title ?? []) as Array<{ plain_text?: string }>;
							const joined = arr
								.map((t) => t.plain_text ?? "")
								.join("")
								.trim();
							return joined || undefined;
						}
						if (prop.type === "url")
							return (prop.url as string | undefined)?.trim();
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
				const invalids: any[] = [];
				const allRows: any[] = [];
				for (const page of (data.results ?? []) as any[]) {
					const props = page.properties ?? {};
					const lte = props?.["Link Tree Enabled"];
					let enabled = false;
					if (lte?.type === "checkbox") enabled = Boolean(lte.checkbox);
					else if (lte?.type === "select") {
						const name = (lte.select?.name ?? "").toString().toLowerCase();
						enabled = name === "true" || name === "yes" || name === "enabled";
					}
					if (!enabled && props?.Type?.select?.name === "LinkTree") enabled = true;
					const slugTxt = readTxt(props?.Slug);
					const titleTxt = readTxt(props?.Title);
					const destTxtRaw = readTxt(props?.Destination);
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
					const row = {
						pageId: page.id,
						title: titleTxt ?? null,
						slug: slugTxt ?? null,
						destination: destTxtRaw ?? null,
						destination_sanitized: destTxt || null,
						enabled,
						raw: {
							lte: {
								type: lte?.type ?? null,
								checkbox: lte?.checkbox ?? null,
								select: lte?.select?.name ?? null,
							},
							slug: { type: props?.Slug?.type ?? null },
							destination: { type: props?.Destination?.type ?? null },
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
