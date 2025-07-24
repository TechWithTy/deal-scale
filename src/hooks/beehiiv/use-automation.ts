// hooks/useAutomationJourney.ts
import { useEffect, useState } from "react";

export interface AutomationJourney {
	id: string;
	name: string;
	trigger: string;
	steps: AutomationStep[];
	createdAt: string;
	updatedAt: string;
}

export interface AutomationStep {
	id: string;
	action: string;
	condition: string;
	delay: number;
	createdAt: string;
}

export function useAutomationJourney() {
	const [journeys, setJourneys] = useState<AutomationJourney[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createJourney = async (journeyData: Partial<AutomationJourney>) => {
		setLoading(true);
		try {
			const response = await fetch(
				"https://api.beehiiv.com/automation/journeys",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
					},
					body: JSON.stringify({
						name: journeyData.name,
						trigger: journeyData.trigger,
						steps: journeyData.steps || [],
					}),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to create journey");
			}

			const newJourney = await response.json();
			setJourneys((prev) => [...prev, newJourney]);
			return newJourney;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const getJourneys = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				"https://api.beehiiv.com/automation/journeys",
				{
					headers: {
						Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
					},
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to fetch journeys");
			}

			const data = await response.json();
			setJourneys(data);
			return data;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const getJourney = async (journeyId: string) => {
		setLoading(true);
		try {
			const response = await fetch(
				`https://api.beehiiv.com/automation/journeys/${journeyId}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
					},
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to fetch journey");
			}

			return await response.json();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateJourney = async (
		journeyId: string,
		updates: Partial<AutomationJourney>,
	) => {
		setLoading(true);
		try {
			const response = await fetch(
				`https://api.beehiiv.com/automation/journeys/${journeyId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
					},
					body: JSON.stringify(updates),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to update journey");
			}

			const updatedJourney = await response.json();
			setJourneys((prev) =>
				prev.map((j) => (j.id === journeyId ? { ...j, ...updatedJourney } : j)),
			);
			return updatedJourney;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getJourneys();
	}, []);

	return {
		journeys,
		loading,
		error,
		createJourney,
		getJourneys,
		getJourney,
		updateJourney,
	};
}
