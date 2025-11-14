/**
 * Tests for /api/redirect route UTM parameter preservation
 */

// Import node-fetch Request/Response
import { Request as NodeRequest, Response as NodeResponse } from "node-fetch";

// Mock NextResponse BEFORE importing route
jest.mock("next/server", () => ({
	NextResponse: {
		json: (body: unknown, init?: ResponseInit) =>
			new NodeResponse(JSON.stringify(body), {
				status: init?.status ?? 200,
				statusText: init?.statusText,
				headers: {
					"content-type": "application/json",
					...(init?.headers as Record<string, string> | undefined),
				},
			}),
		redirect: (url: string | URL, status = 302) => {
			const redirectUrl = typeof url === "string" ? url : url.toString();
			const headers: Record<string, string> = {
				location: redirectUrl,
			};
			return new NodeResponse(undefined, {
				status,
				headers,
			});
		},
	},
}));

// Mock fetch globally
global.fetch = jest.fn();

// Make Request/Response available globally for Next.js imports
if (typeof global.Request === "undefined") {
	global.Request = NodeRequest as unknown as typeof Request;
}
if (typeof global.Response === "undefined") {
	global.Response = NodeResponse as unknown as typeof Response;
}

// @ts-expect-error - TypeScript excludes test files, but module resolution works at runtime
import { GET } from "@/app/api/redirect/route";

// Mock environment variables
beforeEach(() => {
	jest.clearAllMocks();
	process.env.NOTION_KEY = "test-notion-key";
});

afterEach(() => {
	process.env.NOTION_KEY = undefined;
});

