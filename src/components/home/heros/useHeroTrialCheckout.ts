import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import type { Plan } from "@/types/service/plans";

import { HERO_TRIAL_PLAN, createHeroTrialPlan } from "./heroConfig";

export interface TrialCheckoutState {
	clientSecret: string;
	plan: Plan;
	planType: "monthly";
	mode: "setup";
	context: "trial";
	postTrialAmount?: number;
}

export function useHeroTrialCheckout(): {
	isTrialLoading: boolean;
	checkoutState: TrialCheckoutState | null;
	startTrial: () => Promise<void>;
	closeCheckout: () => void;
} {
	const [isTrialLoading, setIsTrialLoading] = useState(false);
	const [checkoutState, setCheckoutState] = useState<TrialCheckoutState | null>(
		null,
	);
	const activeTrialController = useRef<AbortController | null>(null);

	useEffect(
		() => () => {
			activeTrialController.current?.abort();
		},
		[],
	);

	const startTrial = useCallback(async () => {
		if (isTrialLoading) {
			return;
		}

		const controller = new AbortController();
		activeTrialController.current?.abort();
		activeTrialController.current = controller;

		setIsTrialLoading(true);

		try {
			const response = await fetch("/api/stripe/trial", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					planId: HERO_TRIAL_PLAN.id,
					planName: HERO_TRIAL_PLAN.name,
				}),
				signal: controller.signal,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					typeof errorData.error === "string"
						? errorData.error
						: "Unable to prepare free trial checkout.",
				);
			}

			const { clientSecret } = (await response.json().catch(() => ({}))) as {
				clientSecret?: string;
			};

			if (!clientSecret) {
				throw new Error("Free trial checkout is unavailable right now.");
			}

			toast.success(
				"Trial checkout is ready - open the pricing flow to finish setup.",
			);

			const trialPlan: Plan = createHeroTrialPlan();

			setCheckoutState({
				clientSecret,
				plan: trialPlan,
				planType: "monthly",
				mode: "setup",
				context: "trial",
				postTrialAmount: 2000, // Base tier price
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}
			const message =
				error instanceof Error
					? error.message
					: "Unable to start the free trial.";
			toast.error(message);
			console.error("Dynamic hero trial CTA error:", error);
		} finally {
			if (activeTrialController.current === controller) {
				activeTrialController.current = null;
			}
			setIsTrialLoading(false);
		}
	}, [isTrialLoading]);

	const closeCheckout = useCallback(() => {
		setCheckoutState(null);
	}, []);

	return {
		isTrialLoading,
		checkoutState,
		startTrial,
		closeCheckout,
	};
}
