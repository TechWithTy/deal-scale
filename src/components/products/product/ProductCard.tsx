// // ProductCard.tsx
// // ! ProductCard component: Card for displaying product info, modeled after ServiceCard but without icons.
// // * Follows DRY, SOLID, and type-safe best practices (see user rules)

// "use client";
// import { cn } from "@/lib/utils";
// import type { ProductType } from "@/types/products";
// import { motion, useReducedMotion } from "framer-motion";
// import Link from "next/link";
// import type React from "react";
// import { v4 as uuidv4 } from "uuid";
// import { v4 as uuid } from "uuid";

// /**
//  * Props for ProductCard component.
//  * Extends ProductType but omits fields not needed for card display.
//  */
// export interface ProductCardProps
// 	extends Pick<
// 		ProductType,
// 		| "name"
// 		| "description"
// 		| "price"
// 		| "images"
// 		| "salesIncentive"
// 		| "sku"
// 		| "reviews"
// 		| "types"
// 		| "colors"
// 		| "sizes"
// 		| "categories"
// 	> {
// 	className?: string;
// 	showBanner?: boolean;
// 	bannerText?: string;
// 	bannerColor?: string;
// 	onSale?: boolean;
// 	slug?: string; // Path slug for product detail
// 	callbackUrl?: string;
// }

// /**
//  * Validate required ProductCard props.
//  */
// const validateProductProps = (
// 	props: Omit<ProductCardProps, "className">,
// ): boolean => {
// 	return !!(
// 		props?.name &&
// 		typeof props.name === "string" &&
// 		props.description &&
// 		typeof props.description === "string" &&
// 		typeof props.price === "number" &&
// 		Array.isArray(props.images)
// 	);
// };

// import CheckoutForm from "@/components/checkout/CheckoutForm";
// import { Button } from "@/components/ui/button";
// /**
//  * ProductCard - displays product info in a styled card (no icon)
//  * @param props ProductCardProps
//  */
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { CircleDollarSign, Gem } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";

// const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// 	? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
// 	: null;

// if (!stripePromise) {
// 	console.error(
// 		"Stripe publishable key is not set. Checkout will not function.",
// 	);
// }

// const ProductCard = (props: ProductCardProps) => {
// 	const { callbackUrl, ...rest } = props;
// 	const shouldReduceMotion = useReducedMotion();
// 	// State for Stripe checkout modal
// 	const [clientSecretForModal, setClientSecretForModal] = useState<
// 		string | null
// 	>(null);
// 	const [priceForCheckout, setPriceForCheckout] = useState<number>(0);
// 	const [checkoutLoading, setCheckoutLoading] = useState(false);

// 	// ! Initiates Stripe payment intent and opens modal
// 	const handleInitiateCheckout = async () => {
// 		if (!stripePromise) {
// 			toast.error("Stripe is not configured. Cannot proceed to checkout.");
// 			return;
// 		}
// 		setCheckoutLoading(true);
// 		try {
// 			const response = await fetch("/api/stripe/intent", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({
// 					price: Math.round(props.price * 100), // cents
// 					...(callbackUrl ? { callbackUrl } : {}),
// 					description: props.description,
// 					metadata: {
// 						sku: props.sku,
// 						name: props.name,
// 						// Pass categories to metadata for backend use (e.g., logging, receipts)
// 						productCategory: props.categories?.join(","),
// 					},
// 				}),
// 			});
// 			if (!response.ok) {
// 				const errorData = await response
// 					.json()
// 					.catch(() => ({ message: "Failed to create payment intent" }));
// 				throw new Error(errorData.message || "Failed to create payment intent");
// 			}
// 			const { clientSecret } = await response.json();
// 			if (!clientSecret)
// 				throw new Error("Client secret not received from server.");
// 			setPriceForCheckout(props.price);
// 			setClientSecretForModal(clientSecret);
// 		} catch (error: unknown) {
// 			let errorMessage = "Payment failed. Please try again.";
// 			if (error instanceof Error) errorMessage = error.message;
// 			toast.error(errorMessage);
// 			console.error("Checkout initiation failed:", error);
// 		} finally {
// 			setCheckoutLoading(false);
// 		}
// 	};

