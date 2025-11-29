/**
 * Unit tests for Facebook Pixel redirect page
 * Tests event firing, timing, and routing logic in isolation
 */

import RedirectPage from "@/app/redirect/page";
import { render, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type MockFbq, cleanupMockFbq, setupMockFbq } from "./mock-fbq";

// Mock next/navigation
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
	useSearchParams: vi.fn(),
}));

describe("RedirectPage - Facebook Pixel Tracking", () => {
	let mockPush: ReturnType<typeof vi.fn>;
	let mockReplace: ReturnType<typeof vi.fn>;
	let mockRouter: ReturnType<typeof useRouter>;
	let mockFbq: MockFbq;

	beforeEach(() => {
		vi.useFakeTimers();
		mockPush = vi.fn();
		mockReplace = vi.fn();
		mockRouter = {
			push: mockPush,
			replace: mockReplace,
			prefetch: vi.fn(),
			back: vi.fn(),
			forward: vi.fn(),
			refresh: vi.fn(),
		} as ReturnType<typeof useRouter>;

		(useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
		mockFbq = setupMockFbq();
	});

	afterEach(() => {
		vi.useRealTimers();
		cleanupMockFbq();
		vi.clearAllMocks();
	});

	const createSearchParams = (params: Record<string, string>) => {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			searchParams.set(key, value);
		});
		return searchParams;
	};

	it("fires Facebook Pixel Lead event before redirect", async () => {
		const searchParams = createSearchParams({
			to: "https://example.com/target",
			fbSource: "Meta campaign",
			fbIntent: "MVP_Launch_BlackFriday",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		// Mock window.location.href setter
		let hrefValue = "";
		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				get href() {
					return hrefValue;
				},
				set href(value: string) {
					hrefValue = value;
				},
				origin: "https://example.com",
			},
			writable: true,
		});

		render(<RedirectPage />);

		// Verify pixel fired immediately
		expect(
			mockFbq.wasCalledWith("track", "Lead", {
				source: "Meta campaign",
				intent: "MVP_Launch_BlackFriday",
			}),
		).toBe(true);

		// Verify redirect hasn't happened yet (before 600ms)
		vi.advanceTimersByTime(500);
		expect(hrefValue).toBe("");

		// Advance past 600ms delay
		vi.advanceTimersByTime(100);

		await waitFor(() => {
			expect(hrefValue).toBe("https://example.com/target");
		});
	});

	it("uses default values when Facebook Pixel parameters are missing", async () => {
		const searchParams = createSearchParams({
			to: "https://example.com/target",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		let hrefValue = "";
		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				get href() {
					return hrefValue;
				},
				set href(value: string) {
					hrefValue = value;
				},
				origin: "https://example.com",
			},
			writable: true,
		});

		render(<RedirectPage />);

		// Should use default values
		expect(
			mockFbq.wasCalledWith("track", "Lead", {
				source: "Meta campaign",
				intent: "MVP_Launch_BlackFriday",
			}),
		).toBe(true);

		vi.advanceTimersByTime(600);

		await waitFor(() => {
			expect(hrefValue).toBe("https://example.com/target");
		});
	});

	it("preserves UTM parameters in redirect URL", async () => {
		const searchParams = createSearchParams({
			to: "https://example.com/target",
			fbSource: "Meta campaign",
			utm_source: "test",
			utm_campaign: "campaign",
			utm_medium: "email",
			ref: "partner",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		let hrefValue = "";
		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				get href() {
					return hrefValue;
				},
				set href(value: string) {
					hrefValue = value;
				},
				origin: "https://example.com",
			},
			writable: true,
		});

		render(<RedirectPage />);

		vi.advanceTimersByTime(600);

		await waitFor(() => {
			expect(hrefValue).toContain("utm_source=test");
			expect(hrefValue).toContain("utm_campaign=campaign");
			expect(hrefValue).toContain("utm_medium=email");
			expect(hrefValue).toContain("ref=partner");
			// Internal tracking params should be removed
			expect(hrefValue).not.toContain("fbSource");
			expect(hrefValue).not.toContain("fbIntent");
		});
	});

	it("waits at least 500ms before redirect (timing validation)", async () => {
		const searchParams = createSearchParams({
			to: "https://example.com/target",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		let hrefValue = "";
		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				get href() {
					return hrefValue;
				},
				set href(value: string) {
					hrefValue = value;
				},
				origin: "https://example.com",
			},
			writable: true,
		});

		const startTime = Date.now();
		render(<RedirectPage />);

		// Verify pixel fired immediately
		expect(mockFbq.getCallCount()).toBeGreaterThan(0);

		// Advance 499ms - redirect should NOT have happened
		vi.advanceTimersByTime(499);
		expect(hrefValue).toBe("");

		// Advance to 600ms - redirect should happen
		vi.advanceTimersByTime(101);

		await waitFor(() => {
			expect(hrefValue).toBe("https://example.com/target");
		});

		// Verify timing is >= 500ms
		const elapsed = Date.now() - startTime;
		expect(elapsed).toBeGreaterThanOrEqual(500);
	});

	it("handles relative paths with router.push", async () => {
		const searchParams = createSearchParams({
			to: "/signup",
			fbSource: "Meta campaign",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				origin: "https://example.com",
			},
			writable: true,
		});

		render(<RedirectPage />);

		expect(mockFbq.wasCalledWith("track", "Lead")).toBe(true);

		vi.advanceTimersByTime(600);

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("/signup");
		});
	});

	it("handles missing 'to' parameter gracefully", () => {
		const searchParams = createSearchParams({
			fbSource: "Meta campaign",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		render(<RedirectPage />);

		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining("Missing 'to' parameter"),
		);

		// Should not redirect
		vi.advanceTimersByTime(600);
		expect(mockPush).not.toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("handles Facebook Pixel not being initialized", async () => {
		cleanupMockFbq(); // Remove fbq

		const searchParams = createSearchParams({
			to: "https://example.com/target",
			fbSource: "Meta campaign",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		let hrefValue = "";
		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				get href() {
					return hrefValue;
				},
				set href(value: string) {
					hrefValue = value;
				},
				origin: "https://example.com",
			},
			writable: true,
		});

		// Should not throw when fbq is not available
		render(<RedirectPage />);

		// Should still redirect after delay
		vi.advanceTimersByTime(600);

		await waitFor(() => {
			expect(hrefValue).toBe("https://example.com/target");
		});
	});

	it("handles Facebook Pixel tracking errors gracefully", async () => {
		const searchParams = createSearchParams({
			to: "https://example.com/target",
			fbSource: "Meta campaign",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		// Make fbq throw an error
		const errorFbq = vi.fn(() => {
			throw new Error("Pixel error");
		});
		(window as { fbq?: typeof globalThis.fbq }).fbq =
			errorFbq as typeof globalThis.fbq;

		let hrefValue = "";
		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				get href() {
					return hrefValue;
				},
				set href(value: string) {
					hrefValue = value;
				},
				origin: "https://example.com",
			},
			writable: true,
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		render(<RedirectPage />);

		// Should log error but continue
		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining("Failed to track Facebook Pixel event"),
				expect.any(Error),
			);
		});

		// Should still redirect
		vi.advanceTimersByTime(600);

		await waitFor(() => {
			expect(hrefValue).toBe("https://example.com/target");
		});

		consoleSpy.mockRestore();
	});

	it("cleans up timer on unmount", () => {
		const searchParams = createSearchParams({
			to: "https://example.com/target",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		let hrefValue = "";
		Object.defineProperty(window, "location", {
			value: {
				...window.location,
				get href() {
					return hrefValue;
				},
				set href(value: string) {
					hrefValue = value;
				},
				origin: "https://example.com",
			},
			writable: true,
		});

		const { unmount } = render(<RedirectPage />);

		// Unmount before timer completes
		unmount();

		// Fast-forward past the delay
		vi.advanceTimersByTime(600);

		// Should not redirect after unmount
		expect(mockPush).not.toHaveBeenCalled();
		expect(hrefValue).toBe("");
	});

	it("fires pixel event with correct custom parameters", () => {
		const searchParams = createSearchParams({
			to: "https://example.com/target",
			fbSource: "Custom Source",
			fbIntent: "Custom Intent",
		});

		(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(searchParams);

		render(<RedirectPage />);

		const leadCalls = mockFbq.getCallsForEvent("Lead");
		expect(leadCalls.length).toBe(1);
		expect(leadCalls[0]?.params).toEqual({
			source: "Custom Source",
			intent: "Custom Intent",
		});
	});
});
