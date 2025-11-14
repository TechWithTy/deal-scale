// "use client";
// import {
// 	PaymentElement,
// 	useElements,
// 	useStripe,
// } from "@stripe/react-stripe-js";
// import type { StripeError } from "@stripe/stripe-js";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import { Button } from "@/components/ui/button";
// import { useProductSelection } from "@/contexts/ProductSelectionContext";
// import { mockDiscountCodes } from "@/data/discount/mockDiscountCodes";
// import { cn } from "@/lib/utils";
// import type { DiscountCode } from "@/types/discount/discountCode";
// import type { ProductType } from "@/types/products";
// import { Loader2, X } from "lucide-react";

// interface ShippingOption {
// 	id: string;
// 	name: string;
// 	price: number;
// 	estimatedDays: string;
// }

// interface ProductCheckoutFormProps {
// 	product: ProductType;
// 	onClose: () => void;
// 	clientSecret: string;
// }

// export function ProductCheckoutForm({
// 	product,
// 	onClose,
// 	clientSecret,
// }: ProductCheckoutFormProps) {
// 	const stripe = useStripe();
// 	const elements = useElements();
// 	const router = useRouter();
// 	const { selection } = useProductSelection();

// 	const [isLoading, setIsLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const [selectedShipping, setSelectedShipping] =
// 		useState<ShippingOption | null>(null);
// 	const [discountCode, setDiscountCode] = useState("");
// 	const [discountApplied, setDiscountApplied] = useState<DiscountCode | null>(
// 		null,
// 	);
// 	const [discountError, setDiscountError] = useState<string | null>(null);
// 	const [checkingDiscount, setCheckingDiscount] = useState(false);

// 	// Shipping options - could be fetched from an API
// 	const shippingOptions: ShippingOption[] = [
// 		{
// 			id: "standard",
// 			name: "Standard Shipping",
// 			price: 4.99,
// 			estimatedDays: "3-5 business days",
// 		},
// 		{
// 			id: "express",
// 			name: "Express Shipping",
// 			price: 9.99,
// 			estimatedDays: "1-2 business days",
// 		},
// 		{
// 			id: "overnight",
// 			name: "Overnight",
// 			price: 19.99,
// 			estimatedDays: "Next business day",
// 		},
// 	];

// 	// Set default shipping option
// 	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
// 	useEffect(() => {
// 		if (shippingOptions.length > 0 && !selectedShipping) {
// 			setSelectedShipping(shippingOptions[0]);
// 		}
// 	}, []);

// 	// Calculate order summary
// 	const selectedType = product.types?.find((t) => t?.value === selection?.type);
// 	const itemPrice = selectedType?.price ?? product.price ?? 0;
// 	const quantity = selection.quantity ?? 1;
// 	const subtotal = itemPrice * quantity;
// 	const shipping = selectedShipping?.price ?? 0;
// 	const tax = (subtotal + shipping) * 0.08; // Example 8% tax
// 	const getDiscountedTotal = (base: number): number => {
// 		if (!discountApplied) return base;
// 		if (discountApplied.discountPercent)
// 			return Math.max(0, base * (1 - discountApplied.discountPercent / 100));
// 		if (discountApplied.discountAmount)
// 			return Math.max(0, base - discountApplied.discountAmount / 100); // discountAmount is in cents
// 		return base;
// 	};
// 	const total = subtotal + shipping + tax;
// 	const discountedTotal = getDiscountedTotal(total);

// 	const handleCheckDiscount = async () => {
// 		setCheckingDiscount(true);
// 		setDiscountError(null);
// 		await new Promise((r) => setTimeout(r, 400));
// 		const code = discountCode.trim().toUpperCase();
// 		const found = mockDiscountCodes.find(
// 			(dc) => dc.code.toUpperCase() === code,
// 		);
// 		if (!found) {
// 			setDiscountApplied(null);
// 			setDiscountError("Discount code not found.");
// 			setCheckingDiscount(false);
// 			return;
// 		}
// 		if (!found.isActive) {
// 			setDiscountApplied(null);
// 			setDiscountError("This discount code is no longer active.");
// 			setCheckingDiscount(false);
// 			return;
// 		}
// 		if (found.expires && new Date(found.expires) < new Date()) {
// 			setDiscountApplied(null);
// 			setDiscountError("This discount code has expired.");
// 			setCheckingDiscount(false);
// 			return;
// 		}
// 		setDiscountApplied(found);
// 		setDiscountError(null);
// 		setCheckingDiscount(false);
// 	};

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();

// 		if (!stripe || !elements) {
// 			setError("Stripe hasn't loaded yet. Please try again.");
// 			return;
// 		}

// 		setIsLoading(true);
// 		setError(null);

// 		try {
// 			const { error: stripeError } = await stripe.confirmPayment({
// 				elements,
// 				confirmParams: {
// 					return_url: `${window.location.origin}/success`,
// 					receipt_email: "customer@example.com", // TODO: Replace with actual email from form
// 				},
// 				redirect: "if_required",
// 			});

// 			if (stripeError) {
// 				throw stripeError;
// 			}

