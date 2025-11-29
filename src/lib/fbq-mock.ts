/**
 * Mock Facebook Pixel function for local development and testing.
 * Routes pixel events to the local mock server instead of Facebook's servers.
 *
 * Usage:
 * - In development: Automatically replaces window.fbq
 * - In production: Uses real Facebook Pixel
 */

const MOCK_SERVER_URL = "http://localhost:3030/pixel";

export function fbqMock(
	method: string,
	event: string,
	data?: Record<string, unknown>,
): void {
	// Only send to mock server in development
	if (process.env.NODE_ENV !== "development") {
		console.warn(
			"[fbqMock] Mock function called in non-development environment",
		);
		return;
	}

	// Use fetch to send event to mock server
	// Fire and forget - don't block the redirect
	fetch(MOCK_SERVER_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			event_name: event,
			method,
			payload: data || {},
			env: "local-test",
			timestamp: Date.now(),
		}),
	}).catch((error) => {
		// Silently fail if mock server is not running
		console.warn("[fbqMock] Failed to send event to mock server:", error);
	});
}

/**
 * Initialize mock fbq in development mode
 * This replaces window.fbq with the mock function ONLY in development
 *
 * IMPORTANT: This will NEVER run in production - it's development-only
 */
export function initFbqMock(): void {
	if (typeof window === "undefined") return;

	// ONLY run in development mode - never in production
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	// In development, use mock if:
	// 1. Explicitly enabled via ENABLE_FBQ_MOCK=true, OR
	// 2. Real pixel hasn't been initialized yet
	if (process.env.ENABLE_FBQ_MOCK === "true") {
		// Force replace even if fbq exists when explicitly enabled
		(window as { fbq?: typeof globalThis.fbq }).fbq =
			fbqMock as typeof globalThis.fbq;
		console.log(
			"[fbqMock] Mock Facebook Pixel force-initialized (replacing existing)",
		);
	} else if (!window.fbq || typeof window.fbq !== "function") {
		// Use mock if real pixel hasn't loaded yet
		(window as { fbq?: typeof globalThis.fbq }).fbq =
			fbqMock as typeof globalThis.fbq;
		console.log(
			"[fbqMock] Mock Facebook Pixel initialized (real pixel not loaded)",
		);
	}
	// If real pixel is already loaded and ENABLE_FBQ_MOCK is not set,
	// we don't override it - use the real pixel
}
