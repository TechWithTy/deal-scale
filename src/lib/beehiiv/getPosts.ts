import type { BeehiivPost } from "@/types/behiiv";

// Helper to get the base URL safely
function getBaseUrl() {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	// * Use NEXT_PUBLIC_SITE_URL if set (canonical domain)
	if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
	// * Fallback to VERCEL_URL (preview/auto-generated domains)
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	// * Fallback to RENDER_EXTERNAL_URL (render.com)
	if (process.env.RENDER_EXTERNAL_URL)
		return `https://${process.env.RENDER_EXTERNAL_URL}`;
	// * Final fallback: localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Fetch latest Beehiiv posts (safe for SSR and client)
 */
export type BeehiivPostsOptions = {
    perPage?: number; // items per page (1-100)
    page?: number; // page index (1-based)
    all?: boolean; // fetch all pages server-side
    limit?: number; // cap total results when all=true
    includeScheduled?: boolean; // include future-dated posts (default: false for paginated grid)
};

// Backward compatible signature: either a number (legacy limit) or options
export async function getLatestBeehiivPosts(
    opts?: number | BeehiivPostsOptions,
): Promise<BeehiivPost[]> {
    try {
        const isServer = typeof window === "undefined";
        const baseUrl = getBaseUrl();
        const apiPath = "/api/beehiiv/posts";

        // Normalize options
        const options: BeehiivPostsOptions =
            typeof opts === "number" ? { limit: opts } : opts || {};

        const params = new URLSearchParams();
        if (options.perPage) params.set("per_page", String(options.perPage));
        if (options.page) params.set("page", String(options.page));
        if (options.all) params.set("all", "true");
        if (options.limit) params.set("limit", String(options.limit));
        // By default, exclude scheduled posts for paginated grid fetches (all=false)
        // API defaults to include all; we opt-out here unless explicitly overridden.
        if (typeof options.includeScheduled === "boolean") {
            params.set("include_scheduled", String(options.includeScheduled));
        } else if (!options.all) {
            params.set("include_scheduled", "false");
        }

        const qs = params.toString();
        const url = isServer
            ? `${baseUrl}${apiPath}${qs ? `?${qs}` : ""}`
            : `${apiPath}${qs ? `?${qs}` : ""}`;

        console.log("[getLatestBeehiivPosts] Fetching from:", url); // * Debug: log which URL is being fetched

        const res = await fetch(url, {
            // Let Next.js cache per unique query using route's revalidate
            next: { revalidate: 300 },
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => "No error details");
            console.error(
                `[getLatestBeehiivPosts] Failed to fetch posts (${res.status}):`,
                errorText,
            );
            return [];
        }

        const data = await res.json().catch((err) => {
            console.error(
                "[getLatestBeehiivPosts] Failed to parse JSON response:",
                err,
            );
            return { data: [] };
        });

        const posts = Array.isArray(data.data) ? data.data : [];

        // Debug: show fetched posts summary for ALL posts (id, title, published_at)
        try {
            const summary = posts.map((p: any) => ({
                id: p?.id,
                title: p?.title,
                published_at: p?.published_at,
            }));
            console.log(
                `[getLatestBeehiivPosts] Received ${posts.length} post(s). Full summary:`,
                summary,
            );
        } catch (logErr) {
            console.warn("[getLatestBeehiivPosts] Failed to log posts summary:", logErr);
        }
        // If legacy numeric limit was supplied, slice on client as a fallback
        if (typeof opts === "number" && Number.isFinite(opts)) {
            return posts.slice(0, opts);
        }
        return posts;
    } catch (err) {
        console.error("[getLatestBeehiivPosts] Unexpected error:", err);
        return [];
    }
}

// Convenience helper to fetch all posts with optional cap
export async function getAllBeehiivPosts(limit?: number): Promise<BeehiivPost[]> {
    return getLatestBeehiivPosts({ all: true, limit });
}
