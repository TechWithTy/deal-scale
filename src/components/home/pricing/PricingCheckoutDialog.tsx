"use client";

import CheckoutForm, {
	type PlanType,
} from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/types/service/plans";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";

type PricingCheckoutDialogProps = {
	clientSecret: string;
	onClose: () => void;
	plan: Plan;
	planType: PlanType;
};

const stripePromise = (() => {
	const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

	if (!publishableKey || !publishableKey.startsWith("pk_")) {
		console.warn("Stripe publishable key is missing or invalid.");
		return null;
	}

	return loadStripe(publishableKey);
})();

export default function PricingCheckoutDialog({
	clientSecret,
	onClose,
	plan,
	planType,
}: PricingCheckoutDialogProps) {
	useEffect(() => {
		const { body } = document;
		const previousOverflow = body.style.overflow;
		body.style.overflow = "hidden";

		return () => {
			body.style.overflow = previousOverflow;
		};
	}, []);

	const elementOptions = useMemo(
		() => ({
			clientSecret,
			appearance: {
				theme: "night" as const,
				variables: { colorPrimary: "#6366f1" },
			},
		}),
		[clientSecret],
	);

	if (!stripePromise) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
				<div className="w-full max-w-sm rounded-2xl bg-background-dark p-8 text-center shadow-xl">
					<p className="mb-4 font-semibold text-lg text-white">
						We couldn't initialize the checkout experience.
					</p>
					<p className="mb-6 text-sm text-white/70">
						Please refresh the page or contact support for assistance.
					</p>
					<Button onClick={onClose} variant="secondary">
						Close
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6">
			<div className="relative w-full max-w-lg rounded-3xl bg-background-dark/95 p-6 shadow-2xl backdrop-blur">
				<button
					type="button"
					onClick={onClose}
					aria-label="Close checkout"
					className="absolute top-4 right-4 rounded-full border border-white/10 bg-black/60 p-2 text-white transition hover:bg-black/80"
				>
					<X className="h-4 w-4" />
				</button>
				<Elements stripe={stripePromise} options={elementOptions}>
					<CheckoutForm
						clientSecret={clientSecret}
						plan={plan}
						planType={planType}
						onSuccess={onClose}
					/>
				</Elements>
			</div>
		</div>
	);
}
