export function getTestBaseUrl() {
	// * Use NEXT_PUBLIC_SITE_URL if set (canonical domain)
	const normalize = (raw: string): string => {
		let url = raw.trim();
		// If missing protocol, assume https
		if (!/^https?:\/\//i.test(url)) {
			url = `https://${url}`;
		}
		// Fix cases like https:/example.com -> https://example.com
		url = url.replace(/^https:\/(?!\/)/i, "https://");
		url = url.replace(/^http:\/(?!\/)/i, "http://");
		// Drop any trailing slashes for consistency
		url = url.replace(/\/+$/g, "");
		return url;
	};

	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return normalize(process.env.NEXT_PUBLIC_SITE_URL);
	}
	// * Fallback to VERCEL_URL (preview/auto-generated domains)
	if (process.env.VERCEL_URL) {
		return normalize(`https://${process.env.VERCEL_URL}`);
	}
	// * Local development
	if (process.env.NODE_ENV === "test") return "http://localhost:3000";
	// * Final fallback
	return "http://localhost:3000";
}
