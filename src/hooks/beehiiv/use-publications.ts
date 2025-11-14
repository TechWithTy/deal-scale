// hooks/beehiiv/use-publications.ts
// * Hook for listing Beehiiv publications with stats (v2 API)
// ! Requires BEEHIIV_API_KEY in .env
// ! Optionally uses Beehiiv SDK if installed, else falls back to fetch
import type { Publication, PublicationsResponse } from "@/types/behiiv";
import { useEffect, useState } from "react";

export function usePublications() {
	const [publications, setPublications] = useState<Publication[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPublications = async () => {
			setLoading(true);
			// * Logging for debugging
			// eslint-disable-next-line no-console
			console.log("[usePublications] Fetching publications...");
			try {
				const apiKey = process.env.BEEHIIV_API_KEY;
				if (!apiKey) throw new Error("BEEHIIV_API_KEY is missing from .env");
				const url = "https://api.beehiiv.com/v2/publications?expand=stats";
				// eslint-disable-next-line no-console
				console.log(`[usePublications] Request URL: ${url}`);
				const response = await fetch(url, {
					headers: {
						Authorization: `Bearer ${apiKey}`,
					},
				});
				// eslint-disable-next-line no-console
				console.log(`[usePublications] Response status: ${response.status}`);
				let responseBody: unknown;
				try {
					responseBody = await response.clone().json();
					// eslint-disable-next-line no-console
					console.log("[usePublications] Response body:", responseBody);
				} catch (jsonErr) {
					// eslint-disable-next-line no-console
					console.error("[usePublications] Failed to parse JSON:", jsonErr);
				}
				if (!response.ok) throw new Error("Failed to fetch publications");
				const data: PublicationsResponse = responseBody as PublicationsResponse;
				setPublications(data.data);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error("[usePublications] Error:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		};
		fetchPublications();
	}, []);

	return { publications, loading, error };
}
