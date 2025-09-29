import { useCallback, useEffect, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";

/**
 * ! Custom hook for auto-scrolling feature lists with pause/resume support for mouse, touch, and keyboard.
 * * Handles interval, cleanup, and event listeners for accessibility and UX.
 * @param scrollRef - Ref to the scrollable div
 * @param pausedRef - Ref to a boolean indicating pause state
 * @param options - Optional config: { scrollAmount, intervalMs }
 */
function isMobileDevice() {
	if (typeof navigator === "undefined") return false;
	return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	);
}

export function useAutoScrollFeatures(
	scrollRef: RefObject<HTMLDivElement>,
	pausedRef: MutableRefObject<boolean>,
	options?: { scrollAmount?: number; intervalMs?: number; manualHold?: boolean },
) {
	if (isMobileDevice()) return; // No-op on mobile
	const timerRef = useRef<number | null>(null);
	const scrollAmount = options?.scrollAmount ?? 300;
	const intervalMs = options?.intervalMs ?? 5000;
	const manualHold = options?.manualHold ?? false;

	// Helper to pause/resume auto-scroll
	// * useCallback ensures setPaused has a stable identity for useEffect deps
	const setPaused = useCallback(
		(value: boolean) => {
			if (pausedRef.current !== value) pausedRef.current = value;
		},
		[pausedRef],
	);

	const pointerActiveRef = useRef(false);
	const resumeTimeoutRef = useRef<number | null>(null);
	const resumeDelay = options?.intervalMs ? Math.min(Math.max(options.intervalMs / 2, 400), 3000) : 600;

	const clearResumeTimeout = useCallback(() => {
		if (resumeTimeoutRef.current) {
			window.clearTimeout(resumeTimeoutRef.current);
			resumeTimeoutRef.current = null;
		}
	}, []);

	const requestResume = useCallback(() => {
		if (manualHold) {
			return;
		}
		clearResumeTimeout();
		resumeTimeoutRef.current = window.setTimeout(() => {
			pointerActiveRef.current = false;
			setPaused(false);
		}, resumeDelay);
	}, [clearResumeTimeout, manualHold, resumeDelay, setPaused]);

	useEffect(() => {
		return () => {
			clearResumeTimeout();
		};
	}, [clearResumeTimeout]);

	const manualHoldPrevRef = useRef<boolean | null>(null);
	useEffect(() => {
		const previous = manualHoldPrevRef.current;
		manualHoldPrevRef.current = manualHold;
		if (previous === null) {
			return;
		}
		if (manualHold) {
			pointerActiveRef.current = true;
			setPaused(true);
			clearResumeTimeout();
		} else {
			requestResume();
		}
	}, [manualHold, clearResumeTimeout, requestResume, setPaused]);

	// Keyboard navigation (left/right arrows)
	useEffect(() => {
		const node = scrollRef.current;
		if (!node) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") {
				node.scrollBy({ left: scrollAmount, behavior: "smooth" });
				setPaused(true);
			} else if (e.key === "ArrowLeft") {
				node.scrollBy({ left: -scrollAmount, behavior: "smooth" });
				setPaused(true);
			}
		};
		node.addEventListener("keydown", handleKeyDown);
		return () => node.removeEventListener("keydown", handleKeyDown);
	}, [scrollRef, scrollAmount, setPaused]);

	// Touch pause/resume is handled via React's onTouchStart/onTouchEnd props in FeaturesList.tsx for consistency and SSR safety.

	// Pause when user interacts with scrollbars or performs manual scroll
	useEffect(() => {
		const node = scrollRef.current;
		if (!node) return;

		const handleManualScroll = () => {
			pointerActiveRef.current = true;
			setPaused(true);
			if (!manualHold) {
				requestResume();
			}
		};

		const handlePointerDown = (event: PointerEvent) => {
			if (event.pointerType === "mouse" && event.button !== 0) return;
			pointerActiveRef.current = true;
			setPaused(true);
			clearResumeTimeout();
		};

		const handlePointerUp = () => {
			if (!pointerActiveRef.current) return;
			if (!manualHold) {
				requestResume();
			}
		};

		node.addEventListener("wheel", handleManualScroll, { passive: true });
		node.addEventListener("pointerdown", handlePointerDown);
		node.addEventListener("pointerup", handlePointerUp);
		node.addEventListener("pointercancel", handlePointerUp);
		node.addEventListener("scroll", handleManualScroll, { passive: true });

		return () => {
			node.removeEventListener("wheel", handleManualScroll);
			node.removeEventListener("pointerdown", handlePointerDown);
			node.removeEventListener("pointerup", handlePointerUp);
			node.removeEventListener("pointercancel", handlePointerUp);
			node.removeEventListener("scroll", handleManualScroll);
		};
	}, [clearResumeTimeout, manualHold, requestResume, scrollRef, setPaused]);

	// Focus/blur for keyboard accessibility
	useEffect(() => {
		const node = scrollRef.current;
		if (!node) return;
		const handleFocus = () => setPaused(true);
		const handleBlur = () => setPaused(false);
		node.addEventListener("focusin", handleFocus);
		node.addEventListener("focusout", handleBlur);
		return () => {
			node.removeEventListener("focusin", handleFocus);
			node.removeEventListener("focusout", handleBlur);
		};
	}, [scrollRef, setPaused]);

	// Main auto-scroll interval logic
	useEffect(() => {
		if (!scrollRef.current) return;
		if (pausedRef.current) return;
		if (manualHold) return;
		timerRef.current = window.setInterval(() => {
			const node = scrollRef.current;
			if (!node || pausedRef.current || manualHold) return;
			const { scrollLeft, scrollWidth, clientWidth } = node;
			if (scrollLeft + clientWidth >= scrollWidth - 10) {
				node.scrollTo({ left: 0, behavior: "smooth" });
			} else {
				node.scrollBy({ left: scrollAmount, behavior: "smooth" });
			}
		}, intervalMs);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [scrollRef, pausedRef, scrollAmount, intervalMs, manualHold]);
}
