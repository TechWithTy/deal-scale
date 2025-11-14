const NON_WORD_REGEX = /[^a-z0-9]+/g;

/**
 * Normalizes an event title or identifier into a URL-friendly slug.
 */
export function createEventSlug(
	title: string | undefined,
	fallback: string,
): string {
	const normalizedTitle = title?.trim().toLowerCase() ?? "";
	if (normalizedTitle.length > 0) {
		const condensed = normalizedTitle
			.normalize("NFKD")
			.replace(/\p{M}+/gu, "")
			.replace(NON_WORD_REGEX, "-")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "");
		if (condensed.length > 0) {
			return condensed;
		}
	}

	return fallback
		.trim()
		.toLowerCase()
		.replace(NON_WORD_REGEX, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}
