import { type NextRequest, NextResponse } from "next/server";

// GET /api/beehiiv/leaderboard
// Ranks posts by combined analytics (email + web), then paginates the ranked list
export async function GET(request: NextRequest) {
	try {
		const search = request.nextUrl.searchParams;
		const perPage = Math.max(
			1,
			Math.min(
				100,
				Number(search.get("per_page")) || Number(search.get("limit")) || 12,
			),
		);
		const page = Math.max(1, Number(search.get("page")) || 1);
		const sourceLimit = Number(search.get("source_limit")) || undefined; // cap total fetched from source when all=true
		const cacheParam = search.get("cache"); // 'off' to bypass cache

		// Fetch all posts (cached by the posts route) including stats by default
		const params = new URLSearchParams();
		params.set("all", "true");
		if (sourceLimit && Number.isFinite(sourceLimit))
			params.set("limit", String(sourceLimit));
		params.set("order_by", "publish_date");
		params.set("direction", "desc");
		if (cacheParam) params.set("cache", cacheParam);

		const postsUrl = `${request.nextUrl.origin}/api/beehiiv/posts?${params.toString()}`;

		const fetchInit: RequestInit =
			cacheParam === "off"
				? { cache: "no-store" }
				: ({ next: { revalidate: 900 } } as any);
		const res = await fetch(postsUrl, fetchInit);
		if (!res.ok) {
			return NextResponse.json(
				{ data: [], message: "Failed to fetch posts for leaderboard" },
				{ status: res.status },
			);
		}
		const payload = await res.json().catch(() => ({ data: [] }));
		const posts: any[] = Array.isArray(payload?.data) ? payload.data : [];

		// Analytics scoring: mirror BlogGrid.tsx heuristic
		const getNum = (v: unknown): number =>
			typeof v === "number" && Number.isFinite(v) ? v : 0;
		const toTime = (v: unknown): number => {
			if (typeof v === "string" || typeof v === "number") {
				const t = new Date(v as string | number).getTime();
				return Number.isFinite(t) ? t : 0;
			}
			if (v instanceof Date) return v.getTime();
			return 0;
		};
		const analyticsScore = (p: any): number => {
			const web = p?.stats?.web;
			const email = p?.stats?.email;
			const webViews = getNum(web?.views);
			const webClicks = getNum(web?.clicks);
			const emailUniqueOpens = getNum(email?.unique_opens);
			const emailUniqueClicks = getNum(email?.unique_clicks);
			const emailOpenRate = getNum(email?.open_rate);
			const emailClickRate = getNum(email?.click_rate);
			return (
				emailUniqueClicks * 8 +
				emailUniqueOpens * 2 +
				webClicks * 5 +
				webViews * 1 +
				emailClickRate * 0.5 +
				emailOpenRate * 0.2
			);
		};

		const ranked = [...posts].sort((a, b) => {
			const sa = analyticsScore(a);
			const sb = analyticsScore(b);
			if (sa !== sb) return sb - sa;
			// Tie-breaker by recency
			return (
				toTime(b?.published_at ?? b?.publish_date) -
				toTime(a?.published_at ?? a?.publish_date)
			);
		});

		const total = ranked.length;
		const total_pages = Math.max(1, Math.ceil(total / perPage));
		const start = (page - 1) * perPage;
		const data = ranked.slice(start, start + perPage);

		return NextResponse.json({
			data,
			meta: { page, per_page: perPage, total, total_pages },
		});
	} catch (err) {
		console.error("[API] /api/beehiiv/leaderboard error:", err);
		return NextResponse.json(
			{ data: [], message: "Server error building leaderboard" },
			{ status: 500 },
		);
	}
}
