"use client";

import {
	isSessionStorageAvailable,
	safeSessionStorageGetItem,
	safeSessionStorageSetItem,
} from "@/utils/storage/safeStorage";
import { useEffect } from "react";

/**
 * Handles Next.js chunk loading errors that occur when:
 * - User has cached old chunks after a new deployment
 * - Network issues prevent chunk loading
 * - CDN cache issues
 *
 * Automatically reloads the page to fetch fresh chunks.
 * Includes comprehensive error handling to prevent issues when storage is unavailable.
 */
export function ChunkErrorHandler() {
	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") return;

		const handleChunkError = (event: ErrorEvent) => {
			try {
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

				if (!isChunkError) {
					return;
				}

				console.warn(
					"[ChunkErrorHandler] Detected chunk loading error, reloading page...",
					error,
				);

				// Prevent infinite reload loops
				const reloadKey = "chunk-error-reload";

				// Check if sessionStorage is available before attempting to use it
				// If storage is unavailable (throws errors, private mode, etc.), don't reload
				// This prevents crashes and infinite loops
				if (!isSessionStorageAvailable()) {
					console.warn(
						"[ChunkErrorHandler] sessionStorage unavailable, skipping reload to prevent issues",
					);
					return;
				}

				// Try to get last reload time - if this throws, don't reload
				let lastReload: string | null = null;
				try {
					lastReload = safeSessionStorageGetItem(reloadKey);
				} catch (getItemError) {
					// If getItem itself throws (not just returns null), don't reload
					// This handles cases where storage is partially broken
					console.warn(
						"[ChunkErrorHandler] Failed to read reload timestamp, skipping reload to prevent issues",
						getItemError,
					);
					return;
				}

				const now = Date.now();

				// Only reload if we haven't reloaded in the last 5 seconds
				const timeSinceLastReload = lastReload
					? now - Number.parseInt(lastReload, 10)
					: Number.POSITIVE_INFINITY;

				if (!lastReload || timeSinceLastReload > 5000) {
					// Try to save reload timestamp before reloading
					const saved = safeSessionStorageSetItem(reloadKey, now.toString());

					// Only reload if we successfully saved, or if storage save failed but we have no previous reload
					// This prevents infinite loops when storage keeps failing
					if (saved || !lastReload) {
						try {
							// Clear the error to prevent it from being logged again
							if (event.preventDefault) {
								event.preventDefault();
							}

							// Safely attempt reload
							if (
								window.location &&
								typeof window.location.reload === "function"
							) {
								window.location.reload();
							} else {
								console.error(
									"[ChunkErrorHandler] window.location.reload is not available",
								);
							}
						} catch (reloadError) {
							// If reload itself fails, log but don't throw
							console.error(
								"[ChunkErrorHandler] Failed to reload page:",
								reloadError,
							);
						}
					} else {
						// If setItem failed and we had a previous reload, don't reload
						// This prevents infinite loops when storage quota is exceeded
						console.error(
							"[ChunkErrorHandler] Failed to save reload timestamp, skipping reload to prevent infinite loop",
						);
					}
				} else {
					console.error(
						"[ChunkErrorHandler] Chunk error persists after reload. This may indicate a deployment issue.",
						error,
					);
				}
			} catch (error) {
				// Catch any unexpected errors in the error handler itself
				// This prevents the error handler from crashing and causing further issues
				console.error(
					"[ChunkErrorHandler] Unexpected error in error handler:",
					error,
				);
			}
		};

		// Listen for unhandled errors
		window.addEventListener("error", handleChunkError, true);

		// Also listen for unhandled promise rejections (chunk errors often come as promises)
		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			try {
				const reason = event.reason;
				const errorMessage =
					typeof reason === "string"
						? reason
						: reason instanceof Error
							? reason.message
							: String(reason);

				const isChunkError =
					errorMessage.includes("Loading chunk") ||
					errorMessage.includes(
						"Failed to fetch dynamically imported module",
					) ||
					errorMessage.includes("ChunkLoadError") ||
					errorMessage.includes("Loading CSS chunk") ||
					/Loading chunk \d+ failed/i.test(errorMessage);

				if (!isChunkError) {
					return;
				}

				console.warn(
					"[ChunkErrorHandler] Detected chunk loading error in promise rejection, reloading page...",
					reason,
				);

				// Prevent infinite reload loops
				const reloadKey = "chunk-error-reload";

				// Check if sessionStorage is available before attempting to use it
				// If storage is unavailable (throws errors, private mode, etc.), don't reload
				if (!isSessionStorageAvailable()) {
					console.warn(
						"[ChunkErrorHandler] sessionStorage unavailable, skipping reload to prevent issues",
					);
					return;
				}

				// Try to get last reload time - if this throws, don't reload
				let lastReload: string | null = null;
				try {
					lastReload = safeSessionStorageGetItem(reloadKey);
				} catch (getItemError) {
					// If getItem itself throws (not just returns null), don't reload
					// This handles cases where storage is partially broken
					console.warn(
						"[ChunkErrorHandler] Failed to read reload timestamp, skipping reload to prevent issues",
						getItemError,
					);
					return;
				}

				const now = Date.now();

				// Only reload if we haven't reloaded in the last 5 seconds
				const timeSinceLastReload = lastReload
					? now - Number.parseInt(lastReload, 10)
					: Number.POSITIVE_INFINITY;

				if (!lastReload || timeSinceLastReload > 5000) {
					// Try to save reload timestamp before reloading
					const saved = safeSessionStorageSetItem(reloadKey, now.toString());

					// Only reload if we successfully saved, or if storage save failed but we have no previous reload
					if (saved || !lastReload) {
						try {
							// Clear the error to prevent it from being logged again
							if (event.preventDefault) {
								event.preventDefault();
							}

							// Safely attempt reload
							if (
								window.location &&
								typeof window.location.reload === "function"
							) {
								window.location.reload();
							} else {
								console.error(
									"[ChunkErrorHandler] window.location.reload is not available",
								);
							}
						} catch (reloadError) {
							// If reload itself fails, log but don't throw
							console.error(
								"[ChunkErrorHandler] Failed to reload page:",
								reloadError,
							);
						}
					} else {
						// If setItem failed and we had a previous reload, don't reload
						console.error(
							"[ChunkErrorHandler] Failed to save reload timestamp, skipping reload to prevent infinite loop",
						);
					}
				} else {
					console.error(
						"[ChunkErrorHandler] Chunk error persists after reload. This may indicate a deployment issue.",
						reason,
					);
				}
			} catch (error) {
				// Catch any unexpected errors in the error handler itself
				console.error(
					"[ChunkErrorHandler] Unexpected error in rejection handler:",
					error,
				);
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
