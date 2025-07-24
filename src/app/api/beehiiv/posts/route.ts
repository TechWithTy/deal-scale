import { NextResponse } from "next/server";

// ! GET /api/beehiiv/posts - Fetch all posts from Beehiiv publication (server-side, CORS-safe)
export async function GET() {
	console.log("[API] /api/beehiiv/posts route hit");
	const publicationId = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
	const apiKey = process.env.BEEHIIV_API_KEY;
	if (!publicationId) {
		return NextResponse.json(
			{ message: "Missing Beehiiv publication ID" },
			{ status: 500 },
		);
	}
	const url = `https://api.beehiiv.com/v2/publications/${publicationId}/posts`;
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (apiKey) {
		headers.Authorization = `Bearer ${apiKey}`;
	}
	try {
		const res = await fetch(url, { headers });
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
		if (posts.length > 0) {
			// console.log('[API] First blog post model:', JSON.stringify(posts[0], null, 2));
		} else {
			console.log("[API] No blog posts returned.");
		}
		return NextResponse.json({ data: posts, ...data });
	} catch (error) {
		console.error("[API] Error fetching Beehiiv posts:", error);
		// Always return a 'data' field for error cases
		return NextResponse.json(
			{ data: [], message: "Server error fetching Beehiiv posts" },
			{ status: 500 },
		);
	}
}
