/**
 * Centralized z-index constants to prevent overlap issues across the app.
 *
 * Hierarchy (lowest to highest):
 * - Base content: 0-10
 * - Sticky elements: 50-60
 * - Modals/Dialogs: 100-200
 * - Toasts/Notifications: 200-300
 * - Critical overlays: 9999+
 */

export const Z_INDEX = {
	// Base content layers
	BASE: 0,

	// Sticky navigation elements
	STICKY_BANNER: 55,
	NAVBAR: 60,
	NAVIGATION_LOADER: 70,

	// Modal and dialog layers (must be above sticky elements)
	DIALOG_OVERLAY: 100,
	DIALOG_CONTENT: 101,
	CHECKOUT_DIALOG: 102,

	// Toast and notification layers
	TOAST: 200,

	// Critical overlays (mobile menu, full-screen modals)
	MOBILE_MENU: 9999,
	CRITICAL_OVERLAY: 9999,
} as const;



