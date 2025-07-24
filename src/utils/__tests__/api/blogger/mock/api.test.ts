// * Tests for Blogger API client (src/lib/blogger/api.ts)
// ! Network calls are mocked. These tests check correct request formation and error handling.
// * Run with: jest src/utils/__tests__/api/blogger/api.test.ts

// Set a known API key before importing the Blogger API client
process.env.BLOGGER_API_KEY = "unit_test_key";

import {
	getBlogById,
	getBlogByUrl,
	getComments,
	getPost,
	getPosts,
} from "../../../../../lib/blogger/api";

const fetchMock = jest.fn();

global.fetch = fetchMock;

const BASE_URL = "https://www.googleapis.com/blogger/v3";

describe("Blogger API client", () => {
	afterEach(() => {
		fetchMock.mockReset();
	});

	describe("getBlogByUrl", () => {
		it("fetches blog by URL", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: "1",
					name: "Blog",
					description: "",
					published: "",
					updated: "",
					url: "",
				}),
			});
			const url = "https://blog.example.com";
			await getBlogByUrl(url);
			expect(fetchMock).toHaveBeenCalledWith(
				`${BASE_URL}/blogs/byurl?url=${encodeURIComponent(url)}&key=unit_test_key`,
			);
		});
		it("throws on error", async () => {
			fetchMock.mockResolvedValueOnce({ ok: false });
			await expect(getBlogByUrl("x")).rejects.toThrow("Failed to fetch blog");
		});
	});

	describe("getPosts", () => {
		it("fetches posts for blog", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ items: [] }),
			});
			await getPosts("blogid");
			expect(fetchMock).toHaveBeenCalledWith(
				`${BASE_URL}/blogs/blogid/posts?key=unit_test_key`,
			);
		});
		it("fetches posts for blog with pageToken", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ items: [] }),
			});
			await getPosts("blogid", "next");
			expect(fetchMock).toHaveBeenCalledWith(
				`${BASE_URL}/blogs/blogid/posts?key=unit_test_key&pageToken=next`,
			);
		});
		it("throws on error", async () => {
			fetchMock.mockResolvedValueOnce({ ok: false });
			await expect(getPosts("blogid")).rejects.toThrow("Failed to fetch posts");
		});
	});

	describe("getPost", () => {
		it("fetches single post", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: "p" }),
			});
			await getPost("blogid", "postid");
			expect(fetchMock).toHaveBeenCalledWith(
				`${BASE_URL}/blogs/blogid/posts/postid?key=unit_test_key`,
			);
		});
		it("throws on error", async () => {
			fetchMock.mockResolvedValueOnce({ ok: false });
			await expect(getPost("blogid", "postid")).rejects.toThrow(
				"Failed to fetch post",
			);
		});
	});

	describe("getComments", () => {
		it("fetches comments for post", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ items: [] }),
			});
			await getComments("blogid", "postid");
			expect(fetchMock).toHaveBeenCalledWith(
				`${BASE_URL}/blogs/blogid/posts/postid/comments?key=unit_test_key`,
			);
		});
		it("fetches comments for post with pageToken", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ items: [] }),
			});
			await getComments("blogid", "postid", "next");
			expect(fetchMock).toHaveBeenCalledWith(
				`${BASE_URL}/blogs/blogid/posts/postid/comments?key=unit_test_key&pageToken=next`,
			);
		});
		it("throws on error", async () => {
			fetchMock.mockResolvedValueOnce({ ok: false });
			await expect(getComments("blogid", "postid")).rejects.toThrow(
				"Failed to fetch comments",
			);
		});
	});

	describe("getBlogById", () => {
		it("fetches blog by ID", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: "1" }),
			});
			await getBlogById("blogid");
			expect(fetchMock).toHaveBeenCalledWith(
				`${BASE_URL}/blogs/blogid?key=unit_test_key`,
			);
		});
		it("throws on error", async () => {
			fetchMock.mockResolvedValueOnce({ ok: false });
			await expect(getBlogById("blogid")).rejects.toThrow(
				"Failed to fetch blog by ID",
			);
		});
	});
});
