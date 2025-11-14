import { NextResponse } from "next/server";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

type NotionPageDump = {
	properties?: Record<string, { type?: string; number?: number }>;
};

function normalizeNotionId(id?: string | null): string | undefined {
	if (!id) return undefined;
	const raw = id.trim();
	if (raw.includes("-")) return raw;
	// Auto-dash if 32 hex chars
	if (/^[a-f0-9]{32}$/i.test(raw)) {
		return raw.replace(
			/^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/,
			"$1-$2-$3-$4-$5",
		);
	}
	return raw;
}

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
	// Prefer exact canonical name if present (even if type metadata is odd)
	if (Object.prototype.hasOwnProperty.call(props, "Redirects (Clicks)")) {
		return "Redirects (Clicks)";
	}
	for (const name of candidates) {
		const p = props[name];
		if (p && p.type === "number") return name;
	}
	for (const [name, p] of Object.entries(props)) {
		if (p?.type === "number" && /click/i.test(name)) return name;
	}
	return null;
}

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

async function resolveClicksProperty(
	pageId: string,
	token: string,
): Promise<{
	name: string | null;
	keys: string[];
	dump?: NotionPageDump;
	status?: number;
	statusText?: string;
}> {
	const pid = normalizeNotionId(pageId) as string;
	const resp = await fetch(`${NOTION_API}/pages/${pid}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Notion-Version": NOTION_VERSION,
		},
		cache: "no-store",
	});
	if (!resp.ok)
		return {
			name: null,
			keys: [],
			status: resp.status,
			statusText: resp.statusText,
		};
	const data = (await resp.json()) as NotionPageDump;
	const props = data?.properties ?? {};
	const override = (process.env.CLICK_PROP_NAME || "").trim();
	if (override && Object.prototype.hasOwnProperty.call(props, override)) {
		return { name: override, keys: Object.keys(props), dump: data };
	}
	const name = pickClicksProperty(props);
	return { name, keys: Object.keys(props), dump: data };
}

async function getCurrent(
	pageId: string,
	token: string,
	propName: string,
): Promise<number> {
	const pid = normalizeNotionId(pageId) as string;
	const resp = await fetch(`${NOTION_API}/pages/${pid}`, {
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
	return typeof prop?.number === "number" ? prop.number : 0;
}

async function setClicks(
	pageId: string,
	token: string,
	propName: string,
	next: number,
) {
	const pid = normalizeNotionId(pageId) as string;
	return fetch(`${NOTION_API}/pages/${pid}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Notion-Version": NOTION_VERSION,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ properties: { [propName]: { number: next } } }),
	});
}

async function handleIncrement(pageIdOrSlug: {
	pageId?: string;
	slug?: string;
}) {
	const NOTION_KEY = process.env.NOTION_KEY as string | undefined;
	const DB_ID = process.env.NOTION_REDIRECTS_ID as string | undefined;
	if (!NOTION_KEY || !DB_ID)
		return { ok: false, status: 500, error: "env_missing" };

	let pageId = normalizeNotionId(pageIdOrSlug.pageId);
	if (!pageId && pageIdOrSlug.slug) {
		pageId =
			(await findPageIdBySlug(
				DB_ID,
				pageIdOrSlug.slug.replace(/^\//, ""),
				NOTION_KEY,
			)) ?? undefined;
	}
	if (!pageId) return { ok: false, status: 400, error: "missing_pageId" };

	const resolved = await resolveClicksProperty(pageId, NOTION_KEY);
	const propName = resolved.name;
	if (!propName)
		return {
			ok: false,
			status: 500,
			error: "clicks_property_missing",
			keys: resolved.keys,
		};

	const current = await getCurrent(pageId, NOTION_KEY, propName);
	const next = current + 1;
	const res = await setClicks(pageId, NOTION_KEY, propName, next);
	if (!res.ok) {
		let details: unknown = undefined;
		try {
			details = await res.json();
		} catch {}
		return { ok: false, status: 500, error: "notion_patch_failed", details };
	}
	return { ok: true, pageId, next };
}

export async function POST(req: Request) {
	const contentType = req.headers.get("content-type") || "";
	const isJson = contentType.includes("application/json");
	const body = isJson ? await req.json() : {};
	const pageId = normalizeNotionId(
		(body?.pageId as string | undefined) || undefined,
	);
	const slug = (body?.slug as string | undefined) || undefined;
	const result = await handleIncrement({ pageId, slug });
	if (!result.ok)
		return NextResponse.json(result, { status: result.status ?? 500 });
	return NextResponse.json(result);
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const pageId = normalizeNotionId(url.searchParams.get("pageId") || undefined);
	const slug = url.searchParams.get("slug") || undefined;
	const result = await handleIncrement({
		pageId: pageId ?? undefined,
		slug: slug ?? undefined,
	});
	if (!result.ok)
		return NextResponse.json(result, { status: result.status ?? 500 });
	return NextResponse.json(result);
}