// 			// If we get here, payment was successful
// 			onClose();
// 			const successUrl = new URL(`${window.location.origin}/success`);
// 			successUrl.searchParams.append("title", "Purchase Complete!");
// 			successUrl.searchParams.append(
// 				"subtitle",
// 				`Your order for ${product.name} has been processed.`,
// 			);
// 			successUrl.searchParams.append("ctaText", "View My Orders");
// 			successUrl.searchParams.append("ctaHref", "/orders");
// 			router.push(successUrl.toString());
// 		} catch (err) {
// 			console.error("Payment error:", err);
// 			let errorMessage = "An unknown error occurred. Please try again.";
// 			const error = err as StripeError;

// 			if (error.type === "card_error" || error.type === "validation_error") {
// 				switch (error.code) {
// 					case "card_declined":
// 						switch (error.decline_code) {
// 							case "insufficient_funds":
// 								errorMessage =
// 									"Your card has insufficient funds. Please use a different card.";
// 								break;
// 							case "lost_card":
// 								errorMessage =
// 									"This card has been reported as lost. Please use a different card.";
// 								break;
// 							case "stolen_card":
// 								errorMessage =
// 									"This card has been reported as stolen. Please use a different card.";
// 								break;
// 							default:
// 								errorMessage =
// 									"Your card was declined. Please check your card details or use a different card.";
// 								break;
// 						}
// 						break;
// 					case "expired_card":
// 						errorMessage =
// 							"Your card has expired. Please use a different card.";
// 						break;
// 					case "incorrect_cvc":
// 						errorMessage = "The CVC is incorrect. Please check and try again.";
// 						break;
// 					case "processing_error":
// 						errorMessage =
// 							"There was a processing error. Please try again in a few moments.";
// 						break;
// 					case "incorrect_number":
// 						errorMessage =
// 							"The card number is incorrect. Please check the number and try again.";
// 						break;
// 					default:
// 						errorMessage =
// 							error.message ||
// 							"An error occurred during payment. Please try again.";
// 						break;
// 				}
// 			} else if (err instanceof Error) {
// 				errorMessage = err.message;
// 			}

// 			const failureUrl = new URL(`${window.location.origin}/failed`);
// 			failureUrl.searchParams.append("title", "Purchase Failed");
// 			failureUrl.searchParams.append("subtitle", errorMessage);
// 			failureUrl.searchParams.append("ctaText", "Back to Products");
// 			failureUrl.searchParams.append("ctaHref", "/products");
// 			router.push(failureUrl.toString());
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	};
// 	return (
// 		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
// 			<div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl">
// 				{/* Header */}
// 				<div className="sticky top-0 z-10 flex items-center justify-between border-border border-b bg-background p-6">
// 					<h2 className="font-bold text-2xl">Complete Your Order</h2>
// 					<button
// 						type="button"
// 						onClick={onClose}
// 						className="rounded-full p-2 transition-colors hover:bg-accent"
// 						aria-label="Close"
// 					>
// 						<X className="h-5 w-5" />
// 					</button>
// 				</div>

// 				<div className="flex-1 gap-8 overflow-y-auto p-6 md:flex">
// 					{/* Left side - Payment form */}
// 					<div className="md:w-2/3">
// 						<h3 className="mb-4 font-semibold text-lg">Payment Information</h3>
// 						{/* Discount code input */}
// 						<div className="space-y-2 pb-2">
// 							<label
// 								htmlFor="discount"
// 								className="block font-semibold text-black dark:text-zinc-100"
// 							>
// 								Discount Code
// 							</label>
// 							<div className="flex gap-2">
// 								<input
// 									id="discount"
// 									type="text"
// 									placeholder="Enter code (if any)"
// 									value={discountCode}
// 									onChange={(e) => setDiscountCode(e.target.value)}
// 									className="flex-1 rounded border border-zinc-200 bg-white px-3 py-2 text-black transition-colors placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500 dark:placeholder:text-zinc-500"
// 									disabled={!!discountApplied}
// 									autoComplete="off"
// 								/>
// 								<button
// 									type="button"
// 									className="rounded bg-focus px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/80 dark:bg-blue-700 dark:hover:bg-blue-600"
// 									onClick={handleCheckDiscount}
// 									disabled={
// 										checkingDiscount || !!discountApplied || !discountCode
// 									}
// 								>
// 									{discountApplied
// 										? "Applied"
// 										: checkingDiscount
// 											? "Checking..."
// 											: "Apply"}
// 								</button>
// 							</div>
// 							{discountError && (
// 								<p className="mt-1 text-red-600 text-xs dark:text-red-400">
// 									{discountError}
// 								</p>
// 							)}
// 							{discountApplied && (
// 								<div className="mt-1 flex items-center gap-2 text-green-600 text-xs dark:text-green-400">
// 									<span>
// 										Discount <b>{discountApplied.code}</b> applied!
// 									</span>
// 									{discountApplied.discountPercent && (
// 										<span>({discountApplied.discountPercent}% off)</span>
// 									)}
// 									{discountApplied.discountAmount && (
// 										<span>
// 											(${(discountApplied.discountAmount / 100).toFixed(2)} off)
// 										</span>
// 									)}
// 								</div>
// 							)}
// 						</div>

