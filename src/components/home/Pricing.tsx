"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { Plan, PlanType } from "@/types/service/plans";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import CheckoutForm from "../checkout/CheckoutForm";
import Header from "../common/Header";
import { SectionHeading } from "../ui/section-heading";
import PricingCard from "./pricing/PricingCard";

const stripePromise = (() => {
	const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
	if (!key || !key.startsWith("pk_")) {
		throw new Error("Invalid Stripe publishable key");
	}
	return loadStripe(key);
})();

interface PricingProps {
	title: string;
	subtitle: string;
	plans: Plan[];
	callbackUrl?: string;
}

const Pricing: React.FC<PricingProps> = ({
	title,
	subtitle,
	plans,
	callbackUrl,
}) => {
	const hasMounted = useHasMounted();
	const [planType, setPlanType] = useState<PlanType>("monthly");
	const [loading, setLoading] = useState<string | null>(null);
	const [checkoutState, setCheckoutState] = useState<{
		clientSecret: string;
		plan: Plan;
	} | null>(null);

	if (!Array.isArray(plans)) {
		return null;
	}

	const filteredPlans = plans.filter((plan) => {
		const price = plan.price[planType];
		if (!price) return false;
		const amount = price.amount;
		if (typeof amount === "string" && amount.includes("%")) {
			return true;
		}
		const numericAmount = typeof amount === "number" ? amount : Number(amount);
		if (!Number.isNaN(numericAmount) && numericAmount > 0) {
			return true;
		}
		return false;
	});

	const handleCheckout = async (plan: Plan, callbackUrl?: string) => {
		try {
			setLoading(plan.id);
			if (!stripePromise) throw new Error("Stripe not initialized");

			const price = plan.price[planType].amount;
			if (typeof price === "string" && price.endsWith("%")) {
				throw new Error("Percentage-based pricing requires contacting sales");
			}

			// Get the discount code if it exists for this plan and planType
			const discountCode = plan.price[planType]?.discount?.code;
			const priceInCents = Math.round(Number(price) * 100);

			// Prepare metadata including the discount code if it exists
			const metadata: Record<string, string> = {
				planName: plan.name,
				planType,
				pricingCategoryId: plan.pricingCategoryId,
				planId: plan.id,
			};

			// Add discount code to metadata if it exists
			if (discountCode) {
				metadata.discountCode = discountCode.code;
			}

			// Add callback URL if provided
			if (callbackUrl) {
				metadata.callbackUrl = callbackUrl;
			}

			const response = await fetch("/api/stripe/intent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					price: priceInCents,
					description: `${plan.name} subscription (${planType})`,
					metadata,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Failed to create payment intent");
			}

			const data = await response.json();
			if (!data.clientSecret) {
				throw new Error("No client secret returned from Stripe API");
			}

			setCheckoutState({ clientSecret: data.clientSecret, plan });
			setLoading(null);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Payment failed";
			toast.error(errorMessage);
			setLoading(null);
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(price);
	};

	return (
		<section id="pricing" className="relative px-6 lg:px-8">
			<div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-10" />

			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<Header title={title} subtitle={subtitle} size="lg" />
					<div className="mt-8 flex flex-col items-center">
						<div className="flex flex-wrap items-center justify-center gap-2 pt-4">
							{(["monthly", "annual", "oneTime"] as PlanType[]).map((type) => {
								const hasPlansForType = plans.some((plan) => {
									const price = plan.price[type];
									if (!price) return false;
									return (
										price &&
										(price.features.length > 0 ||
											(type === "oneTime"
												? (() => {
														const amt =
															typeof price.amount === "number"
																? price.amount
																: Number(price.amount);
														return !Number.isNaN(amt) && amt > 0;
													})()
												: true))
									);
								});

								if (!hasPlansForType) return null;

								interface DiscountCode {
									discountPercent?: number;
									discountAmount?: number;
								}

								const discountElement = (() => {
									if (type !== "annual") return null;

									const discounts = plans
										.map((plan) => plan.price.annual?.discount?.code)
										.filter((code): code is NonNullable<typeof code> => !!code) as DiscountCode[];

									let maxPercent = 0;
									let maxAmount = 0;

									for (const code of discounts) {
										if (code.discountPercent && code.discountPercent > maxPercent) {
											maxPercent = code.discountPercent;
										}
										if (code.discountAmount && code.discountAmount > maxAmount) {
											maxAmount = code.discountAmount;
										}
									}

									if (maxPercent > 0) {
										return (
											<span className="-translate-x-1/2 -top-7 absolute left-1/2 animate-pulse whitespace-nowrap rounded border border-green-300 bg-green-100 px-2 py-1 font-bold text-green-700 text-xs">
												Save {maxPercent}%
											</span>
										);
									}
									if (maxAmount > 0) {
										return (
											<span className="-top-5 -translate-x-1/2 absolute left-1/2 animate-pulse whitespace-nowrap rounded border border-blue-300 bg-blue-100 px-2 py-0.5 font-bold text-blue-700 text-xs">
												Save ${maxAmount.toLocaleString()}
											</span>
										);
									}
									return null;
								})();

								return (
									<div key={type} className="relative">
										{discountElement}
										<button
											type="button"
											className={`rounded-lg px-4 py-2 transition-all ${
												planType === type
													? "bg-gradient-to-r from-primary/20 to-focus/20 text-black dark:text-white"
													: "text-black hover:text-black dark:text-white dark:text-white/60"
											}`}
											onClick={() => setPlanType(type)}
										>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</button>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{filteredPlans.length > 0 ? (
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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

				{checkoutState && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
						<div className="mx-auto w-full max-w-md rounded-lg bg-background-dark p-8">
							<Elements
								stripe={stripePromise}
								options={{
									clientSecret: checkoutState.clientSecret,
									appearance: {
										theme: "night",
										variables: {
											colorPrimary: "#6366f1",
										},
									},
								}}
							>
								<CheckoutForm
									clientSecret={checkoutState.clientSecret}
									onSuccess={() => setCheckoutState(null)}
									plan={checkoutState.plan}
									planType={planType}
								/>
							</Elements>
						</div>
					</div>
				)}

				<div className="my-16 text-center">
					<p className="mb-4 text-black text-lg dark:text-white/80">
						Want early access to Deal Scale? Help shape the future of scalable
						MVPs designed for ambitious founders and agencies!{" "}
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
