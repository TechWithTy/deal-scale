import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";

const originalEnv = { ...process.env };

const loadModule = async () => {
        jest.resetModules();
        return import("../config");
};

beforeEach(() => {
        process.env = { ...originalEnv };
});

afterEach(() => {
        process.env = { ...originalEnv };
});

describe("getAnalyticsConfig", () => {
        it("prioritizes private env vars when available", async () => {
                process.env.CLARITY_PROJECT_ID = "private-clarity";
                process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = "public-clarity";
                process.env.GOOGLE_ANALYTICS_ID = "ga-private";
                process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS = "ga-public";
                process.env.GOOGLE_TAG_MANAGER_ID = "gtm-private";
                process.env.ZOHO_SALES_IQ_WIDGET_CODE = "zoho-private";

                const { getAnalyticsConfig } = await loadModule();
                const result = getAnalyticsConfig();

                expect(result.config).toEqual({
                        clarityId: "private-clarity",
                        gaId: "ga-private",
                        gtmId: "gtm-private",
                        zohoCode: "zoho-private",
                });
                expect(result.fallbacksUsed).toEqual({});
                expect(result.errors).toHaveLength(0);
                expect(result.warnings).toHaveLength(0);
        });

        it("uses NEXT_PUBLIC fallbacks in development when private vars are missing", async () => {
                process.env.NODE_ENV = "development";
                process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = "public-clarity";
                process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS = "ga-public";
                process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID = "gtm-public";
                process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE = "zoho-public";

                const { getAnalyticsConfig } = await loadModule();
                const result = getAnalyticsConfig();

                expect(result.config).toEqual({
                        clarityId: "public-clarity",
                        gaId: "ga-public",
                        gtmId: "gtm-public",
                        zohoCode: "zoho-public",
                });
                expect(result.fallbacksUsed).toEqual({
                        clarityId: true,
                        gaId: true,
                        gtmId: true,
                        zohoCode: true,
                });
                expect(result.errors).toHaveLength(0);
                expect(result.warnings).toEqual([
                        {
                                field: "clarityId",
                                message: "Using NEXT_PUBLIC fallback for clarityId in development.",
                        },
                        {
                                field: "gaId",
                                message: "Using NEXT_PUBLIC fallback for gaId in development.",
                        },
                        {
                                field: "gtmId",
                                message: "Using NEXT_PUBLIC fallback for gtmId in development.",
                        },
                        {
                                field: "zohoCode",
                                message: "Using NEXT_PUBLIC fallback for zohoCode in development.",
                        },
                ]);
        });

        it("reports warnings when neither private nor public vars exist", async () => {
                delete process.env.CLARITY_PROJECT_ID;
                delete process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
                delete process.env.GOOGLE_ANALYTICS_ID;
                delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
                delete process.env.GOOGLE_TAG_MANAGER_ID;
                delete process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
                delete process.env.ZOHO_SALES_IQ_WIDGET_CODE;
                delete process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE;

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
                ]);
                expect(result.hasErrors).toBe(false);
        });
});