// 						<form
// 							id="payment-form"
// 							onSubmit={handleSubmit}
// 							className="space-y-6"
// 						>
// 							<div className="space-y-4">
// 								<PaymentElement
// 									options={{
// 										layout: "tabs",
// 										fields: {
// 											billingDetails: {
// 												address: {
// 													country: "auto",
// 													postalCode: "auto",
// 												},
// 											},
// 										},
// 									}}
// 								/>
// 							</div>

// 							<div className="pt-4">
// 								<h3 className="mb-4 font-semibold text-lg">Shipping Method</h3>
// 								<div className="space-y-3">
// 									{shippingOptions.map((option) => (
// 										<button
// 											key={option.id}
// 											onClick={() => setSelectedShipping(option)}
// 											type="button"
// 											className={cn(
// 												"cursor-pointer rounded-lg border p-4 transition-colors",
// 												selectedShipping?.id === option.id
// 													? "border-primary bg-primary/5"
// 													: "border-border hover:border-primary/50",
// 											)}
// 										>
// 											<div className="flex items-center justify-between">
// 												<div>
// 													<div className="font-medium">{option.name}</div>
// 													<div className="text-muted-foreground text-sm">
// 														{option.estimatedDays}
// 													</div>
// 												</div>
// 												<div className="font-medium">
// 													${option.price.toFixed(2)}
// 												</div>
// 											</div>
// 										</button>
// 									))}
// 								</div>
// 							</div>
// 						</form>
// 					</div>

// 					{/* Right side - Order summary */}
// 					<div className="mt-8 md:mt-0 md:w-1/3 md:border-border md:border-l md:pl-8">
// 						<h3 className="mb-4 font-semibold text-lg">Order Summary</h3>

// 						{/* Product info */}
// 						<div className="flex items-start space-x-4 border-border border-b py-4">
// 							<div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
// 								{product.images?.[0] && (
// 									<img
// 										src={product.images[0]} // Directly use the string URL
// 										alt={product.name}
// 										className="h-full w-full object-cover"
// 									/>
// 								)}
// 							</div>
// 							<div className="flex-1">
// 								<h4 className="font-medium">{product.name}</h4>
// 								{(selection?.type || selection?.color || selection?.size) && (
// 									<p className="text-muted-foreground text-sm">
// 										{selection?.type}
// 										{selection?.color && ` • ${selection.color}`}
// 										{selection?.size && ` • ${selection.size}`}
// 									</p>
// 								)}
// 								<p className="text-sm">Qty: {quantity}</p>
// 							</div>
// 							<p className="font-medium">${itemPrice.toFixed(2)}</p>
// 						</div>

// 						{/* Order total */}
// 						<div className="mt-6 space-y-3">
// 							<div className="flex justify-between">
// 								<span className="text-muted-foreground">Subtotal</span>
// 								<span>${subtotal.toFixed(2)}</span>
// 							</div>
// 							<div className="flex justify-between">
// 								<span className="text-muted-foreground">Shipping</span>
// 								<span>
// 									{shipping ? `$${shipping.toFixed(2)}` : "Calculated"}
// 								</span>
// 							</div>
// 							<div className="flex justify-between">
// 								<span className="text-muted-foreground">Tax</span>
// 								<span>${tax.toFixed(2)}</span>
// 							</div>
// 							<div className="mt-4 flex justify-between border-border border-t pt-4 font-semibold text-lg">
// 								<span>Total</span>
// 								{discountApplied ? (
// 									<>
// 										<span className="mr-2 text-gray-400 line-through dark:text-zinc-500">
// 											${total.toFixed(2)}
// 										</span>
// 										<span className="font-bold text-green-600 dark:text-green-400">
// 											${discountedTotal.toFixed(2)}
// 										</span>
// 									</>
// 								) : (
// 									<span>${total.toFixed(2)}</span>
// 								)}
// 							</div>
// 						</div>

// 						{/* Submit button */}
// 						<div className="mt-8">
// 							<Button
// 								type="submit"
// 								form="payment-form"
// 								disabled={!stripe || isLoading}
// 								className="mt-6 w-full"
// 							>
// 								{isLoading ? (
// 									<>
// 										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
// 										Processing...
// 									</>
// 								) : (
// 									`Pay $${total.toFixed(2)}`
// 								)}
// 							</Button>
// 							{error && (
// 								<div className="mt-4 text-center text-destructive text-sm">
// 									{error}
// 								</div>
// 							)}

// 							<p className="mt-4 text-center text-muted-foreground text-xs">
// 								Your payment is secure and encrypted. By completing your
// 								purchase, you agree to our{" "}
// 								<a href="/terms" className="text-primary hover:underline">
// 									Terms of Service
// 								</a>{" "}
// 								and{" "}
// 								<a href="/privacy" className="text-primary hover:underline">
// 									Privacy Policy
// 								</a>
// 								.
// 							</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
