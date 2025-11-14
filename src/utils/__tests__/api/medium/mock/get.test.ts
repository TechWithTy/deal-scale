import * as medium from "@/lib/medium/get";

/**
 * Tests for Medium blog fetching utilities: getAllPosts and getPostByGuid.
 * All network calls are mocked. No real Medium or RSS API requests are made.
 */
describe("Medium Blog API", () => {
	// Suppress console.error during tests to keep output clean
	let consoleErrorSpy: jest.SpyInstance;

	beforeAll(() => {
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	beforeEach(() => {
		global.fetch = jest.fn();
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("fetches all posts and maps them correctly", async () => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				items: [
					{
						guid: "https://medium.com/@user/test-post-1",
						title: "Test Post 1",
						content: '<img src="https://img.com/1.jpg">',
						description: "<p>Subtitle one.</p>",
						author: "Author",
						categories: [],
						pubDate: "2025-04-16T00:00:00Z",
						thumbnail: null,
						subtitle: "Subtitle one",
						slug: "test-post-1",
						link: "https://medium.com/@user/test-post-1",
						enclosure: {},
					},
				],
			}),
		});
		const posts = await medium.getAllPosts();
		expect(posts).toHaveLength(1);
		expect(posts[0].thumbnail).toBe("https://img.com/1.jpg");
		expect(posts[0].slug).toBe("test-post-1");
		expect(posts[0].subtitle).toBe("Subtitle one");
	});

	it("fetches a post by guid", async () => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				items: [
					{
						guid: "https://medium.com/@user/test-post-2",
						title: "Test Post 2",
						content: '<img src="https://img.com/2.jpg">',
						description: "<p>Subtitle two.</p>",
						author: "Author",
						categories: [],
						pubDate: "2025-04-16T00:00:00Z",
						thumbnail: null,
						subtitle: "Subtitle two",
						slug: "test-post-2",
						link: "https://medium.com/@user/test-post-2",
						enclosure: {},
					},
				],
			}),
		});
		const post = await medium.getPostByGuid("test-post-2");
		expect(post).not.toBeNull();
		expect(post?.slug).toBe("test-post-2");
		expect(post?.subtitle).toBe("Subtitle two");
	});

	it("returns null if post by guid not found", async () => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({ items: [] }),
		});
		const post = await medium.getPostByGuid("non-existent");
		expect(post).toBeNull();
	});

	it("handles fetch error gracefully", async () => {
		(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
		const posts = await medium.getAllPosts();
		expect(posts).toEqual([]);
	});
});
