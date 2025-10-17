import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response as NodeFetchResponse } from "node-fetch";

jest.mock("next/server", () => ({
        NextResponse: {
                json: (body: unknown, init?: ResponseInit) =>
                        new NodeFetchResponse(JSON.stringify(body), {
                                status: init?.status ?? 200,
                                statusText: init?.statusText,
                                headers: {
                                        "content-type": "application/json",
                                        ...(init?.headers as Record<string, string> | undefined),
                                },
                        }),
        },
}));

const originalEnv = { ...process.env };

const loadRoute = async () => {
        jest.resetModules();
        return import("../route");
};

describe("GET /api/init-providers", () => {
        beforeEach(() => {
                process.env = { ...originalEnv };
        });

        afterEach(() => {
                process.env = { ...originalEnv };
        });

        it("returns a 200 response with warnings when providers are not configured", async () => {
                delete process.env.CLARITY_PROJECT_ID;
                delete process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
                delete process.env.GOOGLE_ANALYTICS_ID;
                delete process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
                delete process.env.GOOGLE_TAG_MANAGER_ID;
                delete process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
                delete process.env.ZOHO_SALES_IQ_WIDGET_CODE;
                delete process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE;

                process.env.NODE_ENV = "production";

                const { GET } = await loadRoute();
                const response = await GET();

                expect(response.status).toBe(200);
                expect(response.headers.get("cache-control")).toBe("no-store");

                const payload = await response.json();

                expect(payload).toEqual({
                        warnings: [
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
                        ],
                        fallbacksUsed: {},
                });
        });
});
