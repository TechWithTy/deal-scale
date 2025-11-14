import type { MediumArticle } from "@/data/medium/post";
import { getAllPosts, getPostByGuid } from "@/lib/medium/get";
import {
	describeIfExternal,
	skipExternalTest,
} from "../../../testHelpers/external";

skipExternalTest("Medium Blog API Integration Tests");
describeIfExternal("Medium Blog API Integration Tests", () => {
	let consoleErrorSpy: jest.SpyInstance;

	beforeAll(() => {
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	describe("getAllPosts", () => {
		it("fetches all posts from the real Medium feed", async () => {
			const posts = await getAllPosts();
			expect(posts.length).toBeGreaterThan(0);
			for (const post of posts as MediumArticle[]) {
				expect(post).toMatchObject({
					title: expect.any(String),
					slug: expect.any(String),
					thumbnail: expect.any(String),
					content: expect.any(String),
					pubDate: expect.any(String),
				});
			}
		});
	});

	describe("getPostByGuid", () => {
		it("fetches a single post by GUID from the real Medium feed", async () => {
			const posts = await getAllPosts();
			const testPost = posts[0];
			const guid = testPost.slug || testPost.guid?.split("/").pop() || "";

			const fetchedPost = await getPostByGuid(guid);
			expect(fetchedPost).not.toBeNull();
			expect(fetchedPost).toMatchObject({
				slug: guid,
				title: testPost.title,
				content: expect.any(String),
				pubDate: expect.any(String),
			});
		});

		it("returns null for non-existent GUID", async () => {
			const nonExistentGuid = "non-existent-guid-12345";
			const result = await getPostByGuid(nonExistentGuid);
			expect(result).toBeNull();
		});
	});
});
