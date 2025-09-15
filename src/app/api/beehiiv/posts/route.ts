import { NextResponse, NextRequest } from "next/server";

// Cache this route per unique query for 5 minutes (ISR-style caching)
export const revalidate = 300;

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
	const includeScheduledParam = search.get("include_scheduled"); // true | false, default true

	// Sanitize values
	const per_page = Math.max(
		1,
		Math.min(100, Number(perPageParam) || Number(limitParam) || 100),
	);
	const startPage = Math.max(1, Number(pageParam) || 1);
	const fetchAll = allParam === "true";
	const limit = limitParam ? Math.max(1, Number(limitParam)) : undefined;

	const baseUrl = `https://api.beehiiv.com/v2/publications/${publicationId}/posts`;
	const includeScheduled =
		includeScheduledParam === null ? true : includeScheduledParam === "true";
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (apiKey) {
		headers.Authorization = `Bearer ${apiKey}`;
	}
	try {
		const toTime = (v: unknown): number => {
			// Handles: ISO strings, ms timestamps, and unix seconds
			if (typeof v === "number") {
				const ms = v < 1e12 ? v * 1000 : v; // seconds -> ms if too small
				return Number.isFinite(ms) ? ms : 0;
			}
			if (typeof v === "string") {
				const num = Number(v);
				if (!Number.isNaN(num)) {
					const ms = num < 1e12 ? num * 1000 : num;
					return Number.isFinite(ms) ? ms : 0;
				}
				const t = new Date(v).getTime();
				return Number.isFinite(t) ? t : 0;
			}
			if (v instanceof Date) return v.getTime();
			return 0;
		};
		const dayKeyUTC = (ms: number) => new Date(ms).toISOString().slice(0, 10); // YYYY-MM-DD
		const isFutureByDay = (ms: number) => dayKeyUTC(ms) > dayKeyUTC(Date.now());
		// Debug: print today's timestamp in Beehiiv format (unix seconds)
		try {
			const todayUnixSeconds = Math.floor(Date.now() / 1000);
			console.log(`[API] Today (unix seconds):`, todayUnixSeconds);
		} catch {}
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
				if (hiddenFromFeedParam)
					url.searchParams.set("hidden_from_feed", hiddenFromFeedParam);
				// content_tags[]
				const tags: string[] = [
					...contentTagsRepeated,
					...(contentTagsCsv
						? contentTagsCsv
								.split(",")
								.map((t) => t.trim())
								.filter(Boolean)
						: []),
				];
				for (const t of new Set(tags))
					url.searchParams.append("content_tags[]", t);
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
				totalPages =
					typeof data.total_pages === "number" ? data.total_pages : totalPages;
				totalResults =
					typeof data.total_results === "number"
						? data.total_results
						: totalResults;
				console.log(`[API] Page ${page} received ${pagePosts.length} post(s)`);
				if (pagePosts.length === 0) break;
				allPosts.push(...pagePosts);
				// Filter out non-visible posts: drafts, scheduled (future-dated by day), hidden_from_feed
				const visiblePosts = (allPosts as any[]).filter((p) => {
					const s = (p as any)?.status;
					const hidden = (p as any)?.hidden_from_feed === true;
					const ts = toTime(
						(p as any)?.published_at ??
							(p as any)?.publish_date ??
							(p as any)?.displayed_date,
					);
					const isFuture = isFutureByDay(ts);
					return s !== "draft" && !hidden && (includeScheduled || !isFuture);
				});
				if (limit && Number.isFinite(limit) && limit > 0) {
					const sliced = visiblePosts.slice(0, limit);
					const sorted = (sliced as any[]).sort(
						(a, b) => toTime(b?.published_at) - toTime(a?.published_at),
					);
					return NextResponse.json({
						data: sorted,
						meta: {
							total: sliced.length,
							total_results: totalResults,
							total_pages: totalPages,
						},
					});
				}
				// Next iteration
				page += 1;
				if (totalPages && page > totalPages) break;
			}
			if (allPosts.length === 0) {
				console.log("[API] No blog posts returned.");
			}
			// Sort newest first by published_at
			const filtered = (allPosts as any[]).filter((p) => {
				const s = (p as any)?.status;
				const hidden = (p as any)?.hidden_from_feed === true;
				const ts = toTime(
					(p as any)?.published_at ??
						(p as any)?.publish_date ??
						(p as any)?.displayed_date,
				);
				const isFuture = isFutureByDay(ts);
				return s !== "draft" && !hidden && (includeScheduled || !isFuture);
			});
			const sorted = filtered.sort(
				(a, b) => toTime(b?.published_at) - toTime(a?.published_at),
			);
			return NextResponse.json({
				data: sorted,
				meta: {
					total: sorted.length,
					total_results: totalResults,
					total_pages: totalPages,
				},
			});
		} else {
			// Visibility-aware pagination: build a filtered stream across pages, then slice for the requested page
			const desiredStart = (startPage - 1) * per_page;
			const desiredEnd = desiredStart + per_page;

			// Helper to build a URL for a specific page with all the same query params
			const buildUrlForPage = (pageNum: number) => {
				const u = new URL(baseUrl);
				u.searchParams.set("limit", String(per_page)); // Beehiiv uses 'limit'
				u.searchParams.set("page", String(pageNum));
				u.searchParams.set("order_by", orderByParam);
				u.searchParams.set("direction", directionParam);
				if (audienceParam) u.searchParams.set("audience", audienceParam);
				if (platformParam) u.searchParams.set("platform", platformParam);
				if (statusParam) u.searchParams.set("status", statusParam);
				if (hiddenFromFeedParam)
					u.searchParams.set("hidden_from_feed", hiddenFromFeedParam);
				for (const t of new Set([
					...contentTagsRepeated,
					...(contentTagsCsv
						? contentTagsCsv
								.split(",")
								.map((t) => t.trim())
								.filter(Boolean)
						: []),
				]))
					u.searchParams.append("content_tags[]", t);
				const expands = expandParam.length > 0 ? expandParam : ["stats"]; // default stats
				for (const e of new Set(expands)) u.searchParams.append("expand", e);
				return u;
			};

			// First fetch page 1 to discover total_pages
			const firstUrl = buildUrlForPage(1);
			console.log(
				"[API] Fetching Beehiiv URL (discover):",
				firstUrl.toString(),
			);
			const firstRes = await fetch(firstUrl.toString(), {
				headers,
				next: { revalidate: 300 },
			});
			if (!firstRes.ok) {
				return NextResponse.json(
					{ data: [], message: "Failed to fetch posts from Beehiiv" },
					{ status: firstRes.status },
				);
			}
			const firstData = await firstRes.json();
			const total_pages: number | undefined =
				typeof (firstData as any)?.total_pages === "number"
					? (firstData as any).total_pages
					: typeof (firstData as any)?.meta?.total_pages === "number"
						? (firstData as any).meta.total_pages
						: undefined;

			// Accumulate filtered posts across pages until we can serve the requested slice or run out
			const filteredStream: any[] = [];
			const maxPages =
				total_pages && Number.isFinite(total_pages) ? total_pages : 50; // safety cap
			for (let p = 1; p <= maxPages; p++) {
				const pageUrl = p === 1 ? firstUrl : buildUrlForPage(p);
				const res =
					p === 1
						? firstRes
						: await fetch(pageUrl.toString(), {
								headers,
								next: { revalidate: 300 },
							});
				if (!res.ok) break;
				const data = p === 1 ? firstData : await res.json();
				const posts: any[] = Array.isArray((data as any)?.data)
					? (data as any).data
					: [];
				const visible = posts.filter((it) => {
					const s = (it as any)?.status;
					const hidden = (it as any)?.hidden_from_feed === true;
					const ts = toTime(
						(it as any)?.published_at ??
							(it as any)?.publish_date ??
							(it as any)?.displayed_date,
					);
					const isFuture = isFutureByDay(ts);
					return s !== "draft" && !hidden && (includeScheduled || !isFuture);
				});
				filteredStream.push(...visible);
				// Once we have enough to fill the requested page, we can stop early
				if (filteredStream.length >= desiredEnd) break;
				// Stop if we've reached the end
				const pagesTotal =
					typeof (data as any)?.total_pages === "number"
						? (data as any).total_pages
						: typeof (data as any)?.meta?.total_pages === "number"
							? (data as any).meta.total_pages
							: undefined;
				if (pagesTotal && p >= pagesTotal) break;
			}

			const pageSlice = filteredStream
				.slice(desiredStart, desiredEnd)
				.sort((a, b) => toTime(b?.published_at) - toTime(a?.published_at));

			// If total_pages known, compute visible total pages based on filtered count (approx unless we fetched all pages)
			const visibleTotal = filteredStream.length; // note: could be undercount if we stopped early before the requested page far ahead
			const meta = {
				total: pageSlice.length,
				total_pages: total_pages,
				total_results: visibleTotal,
			};
			return NextResponse.json({ data: pageSlice, meta });
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
