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
};

// Backward compatible signature: either a number (legacy limit) or options
export async function getLatestBeehiivPosts(
    opts?: number | BeehiivPostsOptions,
): Promise<BeehiivPost[]> {
    try {
        const isServer = typeof window === "undefined";
        const baseUrl = getBaseUrl();
        const apiPath = "/api/beehiiv/posts";
        const urlObj = new URL(isServer ? `${baseUrl}${apiPath}` : apiPath, baseUrl || undefined);

        // Normalize options
        const options: BeehiivPostsOptions =
            typeof opts === "number" ? { limit: opts } : opts || {};

        if (options.perPage) urlObj.searchParams.set("per_page", String(options.perPage));
        if (options.page) urlObj.searchParams.set("page", String(options.page));
        if (options.all) urlObj.searchParams.set("all", "true");
        if (options.limit) urlObj.searchParams.set("limit", String(options.limit));

        const url = urlObj.toString();

        console.log("[getLatestBeehiivPosts] Fetching from:", url); // * Debug: log which URL is being fetched

        const res = await fetch(url, {
            cache: "no-store",
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

        // Debug: show fetched posts summary and a small preview to avoid noisy logs
        try {
            const preview = posts.slice(0, 3).map((p: any) => ({
                id: p?.id,
                title: p?.title,
                published_at: p?.published_at,
            }));
            console.log(
                `[getLatestBeehiivPosts] Received ${posts.length} post(s). Preview:`,
                preview,
            );
        } catch (logErr) {
            console.warn("[getLatestBeehiivPosts] Failed to log posts preview:", logErr);
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
