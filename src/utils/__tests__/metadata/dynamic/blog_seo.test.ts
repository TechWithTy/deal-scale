import type { BeehiivPost } from "@/types/behiiv";
import { getTestBaseUrl } from "@/utils/env";
import { getSeoMetadataForPost } from "@/utils/seo/dynamic/blog";

const mockPosts: BeehiivPost[] = [
	{
		id: "test-blog-id",
		title: "Test Blog Post",
		author: "John Doe",
		subtitle: "An in-depth look at our test subject",
		categories: ["Technology"],
		content: {
			free: { web: "A summary of the test blog post." },
			premium: { web: "Premium summary" },
		},
		description: "A summary of the test blog post.",
		enclosure: {},
		link: "https://medium.com/test-blog-post",
		pubDate: "2025-04-16T00:00:00Z",
		meta_default_description: "A summary of the test blog post.",
		thumbnail_url: "https://example.com/image.jpg",
		web_url: "https://dealscale.io/p/test-blog-post",
		published_at: "2025-04-16T00:00:00Z",
		displayed_date: Date.parse("2025-04-16T00:00:00Z"),
		content_tags: ["Technology", "AI"],
	},
];

const notFoundResponse = {
	ok: false,
	status: 404,
	json: async () => ({ data: [] }),
	text: async () => "Not Found",
};

let originalFetch: typeof fetch;

beforeAll(() => {
	originalFetch = global.fetch;
});

afterAll(() => {
	global.fetch = originalFetch;
});

beforeEach(() => {
	global.fetch = jest.fn(async (url: RequestInfo | URL) => {
		if (typeof url === "string" && url.includes("/api/beehiiv/posts")) {
			return {
				ok: true,
				status: 200,
				json: async () => ({ data: mockPosts }),
				text: async () => JSON.stringify({ data: mockPosts }),
			} as unknown as Response;
		}
		return notFoundResponse as unknown as Response;
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

	it("falls back to published_at when publish_date is missing", () => {
		const seo = getBlogSeo({
			...mockBlog,
			publish_date: undefined,
			displayed_date: undefined,
			published_at: "2025-04-16T00:00:00Z",
		});

		expect(seo.datePublished).toBe("2025-04-16T00:00:00.000Z");
		expect(seo.dateModified).toBe("2025-04-16T00:00:00.000Z");
	});
});

describe("getBlogMetadata", () => {
	const pageUrl = "https://dealscale.io/p/test-blog-post";
	const blogId = "test-blog-id";

	it("returns full Next.js metadata for a valid blog post", async () => {
		const meta = await getSeoMetadataForPost(blogId);
		expect(meta.title).toBe("Test Blog Post");
		expect(meta.description).toBe("A summary of the test blog post.");
		expect(meta.canonical).toBe(pageUrl);
		expect(meta.image).toBe("https://example.com/image.jpg");
		expect(meta.keywords).toEqual(["Technology", "AI"]);
		expect(meta.priority).toBe(0.7);
		expect(meta.changeFrequency).toBe("weekly");
		expect(meta.datePublished).toBe("2025-04-16T00:00:00.000Z");
		expect(meta.dateModified).toBe("2025-04-16T00:00:00.000Z");
	});

	it("uses published_at when publish_date is not provided", async () => {
		const postWithoutPublishDate: BeehiivPost = {
			...mockPosts[0],
			id: "published-at-only",
			publish_date: undefined,
			published_at: "2026-02-01T12:00:00Z",
			displayed_date: undefined,
		};

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: async () => ({ data: [postWithoutPublishDate] }),
			text: async () => JSON.stringify({ data: [postWithoutPublishDate] }),
		} as unknown as Response);

		const meta = await getSeoMetadataForPost(postWithoutPublishDate.id);

		expect(meta.datePublished).toBe("2026-02-01T12:00:00.000Z");
		expect(meta.dateModified).toBeUndefined();
	});

	it("returns not found metadata if post is undefined", async () => {
		const meta = await getSeoMetadataForPost("nonexistent-id");
		expect(meta.title).toBe("Article Not Found");
		expect(meta.description).toBe("The requested article could not be found");
		expect(meta.canonical).toBe(`${getTestBaseUrl()}/blogs/nonexistent-id`);
		expect(meta.image).toBe("");
		expect(meta.keywords).toEqual([]);
	});
});
