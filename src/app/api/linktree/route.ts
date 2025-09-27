import { NextResponse } from "next/server";

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

import { mapNotionPageToLinkTree } from "@/utils/notion/linktreeMapper";
import type {
	NotionPage,
	NotionQueryResponse,
} from "@/utils/notion/notionTypes";

async function queryNotionDatabase(databaseId: string) {
	const resp = await fetch(`${NOTION_API_BASE}/databases/${databaseId}/query`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.NOTION_KEY}`,
			"Notion-Version": NOTION_VERSION,
			"Content-Type": "application/json",
		},
		// The page that calls this API controls caching via next tags.
		// Keep this request default (no-store here) to avoid double caching layers.
		cache: "no-store",
		body: JSON.stringify({ page_size: 100 }),
	});
	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(`Notion DB query failed ${resp.status}: ${text}`);
	}
	return resp.json();
}

export async function GET() {
	try {
		const rawId = process.env.NOTION_REDIRECTS_ID;
		const addDashes = (id: string) =>
			id.replace(/^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/, "$1-$2-$3-$4-$5");
		const dbId = !rawId
			? undefined
			: rawId.includes("-")
				? rawId
				: rawId.length === 32
					? addDashes(rawId)
					: rawId;
		if (!dbId) {
			return NextResponse.json(
				{ ok: false, error: "missing NOTION_REDIRECTS_ID" },
				{ status: 500 },
			);
		}

		const data = (await queryNotionDatabase(dbId)) as NotionQueryResponse;
		const results: NotionPage[] = Array.isArray(data?.results)
			? data.results
			: [];

		const items = results
			.map((page) => mapNotionPageToLinkTree(page))
			.filter((m) =>
				Boolean(
					m?.linkTreeEnabled &&
						((m?.destination && m.destination.length > 0) ||
							(Array.isArray(m?.files) && m.files.length > 0)),
				),
			);

		const debug = false; // flip to true temporarily if needed
		if (debug) {
			console.log("[linktree-api] dbId", dbId);
			console.log("[linktree-api] total pages", results.length);
			console.log(
				"[linktree-api] items",
				items.map((i) => i.slug),
			);
		}
		return NextResponse.json({ ok: true, items });
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : "internal error";
		return NextResponse.json({ ok: false, error: msg }, { status: 500 });
	}
}
