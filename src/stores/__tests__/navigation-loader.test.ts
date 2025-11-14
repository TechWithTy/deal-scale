import { act } from "@testing-library/react";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import {
	resetNavigationLoaderStore,
	useNavigationLoaderStore,
} from "@/stores/navigation-loader";

describe("navigation loader store", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		resetNavigationLoaderStore();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		resetNavigationLoaderStore();
	});

	it("starts with navigation disabled", () => {
		const { isNavigating } = useNavigationLoaderStore.getState();

		expect(isNavigating).toBe(false);
	});

	it("tracks start and completion of navigation", () => {
		const { startNavigation, finishNavigation } =
			useNavigationLoaderStore.getState();

		let navigationId: number = 0;
		act(() => {
			navigationId = startNavigation();
		});

		expect(useNavigationLoaderStore.getState().isNavigating).toBe(true);

		act(() => {
			finishNavigation(navigationId);
		});

		expect(useNavigationLoaderStore.getState().isNavigating).toBe(false);
	});

	it("clears stuck navigation after timeout", () => {
		const { startNavigation } = useNavigationLoaderStore.getState();

		act(() => {
			startNavigation({ timeoutMs: 25 });
		});

		expect(useNavigationLoaderStore.getState().isNavigating).toBe(true);

		act(() => {
			vi.advanceTimersByTime(30);
		});

		expect(useNavigationLoaderStore.getState().isNavigating).toBe(false);
	});
});

