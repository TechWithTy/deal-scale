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
	const hasRss = xml.includes("<rss") && xml.includes("version=\"2.0\"");
	const hasChannel = xml.includes("<channel>");
	const hasTitle = xml.includes("<title>");
	const hasLink = xml.includes("<link>");
	const hasDescription = xml.includes("<description>");
	return hasRss && hasChannel && hasTitle && hasLink && hasDescription;
};

describe("News RSS Feeds", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.NODE_ENV = "test";
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Inman News Feed", () => {
		it("should return valid RSS 2.0 feed when Inman responds successfully", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>Inman News</title>
		<link>https://www.inman.com</link>
		<description>Real estate news</description>
		<item>
			<title>Test Article</title>
			<link>https://www.inman.com/article</link>
			<description>Test content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
		</item>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/inman.xml")).default;
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
		});

		it("should return valid error RSS when Inman fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/inman.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("rss");
		});
	});

	describe("REIT.com Feed", () => {
		it("should return valid RSS 2.0 feed when REIT.com responds successfully", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>REIT.com</title>
		<link>https://www.reit.com</link>
		<description>REIT news</description>
		<item>
			<title>REIT Article</title>
			<link>https://www.reit.com/article</link>
			<description>REIT content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
		</item>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/reit.xml")).default;
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
		});

		it("should return valid error RSS when REIT.com fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 404,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/reit.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("rss");
		});
	});

	describe("Connect CRE Feed", () => {
		it("should return valid RSS 2.0 feed when Connect CRE responds successfully", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>Connect CRE</title>
		<link>https://www.connectcre.com</link>
		<description>Commercial real estate news</description>
		<item>
			<title>CRE Article</title>
			<link>https://www.connectcre.com/article</link>
			<description>CRE content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
		</item>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/connect-cre.xml")).default;
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
		});

		it("should return valid error RSS when Connect CRE fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/connect-cre.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("rss");
		});
	});

	describe("World Property Journal Feed", () => {
		it("should return valid RSS 2.0 feed when World Property Journal responds successfully", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>World Property Journal</title>
		<link>https://www.worldpropertyjournal.com</link>
		<description>Global real estate news</description>
		<item>
			<title>Global Article</title>
			<link>https://www.worldpropertyjournal.com/article</link>
			<description>Global content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
		</item>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/world-property-journal.xml")).default;
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
		});

		it("should return valid error RSS when World Property Journal fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 404,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/world-property-journal.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("rss");
		});
	});

	describe("first tuesday Feed", () => {
		it("should return valid RSS 2.0 feed when first tuesday responds successfully", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>first tuesday</title>
		<link>https://journal.firsttuesday.us</link>
		<description>Real estate investing news</description>
		<item>
			<title>Investing Article</title>
			<link>https://journal.firsttuesday.us/article</link>
			<description>Investing content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
		</item>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/first-tuesday.xml")).default;
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
		});

		it("should return valid error RSS when first tuesday fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/first-tuesday.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("rss");
		});
	});

	describe("NAR Feed", () => {
		it("should return valid RSS 2.0 feed when NAR responds successfully", async () => {
			const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>NAR</title>
		<link>https://www.nar.realtor</link>
		<description>Realtor association news</description>
		<item>
			<title>NAR Article</title>
			<link>https://www.nar.realtor/article</link>
			<description>NAR content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
		</item>
	</channel>
</rss>`;

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				text: async () => mockRSS,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/nar.xml")).default;
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
		});

		it("should return valid error RSS when NAR fails", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 403,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/nar.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain("<?xml");
			expect(sentXml).toContain("rss");
		});
	});

	describe("News Aggregator Feed", () => {
		it("should return valid RSS 2.0 feed with combined entries from all sources", async () => {
			const mockInman = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>Inman Article</title>
			<link>https://www.inman.com/article</link>
			<description>Inman content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
			<guid>inman-1</guid>
		</item>
	</channel>
</rss>`;

			const mockREIT = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>REIT Article</title>
			<link>https://www.reit.com/article</link>
			<description>REIT content</description>
			<pubDate>Mon, 02 Jan 2024 00:00:00 GMT</pubDate>
			<guid>reit-1</guid>
		</item>
	</channel>
</rss>`;

			const mockConnectCRE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>Connect CRE Article</title>
			<link>https://www.connectcre.com/article</link>
			<description>Connect CRE content</description>
			<pubDate>Mon, 03 Jan 2024 00:00:00 GMT</pubDate>
			<guid>connectcre-1</guid>
		</item>
	</channel>
</rss>`;

			const mockWPJ = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>WPJ Article</title>
			<link>https://www.worldpropertyjournal.com/article</link>
			<description>WPJ content</description>
			<pubDate>Mon, 04 Jan 2024 00:00:00 GMT</pubDate>
			<guid>wpj-1</guid>
		</item>
	</channel>
</rss>`;

			const mockFT = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>first tuesday Article</title>
			<link>https://journal.firsttuesday.us/article</link>
			<description>first tuesday content</description>
			<pubDate>Mon, 05 Jan 2024 00:00:00 GMT</pubDate>
			<guid>ft-1</guid>
		</item>
	</channel>
</rss>`;

			const mockNAR = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>NAR Article</title>
			<link>https://www.nar.realtor/article</link>
			<description>NAR content</description>
			<pubDate>Mon, 06 Jan 2024 00:00:00 GMT</pubDate>
			<guid>nar-1</guid>
		</item>
	</channel>
</rss>`;

			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockInman,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockREIT,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockConnectCRE,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockWPJ,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockFT,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockNAR,
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/news.xml")).default;
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
			expect(sentXml).toContain("Inman Article");
			expect(sentXml).toContain("REIT Article");
			expect(sentXml).toContain("Connect CRE Article");
			expect(sentXml).toContain("WPJ Article");
			expect(sentXml).toContain("first tuesday Article");
			expect(sentXml).toContain("NAR Article");
		});

		it("should sort entries by publication date (newest first)", async () => {
			const mockInman = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>Old Article</title>
			<link>https://www.inman.com/old</link>
			<description>Old content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
			<guid>old-1</guid>
		</item>
	</channel>
</rss>`;

			const mockREIT = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>New Article</title>
			<link>https://www.reit.com/new</link>
			<description>New content</description>
			<pubDate>Mon, 15 Jan 2024 00:00:00 GMT</pubDate>
			<guid>new-1</guid>
		</item>
	</channel>
</rss>`;

			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockInman,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockREIT,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/news.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			const newArticleIndex = sentXml.indexOf("New Article");
			const oldArticleIndex = sentXml.indexOf("Old Article");
			expect(newArticleIndex).toBeLessThan(oldArticleIndex);
		});

		it("should include source tags for each entry", async () => {
			const mockInman = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<item>
			<title>Inman Article</title>
			<link>https://www.inman.com/article</link>
			<description>Inman content</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
			<guid>inman-1</guid>
		</item>
	</channel>
</rss>`;

			global.fetch = vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					text: async () => mockInman,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					text: async () => "",
				} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/news.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(sentXml).toContain('<source url="');
			expect(sentXml).toContain("Inman News");
		});

		it("should return valid empty feed when all sources fail", async () => {
			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/news.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(validateRSS2(sentXml)).toBe(true);
			expect(sentXml).toContain("No Content Available");
		});

		it("should return valid error feed when handler throws", async () => {
			// Mock fetch to throw an error synchronously (not a rejected promise)
			// This simulates an actual exception in the try block
			global.fetch = vi.fn().mockImplementation(() => {
				throw new Error("Network error");
			});

			// @ts-expect-error - Dynamic import for test
			const handler = (await import("../../../pages/api/rss/news.xml")).default;
			const req = createMockRequest();
			const res = createMockResponse();

			await handler(req, res);

			// When an actual exception is thrown (not just rejected promises),
			// the catch block should return 502
			expect(res.status).toHaveBeenCalledWith(502);
			const sentXml = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
			expect(validateRSS2(sentXml)).toBe(true);
			expect(sentXml).toContain("Feed Temporarily Unavailable");
		});
	});
});

