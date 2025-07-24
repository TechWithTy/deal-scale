// components/checkout/CheckoutForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { mockDiscountCodes } from "@/data/discount/mockDiscountCodes";
import { validateDiscountCode } from "@/utils/discountValidator";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { DiscountCode } from "@/types/discount/discountCode";
import type { Plan } from "@/types/service/plans";
import type { ProductCategory } from "@/types/products";
import type {
	ServiceItemData,
	ServiceCategoryValue,
} from "@/types/service/services";
import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export type PlanType = "monthly" | "annual" | "oneTime";

export interface CheckoutFormProps {
	clientSecret: string;
	onSuccess: () => void;
	plan: Plan;
	service?: ServiceItemData; // * Add service to props for more specific validation
	planType: PlanType;
	productCategories?: ProductCategory[]; // Add product categories for validation
}

export default function CheckoutForm({
	clientSecret,
	onSuccess,
	plan,
	service,
	planType,
	productCategories,
}: CheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [discountCode, setDiscountCode] = useState("");
	const [discountApplied, setDiscountApplied] = useState<DiscountCode | null>(
		null,
	);
	const [validationMessage, setValidationMessage] = useState<string | null>(
		null,
	);
	const [displayPrice, setDisplayPrice] = useState<number | string>(
		plan.price[planType].amount,
	);
	const [checkingDiscount, setCheckingDiscount] = useState(false);
	const hasMounted = useHasMounted();

	// Auto-apply discount code from plan if it exists
	useEffect(() => {
		const planDiscount = plan.price[planType]?.discount;
		if (planDiscount && !discountApplied) {
			setDiscountCode(planDiscount.code.code);
			setDiscountApplied(planDiscount.code);
			setValidationMessage("Discount applied successfully!");
		}
	}, [plan, planType, discountApplied]);

	useEffect(() => {
		const originalAmount = plan.price[planType].amount;

		if (discountApplied && typeof originalAmount === "number") {
			let newPrice = originalAmount;
			if (discountApplied.discountAmount) {
				newPrice = originalAmount - discountApplied.discountAmount;
			} else if (discountApplied.discountPercent) {
				newPrice = originalAmount * (1 - discountApplied.discountPercent / 100);
			}
			setDisplayPrice(Math.max(0, newPrice)); // Ensure price doesn't go below 0
		} else {
			setDisplayPrice(originalAmount);
		}
	}, [discountApplied, plan, planType]);

	if (!hasMounted) return null;

	const handleCheckDiscount = async () => {
		const originalAmount = plan.price[planType].amount;
		if (typeof originalAmount !== "number") {
			setValidationMessage("Discounts cannot be applied to this plan type.");
			return;
		}
		setCheckingDiscount(true);
		setValidationMessage(null);
		await new Promise((r) => setTimeout(r, 400)); // Simulate network delay

		const code = discountCode.trim().toUpperCase();
		const foundCode = mockDiscountCodes.find(
			(dc) => dc.code.toUpperCase() === code,
		);

		if (!foundCode) {
			setDiscountApplied(null);
			setValidationMessage("Discount code not found.");
			setCheckingDiscount(false);
			return;
		}

		const validationResult = validateDiscountCode(foundCode, {
			plan,
			serviceId: service?.id,
			serviceCategoryId: service?.categories[0] as
				| ServiceCategoryValue
				| undefined,
			productId: service ? undefined : plan.id, // Assume plan.id is productId if not a service
			productCategories,
		});

		if (validationResult.isValid) {
			try {
				const response = await fetch("/api/stripe/intent", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						intentId: clientSecret.split("_secret")[0],
						discountCode: foundCode.code,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to apply discount.");
				}

				setDiscountApplied(foundCode);
				setDisplayPrice(data.amount / 100);
				setValidationMessage("Discount applied successfully!");
			} catch (error) {
				setDiscountApplied(null);
				setValidationMessage(
					error instanceof Error
						? error.message
						: "An unexpected error occurred.",
				);
			}
		} else {
			setDiscountApplied(null);
			setValidationMessage(validationResult.errorMessage);
		}

		setCheckingDiscount(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setLoading(true);
		try {
			const returnUrl = new URL(`${window.location.origin}/success`);
			returnUrl.searchParams.append("title", "Payment Successful!");
			returnUrl.searchParams.append(
				"subtitle",
				`Your payment for the ${plan.name} plan has been processed.`,
			);
			returnUrl.searchParams.append("ctaText", "Go to Dashboard");
			returnUrl.searchParams.append("ctaHref", "/dashboard");

			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: returnUrl.toString(),
				},
			});

			if (error) {
				throw error;
			}
			onSuccess();
			toast.success("Payment successful!");
		} catch (err) {
			const error = err as StripeError;
			console.error("Payment error:", error);
			let errorMessage = "An unknown error occurred. Please try again.";

			if (error.type === "card_error" || error.type === "validation_error") {
				switch (error.code) {
					case "card_declined":
						switch (error.decline_code) {
							case "insufficient_funds":
								errorMessage =
									"Your card has insufficient funds. Please use a different card.";
								break;
							case "lost_card":
								errorMessage =
									"This card has been reported as lost. Please use a different card.";
								break;
							case "stolen_card":
								errorMessage =
									"This card has been reported as stolen. Please use a different card.";
								break;
							default:
								errorMessage =
									"Your card was declined. Please check your card details or use a different card.";
								break;
						}
						break;
					case "expired_card":
						errorMessage =
							"Your card has expired. Please use a different card.";
						break;
					case "incorrect_cvc":
						errorMessage = "The CVC is incorrect. Please check and try again.";
						break;
					case "processing_error":
						errorMessage =
							"There was a processing error. Please try again in a few moments.";
						break;
					case "incorrect_number":
						errorMessage =
							"The card number is incorrect. Please check the number and try again.";
						break;
					default:
						errorMessage =
							error.message ||
							"An error occurred during payment. Please try again.";
						break;
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			const failureUrl = new URL(`${window.location.origin}/failed`);
			failureUrl.searchParams.append("title", "Payment Failed");
			failureUrl.searchParams.append("subtitle", errorMessage);
			failureUrl.searchParams.append("ctaText", "Try Again");
			failureUrl.searchParams.append("ctaHref", window.location.pathname);

			window.location.href = failureUrl.toString();
		} finally {
			setLoading(false);
		}
	};

	const calculateDepositAmount = (plan: Plan, type: PlanType): number => {
		const price = plan.price[type].amount;

		// Handle percentage-based pricing
		if (typeof price === "string" && price.endsWith("%")) {
			throw new Error("Percentage-based pricing requires contacting sales");
		}

		const numericPrice = Number(price);
		if (Number.isNaN(numericPrice)) {
			throw new Error("Invalid price amount");
		}

		if (type === "oneTime") {
			return numericPrice;
		}
		return numericPrice / 2; // 50% deposit for subscriptions
	};

	const formatPrice = (price: number | string): string => {
		if (typeof price === "string" && price.endsWith("%")) {
			return price; // Return percentage as is
		}

		const numericPrice = Number(price);
		if (Number.isNaN(numericPrice)) {
			return "Price not available";
		}

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(numericPrice);
	};

	let depositAmount: number | null = null;
	let depositError: string | null = null;

	try {
		depositAmount = calculateDepositAmount(plan, planType);
	} catch (error) {
		depositError =
			error instanceof Error ? error.message : "Failed to calculate deposit";
	}

	const discountedAmount =
		depositAmount !== null && discountApplied
			? Number(displayPrice) / 2
			: depositAmount;

	return (
		<Dialog open={!!clientSecret} onOpenChange={onSuccess}>
			<DialogContent className="max-h-[90vh] w-full max-w-md overflow-y-auto p-6 text-center">
				<DialogHeader className="flex flex-col items-center">
					<DialogTitle className="font-semibold text-xl">
						Complete Your Purchase
					</DialogTitle>
					<DialogDescription className="text-gray-400 text-sm">
						{planType === "oneTime" ? (
							"Full payment"
						) : (
							<>
								<span className="font-semibold text-primary">
									Secure your Pilot place:
								</span>
								<br />
								<span className="text-accent text-xs">
									1 Free Off-Market Credit
									<br />
									Unlimited Free Skip Tracing
									<br />
									Price Locked In For 5 Years
								</span>
							</>
						)}
						<br />
						<span className="text-gray-400 text-xs">
							Powered by Stripe & Klarna
						</span>
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					<div className="rounded-xl border border-accent/30 bg-gradient-to-br from-background-dark to-background-dark/80 p-6 shadow-lg">
						<h3 className="mb-3 font-bold text-primary text-xl">{plan.name}</h3>
						<p className="mb-4 text-accent text-sm">
							{plan.price[planType].description}
						</p>
						<ul className="space-y-2 text-accent text-sm">
							{plan.price[planType].features.map((feature) => (
								<li key={uuidv4()} className="flex items-center">
									<span className="mr-2 text-accent">✓</span>
									{typeof feature === "string" ? feature : feature}
								</li>
							))}
						</ul>
					</div>

					{/* Discount code input */}
					<div className="space-y-2">
						<label
							htmlFor="discount"
							className="block font-semibold text-black dark:text-zinc-100"
						>
							Discount Code
						</label>
						<div className="flex gap-2">
							<input
								id="discount"
								type="text"
								placeholder="Enter code (if any)"
								value={discountCode}
								onChange={(e) => setDiscountCode(e.target.value)}
								className="flex-1 rounded border border-zinc-200 bg-white px-3 py-2 text-black transition-colors placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500 dark:placeholder:text-zinc-500"
								disabled={!!discountApplied}
								autoComplete="off"
							/>
							<button
								type="button"
								className="rounded bg-focus px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/80 dark:bg-blue-700 dark:hover:bg-blue-600"
								onClick={handleCheckDiscount}
								disabled={
									checkingDiscount || !!discountApplied || !discountCode
								}
							>
								{discountApplied
									? "Applied"
									: checkingDiscount
										? "Checking..."
										: "Apply"}
							</button>
						</div>
						{validationMessage && (
							<p className="mt-1 text-red-600 text-xs dark:text-red-400">
								{validationMessage}
							</p>
						)}
						{discountApplied && (
							<div className="mt-1 flex items-center gap-2 text-green-600 text-xs dark:text-green-400">
								<span>
									Discount <b>{discountApplied.code}</b> applied!
								</span>
								{discountApplied.discountPercent && (
									<span>({discountApplied.discountPercent}% off)</span>
								)}
								{discountApplied.discountAmount && (
									<span>
										({formatPrice(discountApplied.discountAmount)} off)
									</span>
								)}
							</div>
						)}
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<PaymentElement />
						<p className="mt-3 text-center text-tertiary">
							Click a payment method to continue.
						</p>
						<Button
							type="submit"
							disabled={!stripe || loading}
							className="mt-4 w-full py-2"
						>
							{loading
								? "Processing..."
								: `Pay ${planType === "oneTime" ? "Full Amount" : "Deposit"}`}
						</Button>
					</form>
				</div>

				<DialogFooter className="mt-6">
					<div className="w-full text-center">
						<p className="bg-gradient-to-r from-primary to-focus bg-clip-text font-semibold text-sm text-transparent">
							{planType === "oneTime" ? "Total Price" : "Full Price"}:{" "}
							{formatPrice(displayPrice)}
						</p>

						{depositError && (
							<p className="mt-1 text-red-600 text-xs dark:text-red-400">
								{depositError}
							</p>
						)}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
