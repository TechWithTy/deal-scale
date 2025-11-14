// hooks/useNewsletterSubscribers.ts
import type { Subscriber } from "@/types/behiiv";
import { useState } from "react";
import { toast } from "sonner";

// Helper for absolute API URLs
const apiUrl = (path: string) => {
	const apiBase = process.env.API_BASE_URL || "";
	return `${apiBase}${path}`;
};

export function useNewsletterSubscribers() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// CREATE
	async function addSubscriber(email: string): Promise<Subscriber | null> {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(apiUrl("/api/beehiiv/subscribe"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			// Output the raw response object
			console.log("DEBUG: fetch response object:", response);
			type ApiResponse = Subscriber | { message: string };
			let data: ApiResponse | null;
			try {
				data = await response.json();
			} catch (jsonErr) {
				console.log("DEBUG: Error parsing JSON from response:", jsonErr);
				data = null;
			}
			// Output the parsed data and status
			console.log(
				"DEBUG: Raw API response from /api/beehiiv/subscribe:",
				data,
				"Status:",
				response.status,
			);
			function hasMessage(obj: unknown): obj is { message: string } {
				return (
					typeof obj === "object" &&
					obj !== null &&
					"message" in obj &&
					typeof (obj as { message: string }).message === "string"
				);
			}
			if (!response.ok) {
				const errorMsg = hasMessage(data)
					? data.message
					: "Failed to add subscriber";
				toast.error(errorMsg);
				setError(errorMsg);
				return null;
			}
			toast.success("Thank you for subscribing to our newsletter!");
			// Only return data if it matches Subscriber shape
			if (data && typeof data === "object") {
				if (
					"data" in data &&
					data.data &&
					typeof data.data === "object" &&
					"id" in data.data
				) {
					return data.data as Subscriber;
				}
				if ("id" in data) {
					return data as Subscriber;
				}
			}
			return null;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			console.log("DEBUG: fetch threw error (full object):", err);
			setError(msg);
			toast.error(msg);
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	// READ
	const getSubscriberByEmail = async (
		email: string,
	): Promise<Subscriber | null> => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				apiUrl(`/api/beehiiv/subscribe?email=${encodeURIComponent(email)}`),
			);
			const data = await response.json();
			if (!response.ok) {
				toast.error(data.message || "Failed to get subscriber");
				setError(data.message || "Failed to get subscriber");
				return null;
			}
			return data?.data || null;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			setError(msg);
			toast.error(msg);
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	// DELETE
	const removeSubscriber = async (email: string): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(apiUrl("/api/beehiiv/subscribe"), {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await response.json();
			if (!response.ok) {
				toast.error(data.message || "Failed to remove subscriber");
				setError(data.message || "Failed to remove subscriber");
				return false;
			}
			toast.success("Subscriber removed from Beehiiv.");
			return true;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			setError(msg);
			toast.error(msg);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	// UPDATE
	const updateSubscription = async (
		subscriptionId: string,
		updates: Partial<{ tier: string; stripe_customer_id: string }>,
	): Promise<Subscriber | null> => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(apiUrl("/api/beehiiv/subscribe"), {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ subscriptionId, updates }),
			});
			const data: Subscriber = await response.json();
			if (!response.ok) {
				toast.error(data.status || "Failed to update subscription");
				setError(data.status || "Failed to update subscription");
				return null;
			}
			toast.success("Subscription updated.");
			return data;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			setError(msg);
			toast.error(msg);
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		addSubscriber,
		getSubscriberByEmail,
		removeSubscriber,
		updateSubscription,
		isLoading,
		error,
	};
}
