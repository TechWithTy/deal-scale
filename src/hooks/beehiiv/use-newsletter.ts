// hooks/useNewsletter.ts
import { useEffect, useState } from "react";

export interface Newsletter {
	id: string;
	title: string;
	content: string;
	subscribers: string[];
	createdAt: string;
}

export interface NewsletterStats {
	openRate: number;
	clickRate: number;
	unsubscribes: number;
}

export function useNewsletter() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

	const createNewsletter = async (title: string, content: string) => {
		setLoading(true);
		try {
			const response = await fetch("https://api.beehiiv.com/newsletters", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
				body: JSON.stringify({ title, content }),
			});

			if (!response.ok) throw new Error("Failed to create newsletter");
			const data = await response.json();
			setNewsletters((prev) => [...prev, data]);
			return data;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateNewsletter = async (id: string, updates: Partial<Newsletter>) => {
		setLoading(true);
		try {
			const response = await fetch(
				`https://api.beehiiv.com/newsletters/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
					},
					body: JSON.stringify(updates),
				},
			);

			if (!response.ok) throw new Error("Failed to update newsletter");
			const data = await response.json();
			setNewsletters((prev) => prev.map((n) => (n.id === id ? data : n)));
			return data;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteNewsletter = async (id: string) => {
		setLoading(true);
		try {
			const response = await fetch(
				`https://api.beehiiv.com/newsletters/${id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
					},
				},
			);

			if (!response.ok) throw new Error("Failed to delete newsletter");
			setNewsletters((prev) => prev.filter((n) => n.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const fetchNewsletters = async () => {
		setLoading(true);
		try {
			const response = await fetch("https://api.beehiiv.com/newsletters", {
				headers: {
					Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
				},
			});

			if (!response.ok) throw new Error("Failed to fetch newsletters");
			const data = await response.json();
			setNewsletters(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchNewsletters();
	}, []);

	return {
		loading,
		error,
		newsletters,
		createNewsletter,
		updateNewsletter,
		deleteNewsletter,
		fetchNewsletters,
	};
}
