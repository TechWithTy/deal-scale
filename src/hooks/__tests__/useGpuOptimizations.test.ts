"use client";

import { renderHook, waitFor, act } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { useGpuOptimizations } from "../useGpuOptimizations";

type MockMatchMedia = ReturnType<typeof createMockMatchMedia>;

function createMockMatchMedia(matches: boolean) {
	const listeners = new Set<() => void>();
	const mockMatchMedia = {
		matches,
		media: "(prefers-reduced-motion: reduce)",
		addEventListener: vi.fn((_event: string, callback: () => void) => {
			listeners.add(callback);
		}),
		removeEventListener: vi.fn((_event: string, callback: () => void) => {
			listeners.delete(callback);
		}),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
		onchange: null as (() => void) | null,
		triggerChange(nextMatches: boolean) {
			mockMatchMedia.matches = nextMatches;
			listeners.forEach((listener) => listener());
		},
	} as MockMatchMedia & {
		triggerChange(nextMatches: boolean): void;
	};

	return mockMatchMedia;
}

let originalUserAgent: PropertyDescriptor | undefined;
let originalMatchMedia: typeof window.matchMedia;
let mock: MockMatchMedia & {
	triggerChange(nextMatches: boolean): void;
};

describe("useGpuOptimizations", () => {
	beforeEach(() => {
		originalUserAgent = Object.getOwnPropertyDescriptor(
			window.navigator,
			"userAgent",
		);
		originalMatchMedia = window.matchMedia;
		mock = createMockMatchMedia(false);
		window.matchMedia = vi.fn().mockReturnValue(mock);
		setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0.0 Safari/537.36");
	});

	afterEach(() => {
		if (originalUserAgent) {
			Object.defineProperty(window.navigator, "userAgent", originalUserAgent);
		}
		window.matchMedia = originalMatchMedia;
		vi.restoreAllMocks();
	});

	it("enables GPU optimizations for Chromium browsers without reduced motion", async () => {
		const { result } = renderHook(() => useGpuOptimizations());

		await waitFor(() => {
			expect(result.current).toBe(true);
		});
	});

	it("disables GPU optimizations for Firefox regardless of motion preference", async () => {
		setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
		);

		const { result } = renderHook(() => useGpuOptimizations());

		await waitFor(() => {
			expect(result.current).toBe(false);
		});
	});

	it("reacts to reduced-motion changes by disabling GPU hints", async () => {
		const { result } = renderHook(() => useGpuOptimizations());

		await waitFor(() => {
			expect(result.current).toBe(true);
		});

		act(() => {
			mock.triggerChange(true);
		});

		await waitFor(() => {
			expect(result.current).toBe(false);
		});

		act(() => {
			mock.triggerChange(false);
		});

		await waitFor(() => {
			expect(result.current).toBe(true);
		});
	});
});

function setUserAgent(value: string) {
	Object.defineProperty(window.navigator, "userAgent", {
		value,
		configurable: true,
	});
}

