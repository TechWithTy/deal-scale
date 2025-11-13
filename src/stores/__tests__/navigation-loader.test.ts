import { act } from "@testing-library/react";

import {
	resetNavigationLoaderStore,
	useNavigationLoaderStore,
} from "@/stores/navigation-loader";

describe("navigation loader store", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		resetNavigationLoaderStore();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
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
			jest.advanceTimersByTime(30);
		});

		expect(useNavigationLoaderStore.getState().isNavigating).toBe(false);
	});
});

