/**
 * @vitest-environment node
 */

import { XMLParser } from "fast-xml-parser";
import fetch, {
	Request as NodeFetchRequest,
	Response as NodeFetchResponse,
} from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock Next.js API types
const createMockRequest = (): NextApiRequest => {
	return {} as NextApiRequest;
};

const createMockResponse = (): NextApiResponse => {
	const res = {
		status: vi.fn().mockReturnThis(),
		setHeader: vi.fn().mockReturnThis(),
		send: vi.fn().mockReturnThis(),
	} as unknown as NextApiResponse;
	return res;
};

// Setup global fetch
const globalAny = global as typeof globalThis & Record<string, unknown>;
if (!globalAny.fetch) {
	globalAny.fetch = fetch;
}
if (!globalAny.Request) {
	globalAny.Request = NodeFetchRequest;
}
if (!globalAny.Response) {
	globalAny.Response = NodeFetchResponse;
}

// XML Parser for validation
const parser = new XMLParser({
	ignoreAttributes: false,
	parseAttributeValue: true,
});

// Helper to validate RSS 2.0 structure
const validateRSS2 = (xml: string): boolean => {
	if (!xml || typeof xml !== "string") return false;
	// Basic XML structure check - if it has the required elements, it's valid
	const hasRss = xml.includes("<rss") && xml.includes("version=\"2.0\"");
	const hasChannel = xml.includes("<channel>");
	const hasTitle = xml.includes("<title>");
	const hasLink = xml.includes("<link>");
	const hasDescription = xml.includes("<description>");
	return hasRss && hasChannel && hasTitle && hasLink && hasDescription;
};

// Helper to validate Atom feed structure
const validateAtom = (xml: string): boolean => {
	try {
		const parsed = parser.parse(xml);
		return (
			parsed.feed !== undefined &&
			parsed.feed.title !== undefined &&
			(parsed.feed.entry !== undefined || Array.isArray(parsed.feed.entry))
		);
	} catch {
		return false;
	}
};

