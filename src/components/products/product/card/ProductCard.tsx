"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ProductCardProps } from "./types";
import ProductImage from "./ProductImage";
import ProductHeader from "./ProductHeader";
import ProductMetadata from "./ProductMetadata";
import ProductActions from "./ProductActions";
import CheckoutDialog from "./CheckoutDialog";

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
	} = props;

	const shouldReduceMotion = useReducedMotion();
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

	const handleAddToCart = () => {
		toast.success("Added to cart");
		// TODO: Implement actual cart functionality
	};

	const handleInitiateCheckout = async () => {
		if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
			toast.error("Stripe is not configured. Cannot proceed to checkout.");
			return;
		}

		setIsCheckoutLoading(true);
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
		} catch (error) {
			console.error("Checkout initiation failed:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Payment failed. Please try again.",
			);
		} finally {
			setIsCheckoutLoading(false);
		}
	};

	const imageUrl = images?.[0] || "/placeholder-product.png";

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
			<ProductImage imageUrl={imageUrl} alt={name} slug={slug} />

			<div className="mt-4 flex-1">
				<ProductHeader id={sku} name={name} salesIncentive={salesIncentive} />

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
