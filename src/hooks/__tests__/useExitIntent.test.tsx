import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useExitIntent } from "../useExitIntent";

const FIRE_MOUSE_LEAVE = (clientY: number) => {
	const event = new MouseEvent("mouseleave", {
		clientY,
	});
	document.dispatchEvent(event);
};

describe("useExitIntent", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		sessionStorage.clear();
		process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT = "true";
	});

	afterEach(() => {
		vi.useRealTimers();
		delete process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT;
	});

	it("does not trigger before minTimeOnPage elapses", () => {
		const onExitIntent = vi.fn();
		renderHook(() =>
			useExitIntent({
				onExitIntent,
				minTimeOnPage: 5000,
			}),
		);

		act(() => {
			FIRE_MOUSE_LEAVE(0);
		});

		expect(onExitIntent).not.toHaveBeenCalled();
	});

	it("triggers when threshold is met after minTimeOnPage", () => {
		const onExitIntent = vi.fn();
		renderHook(() =>
			useExitIntent({
				onExitIntent,
				minTimeOnPage: 3000,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(4000);
			FIRE_MOUSE_LEAVE(2);
		});

		expect(onExitIntent).toHaveBeenCalledTimes(1);
	});

	it("only triggers once per session when configured", () => {
		const onExitIntent = vi.fn();
		renderHook(() =>
			useExitIntent({
				onExitIntent,
				minTimeOnPage: 1000,
				oncePerSession: true,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(1500);
			FIRE_MOUSE_LEAVE(0);
			FIRE_MOUSE_LEAVE(0);
		});

		expect(onExitIntent).toHaveBeenCalledTimes(1);
		expect(sessionStorage.getItem("exit-intent-triggered")).toBe("true");
	});

	it("respects enabled flag", () => {
		const onExitIntent = vi.fn();
		renderHook(() =>
			useExitIntent({
				onExitIntent,
				enabled: false,
			}),
		);

		act(() => {
			FIRE_MOUSE_LEAVE(0);
		});

		expect(onExitIntent).not.toHaveBeenCalled();
	});

	it("does not trigger when env flag disabled", () => {
		delete process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT;
		const onExitIntent = vi.fn();
		renderHook(() =>
			useExitIntent({
				onExitIntent,
				minTimeOnPage: 1000,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(1500);
			FIRE_MOUSE_LEAVE(0);
		});

		expect(onExitIntent).not.toHaveBeenCalled();
	});
});

