import type { NextWebVitalsMetric } from "next/app";

describe("reportWebVitals", () => {
        const originalLocation = window.location;
        const originalPerformance = window.performance;
        const originalSendBeacon = window.navigator.sendBeacon;
        let consoleDebugSpy: jest.SpyInstance;

        beforeEach(() => {
                consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation(() => undefined);

                Object.defineProperty(window, "location", {
                        configurable: true,
                        value: { pathname: "/pricing" } as Location,
                });

                Object.defineProperty(window, "performance", {
                        configurable: true,
                        value: {
                                getEntriesByType: jest
                                        .fn()
                                        .mockReturnValue([
                                                { type: "navigate" } as PerformanceNavigationTiming,
                                        ]),
                        } as Performance,
                });

                Object.defineProperty(window.navigator, "sendBeacon", {
                        configurable: true,
                        value: jest.fn().mockReturnValue(true),
                });
        });

        afterEach(() => {
                jest.resetModules();

                consoleDebugSpy.mockRestore();

                Object.defineProperty(window, "location", {
                        configurable: true,
                        value: originalLocation,
                });

                Object.defineProperty(window, "performance", {
                        configurable: true,
                        value: originalPerformance,
                });

                Object.defineProperty(window.navigator, "sendBeacon", {
                        configurable: true,
                        value: originalSendBeacon,
                });
        });

        it("dispatches a payload with a rounded delta when present", () => {
                jest.isolateModules(() => {
                        const { reportWebVitals } = require("../reportWebVitals") as {
                                reportWebVitals: (metric: NextWebVitalsMetric) => void;
                        };

                        const metric = {
                                id: "v1",
                                label: "web-vital" as const,
                                name: "CLS" as const,
                                startTime: 0,
                                value: 1.2345,
                                delta: 0.9876,
                        } as NextWebVitalsMetric & { delta: number };

                        reportWebVitals(metric);
                });

                const sendBeacon = window.navigator.sendBeacon as jest.Mock;
                expect(sendBeacon).toHaveBeenCalledTimes(1);

                const payload = JSON.parse(sendBeacon.mock.calls[0][1] as string) as Record<string, unknown>;
                expect(payload.delta).toBe(0.988);
                expect(payload.navigationType).toBe("navigate");
        });
});
