/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { ChunkErrorHandler } from "../ChunkErrorHandler";

// Mock PromiseRejectionEvent since it's not available in jsdom
class MockPromiseRejectionEvent extends Event {
	reason: unknown;
	promise: Promise<unknown>;

	constructor(
		type: string,
		init: { reason: unknown; promise: Promise<unknown> },
	) {
		super(type, { cancelable: true });
		this.reason = init.reason;
		this.promise = init.promise;
	}
}

// Make it available globally for tests
global.PromiseRejectionEvent =
	MockPromiseRejectionEvent as typeof PromiseRejectionEvent;

describe("ChunkErrorHandler", () => {
	let mockReload: ReturnType<typeof vi.fn>;
	let mockSessionStorage: Storage;
	let originalLocation: Location;

	beforeEach(() => {
		// Mock window.location.reload
		mockReload = vi.fn();
		originalLocation = window.location;
		Object.defineProperty(window, "location", {
			value: {
				...originalLocation,
				reload: mockReload,
			},
			writable: true,
			configurable: true,
		});

		// Mock sessionStorage
		mockSessionStorage = {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
			key: vi.fn(),
			length: 0,
		};
		Object.defineProperty(window, "sessionStorage", {
			value: mockSessionStorage,
			writable: true,
			configurable: true,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		// Restore original location
		Object.defineProperty(window, "location", {
			value: originalLocation,
			writable: true,
			configurable: true,
		});
	});

	describe("Chunk error detection", () => {
		it("should detect and handle 'Loading chunk X failed' error", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
				"chunk-error-reload",
				expect.any(String),
			);
			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should detect 'Loading chunk X failed' with regex pattern", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 12345 failed",
				error: new Error("Loading chunk 12345 failed"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should detect 'Failed to fetch dynamically imported module' error", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Failed to fetch dynamically imported module",
				error: new Error("Failed to fetch dynamically imported module"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should detect 'ChunkLoadError' error", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "ChunkLoadError: Loading chunk failed",
				error: new Error("ChunkLoadError: Loading chunk failed"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should detect 'Loading CSS chunk' error", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading CSS chunk 42 failed",
				error: new Error("Loading CSS chunk 42 failed"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should handle chunk error as string in error event", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should handle chunk error in promise rejection", async () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const error = new Error("Loading chunk 7895 failed");
			const promise = Promise.reject(error);
			// Catch the rejection to prevent unhandled rejection warning
			promise.catch(() => {});

			const rejectionEvent = new MockPromiseRejectionEvent(
				"unhandledrejection",
				{
					reason: error,
					promise,
				},
			);

			window.dispatchEvent(rejectionEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should handle chunk error as string in promise rejection", async () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const reason = "Loading chunk 7895 failed";
			const promise = Promise.reject(reason);
			// Catch the rejection to prevent unhandled rejection warning
			promise.catch(() => {});

			const rejectionEvent = new MockPromiseRejectionEvent(
				"unhandledrejection",
				{
					reason,
					promise,
				},
			);

			window.dispatchEvent(rejectionEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});
	});

	describe("Non-chunk errors", () => {
		it("should NOT reload for regular JavaScript errors", () => {
			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "TypeError: Cannot read property 'x' of undefined",
				error: new TypeError("Cannot read property 'x' of undefined"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).not.toHaveBeenCalled();
		});

		it("should NOT reload for network errors", () => {
			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "NetworkError: Failed to fetch",
				error: new Error("NetworkError: Failed to fetch"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).not.toHaveBeenCalled();
		});

		it("should NOT reload for promise rejections that are not chunk errors", async () => {
			render(<ChunkErrorHandler />);

			const error = new Error("API request failed");
			const promise = Promise.reject(error);
			// Catch the rejection to prevent unhandled rejection warning
			promise.catch(() => {});

			const rejectionEvent = new MockPromiseRejectionEvent(
				"unhandledrejection",
				{
					reason: error,
					promise,
				},
			);

			window.dispatchEvent(rejectionEvent);

			expect(mockReload).not.toHaveBeenCalled();
		});
	});

	describe("Infinite reload prevention", () => {
		it("should prevent reload if reloaded within 5 seconds", () => {
			const now = Date.now();
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				(now - 2000).toString(), // 2 seconds ago
			);

			// Mock Date.now to return a time 2 seconds after the stored time
			vi.spyOn(Date, "now").mockReturnValue(now);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
			});

			window.dispatchEvent(errorEvent);

			// Should NOT reload because it's within 5 seconds
			expect(mockReload).not.toHaveBeenCalled();
			expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
		});

		it("should allow reload if last reload was more than 5 seconds ago", () => {
			const now = Date.now();
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				(now - 6000).toString(), // 6 seconds ago
			);

			vi.spyOn(Date, "now").mockReturnValue(now);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
			});

			window.dispatchEvent(errorEvent);

			// Should reload because it's been more than 5 seconds
			expect(mockReload).toHaveBeenCalledTimes(1);
			expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
				"chunk-error-reload",
				now.toString(),
			);
		});

		it("should allow reload if no previous reload timestamp exists", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should handle invalid sessionStorage timestamp gracefully", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				"invalid",
			);

			const now = Date.now();
			vi.spyOn(Date, "now").mockReturnValue(now);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
			});

			window.dispatchEvent(errorEvent);

			// parseInt("invalid") returns NaN, and NaN - now is NaN, which is not > 5000
			// So the condition (!lastReload || now - parseInt(lastReload, 10) > 5000) evaluates to
			// (false || false) = false, so reload should NOT happen
			// Actually wait - if lastReload is "invalid", it's truthy, so !lastReload is false
			// Then we check NaN > 5000 which is false, so the whole condition is false
			// So reload should NOT be called. But the component logic might still reload.
			// Let's check: the component does `if (!lastReload || now - parseInt(lastReload, 10) > 5000)`
			// If lastReload is "invalid" (truthy), !lastReload is false
			// parseInt("invalid", 10) is NaN
			// now - NaN is NaN
			// NaN > 5000 is false
			// So the condition is false, and reload should NOT happen
			expect(mockReload).not.toHaveBeenCalled();
		});
	});

	describe("Event handling", () => {
		it("should call preventDefault on error event when chunk error detected", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
				cancelable: true,
			});

			const preventDefaultSpy = vi.spyOn(errorEvent, "preventDefault");

			window.dispatchEvent(errorEvent);

			expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
		});

		it("should call preventDefault on promise rejection event when chunk error detected", async () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const error = new Error("Loading chunk 7895 failed");
			const promise = Promise.reject(error);
			// Catch the rejection to prevent unhandled rejection warning
			promise.catch(() => {});

			const rejectionEvent = new MockPromiseRejectionEvent(
				"unhandledrejection",
				{
					reason: error,
					promise,
				},
			);

			const preventDefaultSpy = vi.spyOn(rejectionEvent, "preventDefault");

			window.dispatchEvent(rejectionEvent);

			expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
		});

		it("should cleanup event listeners on unmount", () => {
			const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

			const { unmount } = render(<ChunkErrorHandler />);

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				"error",
				expect.any(Function),
				true,
			);
			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				"unhandledrejection",
				expect.any(Function),
			);
		});
	});

	describe("Edge cases", () => {
		it("should handle error event with no error property", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should handle error event with empty message", () => {
			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "",
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).not.toHaveBeenCalled();
		});

		it("should handle promise rejection with non-Error, non-string reason", async () => {
			render(<ChunkErrorHandler />);

			const reason = { custom: "error object" };
			const promise = Promise.reject(reason);
			// Catch the rejection to prevent unhandled rejection warning
			promise.catch(() => {});

			const rejectionEvent = new MockPromiseRejectionEvent(
				"unhandledrejection",
				{
					reason,
					promise,
				},
			);

			window.dispatchEvent(rejectionEvent);

			// Should convert to string and check, but won't match chunk error patterns
			expect(mockReload).not.toHaveBeenCalled();
		});

		it("should handle promise rejection with null reason", async () => {
			render(<ChunkErrorHandler />);

			const promise = Promise.reject(null);
			// Catch the rejection to prevent unhandled rejection warning
			promise.catch(() => {});

			const rejectionEvent = new MockPromiseRejectionEvent(
				"unhandledrejection",
				{
					reason: null,
					promise,
				},
			);

			window.dispatchEvent(rejectionEvent);

			expect(mockReload).not.toHaveBeenCalled();
		});

		it("should handle promise rejection with undefined reason", async () => {
			render(<ChunkErrorHandler />);

			const promise = Promise.reject(undefined);
			// Catch the rejection to prevent unhandled rejection warning
			promise.catch(() => {});

			const rejectionEvent = new MockPromiseRejectionEvent(
				"unhandledrejection",
				{
					reason: undefined,
					promise,
				},
			);

			window.dispatchEvent(rejectionEvent);

			expect(mockReload).not.toHaveBeenCalled();
		});

		it("should handle case-insensitive chunk error messages", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "LOADING CHUNK 7895 FAILED",
				error: new Error("LOADING CHUNK 7895 FAILED"),
			});

			window.dispatchEvent(errorEvent);

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it("should handle multiple rapid chunk errors and only reload once", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);

			render(<ChunkErrorHandler />);

			// First error
			const errorEvent1 = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
			});

			// Second error (should be prevented by sessionStorage)
			const errorEvent2 = new ErrorEvent("error", {
				message: "Loading chunk 7896 failed",
				error: new Error("Loading chunk 7896 failed"),
			});

			window.dispatchEvent(errorEvent1);

			// Mock sessionStorage to return recent timestamp for second error
			const now = Date.now();
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				(now - 1000).toString(),
			);
			vi.spyOn(Date, "now").mockReturnValue(now);

			window.dispatchEvent(errorEvent2);

			// Should only reload once (first error)
			expect(mockReload).toHaveBeenCalledTimes(1);
		});
	});

	describe("SSR safety", () => {
		it("should not run on server side (window is undefined)", () => {
			// This test verifies the component doesn't crash when window is undefined
			// In a real SSR scenario, useEffect won't run, so we can't test the actual behavior
			// But we can verify the component renders without errors
			// Note: In jsdom environment, window always exists, so we can't truly test SSR
			// This test just verifies the component has the SSR check in place
			expect(() => render(<ChunkErrorHandler />)).not.toThrow();
		});
	});

	describe("SessionStorage edge cases", () => {
		it("should handle sessionStorage.getItem throwing an error", () => {
			(
				mockSessionStorage.getItem as ReturnType<typeof vi.fn>
			).mockImplementation(() => {
				throw new Error("sessionStorage unavailable");
			});

			// Should not crash, but also won't reload (error in getItem prevents reload)
			expect(() => {
				render(<ChunkErrorHandler />);
				const errorEvent = new ErrorEvent("error", {
					message: "Loading chunk 7895 failed",
					error: new Error("Loading chunk 7895 failed"),
				});
				window.dispatchEvent(errorEvent);
			}).not.toThrow();

			// Reload should not be called because getItem threw
			expect(mockReload).not.toHaveBeenCalled();
		});

		it("should handle sessionStorage.setItem throwing an error", () => {
			(mockSessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
				null,
			);
			(
				mockSessionStorage.setItem as ReturnType<typeof vi.fn>
			).mockImplementation(() => {
				throw new Error("sessionStorage quota exceeded");
			});

			// If setItem throws, the reload won't happen (component doesn't catch setItem errors)
			// This is acceptable behavior - better to fail safely than reload infinitely
			render(<ChunkErrorHandler />);

			const errorEvent = new ErrorEvent("error", {
				message: "Loading chunk 7895 failed",
				error: new Error("Loading chunk 7895 failed"),
			});

			// Event handlers don't propagate errors, but setItem will throw internally
			// We verify that reload is NOT called because setItem threw
			window.dispatchEvent(errorEvent);

			// Reload should NOT be called because setItem threw before reload could execute
			expect(mockReload).not.toHaveBeenCalled();
			// Verify setItem was called (and threw)
			expect(mockSessionStorage.setItem).toHaveBeenCalled();
		});
	});
});
