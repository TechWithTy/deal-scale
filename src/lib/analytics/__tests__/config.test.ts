import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

const loadModule = async () => {
	vi.resetModules();
	return import("../config");
};

beforeEach(() => {
	process.env = { ...originalEnv };
});

afterEach(() => {
	process.env = { ...originalEnv };
});

describe("getAnalyticsConfig", () => {
	it("prefers NEXT_PUBLIC env vars when both scopes are present", async () => {
		process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = "public-clarity";
		process.env.CLARITY_PROJECT_ID = "private-clarity";
		process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS = "ga-public";
		process.env.GOOGLE_ANALYTICS_ID = "ga-private";
		process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID = "gtm-public";
		process.env.GOOGLE_TAG_MANAGER_ID = "gtm-private";
		process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE = "zoho-public";
		process.env.ZOHO_SALES_IQ_WIDGET_CODE = "zoho-private";
		process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = "fb-public";
		process.env.FACEBOOK_PIXEL_ID = "fb-private";
		process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "public.example";
		process.env.PLAUSIBLE_DOMAIN = "private.example";
		process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT = "https://public.example/event";
		process.env.PLAUSIBLE_ENDPOINT = "https://private.example/event";

		const { getAnalyticsConfig } = await loadModule();
		const result = getAnalyticsConfig();

		expect(result.config).toEqual({
			clarityId: "public-clarity",
			gaId: "ga-public",
			gtmId: "gtm-public",
			zohoCode: "zoho-public",
			facebookPixelId: "fb-public",
			plausibleDomain: "public.example",
			plausibleEndpoint: "https://public.example/event",
		});
		expect(result.fallbacksUsed).toEqual({});
		expect(result.errors).toHaveLength(0);
		expect(result.warnings).toHaveLength(0);
	});

	it("falls back to private env vars when NEXT_PUBLIC values are missing", async () => {
		delete process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
		delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
		delete process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
		delete process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE;
		delete process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
		delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
		delete process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT;
		process.env.CLARITY_PROJECT_ID = "private-clarity";
		process.env.GOOGLE_ANALYTICS_ID = "ga-private";
		process.env.GOOGLE_TAG_MANAGER_ID = "gtm-private";
		process.env.ZOHO_SALES_IQ_WIDGET_CODE = "zoho-private";
		process.env.FACEBOOK_PIXEL_ID = "fb-private";
		process.env.PLAUSIBLE_DOMAIN = "private.example";
		process.env.PLAUSIBLE_ENDPOINT = "https://private.example/event";

		const { getAnalyticsConfig } = await loadModule();
		const result = getAnalyticsConfig();

		expect(result.config).toEqual({
			clarityId: "private-clarity",
			gaId: "ga-private",
			gtmId: "gtm-private",
			zohoCode: "zoho-private",
			facebookPixelId: "fb-private",
			plausibleDomain: "private.example",
			plausibleEndpoint: "https://private.example/event",
		});
		expect(result.fallbacksUsed).toEqual({
			clarityId: true,
			gaId: true,
			gtmId: true,
			zohoCode: true,
			facebookPixelId: true,
			plausibleDomain: true,
			plausibleEndpoint: true,
		});
		expect(result.errors).toHaveLength(0);
		expect(result.warnings).toEqual([
			{
				field: "clarityId",
				message:
					"Using fallback environment variable CLARITY_PROJECT_ID for clarityId.",
			},
			{
				field: "gaId",
				message:
					"Using fallback environment variable GOOGLE_ANALYTICS_ID for gaId.",
			},
			{
				field: "gtmId",
				message:
					"Using fallback environment variable GOOGLE_TAG_MANAGER_ID for gtmId.",
			},
			{
				field: "zohoCode",
				message:
					"Using fallback environment variable ZOHO_SALES_IQ_WIDGET_CODE for zohoCode.",
			},
			{
				field: "facebookPixelId",
				message:
					"Using fallback environment variable FACEBOOK_PIXEL_ID for facebookPixelId.",
			},
			{
				field: "plausibleDomain",
				message:
					"Using fallback environment variable PLAUSIBLE_DOMAIN for plausibleDomain.",
			},
			{
				field: "plausibleEndpoint",
				message:
					"Using fallback environment variable PLAUSIBLE_ENDPOINT for plausibleEndpoint.",
			},
		]);
	});

	it("uses NEXT_PUBLIC values even when NODE_ENV is production", async () => {
		process.env.NODE_ENV = "production";
		process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = "public-clarity";
		process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS = "ga-public";
		process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID = "gtm-public";
		process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE = "zoho-public";
		process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = "fb-public";
		process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "public.example";
		process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT = "https://public.example/event";

		const { getAnalyticsConfig } = await loadModule();
		const result = getAnalyticsConfig();

		expect(result.config).toEqual({
			clarityId: "public-clarity",
			gaId: "ga-public",
			gtmId: "gtm-public",
			zohoCode: "zoho-public",
			facebookPixelId: "fb-public",
			plausibleDomain: "public.example",
			plausibleEndpoint: "https://public.example/event",
		});
		expect(result.fallbacksUsed).toEqual({});
		expect(result.errors).toHaveLength(0);
		expect(result.warnings).toEqual([]);
	});

	it("reports warnings when no environment variables are defined", async () => {
		delete process.env.CLARITY_PROJECT_ID;
		delete process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
		delete process.env.GOOGLE_ANALYTICS_ID;
		delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
		delete process.env.GOOGLE_TAG_MANAGER_ID;
		delete process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
		delete process.env.ZOHO_SALES_IQ_WIDGET_CODE;
		delete process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE;
		delete process.env.FACEBOOK_PIXEL_ID;
		delete process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
		delete process.env.PLAUSIBLE_DOMAIN;
		delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
		delete process.env.PLAUSIBLE_ENDPOINT;
		delete process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT;

		const { getAnalyticsConfig } = await loadModule();
		const result = getAnalyticsConfig();

		expect(result.config).toEqual({});
		expect(result.fallbacksUsed).toEqual({});
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([
			{
				field: "clarityId",
				message: "Analytics provider clarityId is not configured.",
			},
			{
				field: "gaId",
				message: "Analytics provider gaId is not configured.",
			},
			{
				field: "gtmId",
				message: "Analytics provider gtmId is not configured.",
			},
			{
				field: "zohoCode",
				message: "Analytics provider zohoCode is not configured.",
			},
			{
				field: "facebookPixelId",
				message: "Analytics provider facebookPixelId is not configured.",
			},
			{
				field: "plausibleDomain",
				message: "Analytics provider plausibleDomain is not configured.",
			},
			{
				field: "plausibleEndpoint",
				message: "Analytics provider plausibleEndpoint is not configured.",
			},
		]);
		expect(result.hasErrors).toBe(false);
	});
});
