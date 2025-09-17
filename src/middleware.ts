import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Found = {
	destination: string;
	utm_source?: string;
	utm_campaign?: string;
	utm_medium?: string;
	utm_content?: string;
	utm_term?: string;
	utm_id?: string;
	utm_redirect_url?: string;
	pageId?: string;
	nextCalls?: number;
};

function sanitizeUrlLike(input: string | undefined | null): string {
	const s = String(input ?? "");
	// Remove zero-width and unusual unicode spaces around the value
	// Includes NBSP (\u00A0), zero-width spaces (\u200B-\u200D, \uFEFF), and other unicode spaces
	return s
		.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
		.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ")
		.trim();
}

function pickProp(
  props: Record<string, unknown>,
  aliases: string[],
): unknown {
  // 1) Exact alias match
  for (const a of aliases) {
    if (Object.prototype.hasOwnProperty.call(props, a)) return (props as any)[a];
  }
  // 2) Case-insensitive exact
  const lowerMap = new Map<string, string>();
  for (const k of Object.keys(props)) lowerMap.set(k.toLowerCase(), k);
  for (const a of aliases) {
    const hit = lowerMap.get(a.toLowerCase());
    if (hit) return (props as any)[hit];
  }
  // 3) Starts-with / includes fuzzy
  for (const a of aliases) {
    for (const k of Object.keys(props)) {
      const lk = k.toLowerCase();
      const la = a.toLowerCase();
      if (lk.startsWith(la) || lk.includes(la)) return (props as any)[k];
    }
  }
  return undefined;
}

function parseDevRedirects(): Record<string, string> {
	// Priority: ENV JSON > ENV CSV > built-in defaults
	const out: Record<string, string> = {};
	const raw = process.env.DEV_REDIRECTS?.trim();
	if (raw) {
		try {
			// Try JSON first: { "live-demo": "https://app.dealscale.io" }
			const obj = JSON.parse(raw) as Record<string, string>;
			for (const [k, v] of Object.entries(obj))
				out[k.toLowerCase()] = String(v);
			return out;
		} catch {
			// CSV fallback: slug=url,slug2=url2
			for (const pair of raw.split(",")) {
				const [k, v] = pair.split("=");
				if (k && v) out[k.trim().toLowerCase()] = v.trim();
			}
			if (Object.keys(out).length) return out;
		}
	}
	// Built-in minimal defaults for local testing
	out["live-demo"] = "https://app.dealscale.io";
	return out;
}

function getPlain(prop: unknown): string | undefined {
	const p = prop as { type?: string; [k: string]: any } | undefined;
	if (!p) return undefined;
	if (!prop) return undefined;
	// rich_text
	if (p.type === "rich_text")
		return p.rich_text?.[0]?.plain_text as string | undefined;
	// title
	if (p.type === "title") return p.title?.[0]?.plain_text as string | undefined;
	// url
	if (p.type === "url") return p.url as string | undefined;
	// select
	if (p.type === "select") return p.select?.name as string | undefined;
	return undefined;
}

function getDestinationStrict(prop: unknown): string | undefined {
	const p = prop as { type?: string; [k: string]: any } | undefined;
	if (!p) return undefined;
	if (p.type === "url") return sanitizeUrlLike(p.url as string | undefined);
	if (p.type === "rich_text") {
		const parts =
			(p.rich_text as Array<{ plain_text?: string }> | undefined) ?? [];
		const joined = sanitizeUrlLike(
			parts.map((t) => t.plain_text ?? "").join(""),
		);
		if (!joined) return undefined;
		// 1) Full URL inside text
		const m = joined.match(/https?:\/\/[^\s]+/i);
		if (m) return m[0];
		// 2) Protocol-relative
		const m2 = joined.match(/(^|\s)\/\/[^\s]+/);
		if (m2) return m2[0].trim();
		// 3) Internal path
		if (joined.startsWith("/")) return joined;
		// 4) Bare host with a dot
		const host = joined.split(/\s+/)[0];
		if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.+)?$/i.test(host)) return host;
		return undefined;
	}
	return undefined;
}

