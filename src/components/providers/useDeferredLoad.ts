import { useEffect, useState } from "react";

const DEFAULT_MAX_WAIT_MS = 5000;

export function useDeferredLoad(maxWaitMs = DEFAULT_MAX_WAIT_MS) {
        const [shouldLoad, setShouldLoad] = useState(false);

        useEffect(() => {
                if (shouldLoad || typeof window === "undefined") {
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

                const scheduleIdle = () => {
                        if (typeof window === "undefined") {
                                return;
                        }

                        if ("requestIdleCallback" in window) {
                                const idleId = window.requestIdleCallback(() => enable(), { timeout: 2000 });
                                cleanupFns.push(() => window.cancelIdleCallback?.(idleId));
                        } else {
                                timers.push(globalThis.setTimeout(enable, 1200));
                        }
                };

                if (document.readyState === "complete") {
                        scheduleIdle();
                } else {
                        const handleLoad = () => scheduleIdle();
                        window.addEventListener("load", handleLoad, { once: true });
                        cleanupFns.push(() => window.removeEventListener("load", handleLoad));
                }

                const registerWindowEvent = (eventName: keyof WindowEventMap) => {
                        const handler = () => enable();
                        window.addEventListener(eventName, handler, { once: true, passive: true });
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

                timers.push(globalThis.setTimeout(enable, maxWaitMs));

                return () => {
                        resolved = true;
                        for (const timer of timers) {
                                globalThis.clearTimeout(timer);
                        }
                        for (const cleanup of cleanupFns) {
                                cleanup();
                        }
                };
        }, [shouldLoad, maxWaitMs]);

        return shouldLoad;
}
