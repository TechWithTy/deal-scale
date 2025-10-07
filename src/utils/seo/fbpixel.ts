declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
	}
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageView = (properties?: Record<string, unknown>) => {
	if (window.fbq) window.fbq("track", "PageView", properties);
};

export const event = (name: string, options: Record<string, unknown> = {}) => {
	if (window.fbq) window.fbq("track", name, options);
};
