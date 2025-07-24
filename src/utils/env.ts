export function getTestBaseUrl() {
	// * Use NEXT_PUBLIC_SITE_URL if set (canonical domain)
	if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
	// * Fallback to VERCEL_URL (preview/auto-generated domains)
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	// * Local development
	if (process.env.NODE_ENV === "test") return "http://localhost:3000";
	// * Final fallback
	return "http://localhost:3000";
}
