import type { BeehiivPost } from "@/types/behiiv";
import { getTestBaseUrl } from "@/utils/env";
import { getSeoMetadataForPost } from "@/utils/seo/dynamic/blog";

// Mock fetch for tests
beforeAll(() => {
	global.fetch = jest.fn((url) => {
		if (typeof url === "string" && url.includes("/api/beehiiv/posts")) {
			return Promise.resolve({
				json: () =>
					Promise.resolve({
						data: [
							{
								id: "test-blog-id",
								title: "Test Blog Post",
								content: {
									free: { web: "A summary of the test blog post." },
								},
								content_tags: [],
								thumbnail_url: "https://example.com/image.jpg",
								web_url: "https://dealscale.io/p/test-blog-post",
							},
						],
					}),
			}) as unknown as Response;
		}
		return Promise.reject(new Error("Unknown URL"));
	}) as jest.Mock;
});
import { getBlogSeo } from "@/utils/seo/seo";
import type { Metadata } from "next";
const mockBlog: BeehiivPost = {
	id: "unique-guid-1234",
	author: "John Doe",
	categories: ["Technology", "AI"],
	content: {
		free: {
			web: "This is the full content of the test blog post.",
			email: "This is the full content of the test blog post.",
			rss: "This is the full content of the test blog post.",
		},
		premium: {
			web: "This is the full content of the test blog post.",
			email: "This is the full content of the test blog post.",
		},
	},
	description: "A summary of the test blog post.",
	enclosure: {},
	link: "https://medium.com/test-blog-post",
	pubDate: "2025-04-16T00:00:00Z",
	title: "Test Blog Post",
	subtitle: "An in-depth look at our test subject",
	meta_default_description: "A summary of the test blog post.",
	thumbnail_url: "https://dealscale.io/images/test-blog-thumbnail.jpg",
	web_url: "https://dealscale.io/blogs/test-blog-post",
	publish_date: Date.parse("2025-04-16T00:00:00Z"),
	displayed_date: Date.parse("2025-04-16T00:00:00Z"),
	content_tags: ["Technology", "AI"],
};

describe("getBlogSeo", () => {
	it("returns correct SEO metadata for a MediumArticle", () => {
		const seo = getBlogSeo(mockBlog);

		expect(seo.title).toBe("Test Blog Post | Blog | Deal Scale");
		expect(seo.description).toBe("A summary of the test blog post.");
		expect(seo.image).toBe(
			"https://dealscale.io/images/test-blog-thumbnail.jpg",
		);
		expect(seo.type).toBe("article");
		expect(seo.datePublished).toBe("2025-04-16T00:00:00.000Z");
		expect(seo.dateModified).toBe("2025-04-16T00:00:00.000Z");
		expect(seo.keywords).toEqual(["Technology", "AI"]);
	});
});

describe("getBlogMetadata", () => {
	const pageUrl = "https://dealscale.io/p/test-blog-post";
	const blogId = "test-blog-id";

	it("returns full Next.js metadata for a valid blog post", async () => {
		const meta = await getSeoMetadataForPost(blogId);
		expect(meta.title).toBe("Test Blog Post");
		expect(meta.description).toBe("A summary of the test blog post.");
		expect(meta.alternates.canonical).toBe(pageUrl);
		expect(meta.openGraph).toMatchObject({
			url: pageUrl,
			title: "Test Blog Post",
			description: "A summary of the test blog post.",
			type: "article",
			images: ["https://example.com/image.jpg"],
		});
	});

	type BlogMetadata = {
		title: string;
		description: string;
		alternates: { canonical: string };
		openGraph?: unknown;
		robots?: unknown;
		other: Record<string, string>;
	};

	it("returns not found metadata if post is undefined", async () => {
		const meta = await getSeoMetadataForPost("nonexistent-id");
		expect(meta.title).toBe("Article Not Found");
		expect(meta.description).toBe("The requested article could not be found");
		expect(meta.alternates.canonical).toBe(
			`${getTestBaseUrl()}/blogs/nonexistent-id`,
		);
	});
});
