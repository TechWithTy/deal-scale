// * Integration tests for Blogger API client (src/lib/blogger/api.ts)
// * These tests make real HTTP requests to the Blogger API.
// * Requires a valid BLOGGER_API_KEY in your .env file.
// * Provide real blog URLs, blog IDs, and post IDs for your public Blogger blog.
// ! WARNING: These tests will use your API quota and may fail if the API key is invalid or data is missing.

import {
	getBlogById,
	getBlogByUrl,
	getComments,
	getPost,
	getPosts,
} from "../../../../lib/blogger/api";
import {
	describeIfExternal,
	skipExternalTest,
} from "../../../testHelpers/external";

skipExternalTest("Blogger API client (integration)");
describeIfExternal("Blogger API client (integration)", () => {
	// Replace these with real values from your Blogger blog
	const TEST_BLOG_URL = "https://blogger.googleblog.com"; // Official Blogger blog, public
	const TEST_BLOG_ID: string = "7071425658654923642"; // Blogger Buzz blog ID
	const TEST_POST_ID: string = "1788901363067962043"; // A real post ID from that blog

	it("fetches a real blog by URL", async () => {
		const blog = await getBlogByUrl(TEST_BLOG_URL);
		expect(blog).toHaveProperty("id");
		expect(blog).toHaveProperty("name");
		// * Allow protocol/trailing slash differences in returned URL
		expect(blog.url.replace(/^http:/, "https:").replace(/\/$/, "")).toBe(
			TEST_BLOG_URL.replace(/\/$/, ""),
		);
	});

	it("fetches posts for a real blog", async () => {
		const posts = await getPosts(TEST_BLOG_ID);
		expect(Array.isArray(posts.items)).toBe(true);
		expect(posts.items.length).toBeGreaterThan(0);
	});

	it("fetches a real post by ID", async () => {
		try {
			const post = await getPost(TEST_BLOG_ID, TEST_POST_ID);
			expect(post).toHaveProperty("id", TEST_POST_ID);
			expect(post).toHaveProperty("title");
			expect(post).toHaveProperty("content");
		} catch (err) {
			// ! Debug: log error and params
			console.error("Failed to fetch post:", {
				blogId: TEST_BLOG_ID,
				postId: TEST_POST_ID,
				error: err,
			});
			throw err;
		}
	});

	it("fetches comments for a real post", async () => {
		try {
			const comments = await getComments(TEST_BLOG_ID, TEST_POST_ID);
			expect(Array.isArray(comments.items)).toBe(true);
			if (!comments.items || comments.items.length === 0) {
				// ! Warning: This post has no comments. Use a post with comments for full integration coverage.
				console.warn(
					"! WARNING: The selected post has no comments. For full integration coverage, use a post with at least one comment.",
				);
			}
		} catch (err) {
			// ! Debug: log error and params
			console.error("Failed to fetch comments:", {
				blogId: TEST_BLOG_ID,
				postId: TEST_POST_ID,
				error: err,
			});
			throw err;
		}
	});

	it("fetches a real blog by ID", async () => {
		if (!TEST_BLOG_ID || TEST_BLOG_ID === "YOUR_BLOG_ID") {
			// ! Warning: Placeholder or missing blog ID
			console.warn(
				"! WARNING: TEST_BLOG_ID is a placeholder or missing. Provide a real blog ID for a valid integration test.",
			);
		}
		const blog = await getBlogById(TEST_BLOG_ID);
		expect(blog).toHaveProperty("id", TEST_BLOG_ID);
		expect(blog).toHaveProperty("name");
	});
	// * OAuth2 mutation tests (requires BLOGGER_OAUTH_ACCESS_TOKEN)
});
