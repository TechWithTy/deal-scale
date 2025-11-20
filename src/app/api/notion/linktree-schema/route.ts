import { NextResponse } from "next/server";

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

/**
 * API endpoint to fetch the Notion Linktree database schema
 *
 * GET /api/notion/linktree-schema
 *
 * Returns the database schema including all properties and their types
 */
export async function GET() {
	try {
		const NOTION_KEY = process.env.NOTION_KEY;
		const NOTION_DB_ID = process.env.NOTION_REDIRECTS_ID;

		if (!NOTION_KEY) {
			return NextResponse.json(
				{ ok: false, error: "NOTION_KEY not configured" },
				{ status: 500 },
			);
		}

		if (!NOTION_DB_ID) {
			return NextResponse.json(
				{ ok: false, error: "NOTION_REDIRECTS_ID not configured" },
				{ status: 500 },
			);
		}

		const url = `${NOTION_API_BASE}/databases/${NOTION_DB_ID}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${NOTION_KEY}`,
				"Notion-Version": NOTION_VERSION,
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		if (!response.ok) {
			const errorText = await response.text();
			return NextResponse.json(
				{
					ok: false,
					error: `Notion API error: ${response.status}`,
					details: errorText,
				},
				{ status: response.status },
			);
		}

		const schema = await response.json();

		// Transform the schema to a more readable format
		const properties = Object.entries(schema.properties || {}).map(
			([name, prop]: [string, unknown]) => {
				const p = prop as {
					id: string;
					type: string;
					name: string;
					select?: {
						options: Array<{ id: string; name: string; color: string }>;
					};
					multi_select?: {
						options: Array<{ id: string; name: string; color: string }>;
					};
				};
				return {
					name,
					id: p.id,
					type: p.type,
					options:
						p.select?.options?.map((o) => o.name) ||
						p.multi_select?.options?.map((o) => o.name) ||
						undefined,
				};
			},
		);

		return NextResponse.json({
			ok: true,
			database: {
				id: schema.id,
				title:
					schema.title
						?.map((t: { plain_text: string }) => t.plain_text)
						.join("") || "",
				created_time: schema.created_time,
				last_edited_time: schema.last_edited_time,
			},
			properties,
			raw: schema,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ ok: false, error: message }, { status: 500 });
	}
}