// 	if (!validateProductProps(props)) {
// 		console.error("Invalid ProductCard core props:", props);
// 		return (
// 			<div
// 				className={cn(
// 					"rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-400",
// 					props.className,
// 				)}
// 			>
// 				Error: Invalid core product data.
// 			</div>
// 		);
// 	}

// 	const {
// 		name,
// 		description,
// 		price,
// 		images,
// 		salesIncentive,
// 		className,
// 		showBanner = false,
// 		bannerText = "Featured",
// 		bannerColor = "bg-gradient-to-r from-primary to-focus",
// 		onSale = false,
// 		slug,
// 		types,
// 		colors,
// 		sizes,
// 		categories,
// 	} = props;

// 	// todo: Replace with actual product image or fallback
// 	const imageUrl =
// 		images && images.length > 0 ? images[0] : "/placeholder-product.png";

// 	return (
// 		<motion.div
// 			layout
// 			className={cn(
// 				// Card background, border, text
// 				"relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 text-black shadow transition-all duration-200",
// 				"dark:border-gray-700 dark:bg-gray-900 dark:text-white",
// 				className,
// 			)}
// 			whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
// 			transition={{ type: "spring", stiffness: 300, damping: 20 }}
// 		>
// 			{/* Discount Tag */}
// 			{salesIncentive?.discountPercent && (
// 				<div className="absolute top-6 left-6 z-10">
// 					<span className="rounded bg-blue-100 px-3 py-1 font-semibold text-blue-700 text-xs dark:bg-blue-900 dark:text-blue-200">
// 						Up to {salesIncentive.discountPercent}% off
// 					</span>
// 				</div>
// 			)}

// 			{/* Eye and Heart Icons */}
// 			<div className="absolute top-6 right-6 flex gap-2">
// 				<Link
// 					href={props.slug ? `/products/${props.slug}` : "#"}
// 					aria-label={props.slug ? `View details for ${props.name}` : undefined}
// 					className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400"
// 					tabIndex={props.slug ? 0 : -1}
// 				>
// 					<svg
// 						width="20"
// 						height="20"
// 						fill="none"
// 						stroke="currentColor"
// 						strokeWidth="2"
// 						viewBox="0 0 24 24"
// 					>
// 						<title>Modre Details</title>
// 						<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
// 						<circle cx="12" cy="12" r="3" />
// 					</svg>
// 				</Link>
// 				{process.env.APP_MODE === "hybrid" && (
// 					<button
// 						type="button"
// 						className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-pink-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-pink-400"
// 						title="Add to wishlist"
// 					>
// 						<svg
// 							width="20"
// 							height="20"
// 							fill="none"
// 							stroke="currentColor"
// 							strokeWidth="2"
// 							viewBox="0 0 24 24"
// 						>
// 							<title>Add to wishlist</title>
// 							<path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 4.1 13.44 5.68C13.97 4.1 15.64 3 17.38 3C20.46 3 22.88 5.42 22.88 8.5C22.88 13.5 15 21 15 21H12Z" />
// 						</svg>
// 					</button>
// 				)}
// 			</div>

// 			{/* Product Image */}
// 			<div className="w-full pt-2">
// 				<Link
// 					href={slug ? `/products/${slug}` : "#"}
// 					tabIndex={0}
// 					aria-label={`View details for ${name}`}
// 					className="mb-4 block h-40 w-full rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800"
// 				>
// 					<img
// 						src={imageUrl}
// 						alt={name}
// 						loading="lazy"
// 						className="h-full w-full rounded-xl object-cover"
// 						draggable={false}
// 					/>
// 				</Link>
// 			</div>

// 			{/* Product Title with truncation */}
// 			<h3 
// 				className="mb-1 line-clamp-1 text-left font-bold text-black text-lg leading-tight transition-all hover:line-clamp-none dark:text-white"
// 				title={name} // Show full name on hover
// 			>
// 				{name}
// 			</h3>

