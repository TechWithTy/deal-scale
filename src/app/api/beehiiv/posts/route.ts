import { NextResponse, NextRequest } from "next/server";

// ! GET /api/beehiiv/posts - Fetch all posts from Beehiiv publication (server-side, CORS-safe)
export async function GET(request: NextRequest) {
    console.log("[API] /api/beehiiv/posts route hit");
    const publicationId = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
    const apiKey = process.env.BEEHIIV_API_KEY;
    if (!publicationId) {
        return NextResponse.json(
            { message: "Missing Beehiiv publication ID" },
            { status: 500 },
        );
    }
    // Read pagination/search params
    const search = request.nextUrl.searchParams;
    const perPageParam = search.get("per_page"); // legacy (maps to limit)
    const pageParam = search.get("page");
    const allParam = search.get("all");
    const limitParam = search.get("limit");
    const orderByParam = search.get("order_by") || "publish_date"; // created | publish_date | displayed_date
    const directionParam = search.get("direction") || "desc"; // asc | desc
    const audienceParam = search.get("audience");
    const platformParam = search.get("platform"); // web | email | both | all
    const statusParam = search.get("status"); // draft | confirmed | archived | all
    const hiddenFromFeedParam = search.get("hidden_from_feed"); // all | true | false
    // content_tags can be specified as repeated content_tags[] or comma-separated content_tags
    const contentTagsRepeated = search.getAll("content_tags[]");
    const contentTagsCsv = search.get("content_tags");
    const expandParam = search.getAll("expand"); // can be repeated, e.g., stats

    // Sanitize values
    const per_page = Math.max(1, Math.min(100, Number(perPageParam) || Number(limitParam) || 100));
    const startPage = Math.max(1, Number(pageParam) || 1);
    const fetchAll = allParam === "true";
    const limit = limitParam ? Math.max(1, Number(limitParam)) : undefined;

    const baseUrl = `https://api.beehiiv.com/v2/publications/${publicationId}/posts`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
    }
    try {
        const toTime = (v: unknown): number => {
            if (typeof v === "string" || typeof v === "number") {
                const t = new Date(v as string | number).getTime();
                return Number.isFinite(t) ? t : 0;
            }
            if (v instanceof Date) return v.getTime();
            return 0;
        };
        if (fetchAll) {
            // Fetch all pages up to optional limit
            let page = startPage;
            const allPosts: unknown[] = [];
            let totalPages: number | undefined;
            let totalResults: number | undefined;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const url = new URL(baseUrl);
                // Beehiiv uses 'limit' for page size
                url.searchParams.set("limit", String(per_page));
                url.searchParams.set("page", String(page));
                url.searchParams.set("order_by", orderByParam);
                url.searchParams.set("direction", directionParam);
                if (audienceParam) url.searchParams.set("audience", audienceParam);
                if (platformParam) url.searchParams.set("platform", platformParam);
                if (statusParam) url.searchParams.set("status", statusParam);
                if (hiddenFromFeedParam) url.searchParams.set("hidden_from_feed", hiddenFromFeedParam);
                // content_tags[]
                const tags: string[] = [
                    ...contentTagsRepeated,
                    ...(contentTagsCsv ? contentTagsCsv.split(",").map((t) => t.trim()).filter(Boolean) : []),
                ];
                for (const t of new Set(tags)) url.searchParams.append("content_tags[]", t);
                // expand
                const expands = expandParam.length > 0 ? expandParam : ["stats"]; // default to stats
                for (const e of new Set(expands)) url.searchParams.append("expand", e);
                console.log("[API] Fetching Beehiiv URL:", url.toString());
                const res = await fetch(url.toString(), { headers });
                if (!res.ok) {
                    return NextResponse.json(
                        { data: allPosts, message: "Failed to fetch posts from Beehiiv" },
                        { status: res.status },
                    );
                }
                const data = await res.json();
                const pagePosts: unknown[] = Array.isArray(data.data) ? data.data : [];
                // Capture pagination totals if present
                totalPages = typeof data.total_pages === "number" ? data.total_pages : totalPages;
                totalResults = typeof data.total_results === "number" ? data.total_results : totalResults;
                console.log(`[API] Page ${page} received ${pagePosts.length} post(s)`);
                if (pagePosts.length === 0) break;
                allPosts.push(...pagePosts);
                if (limit && allPosts.length >= limit) {
                    const sliced = allPosts.slice(0, limit);
                    const sorted = (sliced as any[]).sort((a, b) => toTime(b?.published_at) - toTime(a?.published_at));
                    return NextResponse.json({ data: sorted, meta: { total: sliced.length, total_results: totalResults, total_pages: totalPages } });
                }
                // Next iteration
                page += 1;
                if (totalPages && page > totalPages) break;
            }
            if (allPosts.length === 0) {
                console.log("[API] No blog posts returned.");
            }
            // Sort newest first by published_at
            const sorted = (allPosts as any[]).sort((a, b) => {
                return toTime(b?.published_at) - toTime(a?.published_at);
            });
            return NextResponse.json({ data: sorted, meta: { total: sorted.length, total_results: totalResults, total_pages: totalPages } });
        } else {
            // Single page fetch
            const url = new URL(baseUrl);
            // Beehiiv uses 'limit' for page size
            url.searchParams.set("limit", String(per_page));
            url.searchParams.set("page", String(startPage));
            url.searchParams.set("order_by", orderByParam);
            url.searchParams.set("direction", directionParam);
            if (audienceParam) url.searchParams.set("audience", audienceParam);
            if (platformParam) url.searchParams.set("platform", platformParam);
            if (statusParam) url.searchParams.set("status", statusParam);
            if (hiddenFromFeedParam) url.searchParams.set("hidden_from_feed", hiddenFromFeedParam);
            const tags: string[] = [
                ...contentTagsRepeated,
                ...(contentTagsCsv ? contentTagsCsv.split(",").map((t) => t.trim()).filter(Boolean) : []),
            ];
            for (const t of new Set(tags)) url.searchParams.append("content_tags[]", t);
            const expands = expandParam.length > 0 ? expandParam : ["stats"]; // default stats
            for (const e of new Set(expands)) url.searchParams.append("expand", e);
            console.log("[API] Fetching Beehiiv URL:", url.toString());
            const res = await fetch(url.toString(), { headers });
            if (!res.ok) {
                // Always return a 'data' field for consistency
                return NextResponse.json(
                    { data: [], message: "Failed to fetch posts from Beehiiv" },
                    { status: res.status },
                );
            }
            const data = await res.json();
            // Ensure the response always has a 'data' array
            const posts = Array.isArray(data.data) ? data.data : [];
            console.log(`[API] Single-page received ${posts.length} post(s)`);
            if (posts.length === 0) {
                console.log("[API] No blog posts returned.");
            }
            const sorted = (posts as any[]).sort((a, b) => {
                return toTime(b?.published_at) - toTime(a?.published_at);
            });
            // Include meta if present but do not overwrite our data
            const meta = (data as any)?.meta;
            if (meta) {
                return NextResponse.json({ data: sorted, meta });
            }
            const total_pages = typeof (data as any)?.total_pages === "number" ? (data as any).total_pages : undefined;
            const total_results = typeof (data as any)?.total_results === "number" ? (data as any).total_results : undefined;
            return NextResponse.json({ data: sorted, meta: { total: sorted.length, total_pages, total_results } });
        }
    } catch (error) {
        console.error("[API] Error fetching Beehiiv posts:", error);
        // Always return a 'data' field for error cases
        return NextResponse.json(
            { data: [], message: "Server error fetching Beehiiv posts" },
            { status: 500 },
        );
    }
}
