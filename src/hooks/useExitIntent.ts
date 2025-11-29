"use client";

import {
	safeSessionStorageGetItem,
	safeSessionStorageSetItem,
} from "@/utils/storage/safeStorage";
import { useEffect, useRef, useState } from "react";

export interface UseExitIntentOptions {
	/**
	 * Callback fired when exit intent is detected
	 */
	onExitIntent?: () => void;
	/**
	 * Minimum time (ms) user must be on page before exit intent triggers
	 * @default 3000
	 */
	minTimeOnPage?: number;
	/**
	 * Whether to enable exit intent detection. Further gated by the
	 * `NEXT_PUBLIC_ENABLE_EXIT_INTENT` environment variable which defaults to false.
	 * @default true (but disabled unless the env flag is explicitly set)
	 */
	enabled?: boolean;
	/**
	 * Threshold for mouse movement to top of viewport (px)
	 * @default 5
	 */
	threshold?: number;
	/**
	 * Whether to track only once per session
	 * @default false
	 */
	oncePerSession?: boolean;
}

const SESSION_STORAGE_KEY = "exit-intent-triggered";

/**
 * Hook to detect when a user is about to leave the page (exit intent).
 * Triggers when mouse moves to top of viewport, indicating user is moving to browser controls.
 *
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 * useExitIntent({
 *   onExitIntent: () => setShowModal(true),
 *   minTimeOnPage: 5000,
 *   oncePerSession: true
 * });
 * ```
 */
export function useExitIntent({
	onExitIntent,
	minTimeOnPage = 3000,
	enabled = true,
	threshold = 5,
	oncePerSession = false,
}: UseExitIntentOptions = {}) {
	const [hasTriggered, setHasTriggered] = useState(false);
	const pageLoadTime = useRef<number>(Date.now());
	const hasTriggeredRef = useRef(false);
	const envEnabled =
		(process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT ?? "").toLowerCase() === "true";

	useEffect(() => {
		if (!enabled || !envEnabled || !onExitIntent) {
			return;
		}

		// Check if already triggered this session
		if (oncePerSession) {
			const wasTriggered =
				safeSessionStorageGetItem(SESSION_STORAGE_KEY) === "true";
			if (wasTriggered || hasTriggeredRef.current) {
				return;
			}
		}

		const handleMouseLeave = (e: MouseEvent) => {
			// Only trigger if mouse is moving upward (toward browser controls)
			if (e.clientY <= threshold) {
				const timeOnPage = Date.now() - pageLoadTime.current;

				// Only trigger if user has been on page for minimum time
				if (timeOnPage >= minTimeOnPage && !hasTriggeredRef.current) {
					hasTriggeredRef.current = true;
					setHasTriggered(true);

					if (oncePerSession) {
						// Safe to fail silently - just won't persist across page reloads
						safeSessionStorageSetItem(SESSION_STORAGE_KEY, "true");
					}

					onExitIntent();
				}
			}
		};

		// Listen for mouse leaving the viewport at the top
		document.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			document.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [
		enabled,
		envEnabled,
		onExitIntent,
		minTimeOnPage,
		threshold,
		oncePerSession,
	]);

	return { hasTriggered };
}
