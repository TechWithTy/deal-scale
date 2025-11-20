/**
 * * Facebook Pixel user association
 * - Represents a user's Facebook Pixel tracking identity and any relevant metadata.
 */
export interface FacebookPixelUser {
	/** The unique Facebook Pixel ID assigned to this user */
	pixelId: string;
	/** The user's unique system/user ID (if applicable) */
	userId?: string;
	/** Optionally track which A/B test variant this user saw */
	abTestId?: string;
	abTestVariant?: string;
	/** Timestamp when the pixel was assigned or last updated */
	assignedAt?: Date;
	/** Any additional metadata for analytics/debugging */
	[key: string]: unknown;
}
