import { NextResponse } from "next/server";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

async function findPageIdBySlug(
	dbId: string,
	slug: string,
	token: string,
): Promise<string | null> {
	const headers = {
		Authorization: `Bearer ${token}`,
		"Notion-Version": NOTION_VERSION,
		"Content-Type": "application/json",
	};
	const uniq = new Set<string>();
	const add = (s?: string) => {
		if (s && !uniq.has(s)) uniq.add(s);
	};
	add(slug);
	add(`/${slug}`);
	add(slug.replace(/^\//, ""));
	add(`/${slug}`.replace(/^\//, ""));
	const candidates = Array.from(uniq);
	const filters = [
		(s: string) => ({ property: "Slug", rich_text: { equals: s } }),
		(s: string) => ({ property: "Slug", title: { equals: s } }),
		(s: string) => ({ property: "Title", title: { equals: s } }),
	];
	for (const s of candidates) {
		for (const build of filters) {
			const body = { page_size: 1, filter: build(s) } as const;
			const resp = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
				method: "POST",
				headers,
				body: JSON.stringify(body),
				cache: "no-store",
			});
			if (!resp.ok) continue;
			const data = await resp.json();
			const page = data?.results?.[0];
			if (page?.id) return page.id as string;
		}
	}
	return null;
}

export async function GET(req: Request) {
	try {
		const NOTION_KEY = process.env.NOTION_KEY;
		const DB_ID = process.env.NOTION_REDIRECTS_ID;
		if (!NOTION_KEY || !DB_ID) {
			return NextResponse.json(
				{ ok: false, error: "Notion env missing" },
				{ status: 500 },
			);
		}
		const url = new URL(req.url);
		const pageIdIn = url.searchParams.get("pageId") || undefined;
		const slugIn = url.searchParams.get("slug") || undefined;
		let pageId = pageIdIn as string | undefined;
		if (!pageId && slugIn) {
			pageId = await findPageIdBySlug(
				DB_ID,
				slugIn.replace(/^\//, ""),
				NOTION_KEY,
			);
		}
		if (!pageId) {
			return NextResponse.json(
				{ ok: false, error: "missing pageId/slug" },
				{ status: 400 },
			);
		}
		const resolved = await fetchPageAndResolveClicksProperty(
			pageId,
			NOTION_KEY,
		);
		const propName = resolved.name;
		if (!propName) {
			console.error(
				"[click-api] No suitable number property for Clicks on page",
				pageId,
				Object.keys(resolved.dump?.properties ?? {}),
			);
			return NextResponse.json(
				{ ok: false, error: "clicks_property_missing" },
				{ status: 500 },
			);
		}
		const current = await getCurrentClicks(pageId, NOTION_KEY, propName);
		const next = current + 1;
		const res = await incrementClicks(pageId, next, NOTION_KEY, propName);
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return NextResponse.json(
				{
					ok: false,
					error: "notion_patch_failed",
					status: res.status,
					details: err,
				},
				{ status: 500 },
			);
		}
		return NextResponse.json({ ok: true, pageId, next });
	} catch (e) {
		return NextResponse.json(
			{ ok: false, error: (e as Error).message },
			{ status: 500 },
		);
	}
}

type NotionPageDump = {
	properties?: Record<string, { type?: string; number?: number }>;
};

function pickClicksProperty(
	props: Record<string, { type?: string; number?: number }>,
): string | null {
	const candidates = [
		"Redirects (Clicks)",
		"Redirects(Clicks)",
		"Redirects - Clicks",
		"Redirects Clicks",
		"Clicks",
		"Link Clicks",
	];
	for (const name of candidates) {
		const p = props[name];
		if (p && p.type === "number") return name;
	}
	// Fallback: first number property that looks like clicks
	for (const [name, p] of Object.entries(props)) {
		if (p?.type === "number" && /click/i.test(name)) return name;
	}
	return null;
}

async function fetchPageAndResolveClicksProperty(
	pageId: string,
	token: string,
): Promise<{ name: string | null; dump?: NotionPageDump }> {
	const resp = await fetch(`${NOTION_API}/pages/${pageId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Notion-Version": NOTION_VERSION,
		},
		cache: "no-store",
	});
	if (!resp.ok) return { name: null };
	const data = (await resp.json()) as NotionPageDump;
	const props = data?.properties ?? {};
	const name = pickClicksProperty(props);
	return { name, dump: data };
}

async function getCurrentClicks(
	pageId: string,
	token: string,
	propName: string,
): Promise<number> {
	const resp = await fetch(`${NOTION_API}/pages/${pageId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Notion-Version": NOTION_VERSION,
		},
		cache: "no-store",
	});
	if (!resp.ok) return 0;
	const data = (await resp.json()) as NotionPageDump;
	const prop = data?.properties?.[propName];
	const current =
		typeof prop?.number === "number" ? (prop.number as number) : 0;
	return current;
}

async function incrementClicks(
	pageId: string,
	next: number,
	token: string,
	propName: string,
) {
	const resp = await fetch(`${NOTION_API}/pages/${pageId}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Notion-Version": NOTION_VERSION,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			properties: {
				[propName]: { number: next },
			},
		}),
	});
	return resp;
}

export async function POST(req: Request) {
	try {
		const NOTION_KEY = process.env.NOTION_KEY;
		const DB_ID = process.env.NOTION_REDIRECTS_ID;
		if (!NOTION_KEY || !DB_ID) {
			return NextResponse.json(
				{ ok: false, error: "Notion env missing" },
				{ status: 500 },
			);
		}
		const contentType = req.headers.get("content-type") || "";
		const isJson = contentType.includes("application/json");
		const body = isJson ? await req.json() : {};
		const pageIdIn = (body?.pageId as string | undefined) || undefined;
		const slugIn = (body?.slug as string | undefined) || undefined;
		let pageId = pageIdIn;
		if (!pageId && slugIn) {
			pageId = await findPageIdBySlug(
				DB_ID,
				slugIn.replace(/^\//, ""),
				NOTION_KEY,
			);
		}
		if (!pageId) {
			return NextResponse.json(
				{ ok: false, error: "missing pageId/slug" },
				{ status: 400 },
			);
		}
		const resolved = await fetchPageAndResolveClicksProperty(
			pageId,
			NOTION_KEY,
		);
		const propName = resolved.name;
		if (!propName) {
			console.error(
				"[click-api] No suitable number property for Clicks on page",
				pageId,
				Object.keys(resolved.dump?.properties ?? {}),
			);
			return NextResponse.json(
				{ ok: false, error: "clicks_property_missing" },
				{ status: 500 },
			);
		}
		const current = await getCurrentClicks(pageId, NOTION_KEY, propName);
		const next = current + 1;
		const res = await incrementClicks(pageId, next, NOTION_KEY, propName);
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return NextResponse.json(
				{
					ok: false,
					error: "notion_patch_failed",
					status: res.status,
					details: err,
				},
				{ status: 500 },
			);
		}
		return NextResponse.json({ ok: true, pageId, next });
	} catch (e) {
		return NextResponse.json(
			{ ok: false, error: (e as Error).message },
			{ status: 500 },
		);
	}
}
