"use client";

import { useWaitCursor } from "@/hooks/useWaitCursor";
import { startStripeToast } from "@/lib/ui/stripeToast";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import CheckoutDialog from "./CheckoutDialog";
import ProductActions from "./ProductActions";
import ProductHeader from "./ProductHeader";
import ProductImage from "./ProductImage";
import ProductMetadata from "./ProductMetadata";
import ProductSummary from "./ProductSummary";
import type { ProductCardProps } from "./types";

const ProductCard = (props: ProductCardProps) => {
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
	useWaitCursor(isCheckoutLoading);

	const handleAddToCart = () => {
		toast.success("Added to cart");
		// TODO: Implement actual cart functionality
	};

	const handleInitiateCheckout = async () => {
		if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
			toast.error("Checkout is currently unavailable. Please contact support.");
			return;
		}

		setIsCheckoutLoading(true);
		const stripeToast = startStripeToast("Preparing checkout…");
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
				throw new Error("Unable to initialize checkout. Please try again.");
			setClientSecret(clientSecret);
			stripeToast.success(
				"Checkout ready. Complete your purchase in the payment form.",
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
				"relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 text-black shadow transition-all duration-200",
				"dark:border-gray-700 dark:bg-gray-900 dark:text-white",
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

			<div className="mt-4">
				<ProductActions
					onAddToCart={handleAddToCart}
					onPurchase={handleInitiateCheckout}
					isLoading={isCheckoutLoading}
				/>
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

export default ProductCard;
