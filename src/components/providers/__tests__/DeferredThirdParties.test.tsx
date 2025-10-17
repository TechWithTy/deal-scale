import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, jest } from "@jest/globals";
import { init as plausibleInit } from "@plausible-analytics/tracker";
import { createElement } from "react";
import type { ComponentType } from "react";

jest.mock("next/dynamic", () => ({
        __esModule: true,
        default: () => {
                const module = require("@/components/analytics/Analytics") as {
                        Analytics: ComponentType<any>;
                };
                return module.Analytics;
        },
}));

const analyticsSpy = jest.fn();

jest.mock("@/components/analytics/Analytics", () => ({
        Analytics: (props: { config: Record<string, unknown> }) => {
                analyticsSpy(props);
                return createElement("div", { "data-testid": "analytics" });
        },
}));

jest.mock(
        "@plausible-analytics/tracker",
        () => ({
                init: jest.fn(),
        }),
        { virtual: true },
);

jest.useFakeTimers();

describe("DeferredThirdParties", () => {
        const originalFetch = globalThis.fetch;
        const originalConsoleWarn = console.warn;

        beforeEach(() => {
                analyticsSpy.mockClear();
                plausibleInit.mockClear();
                globalThis.fetch = jest.fn() as unknown as typeof fetch;
                console.warn = jest.fn();
                document.body.innerHTML = "";
                document.head.innerHTML = "";
        });

        afterEach(() => {
                globalThis.fetch = originalFetch;
                console.warn = originalConsoleWarn;
        });

        it("defers loading until an interaction and injects clarity script", async () => {
                const response = {
                        ok: true,
                        json: () =>
                                Promise.resolve({
                                        clarityId: "clarity-id",
                                        gaId: "ga-id",
                                        gtmId: "gtm-id",
                                        zohoCode: "zoho-id",
                                }),
                } as Response;
                (globalThis.fetch as jest.Mock).mockResolvedValue(response);

                const { DeferredThirdParties } = await import("../DeferredThirdParties");

                render(<DeferredThirdParties />);

                expect(globalThis.fetch).not.toHaveBeenCalled();

                act(() => {
                        fireEvent.pointerMove(window);
                });

                await waitFor(() => {
                        expect(globalThis.fetch).toHaveBeenCalledWith(
                                "/api/init-providers",
                                expect.objectContaining({ cache: "no-store" }),
                        );
                });

                await waitFor(() => {
                        expect(document.getElementById("clarity-script")).not.toBeNull();
                });

                expect(analyticsSpy).toHaveBeenCalledWith({
                        config: {
                                gaId: "ga-id",
                                gtmId: "gtm-id",
                        },
                });
        });

        it("initializes Plausible when a domain is configured", async () => {
                const { DeferredThirdParties } = await import("../DeferredThirdParties");

                render(
                        <DeferredThirdParties
                                initialConfig={{
                                        plausibleDomain: "example.com",
                                }}
                        />,
                );

                act(() => {
                        fireEvent.pointerMove(window);
                });

                await waitFor(() => {
                        expect(plausibleInit).toHaveBeenCalledWith({
                                domain: "example.com",
                                endpoint: "https://plausible.io/api/event",
                                autoCapturePageviews: true,
                                captureOnLocalhost: false,
                        });
                });
        });

        it("does not initialize Plausible when domain is missing", async () => {
                const { DeferredThirdParties } = await import("../DeferredThirdParties");

                render(
                        <DeferredThirdParties
                                initialConfig={{
                                        plausibleEndpoint: "https://proxy.example.com/event",
                                }}
                        />,
                );

                act(() => {
                        fireEvent.pointerMove(window);
                });

                await act(async () => {
                        await Promise.resolve();
                });

                expect(plausibleInit).not.toHaveBeenCalled();
        });

        it("logs a warning and retries when the providers endpoint returns an error", async () => {
                const failingResponse = {
                        ok: false,
                        status: 503,
                        json: () => Promise.resolve({ error: "Service unavailable" }),
                } as Response;
                const successResponse = {
                        ok: true,
                        json: () =>
                                Promise.resolve({
                                        clarityId: "clarity-id",
                                }),
                } as Response;
                (globalThis.fetch as jest.Mock)
                        .mockResolvedValueOnce(failingResponse)
                        .mockResolvedValueOnce(successResponse);

                const { DeferredThirdParties } = await import("../DeferredThirdParties");

                render(<DeferredThirdParties retryDelayMs={500} maxRetries={2} />);

                act(() => {
                        document.dispatchEvent(new Event("visibilitychange"));
                });

                await waitFor(() => {
                        expect(globalThis.fetch).toHaveBeenCalledTimes(1);
                });

                expect(console.warn).toHaveBeenCalledWith(
                        "DeferredThirdParties",
                        "Failed to load provider configuration.",
                        expect.objectContaining({ status: 503 }),
                );

                await act(async () => {
                        jest.advanceTimersByTime(500);
                        await Promise.resolve();
                });

                await waitFor(() => {
                        expect(globalThis.fetch).toHaveBeenCalledTimes(2);
                });
        });

        it("uses initial analytics config without hitting the providers endpoint", async () => {
                const { DeferredThirdParties } = await import("../DeferredThirdParties");

                render(
                        <DeferredThirdParties
                                initialConfig={{
                                        clarityId: "clarity-id",
                                        gaId: "ga-id",
                                        gtmId: "gtm-id",
                                        zohoCode: "zoho-id",
                                        plausibleDomain: "example.com",
                                        plausibleEndpoint: "https://plausible.io/api/event",
                                }}
                        />,
                );

                act(() => {
                        fireEvent.pointerMove(window);
                });

                await waitFor(() => {
                        expect(document.getElementById("clarity-script")).not.toBeNull();
                });

                expect(analyticsSpy).toHaveBeenCalledWith({
                        config: {
                                gaId: "ga-id",
                                gtmId: "gtm-id",
                        },
                });

                expect(globalThis.fetch).not.toHaveBeenCalled();
        });
});
