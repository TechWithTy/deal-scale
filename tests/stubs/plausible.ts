import { vi } from "vitest";

export const init = vi.fn();
export const trackEvent = vi.fn();
export const trackPageview = vi.fn();
export const enableAutoPageviews = vi.fn();

export default {
	init,
	trackEvent,
	trackPageview,
	enableAutoPageviews,
};
