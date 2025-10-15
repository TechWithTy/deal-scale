import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, jest } from "@jest/globals";
import type { ComponentType } from "react";

jest.mock("next/dynamic", () => ({
        __esModule: true,
        default: () => {
                const module = require("@/components/analytics/Analytics") as {
                        Analytics: ComponentType<any>;
                };
                return (props: Record<string, unknown>) => <module.Analytics {...props} />;
        },
}));

const analyticsSpy = jest.fn();

jest.mock("@/components/analytics/Analytics", () => ({
        Analytics: (props: { config: Record<string, unknown> }) => {
                analyticsSpy(props);
                return <div data-testid="analytics" />;
        },
}));

jest.useFakeTimers();

describe("DeferredThirdParties", () => {
        const originalFetch = globalThis.fetch;
        const originalConsoleWarn = console.warn;

        beforeEach(() => {
                analyticsSpy.mockClear();
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
});
