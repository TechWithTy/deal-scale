import { NextResponse } from "next/server";

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

async function getNotionPage(pageId: string) {
	const resp = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
		headers: {
			Authorization: `Bearer ${process.env.NOTION_KEY}`,
			"Notion-Version": NOTION_VERSION,
		},
		cache: "no-store",
	});
	if (!resp.ok)
		throw new Error(`Failed to retrieve page ${pageId}: ${resp.status}`);
	return resp.json();
}

async function incrementCalls(pageId: string) {
	if (!process.env.NOTION_KEY) return; // Skip if not configured
	try {
		const data = await getNotionPage(pageId);
		const props = data?.properties ?? {};
		const fieldName = "Redirects (Calls)";
		const current = Number(props?.[fieldName]?.number ?? 0);
		const nextVal = current + 1;

		await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${process.env.NOTION_KEY}`,
				"Notion-Version": NOTION_VERSION,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				properties: {
					[fieldName]: { number: nextVal },
				},
			}),
		});
	} catch (err) {
		// Swallow errors to not block the redirect
		console.error("[redirect] incrementCalls error", err);
	}
}

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const to = url.searchParams.get("to");
		const pageId = url.searchParams.get("pageId");
		const isFile = url.searchParams.get("isFile");

		if (!to) {
			return NextResponse.json(
				{ ok: false, error: "missing 'to'" },
				{ status: 400 },
			);
		}

		if (pageId) {
			// Fire and forget increment
			incrementCalls(pageId);
		}

		// Build 302 redirect safely
		// 1) Only decode relative paths (e.g., %2Fsignup). Keep absolute URLs as-is to avoid breaking signatures.
		let location = to;
		if (to.startsWith("%2F")) {
			try {
				location = decodeURIComponent(to);
			} catch {
				/* keep as-is */
			}
		}

		// 2) Preserve query parameters from the redirect request if the destination URL doesn't have them
		// This allows incoming UTMs and other tracking parameters to be passed through
		try {
			// Only preserve params for absolute URLs (relative paths should use middleware logic)
			if (/^https?:/i.test(location)) {
				const destUrl = new URL(location);
				const requestParams = url.searchParams;

				// Preserve any query params from the incoming request (except 'to', 'pageId', 'slug', 'isFile')
				// Priority: Destination URL params > Incoming request params
				for (const [key, value] of requestParams.entries()) {
					if (
						key !== "to" &&
						key !== "pageId" &&
						key !== "slug" &&
						key !== "isFile"
					) {
						// Only add if destination URL doesn't already have this parameter
						if (!destUrl.searchParams.has(key)) {
							destUrl.searchParams.set(key, value);
						}
					}
				}

				// Update location with preserved params
				location = destUrl.toString();
			}
		} catch {
			// If parsing fails, continue with original location
		}

		// 2) Normalize forms
		// protocol-relative -> https
		if (/^\/\//.test(location)) {
			location = `https:${location}`;
		}
		const hasScheme = /^(https?:)\/\//i.test(location);
		const isRelative = location.startsWith("/");
		// bare host -> https://host
		if (!isRelative && !hasScheme) {
			if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(location)) {
				location = `https://${location}`;
			} else {
				return NextResponse.json(
					{ ok: false, error: "invalid 'to'" },
					{ status: 400 },
				);
			}
		}

		// 3) Validate absolute URLs (no "https://" without host)
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

		// 4) Build absolute URL for internal paths to satisfy Next.js requirement
		const reqUrl = new URL(req.url);
		const redirectTarget = isRelative
			? new URL(location, reqUrl.origin)
			: location;
		if (!isRelative && !isValidAbsoluteHttpUrl(String(redirectTarget))) {
			return NextResponse.json(
				{ ok: false, error: "invalid absolute URL" },
				{ status: 400 },
			);
		}

		// For file downloads, just 302 so the origin's headers control Content-Disposition
		const res = NextResponse.redirect(redirectTarget, 302);

		// Hint to browsers for downloads when possible (non-authoritative)
		if (isFile) {
			res.headers.set("Cache-Control", "no-store");
		}

		return res;
	} catch (err) {
		const msg = err instanceof Error ? err.message : "internal error";
		return NextResponse.json({ ok: false, error: msg }, { status: 500 });
	}
}
