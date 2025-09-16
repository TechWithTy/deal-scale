import { NextResponse } from "next/server";

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

import { mapNotionPageToLinkTree } from "@/utils/notion/linktreeMapper";
import type { NotionQueryResponse, NotionPage } from "@/utils/notion/notionTypes";

async function queryNotionDatabase(databaseId: string) {
  const resp = await fetch(`${NOTION_API_BASE}/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    // Important: Let Next cache this request; the route itself will be tag-cached
    // by the page fetch via next: { tags: ['link-tree'], revalidate: 300 }
    cache: "force-cache",
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Notion DB query failed ${resp.status}: ${text}`);
  }
  return resp.json();
}

export async function GET() {
  try {
    const dbId = process.env.NOTION_REDIRECTS_ID;
    if (!dbId) {
      return NextResponse.json({ ok: false, error: "missing NOTION_REDIRECTS_ID" }, { status: 500 });
    }

    const data = (await queryNotionDatabase(dbId)) as NotionQueryResponse;
    const results: NotionPage[] = Array.isArray(data?.results) ? data.results : [];

    const items = results
      .map((page) => mapNotionPageToLinkTree(page))
      .filter((m) => Boolean(m?.linkTreeEnabled && m?.destination));

    return NextResponse.json({ ok: true, items });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
