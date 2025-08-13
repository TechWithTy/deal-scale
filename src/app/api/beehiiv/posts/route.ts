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
    const perPageParam = search.get("per_page");
    const pageParam = search.get("page");
    const allParam = search.get("all");
    const limitParam = search.get("limit");

    // Sanitize values
    const per_page = Math.max(1, Math.min(100, Number(perPageParam) || 10));
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
        if (fetchAll) {
            // Fetch all pages up to optional limit
            let page = startPage;
            const allPosts: unknown[] = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const url = new URL(baseUrl);
                url.searchParams.set("per_page", String(per_page));
                url.searchParams.set("page", String(page));
                const res = await fetch(url.toString(), { headers });
                if (!res.ok) {
                    return NextResponse.json(
                        { data: allPosts, message: "Failed to fetch posts from Beehiiv" },
                        { status: res.status },
                    );
                }
                const data = await res.json();
                const pagePosts: unknown[] = Array.isArray(data.data) ? data.data : [];
                if (pagePosts.length === 0) break;
                allPosts.push(...pagePosts);
                if (limit && allPosts.length >= limit) {
                    return NextResponse.json({ data: allPosts.slice(0, limit) });
                }
                page += 1;
            }
            if (allPosts.length === 0) {
                console.log("[API] No blog posts returned.");
            }
            return NextResponse.json({ data: allPosts });
        } else {
            // Single page fetch
            const url = new URL(baseUrl);
            url.searchParams.set("per_page", String(per_page));
            url.searchParams.set("page", String(startPage));
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
            if (posts.length === 0) {
                console.log("[API] No blog posts returned.");
            }
            return NextResponse.json({ data: posts, ...data });
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