// 			{/* Star Rating & Review Count */}
// 			{props.reviews && props.reviews.length > 0 ? (
// 				<div className="mb-3 flex items-center gap-1 text-base">
// 					<span className="flex gap-0.5">
// 						{Array.from({ length: 5 }).map((_, i) => (
// 							<svg
// 								key={uuid()}
// 								width="16"
// 								height="16"
// 								fill={
// 									i <
// 									Math.round(
// 										props.reviews.reduce((sum, r) => sum + r.rating, 0) /
// 											props.reviews.length,
// 									)
// 										? "#facc15"
// 										: "#e5e7eb"
// 								}
// 								viewBox="0 0 20 20"
// 							>
// 								<title>Star Rating</title>
// 								<polygon points="10,1.5 12.59,7.36 19,7.97 14,12.26 15.18,18.5 10,15.27 4.82,18.5 6,12.26 1,7.97 7.41,7.36" />
// 							</svg>
// 						))}
// 					</span>
// 					<span className="ml-1 font-semibold text-black dark:text-white">
// 						{(
// 							props.reviews.reduce((sum, r) => sum + r.rating, 0) /
// 							props.reviews.length
// 						).toFixed(1)}
// 					</span>
// 					<span className="text-gray-500 text-sm dark:text-gray-300">
// 						({props.reviews.length.toLocaleString()})
// 					</span>
// 				</div>
// 			) : (
// 				<div className="mb-3 h-6" />
// 			)}

// 			{/* Price and Action Buttons */}
// 			<div className="mt-2 flex flex-col items-center justify-center gap-2">
// 				<div className="text-center font-bold text-2xl text-black dark:text-white">
// 					${price.toLocaleString()}
// 				</div>
// 				<div className="flex w-full items-center justify-center gap-2">
// 					<button
// 						type="button"
// 						className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
// 						onClick={(e) => {
// 							e.stopPropagation();
// 							// TODO: Implement add to cart functionality
// 							toast.success('Added to cart');
// 						}}
// 					>
// 						<svg
// 							width="16"
// 							height="16"
// 							fill="none"
// 							stroke="currentColor"
// 							strokeWidth="2"
// 							viewBox="0 0 24 24"
// 						>
// 							<title>Add to Cart</title>
// 							<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// 						</svg>
// 						<span>Add to Cart</span>
// 					</button>
// 					<button
// 						type="button"
// 						className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
// 						onClick={handleInitiateCheckout}
// 						disabled={checkoutLoading}
// 					>
// 						<svg
// 							width="16"
// 							height="16"
// 							fill="none"
// 							stroke="currentColor"
// 							strokeWidth="2"
// 							viewBox="0 0 24 24"
// 						>
// 							<title>Purchase</title>
// 							<circle cx="9" cy="21" r="1" />
// 							<circle cx="20" cy="21" r="1" />
// 							<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
// 						</svg>
// 						<span>{checkoutLoading ? "Processing..." : "Purchase"}</span>
// 					</button>
// 				</div>
// 			</div>
// 			{/* Payment Intent Modal */}
// 			{clientSecretForModal && stripePromise && (
// 				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
// 					<div className="mx-auto w-full max-w-md rounded-lg bg-background p-6 shadow-xl dark:bg-background-darker">
// 						<Elements
// 							stripe={stripePromise}
// 							options={{ clientSecret: clientSecretForModal }}
// 						>
// 							<CheckoutForm
// 								clientSecret={clientSecretForModal}
// 								onSuccess={() => {
// 									toast.success("Payment successful!");
// 									setClientSecretForModal(null);
// 								}}
// 								plan={{
// 									id: props.sku || props.name,
// 									name: props.name,
// 									price: {
// 										oneTime: {
// 											amount: priceForCheckout,
// 											description: "One-time payment",
// 											features: [],
// 										},
// 										monthly: { amount: 0, description: "", features: [] },
// 										annual: { amount: 0, description: "", features: [] },
// 									},
// 									cta: { text: "Complete Purchase", type: "checkout" },
// 								}}
// 								planType="oneTime"
// 								productCategories={categories} // Pass categories to checkout form
// 							/>
// 						</Elements>
// 						<Button
// 							variant="ghost"
// 							className="mt-4 w-full"
// 							onClick={() => setClientSecretForModal(null)}
// 						>
// 							Cancel
// 						</Button>
// 					</div>
// 				</div>
// 			)}
// 		</motion.div>
// 	);
// };

// export default ProductCard;
