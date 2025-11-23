"use client";

import { useCallback, useEffect, useState } from "react";

type AffiliateStatus =
	| "pending"
	| "approved"
	| "active"
	| "suspended"
	| "rejected";

interface AffiliateStatusResponse {
	status?: AffiliateStatus;
	affiliateId?: string;
	message?: string;
}

interface UseAffiliateStatusReturn {
	status: AffiliateStatus | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage affiliate application approval status
 * @returns {UseAffiliateStatusReturn} Status, loading state, error, and refetch function
 */
export function useAffiliateStatus(): UseAffiliateStatusReturn {
	const [status, setStatus] = useState<AffiliateStatus | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchStatus = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/affiliates/application/status");
			if (!response.ok) {
				if (response.status === 401) {
					setError("Unauthorized. Please sign in.");
					setStatus(null);
					return;
				}
				if (response.status === 404) {
					// No application found yet
					setStatus(null);
					setIsLoading(false);
					return;
				}
				throw new Error(`Failed to fetch status: ${response.statusText}`);
			}

			const data = (await response.json()) as AffiliateStatusResponse;
			if (data.status) {
				setStatus(data.status);
			} else {
				setStatus(null);
			}
		} catch (err) {
			console.error("[useAffiliateStatus] Error fetching status:", err);
			setError(
				err instanceof Error ? err.message : "Failed to fetch affiliate status",
			);
			setStatus(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchStatus();
	}, [fetchStatus]);

	return {
		status,
		isLoading,
		error,
		refetch: fetchStatus,
	};
}
