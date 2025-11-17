"use client";

import { Button } from "@/components/ui/button";
import { useWaitCursor } from "@/hooks/useWaitCursor";
import { startStripeToast } from "@/lib/ui/stripeToast";
import type { Plan, PlanType } from "@/types/service/plans";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Header from "../common/Header";
import { PlanTypeToggle } from "./pricing/PlanTypeToggle";
import PricingCard from "./pricing/PricingCard";
import {
	PLAN_TYPES,
	computeAnnualDiscountSummary,
	hasDisplayablePricing,
} from "./pricing/pricingUtils";

const PricingCheckoutDialog = dynamic(
	() => import("./pricing/PricingCheckoutDialog"),
	{
		ssr: false,
		loading: () => (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
				<div className="h-12 w-12 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
			</div>
		),
	},
);

interface PricingProps {
	title: string;
	subtitle: string;
	plans: Plan[];
	callbackUrl?: string;
}

interface CheckoutState {
	clientSecret: string;
	plan: Plan;
	planType: PlanType;
	mode: "payment" | "setup";
	context: "standard" | "trial";
	postTrialAmount?: number;
}

const Pricing: React.FC<PricingProps> = ({
	title,
	subtitle,
	plans,
	callbackUrl,
}) => {
	const [planType, setPlanType] = useState<PlanType>("monthly");
	const [loading, setLoading] = useState<string | null>(null);
	const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(
		null,
	);
	useWaitCursor(Boolean(loading));

	const availableTypes = useMemo(() => {
		const types = PLAN_TYPES.filter((type) =>
			plans.some((plan) => hasDisplayablePricing(plan.price[type])),
		);

		return types.length > 0 ? types : (["monthly"] as PlanType[]);
	}, [plans]);

	useEffect(() => {
		if (!availableTypes.includes(planType)) {
			setPlanType(availableTypes[0]);
		}
	}, [availableTypes, planType]);

	const filteredPlans = useMemo(
		() => plans.filter((plan) => hasDisplayablePricing(plan.price[planType])),
		[plans, planType],
	);

	const annualDiscountSummary = useMemo(
		() => computeAnnualDiscountSummary(plans),
		[plans],
	);

	const handleCheckout = useCallback(
		async (plan: Plan, planCallbackUrl?: string) => {
			const priceDetails = plan.price[planType];

			if (!hasDisplayablePricing(priceDetails)) {
				toast.error(
					"This plan is not available for the selected billing option.",
				);
				return;
			}

			if (!priceDetails) {
				toast.error("Pricing details unavailable. Please try again later.");
				return;
			}

			const { amount } = priceDetails;

			if (typeof amount === "string" && amount.trim().endsWith("%")) {
				toast.error("Percentage-based pricing requires contacting sales.");
				return;
			}

			const resolvedAmount =
				typeof amount === "number" ? amount : Number.parseFloat(amount.trim());

			if (!Number.isFinite(resolvedAmount) || resolvedAmount <= 0) {
				toast.error("Pricing information for this plan is unavailable.");
				return;
			}

			let stripeToast: ReturnType<typeof startStripeToast> | undefined;
			try {
				setLoading(plan.id);
				stripeToast = startStripeToast("Preparing checkout…");

				const metadata: Record<string, string> = {
					planName: plan.name,
					planType,
					planId: plan.id,
				};

				if (plan.pricingCategoryId) {
					metadata.pricingCategoryId = plan.pricingCategoryId;
				}

				const discountCode = priceDetails.discount?.code;
				if (discountCode) {
					metadata.discountCode = discountCode.code;
				}

				const resolvedCallbackUrl = planCallbackUrl ?? callbackUrl;
				if (resolvedCallbackUrl) {
					metadata.callbackUrl = resolvedCallbackUrl;
				}

				const response = await fetch("/api/stripe/intent", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						price: Math.round(resolvedAmount * 100),
						description: `${plan.name} subscription (${planType})`,
						metadata,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.error || "Failed to create payment intent");
				}

				const data = (await response.json()) as { clientSecret?: string };
				if (!data.clientSecret) {
					throw new Error("Unable to initialize checkout. Please try again.");
				}

				setCheckoutState({
					clientSecret: data.clientSecret,
					plan,
					planType,
					mode: "payment",
					context: "standard",
				});
				stripeToast?.success(
					"Checkout ready. Complete your purchase in the payment form.",
				);
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Payment failed. Please try again.";
				stripeToast?.error(message);
			} finally {
				setLoading(null);
			}
		},
		[planType, callbackUrl],
	);

	if (!Array.isArray(plans) || plans.length === 0) {
		return null;
	}

	return (
		<section id="pricing" className="relative px-6 lg:px-8">
			<div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-10" />

			<div className="mx-auto max-w-7xl">
				<div className="mb-12 text-center sm:mb-16">
					<Header title={title} subtitle={subtitle} size="lg" />
					<div className="mt-8 mb-6 flex flex-col items-center sm:mb-8">
						<PlanTypeToggle
							planType={planType}
							availableTypes={availableTypes}
							onChange={setPlanType}
							annualDiscountSummary={annualDiscountSummary}
						/>
					</div>
				</div>

				{filteredPlans.length > 0 ? (
					<div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-3 md:pt-0">
						{filteredPlans.map((plan) => (
							<PricingCard
								key={plan.id}
								plan={plan}
								planType={planType}
								loading={loading}
								onCheckout={handleCheckout}
								callbackUrl={callbackUrl}
							/>
						))}
					</div>
				) : (
					<div className="col-span-full py-12 text-center">
						<p className="mb-4 text-gray-600 text-lg dark:text-gray-400">
							No {planType} plans available at the moment.
						</p>
						<Button variant="outline" onClick={() => setPlanType("monthly")}>
							View Monthly Plans
						</Button>
					</div>
				)}

				{checkoutState ? (
					<PricingCheckoutDialog
						clientSecret={checkoutState.clientSecret}
						plan={checkoutState.plan}
						planType={checkoutState.planType}
						mode={checkoutState.mode}
						context={checkoutState.context}
						onClose={() => setCheckoutState(null)}
					/>
				) : null}

				<div className="my-16 text-center">
					<p className="mb-4 text-black text-lg dark:text-white/80">
						Want early access to Deal Scale? Help shape the future of scalable
						MVPs designed for ambitious founders and agencies!
					</p>
					<Link href="/contact-pilot" className="inline-block">
						<Button
							variant="outline"
							className="border-primary/70 bg-white/90 font-semibold text-primary shadow transition-colors hover:bg-primary hover:text-white dark:border-primary/40 dark:bg-background/80 dark:text-primary dark:hover:bg-primary/80"
						>
							Become a Pilot Tester
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Pricing;
