import { evaluateAnalyticsEnv } from "../check-analytics-env";

describe("evaluateAnalyticsEnv", () => {
        it("identifies when analytics configuration is missing", () => {
                const report = evaluateAnalyticsEnv({});

                expect(report.missing).toEqual(
                        expect.arrayContaining([
                                expect.stringContaining("Microsoft Clarity project ID"),
                                expect.stringContaining("Google Analytics measurement ID"),
                                expect.stringContaining("Google Tag Manager container ID"),
                                expect.stringContaining("Zoho SalesIQ widget code"),
                        ]),
                );
        });

        it("warns when fallbacks are used instead of private keys", () => {
                const report = evaluateAnalyticsEnv({
                        NEXT_PUBLIC_CLARITY_PROJECT_ID: "clarity",
                        NEXT_PUBLIC_GOOGLE_ANALYTICS: "ga",
                        NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: "gtm",
                        NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE: "zoho",
                });

                expect(report.fallbackWarnings).toEqual(
                        expect.arrayContaining([
                                expect.stringContaining("Using NEXT_PUBLIC_CLARITY_PROJECT_ID fallback"),
                                expect.stringContaining("Using NEXT_PUBLIC_GOOGLE_ANALYTICS fallback"),
                                expect.stringContaining("Using NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID fallback"),
                                expect.stringContaining("Using NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE fallback"),
                        ]),
                );
        });
});
