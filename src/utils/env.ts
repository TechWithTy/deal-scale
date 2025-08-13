export function getTestBaseUrl() {
	// * Use NEXT_PUBLIC_SITE_URL if set (canonical domain)
	const normalize = (raw: string): string => {
		let url = raw.trim();
		// 1) Fix single-slash schemes at start: https:/example -> https://example
		url = url.replace(/^(https?:)\/(?!\/)/i, "$1//");
		// 2) If missing protocol, assume https
		if (!/^https?:\/\//i.test(url)) {
			url = `https://${url}`;
		}
		// 3) Collapse duplicate protocols at start: https://https:// -> https://
		url = url.replace(/^(https?:\/\/)(https?:\/\/)/i, "$1");
		// 4) Also handle mixed duplicate like https://https:/ -> https://
		url = url.replace(/^(https?:\/\/)(https?:)\/(?!\/)/i, "$1");
		// 5) Ensure protocol is followed by exactly two slashes
		url = url.replace(/^(https?:):\/(?!\/)/i, "$1://");
		// 6) Drop any trailing slashes for consistency
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