async function findRedirectBySlug(slug: string): Promise<Found | null> {
	console.log(`[middleware] findRedirectBySlug searching for: '${slug}'`);
	// Prefer Notion when credentials exist (even in development) so we can increment counters.
	const isProd = process.env.NODE_ENV === "production";
	const NOTION_KEY = process.env.NOTION_KEY;
	const DB_ID = process.env.NOTION_REDIRECTS_ID;
	const devFallback = (() => {
		try {
			const dev = parseDevRedirects();
			return dev[slug];
		} catch {
			return undefined;
		}
	})();
	if (!NOTION_KEY || !DB_ID) {
		// No Notion credentials; use dev fallback if present
		return devFallback ? { destination: devFallback } : null;
	}

	const headers = {
		Authorization: `Bearer ${NOTION_KEY}`,
		"Notion-Version": "2022-06-28",
		"Content-Type": "application/json",
	};

	// Query by slug with robust candidates and property types.
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
			const resp = await fetch(
				`https://api.notion.com/v1/databases/${DB_ID}/query`,
				{
					method: "POST",
					headers,
					body: JSON.stringify(body),
					cache: "no-store",
				},
			);
			if (!resp.ok) continue;
			const data = await resp.json();
			const page = data?.results?.[0];
			if (!page) continue;
			const props = page.properties ?? {} as Record<string, unknown>;
			const destination = getDestinationStrict(props?.Destination);
			if (!destination) continue;
			// Support multiple UTM property spellings from Notion
			const utm_source = getPlain(pickProp(props, ["UTM Source", "utm_source"]))?.trim();
			const utm_campaign = getPlain(pickProp(props, ["UTM Campaign", "utm_campaign"]))?.trim();
			const utm_medium = getPlain(pickProp(props, ["UTM Medium", "utm_medium"]))?.trim();
			const utm_content = getPlain(pickProp(props, ["UTM Content", "utm_content"]))?.trim();
			const utm_term = getPlain(pickProp(props, ["UTM Term", "utm_term"]))?.trim();
			const utm_id = getPlain(pickProp(props, ["UTM Id", "utm_id"]))?.trim();
			// Custom second-stage redirect URL captured as UTM param
			const redirectUrlRawPlain = getPlain(pickProp(props, ["RedirectUrl", "Redirect URL", "redirect_url", "redirecturl"]))?.trim();
			const redirectUrlRaw = redirectUrlRawPlain || getDestinationStrict(pickProp(props, ["RedirectUrl", "Redirect URL"])) || undefined;
			const utm_redirect_url = redirectUrlRaw ? sanitizeUrlLike(redirectUrlRaw) : undefined;
			const callsProp = (props as any)?.["Redirects (Calls)"];
			const current =
				typeof callsProp?.number === "number" ? callsProp.number : 0;
			const nextCalls = current + 1;
			const result: Found = {
				destination,
				utm_source,
				utm_campaign,
				utm_medium,
				utm_content,
				utm_term,
				utm_id,
				utm_redirect_url,
				pageId: page.id as string,
				nextCalls,
			};
			console.log(
				`[middleware] Notion found pageId: ${result.pageId}, nextCalls: ${result.nextCalls}`,
			);
			return result;
		}
	}
	// Not found in Notion; use dev fallback if available (no counter increment)
	if (devFallback)
		console.log(`[middleware] Notion miss, using dev fallback for '${slug}'`);
	return devFallback ? { destination: devFallback } : null;
}

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	// Skip Next.js internals and API/static routes
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api/") ||
		pathname.startsWith("/linktree") ||
		pathname.startsWith("/favicon") ||
		pathname.startsWith("/assets/") ||
		pathname.match(/\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|json|txt)$/i)
	) {
		return NextResponse.next();
	}

	const slug = pathname.split("/")[1]?.toLowerCase();
	if (!slug) return NextResponse.next();

	console.log(`[middleware] Path: ${pathname}, Slug: ${slug}`);

	try {
		const found = await findRedirectBySlug(slug);
		console.log("[middleware] findRedirectBySlug result:", found);
		if (!found) return NextResponse.next();

		let dest = sanitizeUrlLike(found.destination || "");
		if (dest.length < 3) {
			console.warn(
				"[middleware] Weak destination for slug:",
				slug,
				JSON.stringify(dest),
			);
			return NextResponse.next();
		}
		const hasScheme = /^(https?:)\/\//i.test(dest);
		const isProtoRelative = /^\/\//.test(dest);
		const isRelative = dest.startsWith("/");
		if (isProtoRelative) dest = `https:${dest}`;
		else if (!isRelative && !hasScheme) {
			// Only treat as host if it looks like a domain (has a dot)
			if (/^[a-z0-9.-]+$/i.test(dest) && dest.includes("."))
				dest = `https://${dest}`;
			else {
				// Suspicious destination like single letter; skip redirect
				console.warn(
					"[middleware] Ignoring suspicious destination for slug:",
					slug,
					JSON.stringify(dest),
				);
				return NextResponse.next();
			}
		}

		// Build URL safely
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

		if (!isRelative && !isValidAbsoluteHttpUrl(dest)) {
			console.warn(
				"[middleware] Malformed absolute URL, skipping redirect:",
				JSON.stringify(dest),
			);
			return NextResponse.next();
		}

		const url = isRelative ? new URL(dest, req.nextUrl.origin) : new URL(dest);
		// First, remove any existing utm_* on the destination to avoid leaking defaults from source links
		for (const [k] of url.searchParams.entries()) {
			if (k.startsWith("utm_")) url.searchParams.delete(k);
		}
		// Append UTM if present (from Notion)
		if (found.utm_source) url.searchParams.set("utm_source", found.utm_source);
		if (found.utm_campaign) url.searchParams.set("utm_campaign", found.utm_campaign);
		if (found.utm_medium) url.searchParams.set("utm_medium", found.utm_medium);
		if (found.utm_content) url.searchParams.set("utm_content", found.utm_content);
		if (found.utm_term) url.searchParams.set("utm_term", found.utm_term);
		if (found.utm_id) url.searchParams.set("utm_id", found.utm_id);
		if (found.utm_redirect_url)
			url.searchParams.set("utm_redirect_url", found.utm_redirect_url);

		// Debug: show the UTMs we are about to use (helps verify Notion -> URL mapping)
		console.log("[middleware] UTMs (after Notion + optional overrides):", {
			source: url.searchParams.get("utm_source"),
			campaign: url.searchParams.get("utm_campaign"),
			medium: url.searchParams.get("utm_medium"),
			content: url.searchParams.get("utm_content"),
			term: url.searchParams.get("utm_term"),
			id: url.searchParams.get("utm_id"),
			redirect_url: url.searchParams.get("utm_redirect_url"),
		});

		// Optional: allow incoming request UTMs to override Notion (off by default)
		if ((process.env.ALLOW_INCOMING_UTM || "").trim() === "1") {
			for (const [key, value] of req.nextUrl.searchParams.entries()) {
				if (!key.startsWith("utm_")) continue;
				const v = (value ?? "").trim();
				if (!v) continue; // skip empty
				if (v.toLowerCase() === "undefined" || v.toLowerCase() === "null") continue; // skip placeholders
				url.searchParams.set(key, v);
			}
		}

		// If we have a second-stage utm_redirect_url, embed the same UTM params into it
		const rawSecond = url.searchParams.get("utm_redirect_url");
		if (rawSecond) {
			try {
				const secondUrl = new URL(rawSecond, req.nextUrl.origin);
				// Remove any existing utm_* on the second-stage URL first
				for (const [k] of secondUrl.searchParams.entries()) {
					if (k.startsWith("utm_")) secondUrl.searchParams.delete(k);
				}
				// Copy over all utm_ params from the outer URL to the inner second-stage URL
				for (const [k, v] of url.searchParams.entries()) {
					if (k.startsWith("utm_") && k !== "utm_redirect_url") {
						secondUrl.searchParams.set(k, v);
					}
				}
				url.searchParams.set("utm_redirect_url", secondUrl.toString());
			} catch {
				// leave as-is if it wasn't a valid URL
			}
		}

		console.log("[middleware] Final redirect:", url.toString());

		// Add RedirectSource based on referer
		const referer = req.headers.get("referer");
		const isFromLinkTree =
			referer && new URL(referer).pathname.includes("/linktree");
		const redirectSource = isFromLinkTree ? "Linktree" : "Direct";
		url.searchParams.set("RedirectSource", redirectSource);

		// Increment Notion counter (fire-and-forget best-effort)
		const NOTION_KEY = process.env.NOTION_KEY;
		const pageId = found.pageId;
		const nextCalls = found.nextCalls;
		if (NOTION_KEY && pageId && typeof nextCalls === "number") {
			console.log(
				`[middleware] Attempting to increment count for pageId: ${pageId} to ${nextCalls}`,
			);
			// Fire-and-forget, but log errors
			(async () => {
				try {
					const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${NOTION_KEY}`,
							"Notion-Version": "2022-06-28",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							properties: {
								"Redirects (Calls)": { number: nextCalls },
							},
						}),
					});
					if (!res.ok) {
						const errorBody = await res.json();
						console.error(
							`[middleware] FAILED to increment count for pageId: ${pageId}. Status: ${res.status}`,
							JSON.stringify(errorBody, null, 2),
						);
					} else {
						console.log(
							`[middleware] Successfully incremented count for pageId: ${pageId}. Status: ${res.status}`,
						);
					}
				} catch (e) {
					console.error(
						`[middleware] Network error while incrementing count for pageId: ${pageId}`,
						e,
					);
				}
			})();
		}

		return NextResponse.redirect(url);
	} catch (error) {
		// Fail open
		return NextResponse.next();
	}
}

export const config = {
	matcher: "/:slug*",
};
