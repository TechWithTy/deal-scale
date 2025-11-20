"use client";

import { useEffect } from "react";

/**
 * Handles Next.js chunk loading errors that occur when:
 * - User has cached old chunks after a new deployment
 * - Network issues prevent chunk loading
 * - CDN cache issues
 *
 * Automatically reloads the page to fetch fresh chunks.
 */
export function ChunkErrorHandler() {
	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") return;

		const handleChunkError = (event: ErrorEvent) => {
			const error = event.error || event.message || "";

			// Check if this is a chunk loading error
			const isChunkError =
				typeof error === "string"
					? error.includes("Loading chunk") ||
						error.includes("Failed to fetch dynamically imported module") ||
						error.includes("ChunkLoadError") ||
						error.includes("Loading CSS chunk") ||
						/Loading chunk \d+ failed/i.test(error)
					: error instanceof Error &&
						(error.message.includes("Loading chunk") ||
							error.message.includes(
								"Failed to fetch dynamically imported module",
							) ||
							error.message.includes("ChunkLoadError") ||
							error.message.includes("Loading CSS chunk") ||
							/Loading chunk \d+ failed/i.test(error.message));

			if (isChunkError) {
				console.warn(
					"[ChunkErrorHandler] Detected chunk loading error, reloading page...",
					error,
				);

				// Prevent infinite reload loops
				const reloadKey = "chunk-error-reload";
				const lastReload = sessionStorage.getItem(reloadKey);
				const now = Date.now();

				// Only reload if we haven't reloaded in the last 5 seconds
				if (!lastReload || now - Number.parseInt(lastReload, 10) > 5000) {
					sessionStorage.setItem(reloadKey, now.toString());
					// Clear the error to prevent it from being logged again
					event.preventDefault();
					// Reload the page to fetch fresh chunks
					window.location.reload();
				} else {
					console.error(
						"[ChunkErrorHandler] Chunk error persists after reload. This may indicate a deployment issue.",
						error,
					);
				}
			}
		};

		// Listen for unhandled errors
		window.addEventListener("error", handleChunkError, true);

		// Also listen for unhandled promise rejections (chunk errors often come as promises)
		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			const reason = event.reason;
			const errorMessage =
				typeof reason === "string"
					? reason
					: reason instanceof Error
						? reason.message
						: String(reason);

			const isChunkError =
				errorMessage.includes("Loading chunk") ||
				errorMessage.includes("Failed to fetch dynamically imported module") ||
				errorMessage.includes("ChunkLoadError") ||
				errorMessage.includes("Loading CSS chunk") ||
				/Loading chunk \d+ failed/i.test(errorMessage);

			if (isChunkError) {
				console.warn(
					"[ChunkErrorHandler] Detected chunk loading error in promise rejection, reloading page...",
					reason,
				);

				// Prevent infinite reload loops
				const reloadKey = "chunk-error-reload";
				const lastReload = sessionStorage.getItem(reloadKey);
				const now = Date.now();

				if (!lastReload || now - Number.parseInt(lastReload, 10) > 5000) {
					sessionStorage.setItem(reloadKey, now.toString());
					event.preventDefault();
					window.location.reload();
				} else {
					console.error(
						"[ChunkErrorHandler] Chunk error persists after reload. This may indicate a deployment issue.",
						reason,
					);
				}
			}
		};

		window.addEventListener("unhandledrejection", handleUnhandledRejection);

		// Cleanup
		return () => {
			window.removeEventListener("error", handleChunkError, true);
			window.removeEventListener(
				"unhandledrejection",
				handleUnhandledRejection,
			);
		};
	}, []);

	return null;
}