describe("redirect route with UTM parameter preservation", () => {
	const createRequest = (
		to: string,
		searchParams?: URLSearchParams,
	): Request => {
		const url = new URL("https://example.com/api/redirect");
		url.searchParams.set("to", to);
		if (searchParams) {
			searchParams.forEach((value, key) => {
				url.searchParams.set(key, value);
			});
		}
		// Create Request from node-fetch which is available in Jest environment
		return new NodeRequest(url.toString()) as unknown as Request;
	};

	test("preserves UTM parameters for absolute URLs", async () => {
		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "test-source");
		searchParams.set("utm_campaign", "test-campaign");
		searchParams.set("utm_medium", "email");
		searchParams.set("utm_content", "button-click");
		searchParams.set("utm_term", "keyword");
		searchParams.set("utm_offer", "special-offer");
		searchParams.set("utm_id", "campaign-123");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		expect(response.status).toBe(302);
		const location = response.headers.get("location");

		expect(location).toContain("https://example.com/target");
		expect(location).toContain("utm_source=test-source");
		expect(location).toContain("utm_campaign=test-campaign");
		expect(location).toContain("utm_medium=email");
		expect(location).toContain("utm_content=button-click");
		expect(location).toContain("utm_term=keyword");
		expect(location).toContain("utm_offer=special-offer");
		expect(location).toContain("utm_id=campaign-123");
	});

	test("does not preserve internal redirect parameters (pageId, slug, isFile)", async () => {
		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "test-source");
		searchParams.set("pageId", "test-page-123");
		searchParams.set("slug", "test-slug");
		searchParams.set("isFile", "true");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		expect(response).toBeDefined();
		expect(response?.status).toBe(302);
		const location = response?.headers.get("location");
		expect(location).toBeTruthy();

		if (location) {
			// UTM params should be preserved
			expect(location).toContain("utm_source=test-source");
			// Internal redirect parameters should NOT be in the final redirect URL
			expect(location).not.toContain("pageId=test-page-123");
			expect(location).not.toContain("slug=test-slug");
			expect(location).not.toContain("isFile=true");
			// But the destination should be correct
			expect(location).toContain("https://example.com/target");
		}
	});

	test("destination URL params take priority over incoming params", async () => {
		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "incoming-source");
		searchParams.set("utm_campaign", "incoming-campaign");

		// Destination already has UTM params
		const req = createRequest(
			"https://example.com/target?utm_source=destination-source&utm_content=destination-content",
			searchParams,
		);
		const response = await GET(req);

		const location = response.headers.get("location");
		// Destination params should be kept
		expect(location).toContain("utm_source=destination-source");
		expect(location).toContain("utm_content=destination-content");
		// Incoming params that don't conflict should be added
		expect(location).toContain("utm_campaign=incoming-campaign");
	});

	test("preserves non-UTM query parameters", async () => {
		const searchParams = new URLSearchParams();
		searchParams.set("ref", "partner-site");
		searchParams.set("affiliate_id", "12345");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		const location = response.headers.get("location");
		expect(location).toContain("ref=partner-site");
		expect(location).toContain("affiliate_id=12345");
	});

	test("does not preserve params for relative paths (should use middleware)", async () => {
		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "test-source");

		const req = createRequest("/signup", searchParams);
		const response = await GET(req);

		const location = response.headers.get("location");
		// Relative paths should not have params preserved (middleware handles this)
		expect(location).toMatch(/^https:\/\/example\.com\/signup$/);
		expect(location).not.toContain("utm_source");
	});

	test("handles URL encoding correctly", async () => {
		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "test source with spaces");
		searchParams.set("utm_campaign", "campaign&special=chars");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		const location = response.headers.get("location");
		// URLSearchParams encodes spaces as + (both %20 and + are valid)
		expect(location).toMatch(
			/utm_source=test[\s+%20]source[\s+%20]with[\s+%20]spaces/,
		);
		expect(location).toContain("utm_campaign=campaign%26special%3Dchars");
	});

	test("increments call counter when pageId is provided", async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				properties: {
					"Redirects (Calls)": {
						type: "number",
						number: 10,
					},
				},
			}),
		});

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
		});

		const searchParams = new URLSearchParams();
		searchParams.set("pageId", "test-page-id");
		searchParams.set("utm_source", "test");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		// Should still redirect successfully
		expect(response.status).toBe(302);

		// Verify increment was called
		expect(global.fetch).toHaveBeenCalled();
		const incrementCall = (global.fetch as jest.Mock).mock.calls.find((call) =>
			call[0]?.includes("pages/test-page-id"),
		);
		expect(incrementCall).toBeDefined();
	});

	test("handles missing 'to' parameter", async () => {
		const url = new URL("https://example.com/api/redirect");
		const req = new NodeRequest(url.toString()) as unknown as Request;

		const response = await GET(req);
		const json = await response.json();

		expect(response.status).toBe(400);
		expect(json.ok).toBe(false);
		expect(json.error).toBe("missing 'to'");
	});

	test("handles invalid absolute URL", async () => {
		const req = createRequest("not-a-valid-url");

		const response = await GET(req);
		const json = await response.json();

		expect(response.status).toBe(400);
		expect(json.ok).toBe(false);
		expect(json.error).toBe("invalid 'to'");
	});

	test("handles protocol-relative URLs", async () => {
		const req = createRequest("//example.com/target");
		const response = await GET(req);

		const location = response.headers.get("location");
		expect(location).toBe("https://example.com/target");
	});

	test("handles bare hostnames", async () => {
		const req = createRequest("example.com");
		const response = await GET(req);

		const location = response.headers.get("location");
		// URL constructor may add trailing slash, both are valid
		expect(location).toMatch(/^https:\/\/example\.com\/?$/);
	});

	test("handles URL with existing query parameters", async () => {
		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "new-source");

		const req = createRequest(
			"https://example.com/target?existing=param&utm_source=old-source",
			searchParams,
		);
		const response = await GET(req);

		const location = response.headers.get("location");
		// Existing params should be preserved
		expect(location).toContain("existing=param");
		// Existing utm_source should take priority
		expect(location).toContain("utm_source=old-source");
		expect(location).not.toContain("utm_source=new-source");
	});
});
