/**
 * Extracts the GUID from a slug string or array.
 * Handles slugs like:
 * - "cf98c1dca176"
 * - "@codingoni/navigating-the-maze-...-cf98c1dca176"
 * - ["@codingoni", "navigating-the-maze-...-cf98c1dca176"]
 */
export function extractGuidFromSlug(slug: string | string[]): string {
	// * Debug logging for troubleshooting slug extraction
	// eslint-disable-next-line no-console
	console.log("[extractGuidFromSlug] input:", slug);
	const normalized = Array.isArray(slug) ? slug.join("/") : slug;
	const lastSegment = normalized.split("/").pop() ?? normalized;
	const guid = lastSegment.split("-").pop() ?? lastSegment;
	// eslint-disable-next-line no-console
	console.log(
		"[extractGuidFromSlug] normalized:",
		normalized,
		"lastSegment:",
		lastSegment,
		"guid:",
		guid,
	);
	return guid;
}
