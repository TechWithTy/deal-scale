import { useEffect, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";

/**
 * * Adds horizontal drag/swipe-to-scroll to a scrollable container.
 * * Works with both touch and mouse (pointer events).
 * * Pauses auto-scroll while dragging, resumes after.
 * * SSR-safe: no window/document access outside useEffect.
 *
 * ! Make sure scrollRef is attached to a horizontally scrollable div.
 *
 * @param scrollRef - Ref to the scrollable container (div)
 * @param pausedRef - Mutable ref for pausing auto-scroll (optional, but recommended)
 */

export function useDraggableScroll(
	scrollRef: RefObject<HTMLDivElement>,
	pausedRef?: MutableRefObject<boolean>,
) {
	const dragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		// Only run on client
		if (typeof window === "undefined" || typeof document === "undefined")
			return;

		/**
		 * Helper: Pause auto-scroll if pausedRef is provided
		 */
		const pauseAutoScroll = () => {
			if (pausedRef && typeof pausedRef.current !== "undefined") {
				pausedRef.current = true;
			}
		};
		const resumeAutoScroll = () => {
			if (pausedRef && typeof pausedRef.current !== "undefined") {
				pausedRef.current = false;
			}
		};

		/**
		 * Pointer event handlers
		 */
		const handlePointerDown = (e: PointerEvent) => {
			// Only left mouse/touch/pen
			if (e.pointerType === "mouse" && e.button !== 0) return;
			dragging.current = true;
			startX.current = e.clientX;
			scrollLeft.current = el.scrollLeft;
			el.setPointerCapture(e.pointerId);
			pauseAutoScroll();
			el.style.scrollBehavior = "auto"; // Disable smooth for drag
		};
		const handlePointerMove = (e: PointerEvent) => {
			if (!dragging.current) return;
			const dx = e.clientX - startX.current;
			el.scrollLeft = scrollLeft.current - dx;
		};
		const handlePointerUp = (e: PointerEvent) => {
			if (!dragging.current) return;
			dragging.current = false;
			el.releasePointerCapture(e.pointerId);
			el.style.scrollBehavior = "smooth";
			// Resume auto-scroll after a short delay
			setTimeout(resumeAutoScroll, 300);
		};
		const handlePointerLeave = (e: PointerEvent) => {
			if (!dragging.current) return;
			dragging.current = false;
			el.releasePointerCapture(e.pointerId);
			el.style.scrollBehavior = "smooth";
			setTimeout(resumeAutoScroll, 300);
		};

		el.addEventListener("pointerdown", handlePointerDown);
		el.addEventListener("pointermove", handlePointerMove);
		el.addEventListener("pointerup", handlePointerUp);
		el.addEventListener("pointerleave", handlePointerLeave);

		// Prevent default image dragging inside
		const preventImgDrag = (e: Event) => e.preventDefault();
		for (const img of el.querySelectorAll("img")) {
			img.addEventListener("dragstart", preventImgDrag);
		}

		return () => {
			el.removeEventListener("pointerdown", handlePointerDown);
			el.removeEventListener("pointermove", handlePointerMove);
			el.removeEventListener("pointerup", handlePointerUp);
			el.removeEventListener("pointerleave", handlePointerLeave);
			for (const img of el.querySelectorAll("img")) {
				img.removeEventListener("dragstart", preventImgDrag);
			}
		};
	}, [scrollRef, pausedRef]);
}
