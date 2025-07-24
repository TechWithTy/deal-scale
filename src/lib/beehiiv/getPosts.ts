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
export async function getLatestBeehiivPosts(
	limit?: number,
): Promise<BeehiivPost[]> {
	try {
		const isServer = typeof window === "undefined";
		const baseUrl = getBaseUrl();
		const apiPath = "/api/beehiiv/posts";
		const url = isServer ? `${baseUrl}${apiPath}` : apiPath;

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
		return limit ? posts.slice(0, limit) : posts;
	} catch (err) {
		console.error("[getLatestBeehiivPosts] Unexpected error:", err);
		return [];
	}
}
