import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { createElement } from "react";

const plausibleInit = vi.fn();

vi.mock("@plausible-analytics/tracker", () => ({
	__esModule: true,
	init: plausibleInit,
}));

const analyticsSpy = vi.fn((props: { config: Record<string, unknown> }) =>
	createElement("div", { "data-testid": "analytics", "data-config": JSON.stringify(props.config) }),
);

const AnalyticsComponent = (props: { config: Record<string, unknown> }) => analyticsSpy(props);

vi.mock("@/components/analytics/Analytics", () => ({
	__esModule: true,
	Analytics: AnalyticsComponent,
	default: AnalyticsComponent,
}));

vi.mock("next/dynamic", () => ({
	__esModule: true,
	default: () => AnalyticsComponent,
}));

describe("DeferredThirdParties", () => {
	const originalFetch = globalThis.fetch;
	let fetchMock: vi.Mock;
	const originalConsoleWarn = console.warn;

	beforeEach(() => {
		analyticsSpy.mockClear();
		plausibleInit.mockClear();
		fetchMock = vi.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		console.warn = vi.fn();
		document.body.innerHTML = "";
		document.head.innerHTML = "";
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		console.warn = originalConsoleWarn;
	});

	it("defers loading until an interaction and injects clarity script", async () => {
		vi.useFakeTimers();
		try {
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
			fetchMock.mockResolvedValue(response);

			const { DeferredThirdParties } = await import("../DeferredThirdParties");

			render(<DeferredThirdParties />);

			expect(fetchMock).not.toHaveBeenCalled();

			act(() => {
				fireEvent.pointerMove(window);
			});

			await waitFor(() => {
				expect(fetchMock).toHaveBeenCalledWith(
					"/api/init-providers",
					expect.objectContaining({ cache: "no-store" }),
				);
			});

			await waitFor(() => {
				expect(document.getElementById("clarity-script")).not.toBeNull();
			});

			await waitFor(() => {
				expect(analyticsSpy.mock.calls.length).toBeGreaterThan(0);
			});

			const lastCall = analyticsSpy.mock.calls.at(-1);
			expect(lastCall?.[0]?.config).toMatchObject({
				gaId: "ga-id",
				gtmId: "gtm-id",
			});
		} finally {
			vi.useRealTimers();
		}
	});

	it("initializes Plausible when a domain is configured", async () => {
		vi.useFakeTimers();
		try {
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

			await act(async () => {
				vi.runOnlyPendingTimers();
				await Promise.resolve();
			});

			await waitFor(() =>
				expect(plausibleInit).toHaveBeenCalledWith({
					domain: "example.com",
					endpoint: "https://plausible.io/api/event",
					autoCapturePageviews: true,
					captureOnLocalhost: false,
				}),
			);
		} finally {
			vi.useRealTimers();
		}
	});

	it("does not initialize Plausible when domain is missing", async () => {
		vi.useFakeTimers();
		try {
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
				vi.runOnlyPendingTimers();
				await Promise.resolve();
			});

			await act(async () => {
				await Promise.resolve();
			});

			await waitFor(() => {
				expect(plausibleInit).not.toHaveBeenCalled();
			});
		} finally {
			vi.useRealTimers();
		}
	});

	it("logs a warning and retries when the providers endpoint returns an error", async () => {
		vi.useFakeTimers();
		try {
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
			fetchMock.mockResolvedValueOnce(failingResponse).mockResolvedValueOnce(successResponse);

			const { DeferredThirdParties } = await import("../DeferredThirdParties");

			render(<DeferredThirdParties retryDelayMs={500} maxRetries={2} />);

			act(() => {
				document.dispatchEvent(new Event("visibilitychange"));
			});

			await waitFor(() => {
				expect(fetchMock).toHaveBeenCalledTimes(1);
			});

			expect(console.warn).toHaveBeenCalledWith(
				"DeferredThirdParties",
				"Failed to load provider configuration.",
				expect.objectContaining({ status: 503 }),
			);

			await act(async () => {
				vi.advanceTimersByTime(500);
				await Promise.resolve();
			});

			await waitFor(() => {
				expect(fetchMock).toHaveBeenCalledTimes(2);
			});
		} finally {
			vi.useRealTimers();
		}
	});

	it("uses initial analytics config without hitting the providers endpoint", async () => {
		vi.useFakeTimers();
		try {
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

			await act(async () => {
				vi.runOnlyPendingTimers();
				await Promise.resolve();
			});

			await waitFor(() => {
				expect(document.getElementById("clarity-script")).not.toBeNull();
			});

			const lastCall = analyticsSpy.mock.calls.at(-1);
			expect(lastCall?.[0]?.config).toMatchObject({
				gaId: "ga-id",
				gtmId: "gtm-id",
			});

			expect(fetchMock).toHaveBeenCalledWith(
				"/api/init-providers",
				expect.objectContaining({ cache: "no-store" }),
			);
		} finally {
			vi.useRealTimers();
		}
	});
});
