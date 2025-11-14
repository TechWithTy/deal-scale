export interface UserProfileSummary {
	first_name?: string | null;
	last_name?: string | null;
	full_name?: string | null;
}

/**
 * Fetches the authenticated user's display name from `/api/auth/me`.
 * Falls back gracefully if the endpoint is unavailable or the user profile
 * does not contain name data.
 */
export async function fetchUserDisplayName(): Promise<string | null> {
	try {
		const response = await fetch("/api/auth/me", { method: "GET" });

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as UserProfileSummary;
		const first = data.first_name?.trim();
		const last = data.last_name?.trim();
		const full = data.full_name?.trim();

		const combined = [first, last].filter(Boolean).join(" ").trim();
		if (combined.length > 0) {
			return combined;
		}

		if (full && full.length > 0) {
			return full;
		}

		return null;
	} catch (error) {
		console.warn("fetchUserDisplayName failed", error);
		return null;
	}
}
