"use client";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import { startStripeToast } from "@/lib/ui/stripeToast";
// External imports
import { useEffect, useState } from "react";

// Internal imports
import { Button } from "@/components/ui/button";
import { useProductSelection } from "@/contexts/ProductSelectionContext";
import { mockDiscountCodes } from "@/data/discount/mockDiscountCodes";
import { calculateShippingCost, getShippingInfo } from "@/data/shipping";
import { cn } from "@/lib/utils";
import type { DiscountCode } from "@/types/discount/discountCode";
import type { ProductType } from "@/types/products";
import { type ShippingOption, TAX_RATE } from "@/types/products/shipping";
import toast from "react-hot-toast";
import { useWaitCursor } from "@/hooks/useWaitCursor";

import { CheckoutFooter } from "./CheckoutFooter";
// Local component imports
import { CheckoutHeader } from "./CheckoutHeader";
import { DiscountCodeInput } from "./DiscountCodeInput";
import { OrderSummary } from "./OrderSummary";
import { PaymentSection } from "./PaymentSection";
import { ShippingMethodSelector } from "./ShippingMethodSelector";

interface ProductCheckoutFormProps {
	product: ProductType;
	onClose: () => void;
	clientSecret: string;
	prefilledDiscountCode?: string;
	prefilledDiscount?: DiscountCode;
}

