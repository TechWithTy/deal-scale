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
	options?: { scrollAmount?: number; intervalMs?: number },
) {
	if (isMobileDevice()) return; // No-op on mobile
	const timerRef = useRef<number | null>(null);
	const scrollAmount = options?.scrollAmount ?? 300;
	const intervalMs = options?.intervalMs ?? 5000;

	// Helper to pause/resume auto-scroll
	// * useCallback ensures setPaused has a stable identity for useEffect deps
	const setPaused = useCallback(
		(value: boolean) => {
			if (pausedRef.current !== value) pausedRef.current = value;
		},
		[pausedRef],
	);

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
		timerRef.current = window.setInterval(() => {
			const node = scrollRef.current;
			if (!node || pausedRef.current) return;
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
	}, [scrollRef, pausedRef, scrollAmount, intervalMs]);
}
