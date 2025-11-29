"use client";

import CheckoutForm, {
	type PlanType,
} from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Z_INDEX } from "@/lib/constants/z-index";
import type { Plan } from "@/types/service/plans";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo } from "react";

type CheckoutContext = "standard" | "trial";
type CheckoutMode = "payment" | "setup";

type PricingCheckoutDialogProps = {
	clientSecret: string;
	onClose: () => void;
	onSuccess?: () => void;
	plan: Plan;
	planType: PlanType;
	mode: CheckoutMode;
	context: CheckoutContext;
	postTrialAmount?: number;
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
	onSuccess,
	plan,
	planType,
	mode,
	context,
	postTrialAmount,
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
			<div
				className="fixed inset-0 flex items-center justify-center p-6"
				style={{ zIndex: Z_INDEX.CHECKOUT_DIALOG }}
			>
				<div className="w-full max-w-sm rounded-2xl bg-background p-8 text-center shadow-xl">
					<p className="mb-4 font-semibold text-lg">
						We couldn't initialize the checkout experience.
					</p>
					<p className="mb-6 text-muted-foreground text-sm">
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
		<Elements stripe={stripePromise} options={elementOptions}>
			<CheckoutForm
				clientSecret={clientSecret}
				plan={plan}
				planType={planType}
				mode={mode}
				context={context}
				postTrialAmount={postTrialAmount}
				onSuccess={onSuccess || onClose}
				onCancel={onClose}
			/>
		</Elements>
	);
}
