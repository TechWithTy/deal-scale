import { act, renderHook } from "@testing-library/react";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import { useDeferredLoad } from "../useDeferredLoad";

describe("useDeferredLoad", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	it("enables loading after the maximum wait if idle callbacks are unavailable", () => {
		const originalRequestIdleCallback = window.requestIdleCallback;
		// Ensure the idle callback path is disabled so the timeout fallback is used.
		delete (
			window as typeof window & {
				requestIdleCallback?: typeof window.requestIdleCallback;
			}
		).requestIdleCallback;

		const { result } = renderHook(() => useDeferredLoad(300));

		expect(result.current).toBe(false);

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(result.current).toBe(true);

		if (originalRequestIdleCallback) {
			window.requestIdleCallback = originalRequestIdleCallback;
		}
	});
});
