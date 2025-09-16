import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Found = {
    destination: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
};

function getPlain(prop: any): string | undefined {
    if (!prop) return undefined;
    // rich_text
    if (prop.type === "rich_text") return prop.rich_text?.[0]?.plain_text as string | undefined;
    // title
    if (prop.type === "title") return prop.title?.[0]?.plain_text as string | undefined;
    // url
    if (prop.type === "url") return prop.url as string | undefined;
    // select
    if (prop.type === "select") return prop.select?.name as string | undefined;
    return undefined;
}

async function findRedirectBySlug(slug: string): Promise<Found | null> {
    const NOTION_KEY = process.env.NOTION_KEY;
    const DB_ID = process.env.NOTION_REDIRECTS_ID;
    if (!NOTION_KEY || !DB_ID) return null;

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
            const destination = getPlain(props?.Destination);
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

        let dest = found.destination;
        // Normalize bare hosts to https
        const hasScheme = /^(https?:)\/\//i.test(dest);
        const isRelative = dest.startsWith("/");
        if (!isRelative && !hasScheme) dest = `https://${dest}`;

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
