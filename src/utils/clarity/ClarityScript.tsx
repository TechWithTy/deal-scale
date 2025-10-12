"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

/**
 * Microsoft Clarity script loader.
 *
 * Prefer setting NEXT_PUBLIC_CLARITY_PROJECT_ID in your env.
 * You can also pass a projectId prop to override.
 */
export function MicrosoftClarityScript({ projectId }: { projectId?: string }) {
	const id =
		projectId ?? process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "sttpn4xwgd";

	if (!id) {
		if (process.env.NODE_ENV !== "production") {
			// eslint-disable-next-line no-console
			console.warn(
				"Clarity: NEXT_PUBLIC_CLARITY_PROJECT_ID not set and no projectId prop provided; script not injected.",
			);
		}
		return null;
	}

	// Initialize via official package API once on mount
	useEffect(() => {
		let cancelled = false;

		const initialize = () => {
			if (cancelled) return;
			try {
				Clarity.init(id);
			} catch (e) {
				if (process.env.NODE_ENV !== "production") {
					// eslint-disable-next-line no-console
					console.warn("Clarity: init failed", e);
				}
			}
		};

		if (typeof window !== "undefined") {
			if ("requestIdleCallback" in window) {
				window.requestIdleCallback(initialize, { timeout: 1500 });
			} else {
				// Use type assertion to handle browser vs Node.js differences
				(globalThis as typeof globalThis & { __clarityTimeout?: number }).__clarityTimeout =
					globalThis.setTimeout(initialize, 800) as unknown as number;
			}
		}

		return () => {
			cancelled = true;
			if (typeof window !== "undefined") {
				const timeout = (globalThis as any).__clarityTimeout;
				if (timeout) {
					window.clearTimeout(timeout);
				}
			}
		};
	}, [id]);

	return null;
}