describe("RSS Feeds", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.NODE_ENV = "test";
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Main RSS Feed (Beehiiv)", () => {
		it("should return valid RSS 2.0 feed when Beehiiv responds successfully", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>Test Feed</title>
		<link>https://example.com</link>
		<description>Test description</description>
		<item>
			<title>Test Post</title>
			<link>https://example.com/post</link>
			<description>Test content</description>
		</item>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../rss.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.setHeader).toHaveBeenCalledWith(
				"Content-Type",
				"application/rss+xml; charset=utf-8",
			);
			expect(res.send).toHaveBeenCalled();
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(validateRSS2(sentXml)).toBe(true);
		});

		it("should return valid error RSS when Beehiiv fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../rss.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("rss");
		});
	});

	describe("YouTube RSS Feed", () => {
		it("should return valid Atom feed when YouTube responds successfully", async () => {
			const mockAtom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
	<title>YouTube Feed</title>
	<entry>
		<title>Test Video</title>
		<link href="https://youtube.com/watch?v=test123"/>
		<yt:videoId>test123</yt:videoId>
	</entry>
</feed>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockAtom,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../youtube.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.setHeader).toHaveBeenCalledWith(
				"Content-Type",
				"application/atom+xml; charset=utf-8",
			);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(validateAtom(sentXml)).toBe(true);
		});

		it("should return valid error feed when YouTube fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 404,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../youtube.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("feed");
		});
	});

	describe("GitHub RSS Feed", () => {
		it("should return valid Atom feed when GitHub responds successfully", async () => {
			const mockAtom = `<?xml version="1.0" encoding="UTF-8"?>
<feed>
	<title>GitHub Activity</title>
	<entry>
		<title>Test Activity</title>
		<link href="https://github.com/test"/>
		<id>test-id</id>
	</entry>
</feed>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockAtom,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../github.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.setHeader).toHaveBeenCalledWith(
				"Content-Type",
				"application/atom+xml; charset=utf-8",
			);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(validateAtom(sentXml)).toBe(true);
		});

		it("should return valid error feed when GitHub fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 403,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../github.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("feed");
		});
	});

	describe("Hybrid RSS Feed", () => {
		it("should return valid RSS 2.0 feed with combined entries", async () => {
			const mockBeehiiv = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>Blog Post</title>
			<link>https://example.com/blog</link>
			<description>Blog content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
			<guid>blog-1</guid>
		</item>
	</channel>
</rss>`;

			const mockYouTube = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
	<entry>
		<title>Video Title</title>
		<link href="https://youtube.com/watch?v=abc123"/>
		<yt:videoId>abc123</yt:videoId>
		<published>2024-01-02T00:00:00Z</published>
	</entry>
</feed>`;

			const mockGitHub = `<?xml version="1.0" encoding="UTF-8"?>
<feed>
	<entry>
		<id>github-1</id>
		<title>GitHub Activity</title>
		<link href="https://github.com/test"/>
		<published>2024-01-03T00:00:00Z</published>
	</entry>
</feed>`;

			// Mock: Beehiiv + YouTube (first attempt succeeds) + GitHub
			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockBeehiiv,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockYouTube,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockGitHub,
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../hybrid.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.setHeader).toHaveBeenCalledWith(
				"Content-Type",
				"application/rss+xml; charset=utf-8",
			);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(validateRSS2(sentXml)).toBe(true);
			expect(sentXml).toContain("Blog Post");
			expect(sentXml).toContain("Video Title");
			expect(sentXml).toContain("GitHub Activity");
		});

		it("should return valid RSS feed with placeholder when all sources fail", async () => {
			// Mock multiple YouTube feed attempts (3 URLs) + Beehiiv + GitHub
			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: false,
					status: 500,
				} as Response)
				// YouTube feed attempts (3 URLs)
				.mockResolvedValueOnce({
					ok: false,
					status: 404,
				} as Response)
				.mockResolvedValueOnce({
					ok: false,
					status: 404,
				} as Response)
				.mockResolvedValueOnce({
					ok: false,
					status: 404,
				} as Response)
				.mockResolvedValueOnce({
					ok: false,
					status: 403,
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../hybrid.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			// The empty feed should be valid RSS
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("<rss");
			expect(sentXml).toContain("<channel>");
			expect(validateRSS2(sentXml)).toBe(true);
			expect(sentXml).toContain("No Content Available");
		});

		it("should return valid error RSS when feed building fails", async () => {
			// Mock fetch to return invalid XML that can't be parsed
			// Beehiiv + YouTube (3 attempts) + GitHub
			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "invalid xml",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "invalid xml",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "invalid xml",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "invalid xml",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "invalid xml",
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../hybrid.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			// Should return 200 with placeholder item when parsing fails
			expect(res.status).toHaveBeenCalledWith(200);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			// Should be valid RSS even with invalid source feeds
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("<rss");
			expect(sentXml).toContain("<channel>");
			expect(validateRSS2(sentXml)).toBe(true);
		});

		it("should sort entries by publication date (newest first)", async () => {
			const mockBeehiiv = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>Old Post</title>
			<link>https://example.com/old</link>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
			<guid>old-1</guid>
		</item>
	</channel>
</rss>`;

			const mockYouTube = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
	<entry>
		<title>New Video</title>
		<link href="https://youtube.com/watch?v=new123"/>
		<yt:videoId>new123</yt:videoId>
		<published>2024-01-15T00:00:00Z</published>
	</entry>
</feed>`;

			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockBeehiiv,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockYouTube,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../hybrid.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			const newVideoIndex = sentXml.indexOf("New Video");
			const oldPostIndex = sentXml.indexOf("Old Post");
			expect(newVideoIndex).toBeLessThan(oldPostIndex);
		});

		it("should include source tags for each entry", async () => {
			const mockBeehiiv = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>Blog Post</title>
			<link>https://example.com/blog</link>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
			<guid>blog-1</guid>
		</item>
	</channel>
</rss>`;

			const mockYouTube = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
	<entry>
		<title>Video</title>
		<link href="https://youtube.com/watch?v=test"/>
		<yt:videoId>test</yt:videoId>
		<published>2024-01-02T00:00:00Z</published>
	</entry>
</feed>`;

			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockBeehiiv,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockYouTube,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../hybrid.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain('<source url="');
			expect(sentXml).toContain("DealScale Blog");
			expect(sentXml).toContain("DealScale YouTube");
		});
	});

	describe("RSS Feed Headers", () => {
		it("should set correct Content-Type headers for RSS feeds", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>Test</title>
		<link>https://example.com</link>
		<description>Test</description>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../rss.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.setHeader).toHaveBeenCalledWith(
				"Content-Type",
				"application/rss+xml; charset=utf-8",
			);
		});

		it("should set correct Cache-Control headers", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>Test</title>
		<link>https://example.com</link>
		<description>Test</description>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../rss.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.setHeader).toHaveBeenCalledWith(
				"Cache-Control",
				expect.stringContaining("s-maxage"),
			);
		});
	});
});

