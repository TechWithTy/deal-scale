"use client";

import { useEffect, useState } from "react";

const FIREFOX_REGEX = /firefox|gecko\/\d+/i;

/**
 * Returns whether heavy GPU-accelerated transforms should be enabled.
 * Firefox and users with reduced-motion preferences will fall back to
 * non-GPU rendering to avoid layout glitches (e.g., white gaps).
 */
export function useGpuOptimizations(): boolean {
	const [enableGpu, setEnableGpu] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined" || typeof navigator === "undefined") {
			return;
		}

		const isFirefox = FIREFOX_REGEX.test(navigator.userAgent);
		const motionQuery =
			typeof window.matchMedia === "function"
				? window.matchMedia("(prefers-reduced-motion: reduce)")
				: undefined;

		const evaluate = () => {
			const prefersReducedMotion = motionQuery?.matches ?? false;
			setEnableGpu(!isFirefox && !prefersReducedMotion);
		};

		evaluate();

		if (!motionQuery) {
			return;
		}

		const listener = () => evaluate();

		if (typeof motionQuery.addEventListener === "function") {
			motionQuery.addEventListener("change", listener);
			return () => motionQuery.removeEventListener("change", listener);
		}

		if (typeof motionQuery.addListener === "function") {
			motionQuery.addListener(listener);
			return () => motionQuery.removeListener(listener);
		}

		return;
	}, []);

	return enableGpu;
}


