/**
 * Utility functions for safely accessing browser storage APIs.
 * These functions handle cases where storage is unavailable or throws errors,
 * which can happen in:
 * - Private/incognito browsing mode
 * - Browsers with storage disabled
 * - Test environments with mocked storage
 * - Cross-origin iframes
 * - Quota exceeded scenarios
 */

/**
 * Safely gets an item from sessionStorage.
 * Returns null if storage is unavailable or throws an error.
 */
export function safeSessionStorageGetItem(key: string): string | null {
	try {
		if (typeof window === "undefined" || !window.sessionStorage) {
			return null;
		}
		return window.sessionStorage.getItem(key);
	} catch (error) {
		// Storage may be unavailable due to:
		// - Private browsing mode
		// - Storage quota exceeded
		// - Cross-origin restrictions
		// - Security policies
		console.warn(`[safeSessionStorageGetItem] Failed to read sessionStorage key "${key}":`, error);
		return null;
	}
}

/**
 * Safely sets an item in sessionStorage.
 * Returns true if successful, false if storage is unavailable or throws an error.
 */
export function safeSessionStorageSetItem(
	key: string,
	value: string,
): boolean {
	try {
		if (typeof window === "undefined" || !window.sessionStorage) {
			return false;
		}
		window.sessionStorage.setItem(key, value);
		return true;
	} catch (error) {
		// Storage may throw due to:
		// - Quota exceeded (QUOTA_EXCEEDED_ERR)
		// - Private browsing mode
		// - Cross-origin restrictions
		// - Security policies
		console.warn(
			`[safeSessionStorageSetItem] Failed to set sessionStorage key "${key}":`,
			error,
		);
		return false;
	}
}

/**
 * Safely removes an item from sessionStorage.
 * Returns true if successful, false if storage is unavailable or throws an error.
 */
export function safeSessionStorageRemoveItem(key: string): boolean {
	try {
		if (typeof window === "undefined" || !window.sessionStorage) {
			return false;
		}
		window.sessionStorage.removeItem(key);
		return true;
	} catch (error) {
		console.warn(
			`[safeSessionStorageRemoveItem] Failed to remove sessionStorage key "${key}":`,
			error,
		);
		return false;
	}
}

/**
 * Safely checks if sessionStorage is available and functional.
 */
export function isSessionStorageAvailable(): boolean {
	try {
		if (typeof window === "undefined" || !window.sessionStorage) {
			return false;
		}
		// Try to set and get a test item
		const testKey = "__storage_test__";
		window.sessionStorage.setItem(testKey, "test");
		window.sessionStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}

