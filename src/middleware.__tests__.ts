/**
 * Tests for middleware redirect functionality with UTM parameters
 */

import { middleware } from "@/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
const mockEnv: NodeJS.ProcessEnv = {
	NODE_ENV: "test" as const,
	NOTION_KEY: "test-notion-key",
	NOTION_REDIRECTS_ID: "test-db-id",
};

beforeEach(() => {
	jest.clearAllMocks();
	// Assign individual properties (NODE_ENV is read-only, skip it)
	process.env.NOTION_KEY = mockEnv.NOTION_KEY;
	process.env.NOTION_REDIRECTS_ID = mockEnv.NOTION_REDIRECTS_ID;
});

afterEach(() => {
	process.env.ALLOW_INCOMING_UTM = undefined;
});

describe("middleware redirects with UTM parameters", () => {
	const createRequest = (
		pathname: string,
		searchParams?: URLSearchParams,
	): NextRequest => {
		const url = new URL(`https://example.com${pathname}`);
		if (searchParams) {
			searchParams.forEach((value, key) => {
				url.searchParams.set(key, value);
			});
		}
		return {
			nextUrl: url,
			headers: new Headers(),
		} as NextRequest;
	};

	const createNotionResponse = (
		destination: string,
		utmParams?: {
			utm_source?: string;
			utm_campaign?: string;
			utm_medium?: string;
			utm_content?: string;
			utm_term?: string;
			utm_offer?: string;
			utm_id?: string;
			utm_campaign_relation?: string;
		},
	) => {
		const properties: Record<string, unknown> = {
			Destination: {
				type: "url",
				url: destination,
			},
			"Redirects (Calls)": {
				type: "number",
				number: 0,
			},
		};

		if (utmParams?.utm_source) {
			properties["UTM Source"] = {
				type: "select",
				select: { name: utmParams.utm_source },
			};
		}

		if (utmParams?.utm_campaign_relation) {
			properties["UTM Campaign (Relation)"] = {
				type: "select",
				select: { name: utmParams.utm_campaign_relation },
			};
		} else if (utmParams?.utm_campaign) {
			properties["UTM Campaign"] = {
				type: "select",
				select: { name: utmParams.utm_campaign },
			};
		}

		if (utmParams?.utm_medium) {
			properties["UTM Medium"] = {
				type: "select",
				select: { name: utmParams.utm_medium },
			};
		}

		if (utmParams?.utm_content) {
			properties["UTM Content"] = {
				type: "select",
				select: { name: utmParams.utm_content },
			};
		}

		if (utmParams?.utm_term) {
			properties["UTM Term"] = {
				type: "select",
				select: { name: utmParams.utm_term },
			};
		}

		if (utmParams?.utm_offer) {
			properties["UTM Offer"] = {
				type: "select",
				select: { name: utmParams.utm_offer },
			};
		}

		if (utmParams?.utm_id) {
			properties["UTM Id"] = {
				type: "select",
				select: { name: utmParams.utm_id },
			};
		}

		return {
			results: [
				{
					id: "test-page-id",
					properties,
				},
			],
		};
	};

	test("redirects with all UTM parameters from Notion", async () => {
		const utmParams = {
			utm_source: "linkedin",
			utm_campaign: "beta2025",
			utm_medium: "social",
			utm_content: "post-123",
			utm_term: "keyword",
			utm_offer: "early-access",
			utm_id: "campaign-456",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse("https://example.com/target", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		expect(response).toBeInstanceOf(NextResponse);
		expect(response?.status).toBe(307);

		const location = response?.headers.get("location");
		expect(location).toContain("https://example.com/target");
		expect(location).toContain("utm_source=linkedin");
		expect(location).toContain("utm_campaign=beta2025");
		expect(location).toContain("utm_medium=social");
		expect(location).toContain("utm_content=post-123");
		expect(location).toContain("utm_term=keyword");
		expect(location).toContain("utm_offer=early-access");
		expect(location).toContain("utm_id=campaign-456");
	});

	test("prefers UTM Campaign (Relation) over UTM Campaign", async () => {
		const utmParams = {
			utm_campaign: "fallback-campaign",
			utm_campaign_relation: "primary-campaign",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse("https://example.com/target", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toContain("utm_campaign=primary-campaign");
		expect(location).not.toContain("utm_campaign=fallback-campaign");
	});

	test("falls back to UTM Campaign when UTM Campaign (Relation) is missing", async () => {
		const utmParams = {
			utm_campaign: "fallback-campaign",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse("https://example.com/target", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toContain("utm_campaign=fallback-campaign");
	});

	test("removes existing UTM parameters from destination URL before adding Notion UTMs", async () => {
		const utmParams = {
			utm_source: "notion-source",
			utm_campaign: "notion-campaign",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse(
						"https://example.com/target?utm_source=old&utm_campaign=old",
						utmParams,
					),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toContain("utm_source=notion-source");
		expect(location).toContain("utm_campaign=notion-campaign");
		expect(location).not.toContain("utm_source=old");
		expect(location).not.toContain("utm_campaign=old");
	});

	test("preserves incoming UTM parameters when ALLOW_INCOMING_UTM is set", async () => {
		process.env.ALLOW_INCOMING_UTM = "1";

		const utmParams = {
			utm_source: "notion-source",
			utm_campaign: "notion-campaign",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse("https://example.com/target", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "incoming-source");
		searchParams.set("utm_content", "incoming-content");

		const req = createRequest("/pilot", searchParams);
		const response = await middleware(req);

		const location = response?.headers.get("location");
		// Incoming UTMs override Notion UTMs when ALLOW_INCOMING_UTM is set
		expect(location).toContain("utm_source=incoming-source");
		expect(location).toContain("utm_content=incoming-content");
	});

	test("ignores incoming UTM parameters when ALLOW_INCOMING_UTM is not set", async () => {
		process.env.ALLOW_INCOMING_UTM = undefined;

		const utmParams = {
			utm_source: "notion-source",
			utm_campaign: "notion-campaign",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse("https://example.com/target", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const searchParams = new URLSearchParams();
		searchParams.set("utm_source", "incoming-source");

		const req = createRequest("/pilot", searchParams);
		const response = await middleware(req);

		const location = response?.headers.get("location");
		// Notion UTMs should be used, incoming UTMs ignored
		expect(location).toContain("utm_source=notion-source");
		expect(location).not.toContain("utm_source=incoming-source");
	});

	test("adds RedirectSource parameter based on referer", async () => {
		const utmParams = {
			utm_source: "linktree",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse("https://example.com/target", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		req.headers.set("referer", "https://example.com/linktree");

		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toContain("RedirectSource=Linktree");
	});

	test("sets RedirectSource to Direct when not from linktree", async () => {
		const utmParams = {
			utm_source: "linkedin",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponse("https://example.com/target", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toContain("RedirectSource=Direct");
	});

	test("handles relative path redirects", async () => {
		const utmParams = {
			utm_source: "internal",
			utm_campaign: "internal-campaign",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => createNotionResponse("/signup", utmParams),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toMatch(/^https:\/\/example\.com\/signup/);
		expect(location).toContain("utm_source=internal");
		expect(location).toContain("utm_campaign=internal-campaign");
	});

	test("increments Redirects (Calls) counter in Notion", async () => {
		const utmParams = {
			utm_source: "test",
		};

		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					results: [
						{
							id: "test-page-id",
							properties: {
								Destination: {
									type: "url",
									url: "https://example.com/target",
								},
								"Redirects (Calls)": {
									type: "number",
									number: 5,
								},
							},
						},
					],
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		await middleware(req);

		// Verify increment call was made
		expect(global.fetch).toHaveBeenCalledTimes(2);
		const incrementCall = (global.fetch as jest.Mock).mock.calls[1];
		expect(incrementCall[0]).toBe(
			"https://api.notion.com/v1/pages/test-page-id",
		);
		expect(incrementCall[1]?.method).toBe("PATCH");
		expect(incrementCall[1]?.body).toContain('"number":6');
	});

	test("skips redirect for paths that should be ignored", async () => {
		const paths = [
			"/_next/static/chunk.js",
			"/api/health",
			"/linktree",
			"/favicon.ico",
			"/assets/image.png",
			"/style.css",
		];

		for (const path of paths) {
			const req = createRequest(path);
			const response = await middleware(req);
			expect(response).toBeInstanceOf(NextResponse);
			expect(response?.status).toBe(200);
		}
	});
});

describe("middleware redirects with Facebook Pixel tracking", () => {
	const createRequest = (
		pathname: string,
		searchParams?: URLSearchParams,
	): NextRequest => {
		const url = new URL(`https://example.com${pathname}`);
		if (searchParams) {
			searchParams.forEach((value, key) => {
				url.searchParams.set(key, value);
			});
		}
		return {
			nextUrl: url,
			headers: new Headers(),
		} as NextRequest;
	};

	const createNotionResponseWithFacebookPixel = (
		destination: string,
		facebookPixelEnabled: boolean,
		facebookPixelSource?: string,
		facebookPixelIntent?: string,
		utmParams?: {
			utm_source?: string;
			utm_campaign?: string;
		},
	) => {
		const properties: Record<string, unknown> = {
			Destination: {
				type: "url",
				url: destination,
			},
			"Redirects (Calls)": {
				type: "number",
				number: 0,
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
			...(facebookPixelSource && {
				"Facebook Pixel Source": {
					type: "select",
					select: { name: facebookPixelSource },
				},
			}),
			...(facebookPixelIntent && {
				"Facebook Pixel Intent": {
					type: "rich_text",
					rich_text: [{ plain_text: facebookPixelIntent }],
				},
			}),
		};

		if (utmParams?.utm_source) {
			properties["UTM Source"] = {
				type: "select",
				select: { name: utmParams.utm_source },
			};
		}

		if (utmParams?.utm_campaign) {
			properties["UTM Campaign"] = {
				type: "select",
				select: { name: utmParams.utm_campaign },
			};
		}

		return {
			results: [
				{
					id: "test-page-id",
					properties,
				},
			],
		};
	};

	test("redirects to client-side tracking page when Facebook Pixel is enabled", async () => {
		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponseWithFacebookPixel(
						"https://example.com/target",
						true,
						"Meta campaign",
						"MVP_Launch_BlackFriday",
					),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		expect(response).toBeInstanceOf(NextResponse);
		expect(response?.status).toBe(307); // Middleware uses 307

		const location = response?.headers.get("location");
		expect(location).toContain("/redirect");
		expect(location).toContain("to=https%3A%2F%2Fexample.com%2Ftarget");
		// URL encoding can use + or %20 for spaces
		expect(location).toMatch(/fbSource=Meta[\s+%20]campaign/);
		expect(location).toContain("fbIntent=MVP_Launch_BlackFriday");
	});

	test("uses direct redirect when Facebook Pixel is disabled", async () => {
		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponseWithFacebookPixel(
						"https://example.com/target",
						false,
					),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		expect(response).toBeInstanceOf(NextResponse);
		expect(response?.status).toBe(307);

		const location = response?.headers.get("location");
		expect(location).toContain("https://example.com/target");
		expect(location).not.toContain("/redirect");
	});

	test("preserves UTM parameters when redirecting to tracking page", async () => {
		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponseWithFacebookPixel(
						"https://example.com/target",
						true,
						"Meta campaign",
						"Launch",
						{
							utm_source: "linkedin",
							utm_campaign: "beta2025",
						},
					),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toContain("/redirect");
		// URL encoding can use + or %20 for spaces
		expect(location).toMatch(/fbSource=Meta[\s+%20]campaign/);
		// UTM params should be in the 'to' parameter (URL-encoded, = becomes %3D)
		expect(location).toMatch(/utm_source%3Dlinkedin|utm_source=linkedin/);
		expect(location).toMatch(/utm_campaign%3Dbeta2025|utm_campaign=beta2025/);
	});

	test("handles Facebook Pixel with only source parameter", async () => {
		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () =>
					createNotionResponseWithFacebookPixel(
						"https://example.com/target",
						true,
						"Meta campaign",
					),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		const location = response?.headers.get("location");
		expect(location).toContain("/redirect");
		// URL encoding can use + or %20 for spaces
		expect(location).toMatch(/fbSource=Meta[\s+%20]campaign/);
		expect(location).not.toContain("fbIntent");
	});

	test("handles Facebook Pixel when mapper fails gracefully", async () => {
		// Mock Notion response that will cause mapper to fail
		(global.fetch as jest.Mock)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					results: [
						{
							id: "test-page-id",
							properties: {
								Destination: {
									type: "url",
									url: "https://example.com/target",
								},
								"Redirects (Calls)": {
									type: "number",
									number: 0,
								},
								// Invalid structure that might cause mapper issues
								"Facebook Pixel Enabled": null,
							},
						},
					],
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({}),
			});

		const req = createRequest("/pilot");
		const response = await middleware(req);

		// Should fall back to direct redirect
		expect(response).toBeInstanceOf(NextResponse);
		const location = response?.headers.get("location");
		expect(location).toContain("https://example.com/target");
		expect(location).not.toContain("/redirect");
	});
});
