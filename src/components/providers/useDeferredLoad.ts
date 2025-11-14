import { useEffect, useState } from "react";

const DEFAULT_MAX_WAIT_MS = 5000;
const DEFAULT_IDLE_TIMEOUT_MS = 2000;

type DeferredOptions =
	| number
	| {
			enabled?: boolean;
			/**
			 * Maximum wait before enabling. Set to `0` to disable the timeout fallback.
			 */
			timeout?: number;
			/**
			 * If true, defer resolving until an explicit user interaction occurs.
			 * Idle callbacks and timeout fallbacks will be skipped unless `timeout`
			 * is explicitly provided.
			 */
			requireInteraction?: boolean;
			/**
			 * Custom timeout for requestIdleCallback.
			 */
			idleTimeout?: number;
	  };

export function useDeferredLoad(options?: DeferredOptions) {
	const resolvedOptions =
		typeof options === "number"
			? { timeout: options }
			: options ?? { timeout: DEFAULT_MAX_WAIT_MS };
	const {
		enabled = true,
		timeout = DEFAULT_MAX_WAIT_MS,
		requireInteraction = false,
		idleTimeout = DEFAULT_IDLE_TIMEOUT_MS,
	} = resolvedOptions;
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		if (!enabled || shouldLoad || typeof window === "undefined") {
			return;
		}

		let resolved = false;
		const timers: Array<ReturnType<typeof globalThis.setTimeout>> = [];
		const cleanupFns: Array<() => void> = [];

		const enable = () => {
			if (!resolved) {
				resolved = true;
				setShouldLoad(true);
			}
		};

		const registerWindowEvent = (eventName: keyof WindowEventMap) => {
			const handler = () => enable();
			window.addEventListener(eventName, handler, {
				once: true,
				passive: true,
			});
			cleanupFns.push(() => window.removeEventListener(eventName, handler));
		};

		const registerDocumentEvent = (eventName: keyof DocumentEventMap) => {
			const handler = () => enable();
			document.addEventListener(eventName, handler, { once: true });
			cleanupFns.push(() => document.removeEventListener(eventName, handler));
		};

		registerWindowEvent("pointerdown");
		registerWindowEvent("pointermove");
		registerWindowEvent("scroll");
		registerWindowEvent("keydown");
		registerWindowEvent("pageshow");
		registerDocumentEvent("visibilitychange");

		if (!requireInteraction) {
			const scheduleIdle = () => {
				if (typeof window === "undefined") {
					return;
				}

				if ("requestIdleCallback" in window) {
					const idleId = window.requestIdleCallback(() => enable(), {
						timeout: idleTimeout,
					});
					cleanupFns.push(() => window.cancelIdleCallback?.(idleId));
				} else {
					timers.push(globalThis.setTimeout(enable, idleTimeout));
				}
			};

			if (document.readyState === "complete") {
				scheduleIdle();
			} else {
				const handleLoad = () => scheduleIdle();
				window.addEventListener("load", handleLoad, { once: true });
				cleanupFns.push(() => window.removeEventListener("load", handleLoad));
			}
		}

		if (!requireInteraction || timeout > 0) {
			const timeoutDuration = timeout < 0 ? DEFAULT_MAX_WAIT_MS : timeout;
			if (timeoutDuration > 0) {
				timers.push(globalThis.setTimeout(enable, timeoutDuration));
			}
		}

		return () => {
			resolved = true;
			for (const timer of timers) {
				globalThis.clearTimeout(timer);
			}
			for (const cleanup of cleanupFns) {
				cleanup();
			}
		};
	}, [enabled, shouldLoad, timeout, requireInteraction, idleTimeout]);

	return shouldLoad;
}