export function ProductCheckoutForm({
	product,
	onClose,
	clientSecret,
	prefilledDiscountCode,
	prefilledDiscount,
}: ProductCheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const router = useNavigationRouter();
	const { selection } = useProductSelection();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
	const [selectedShipping, setSelectedShipping] =
		useState<ShippingOption | null>(null);
	const [discountCode, setDiscountCode] = useState("");
	const [discountApplied, setDiscountApplied] = useState<DiscountCode | null>(
		null,
	);
	const [discountError, setDiscountError] = useState<string | null>(null);
	const [checkingDiscount, setCheckingDiscount] = useState(false);
	useWaitCursor(isLoading || checkingDiscount);

	// Load shipping options for the current product
	useEffect(() => {
		const productShipping = getShippingInfo(product.id);
		if (productShipping) {
			setShippingOptions(productShipping.availableOptions);
			// Set default shipping option
			const defaultOption = productShipping.availableOptions.find(
				(option) => option.id === productShipping.defaultOptionId,
			);
			if (defaultOption) {
				setSelectedShipping(defaultOption);
			} else if (productShipping.availableOptions.length > 0) {
				setSelectedShipping(productShipping.availableOptions[0]);
			}
		}
	}, [product.id]);

	// Calculate order summary
	// Prefill or reset discount code when the modal opens with a provided coupon
	useEffect(() => {
		if (!prefilledDiscountCode) {
			setDiscountCode("");
			setDiscountApplied(null);
			setDiscountError(null);
			return;
		}

		const normalized = prefilledDiscountCode.trim().toUpperCase();
		setDiscountCode(normalized);

		const prefilled =
			prefilledDiscount ??
			mockDiscountCodes.find((dc) => dc.code.toUpperCase() === normalized);

		if (prefilled) {
			setDiscountApplied(prefilled);
			setDiscountError(null);
		} else {
			setDiscountApplied(null);
		}
	}, [prefilledDiscountCode]);
	const selectedType = product.types?.find((t) => t?.value === selection?.type);
	const itemPrice = selectedType?.price ?? product.price ?? 0;
	const quantity = selection.quantity ?? 1;
	const subtotal = itemPrice * quantity;
	// Calculate shipping cost based on selected option and quantity
	const shippingAmount = selectedShipping
		? calculateShippingCost(
				product.id,
				selectedShipping.id,
				selection.quantity ?? 1,
			)
		: 0;
	const tax = (subtotal + shippingAmount) * TAX_RATE;

	const getDiscountedTotal = (base: number): number => {
		if (!discountApplied) return base;
		if (discountApplied.discountPercent)
			return Math.max(0, base * (1 - discountApplied.discountPercent / 100));
		if (discountApplied.discountAmount)
			return Math.max(0, base - discountApplied.discountAmount / 100);
		return base;
	};

	const total = subtotal + shippingAmount + tax;
	const discountedTotal = getDiscountedTotal(total);

	const handleCheckDiscount = async () => {
		setCheckingDiscount(true);
		setDiscountError(null);
		await new Promise((r) => setTimeout(r, 400));
		const code = discountCode.trim().toUpperCase();
		const found = mockDiscountCodes.find(
			(dc) => dc.code.toUpperCase() === code,
		);

		if (!found) {
			setDiscountApplied(null);
			setDiscountError("Discount code not found.");
			setCheckingDiscount(false);
			return;
		}
		if (!found.isActive) {
			setDiscountApplied(null);
			setDiscountError("This discount code is no longer active.");
			setCheckingDiscount(false);
			return;
		}
		if (found.expires && new Date(found.expires) < new Date()) {
			setDiscountApplied(null);
			setDiscountError("This discount code has expired.");
			setCheckingDiscount(false);
			return;
		}
		setDiscountApplied(found);
		setDiscountError(null);
		setCheckingDiscount(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			setError("Payment system is still loading. Please wait a moment and try again.");
			return;
		}

		setIsLoading(true);
		setError(null);
		const stripeToast = startStripeToast("Processing payment…");

		try {
			const { error: stripeError } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/success`,
					receipt_email: "customer@example.com", // TODO: Replace with actual email from form
				},
				redirect: "if_required",
			});

			if (stripeError) {
				throw stripeError;
			}

			// If we get here, payment was successful
			onClose();
			const successUrl = new URL(`${window.location.origin}/success`);
			successUrl.searchParams.append("title", "Purchase Complete!");
			successUrl.searchParams.append(
				"subtitle",
				`Your order for ${product.name} has been processed.`,
			);
			successUrl.searchParams.append("ctaText", "View My Orders");
			successUrl.searchParams.append("ctaHref", "/orders");
			stripeToast.success("Payment successful!");
			router.push(successUrl.toString());
		} catch (err) {
			console.error("Payment error:", err);
			let errorMessage = "An unknown error occurred. Please try again.";
			const error = err as StripeError;

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
			} else if (err instanceof Error) {
				// Don't expose raw error messages - use generic fallback
				errorMessage = "An error occurred during payment. Please try again.";
			}

			const failureUrl = new URL(`${window.location.origin}/failed`);
			failureUrl.searchParams.append("title", "Purchase Failed");
			failureUrl.searchParams.append("subtitle", errorMessage);
			failureUrl.searchParams.append("ctaText", "Back to Products");
			failureUrl.searchParams.append("ctaHref", "/products");
			stripeToast.error(errorMessage);
			router.push(failureUrl.toString());
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
			<div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl">
				<CheckoutHeader onClose={onClose} />

				<div className="flex-1 gap-8 overflow-y-auto p-6 md:flex">
					{/* Left side - Payment form */}
					<div className="md:w-2/3">
						<h3 className="mb-4 font-semibold text-lg">Payment Information</h3>

						<DiscountCodeInput
							discountCode={discountCode}
							setDiscountCode={setDiscountCode}
							discountApplied={discountApplied}
							discountError={discountError}
							checkingDiscount={checkingDiscount}
							onCheckDiscount={handleCheckDiscount}
						/>

						<form
							id="payment-form"
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<PaymentSection error={error} setError={setError} />

							{shippingOptions.length > 0 && (
								<ShippingMethodSelector
									selectedShipping={selectedShipping}
									onSelectShipping={setSelectedShipping}
									shippingOptions={shippingOptions}
								/>
							)}
						</form>
					</div>

					{/* Right side - Order summary */}
					<div className="mt-8 md:mt-0 md:w-1/3 md:border-border md:border-l md:pl-8">
						<OrderSummary
							product={product}
							selection={{
								type: selection?.type,
								color: selection?.color,
								size: selection?.size,
								quantity: selection?.quantity ?? 1,
							}}
							subtotal={subtotal}
							shipping={shippingAmount}
							tax={tax}
							total={total}
							discountedTotal={discountedTotal}
							discountApplied={discountApplied}
							isLoading={isLoading}
							error={error}
							onPay={handleSubmit}
						/>

						<CheckoutFooter
							isLoading={isLoading}
							total={discountedTotal}
							error={error}
							onPay={handleSubmit}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
