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

describe("redirect route with Facebook Pixel tracking", () => {
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
		return new NodeRequest(url.toString()) as unknown as Request;
	};

	const createNotionPageWithFacebookPixel = (
		facebookPixelEnabled: boolean,
		facebookPixelSource?: string,
		facebookPixelIntent?: string,
	) => {
		const props: Record<string, unknown> = {
			Slug: {
				type: "rich_text",
				rich_text: [{ plain_text: "test-slug" }],
			},
			Title: {
				type: "rich_text",
				rich_text: [{ plain_text: "Test Title" }],
			},
			Destination: {
				type: "url",
				url: "https://example.com/target",
			},
			"Redirects (Calls)": {
				type: "number",
				number: 0,
			},
			"Link Tree Enabled": {
				type: "select",
				select: { name: "True" },
			},
			"Facebook Pixel Enabled": facebookPixelEnabled
				? {
						type: "select",
						select: { name: "True" },
					}
				: {
						type: "select",
						select: { name: "False" },
					},
		};

		if (facebookPixelSource) {
			props["Facebook Pixel Source"] = {
				type: "select",
				select: { name: facebookPixelSource },
			};
		}

		if (facebookPixelIntent) {
			props["Facebook Pixel Intent"] = {
				type: "rich_text",
				rich_text: [{ plain_text: facebookPixelIntent }],
			};
		}

		return {
			id: "test-page-id",
			properties: props,
			icon: null,
			cover: null,
		};
	};

	test("redirects to client-side tracking page when Facebook Pixel is enabled", async () => {
		const notionPageData = createNotionPageWithFacebookPixel(
			true,
			"Meta campaign",
			"MVP_Launch_BlackFriday",
		);

		let getCallCount = 0;
		// Mock fetch with separate counters for GET and PATCH
		(global.fetch as jest.Mock).mockImplementation(
			(url: string, options?: RequestInit) => {
				// PATCH call for increment
				if (options?.method === "PATCH") {
					return Promise.resolve({
						ok: true,
					});
				}
				// GET calls
				getCallCount++;
				// First GET: incrementCalls
				if (getCallCount === 1) {
					return Promise.resolve({
						ok: true,
						json: async () => ({
							properties: {
								"Redirects (Calls)": { type: "number", number: 0 },
							},
						}),
					});
				}
				// Second GET: Facebook Pixel check
				return Promise.resolve({
					ok: true,
					json: async () => notionPageData,
				});
			},
		);

		const searchParams = new URLSearchParams();
		searchParams.set("pageId", "test-page-id");
		searchParams.set("utm_source", "test-source");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		expect(response.status).toBe(302);
		const location = response.headers.get("location");

		// Debug: log the location to see what we got
		if (!location?.includes("/redirect")) {
			console.log("Location:", location);
			console.log(
				"Fetch calls:",
				(global.fetch as jest.Mock).mock.calls.length,
			);
		}

		// Should redirect to /redirect page
		expect(location).toContain("/redirect");
		expect(location).toContain("to=https%3A%2F%2Fexample.com%2Ftarget");
		// URL encoding can use + or %20 for spaces
		expect(location).toMatch(/fbSource=Meta[\s+%20]campaign/);
		expect(location).toContain("fbIntent=MVP_Launch_BlackFriday");
		// UTM params should be preserved
		expect(location).toContain("utm_source=test-source");
	});

	test("uses direct redirect when Facebook Pixel is disabled", async () => {
		let getCallCount = 0;
		(global.fetch as jest.Mock).mockImplementation(
			(url: string, options?: RequestInit) => {
				if (options?.method === "PATCH") {
					return Promise.resolve({ ok: true });
				}
				getCallCount++;
				if (getCallCount === 1) {
					return Promise.resolve({
						ok: true,
						json: async () => ({
							properties: {
								"Redirects (Calls)": { type: "number", number: 0 },
							},
						}),
					});
				}
				return Promise.resolve({
					ok: true,
					json: async () => createNotionPageWithFacebookPixel(false),
				});
			},
		);

		const searchParams = new URLSearchParams();
		searchParams.set("pageId", "test-page-id");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		expect(response.status).toBe(302);
		const location = response.headers.get("location");

		// Should redirect directly to target, not to /redirect
		expect(location).toBe("https://example.com/target");
		expect(location).not.toContain("/redirect");
	});

	test("handles Facebook Pixel with only source parameter", async () => {
		let getCallCount = 0;
		(global.fetch as jest.Mock).mockImplementation(
			(url: string, options?: RequestInit) => {
				if (options?.method === "PATCH") {
					return Promise.resolve({ ok: true });
				}
				getCallCount++;
				if (getCallCount === 1) {
					return Promise.resolve({
						ok: true,
						json: async () => ({
							properties: {
								"Redirects (Calls)": { type: "number", number: 0 },
							},
						}),
					});
				}
				return Promise.resolve({
					ok: true,
					json: async () =>
						createNotionPageWithFacebookPixel(true, "Meta campaign"),
				});
			},
		);

		const searchParams = new URLSearchParams();
		searchParams.set("pageId", "test-page-id");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		const location = response.headers.get("location");
		expect(location).toContain("/redirect");
		// URL encoding can use + or %20 for spaces
		expect(location).toMatch(/fbSource=Meta[\s+%20]campaign/);
		expect(location).not.toContain("fbIntent");
	});

	test("handles Facebook Pixel when Notion fetch fails gracefully", async () => {
		let getCallCount = 0;
		// Mock fetch - first call succeeds (for incrementCalls), second fails (for Facebook Pixel check)
		(global.fetch as jest.Mock).mockImplementation(
			(url: string, options?: RequestInit) => {
				if (options?.method === "PATCH") {
					return Promise.resolve({ ok: true });
				}
				getCallCount++;
				if (getCallCount === 1) {
					// First GET: incrementCalls succeeds
					return Promise.resolve({
						ok: true,
						json: async () => ({
							properties: {
								"Redirects (Calls)": { type: "number", number: 0 },
							},
						}),
					});
				}
				// Second GET: Facebook Pixel check fails
				return Promise.reject(new Error("Notion API error"));
			},
		);

		const searchParams = new URLSearchParams();
		searchParams.set("pageId", "test-page-id");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		// Should fall back to direct redirect
		expect(response.status).toBe(302);
		const location = response.headers.get("location");
		expect(location).toBe("https://example.com/target");
		expect(location).not.toContain("/redirect");
	});

	test("preserves all query parameters when redirecting to tracking page", async () => {
		let getCallCount = 0;
		(global.fetch as jest.Mock).mockImplementation(
			(url: string, options?: RequestInit) => {
				if (options?.method === "PATCH") {
					return Promise.resolve({ ok: true });
				}
				getCallCount++;
				if (getCallCount === 1) {
					return Promise.resolve({
						ok: true,
						json: async () => ({
							properties: {
								"Redirects (Calls)": { type: "number", number: 0 },
							},
						}),
					});
				}
				return Promise.resolve({
					ok: true,
					json: async () =>
						createNotionPageWithFacebookPixel(true, "Meta campaign", "Launch"),
				});
			},
		);

		const searchParams = new URLSearchParams();
		searchParams.set("pageId", "test-page-id");
		searchParams.set("utm_source", "test");
		searchParams.set("utm_campaign", "campaign");
		searchParams.set("ref", "partner");

		const req = createRequest("https://example.com/target", searchParams);
		const response = await GET(req);

		const location = response.headers.get("location");
		expect(location).toContain("utm_source=test");
		expect(location).toContain("utm_campaign=campaign");
		expect(location).toContain("ref=partner");
	});
});
