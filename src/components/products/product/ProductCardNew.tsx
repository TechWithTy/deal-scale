"use client";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import {
	ProductCard as Card,
	type ProductCardProps as CardProps,
	CheckoutDialog,
	ProductHeader,
	ProductImage,
	ProductMetadata,
	ProductSummary,
} from "./card";
import { useWaitCursor } from "@/hooks/useWaitCursor";
import { startStripeToast } from "@/lib/ui/stripeToast";

// Re-export types for convenience
export type { CardProps as ProductCardProps };

/**
 * ProductCardNew - An improved version of ProductCard using modular subcomponents
 * @param props - Product card properties
 */
const ProductCardNew = (props: CardProps) => {
	const {
		name,
		description,
		price,
		images = [],
		salesIncentive,
		className,
		slug,
		sku,
		reviews = [],
		categories = [],
		callbackUrl,
		abTest,
	} = props;

	const shouldReduceMotion = useReducedMotion();
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

	const addToCart = useCartStore((state) => state.addItem);
	useWaitCursor(isCheckoutLoading);

	const handleAddToCart = useCallback(() => {
		const {
			name,
			price,
			images = [],
			description = "",
			slug = "",
			sku,
			categories = [],
		} = props;

		// Create a cart item with all required properties
		const cartItem = {
			id: sku || Date.now().toString(), // Use SKU as ID or fallback to timestamp
			name,
			description,
			price,
			sku: sku || "",
			slug,
			images,
			reviews: [],
			types: [],
			colors: [],
			sizes: [],
			categories,
		};

		addToCart(cartItem, 1); // Pass quantity as second argument
		toast.success(`${name} added to cart`);
	}, [addToCart, props]);

	const handleInitiateCheckout = async () => {
		if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
			toast.error("Stripe is not configured. Cannot proceed to checkout.");
			return;
		}

		setIsCheckoutLoading(true);
		const stripeToast = startStripeToast("Contacting Stripe…");
		try {
			const response = await fetch("/api/stripe/intent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					price: Math.round(price * 100),
					...(callbackUrl && { callbackUrl }),
					description,
					metadata: {
						sku,
						name,
						productCategory: categories?.join(","),
					},
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({
					message: "Failed to create payment intent",
				}));
				throw new Error(errorData.message || "Failed to create payment intent");
			}

			const { clientSecret } = await response.json();
			if (!clientSecret)
				throw new Error("Client secret not received from server.");
			setClientSecret(clientSecret);
			stripeToast.success(
				"Checkout ready. Review the Stripe modal to finish your purchase.",
			);
		} catch (error) {
			console.error("Checkout initiation failed:", error);
			stripeToast.error(
				error instanceof Error
					? error.message
					: "Stripe checkout failed to initialize. Please try again.",
			);
		} finally {
			setIsCheckoutLoading(false);
		}
	};

	const imageUrl = images?.[0] || "/placeholder-product.png";
	const productSlug = slug ?? sku;

	return (
		<motion.div
			layout
			className={cn(
				"relative flex h-full flex-col rounded-xl border border-slate-200 bg-gradient-to-b from-white via-white to-slate-50 p-6 text-slate-900 shadow-md transition-all duration-200",
				"dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950 dark:text-slate-100 dark:shadow-lg/20",
				className,
			)}
			whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<ProductImage imageUrl={imageUrl} alt={name} slug={productSlug} />

			<div className="mt-4 flex-1">
				<ProductHeader
					id={sku}
					slug={productSlug}
					name={name}
					salesIncentive={salesIncentive}
				/>
				<ProductSummary description={description} abTest={abTest} />
				<ProductMetadata price={price} reviews={reviews} />
			</div>

			{/* Buttons Row */}
			<div className="mt-6 flex w-full flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
				<button
					type="button"
					className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus:ring-offset-slate-950"
					onClick={handleAddToCart}
				>
					<svg
						width="16"
						height="16"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
						role="img"
						aria-labelledby="addToCartTitle"
					>
						<title id="addToCartTitle">Add to Cart</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					<span>Add to Cart</span>
				</button>
				<button
					type="button"
					className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-slate-950"
					onClick={handleInitiateCheckout}
					disabled={isCheckoutLoading}
				>
					{isCheckoutLoading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
							<span className="sr-only">Processing checkout…</span>
							<span aria-hidden>Processing…</span>
						</>
					) : (
						<>
							<svg
								width="16"
								height="16"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
								role="img"
								aria-labelledby="purchaseTitle"
							>
								<title id="purchaseTitle">Purchase</title>
								<circle cx="9" cy="21" r="1" />
								<circle cx="20" cy="21" r="1" />
								<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
							</svg>
							<span>Purchase</span>
						</>
					)}
				</button>
			</div>

			<CheckoutDialog
				isOpen={!!clientSecret}
				onClose={() => setClientSecret(null)}
				clientSecret={clientSecret}
				price={price}
				name={name}
				sku={sku}
				categories={categories}
			/>
		</motion.div>
	);
};

export default ProductCardNew;
