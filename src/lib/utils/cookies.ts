/**
 * Cookie utility functions for managing banner state
 */

const BANNER_CLOSED_COOKIE = "bannerClosed";
const COOKIE_EXPIRY_HOURS = 24;

/**
 * Set a cookie with expiration time
 */
function setCookie(name: string, value: string, hours: number): void {
	if (typeof document === "undefined") return;

	const date = new Date();
	date.setTime(date.getTime() + hours * 60 * 60 * 1000);
	const expires = `expires=${date.toUTCString()}`;
	document.cookie = `${name}=${value}; ${expires}; path=/`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;

	const nameEQ = `${name}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/**
 * Check if banner was closed within the last 24 hours
 */
export function isBannerClosed(): boolean {
	const cookieValue = getCookie(BANNER_CLOSED_COOKIE);
	if (!cookieValue) return false;

	// Cookie exists, meaning banner was closed
	// The cookie will expire automatically after 24 hours
	return true;
}

/**
 * Mark banner as closed (sets cookie for 24 hours)
 */
export function setBannerClosed(): void {
	setCookie(BANNER_CLOSED_COOKIE, "true", COOKIE_EXPIRY_HOURS);
}

/**
 * Clear the banner closed cookie (for testing/debugging)
 */
export function clearBannerClosed(): void {
	if (typeof document === "undefined") return;
	document.cookie = `${BANNER_CLOSED_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}



