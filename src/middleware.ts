import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Found = {
    destination: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
};

function parseDevRedirects(): Record<string, string> {
    // Priority: ENV JSON > ENV CSV > built-in defaults
    const out: Record<string, string> = {};
    const raw = process.env.DEV_REDIRECTS?.trim();
    if (raw) {
        try {
            // Try JSON first: { "live-demo": "https://app.dealscale.io" }
            const obj = JSON.parse(raw) as Record<string, string>;
            for (const [k, v] of Object.entries(obj)) out[k.toLowerCase()] = String(v);
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
    if (p.type === "rich_text") return p.rich_text?.[0]?.plain_text as string | undefined;
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
    if (p.type === "url") return (p.url as string | undefined)?.trim();
    if (p.type === "rich_text") {
        const parts = (p.rich_text as Array<{ plain_text?: string }> | undefined) ?? [];
        const joined = parts.map((t) => (t.plain_text ?? "")).join("").trim();
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
    // Dev override: use DEV_REDIRECTS when not in production or when Notion env is missing
    const isProd = process.env.NODE_ENV === "production";
    const NOTION_KEY = process.env.NOTION_KEY;
    const DB_ID = process.env.NOTION_REDIRECTS_ID;
    if (!isProd || !NOTION_KEY || !DB_ID) {
        const dev = parseDevRedirects();
        const hit = dev[slug];
        if (hit) return { destination: hit };
        // If Notion creds exist and we're in dev, we still attempt Notion below as fallback
        if (!NOTION_KEY || !DB_ID) return null;
    }

    const headers = {
        Authorization: `Bearer ${NOTION_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
    };

    // Query by slug (accept either '/slug' or 'slug'). Try filtering by 'Slug' then by 'Title'.
    const candidates = [slug, `/${slug}`];
    const filters = [
        (s: string) => ({ property: "Slug", rich_text: { equals: s } }),
        (s: string) => ({ property: "Title", title: { equals: s } }),
    ];

    for (const s of candidates) {
        for (const build of filters) {
            const body = { page_size: 1, filter: build(s) } as const;
            const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
                cache: "no-store",
            });
            if (!resp.ok) continue;
            const data = await resp.json();
            const page = data?.results?.[0];
            if (!page) continue;
            const props = page.properties ?? {};
            const destination = getDestinationStrict(props?.Destination);
            if (!destination) continue;
            // Support multiple UTM property spellings from Notion
            const utm_source = getPlain(props?.["UTM Source"]) ?? getPlain(props?.utm_source);
            const utm_campaign = getPlain(props?.["UTM Campaign"]) ?? getPlain(props?.["UTM Campaign (R...)"]) ?? getPlain(props?.utm_campaign);
            const utm_medium = getPlain(props?.["UTM Medium"]) ?? getPlain(props?.utm_medium);
            return { destination, utm_source, utm_campaign, utm_medium };
        }
    }
    return null;
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

    try {
        const found = await findRedirectBySlug(slug);
        if (!found) return NextResponse.next();

        let dest = (found.destination || "").trim();
        if (dest.length < 3) {
            console.warn("[middleware] Weak destination for slug:", slug, JSON.stringify(dest));
            return NextResponse.next();
        }
        const hasScheme = /^(https?:)\/\//i.test(dest);
        const isProtoRelative = /^\/\//.test(dest);
        const isRelative = dest.startsWith("/");
        if (isProtoRelative) dest = `https:${dest}`;
        else if (!isRelative && !hasScheme) {
            // Only treat as host if it looks like a domain (has a dot)
            if (/^[a-z0-9.-]+$/i.test(dest) && dest.includes('.')) dest = `https://${dest}`;
            else {
                // Suspicious destination like single letter; skip redirect
                console.warn("[middleware] Ignoring suspicious destination for slug:", slug, JSON.stringify(dest));
                return NextResponse.next();
            }
        }

        // Build URL
        const url = isRelative ? new URL(dest, req.nextUrl.origin) : new URL(dest);
        // Append UTM if present
        if (found.utm_source) url.searchParams.set("utm_source", found.utm_source);
        if (found.utm_campaign) url.searchParams.set("utm_campaign", found.utm_campaign);
        if (found.utm_medium) url.searchParams.set("utm_medium", found.utm_medium);

        return NextResponse.redirect(url);
    } catch (error) {
        // Fail open
        return NextResponse.next();
    }
}

export const config = {
    matcher: "/:slug*",
};
