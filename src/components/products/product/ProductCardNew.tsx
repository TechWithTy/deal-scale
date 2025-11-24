"use client";

import BecomeACloserCard from "@/components/closers/BecomeACloserCard";
import ClosersMarketplaceModal from "@/components/closers/ClosersMarketplaceModal";
import { useWaitCursor } from "@/hooks/useWaitCursor";
import { startStripeToast } from "@/lib/ui/stripeToast";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { ProductCategory } from "@/types/products";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import MonetizeCard from "../workflow/MonetizeCard";
import {
	ProductCard as Card,
	type ProductCardProps as CardProps,
	CheckoutDialog,
	ProductHeader,
	ProductImage,
	ProductMetadata,
	ProductSummary,
} from "./card";

const MONETIZE_PORTAL_URL = "https://app.leadorchestra.com";

const MONETIZE_CATEGORY_INFO: Record<
	string,
	{ title: string; subtitle: string }
> = {
	"sales-scripts-marketplace": {
		title: "Sell Your Sales Scripts",
		subtitle: "Publish proven cadences to thousands of Deal Scale operators",
	},
	"workflows-marketplace": {
		title: "Monetize Your Workflow",
		subtitle: "Share your automation with the world and earn revenue",
	},
	"voices-marketplace": {
		title: "Monetize Your Voice Agent",
		subtitle: "Tap into our network and deploy your concierge for clients",
	},
};

// Re-export types for convenience
export type { CardProps as ProductCardProps };

/**
 * ProductCardNew - An improved version of ProductCard using modular subcomponents
 * @param props - Product card properties
 */
const ProductCardNew = (props: CardProps) => {
	const {
		id,
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
	const [isClosersModalOpen, setIsClosersModalOpen] = useState(false);
	const router = useRouter();

	const addToCart = useCartStore((state) => state.addItem);
	useWaitCursor(isCheckoutLoading);

	// Check if this is the Remote Closers marketplace product (not individual closers)
	// Only show BecomeACloserCard for the marketplace product itself, not individual closer products
	const isRemoteCloserMarketplace =
		(categories?.includes(ProductCategory.RemoteClosers) ?? false) &&
		(id === "remote-closers-marketplace" ||
			slug === "remote-closers" ||
			sku === "DS-REMOTE-CLOSERS");

	// Check if this is a monetization marketplace entry point (Sales Scripts, Workflows, Voices marketplaces)
	const isMonetizeMarketplace =
		(categories?.includes(ProductCategory.Monetize) ?? false) &&
		(id?.includes("marketplace") || sku?.includes("MARKETPLACE")) &&
		!isRemoteCloserMarketplace;

	// Get monetize card info for marketplace products
	const monetizeInfo =
		isMonetizeMarketplace && id ? MONETIZE_CATEGORY_INFO[id] : null;

	// Handle monetize marketplace click
	const handleMonetizeMarketplaceClick = useCallback(() => {
		if (!id) return;

		// Determine category for UTM params
		let category = "";
		if (id.includes("sales-scripts")) category = "sales-scripts";
		else if (id.includes("workflows")) category = "workflows";
		else if (id.includes("voices")) category = "voices";

		// Redirect to monetization portal
		const url = new URL(MONETIZE_PORTAL_URL);
		url.searchParams.set("category", category);
		url.searchParams.set("action", "monetize");
		window.open(url.toString(), "_blank", "noopener");
	}, [id]);

	// Check if this is an individual closer product (has RemoteClosers category but is not the marketplace product)
	const isIndividualCloser =
		(categories?.includes(ProductCategory.RemoteClosers) ?? false) &&
		!isRemoteCloserMarketplace &&
		(id?.startsWith("closer-") || sku?.startsWith("DS-CLOSER-"));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleAddToCart = useCallback(() => {
		// Open closers marketplace modal for Remote Closers marketplace product only
		if (isRemoteCloserMarketplace) {
			setIsClosersModalOpen(true);
			return;
		}

		// For individual closers, open messaging/booking flow
		if (isIndividualCloser) {
			// TODO: Open closer messaging/booking modal or redirect to booking page
			toast.success(`Messaging ${name}...`);
			console.log("Message closer:", id || sku);
			return;
		}

		const {
			name: productName,
			price,
			images: productImages = [],
			description: productDescription = "",
			slug: productSlug = "",
			sku: productSku,
			categories: productCategories = [],
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
	}, [
		addToCart,
		props,
		isRemoteCloserMarketplace,
		isIndividualCloser,
		id,
		sku,
		name,
		router,
	]);

	const handleInitiateCheckout = async () => {
		// Open closers marketplace modal for Remote Closers marketplace product only
		if (isRemoteCloserMarketplace) {
			setIsClosersModalOpen(true);
			return;
		}

		// For individual closers, open hiring/booking flow
		if (isIndividualCloser) {
			// TODO: Open closer hiring/booking modal or redirect to booking page
			toast.success(`Hiring ${name}...`);
			console.log("Hire closer:", id || sku);
			// Could open a booking modal or redirect to booking page
			// router.push(`/closers/${slug || id}/book`);
			return;
		}

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

	// Render BecomeACloserCard for Remote Closers marketplace product only
	if (isRemoteCloserMarketplace) {
		return (
			<>
				<BecomeACloserCard
					title="Remote Closers Marketplace"
					subtitle="Browse closers or apply to join"
					imageUrl={imageUrl}
					onClick={() => setIsClosersModalOpen(true)}
					className={className}
				/>
				<ClosersMarketplaceModal
					isOpen={isClosersModalOpen}
					onClose={() => setIsClosersModalOpen(false)}
					onApplyClick={() => router.push("/closers/apply")}
				/>
			</>
		);
	}

	// Render MonetizeCard for other monetize marketplace products (Sales Scripts, Workflows, Voices)
	if (isMonetizeMarketplace && monetizeInfo) {
		return (
			<MonetizeCard
				onClick={handleMonetizeMarketplaceClick}
				title={monetizeInfo.title}
				subtitle={monetizeInfo.subtitle}
				ariaLabel={`${monetizeInfo.title} on Deal Scale`}
				className={className}
			/>
		);
	}

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
			<ProductImage
				imageUrl={imageUrl}
				alt={name}
				slug={productSlug}
				categories={categories}
			/>

			<div className="mt-4 flex-1">
				<ProductHeader
					id={sku}
					slug={productSlug}
					name={name}
					salesIncentive={salesIncentive}
					categories={categories}
				/>
				<ProductSummary description={description} abTest={abTest} />
				<ProductMetadata price={price} reviews={reviews} />
			</div>

			{/* Buttons Row */}
			<div className="mt-6 flex w-full flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
				{isIndividualCloser ? (
					<>
						{/* Message Button for Closers */}
						<button
							type="button"
							className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:focus:ring-offset-slate-950 dark:hover:bg-slate-900"
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
								aria-labelledby="messageTitle"
							>
								<title id="messageTitle">Message</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
								/>
							</svg>
							<span>Message</span>
						</button>
						{/* Hire Button for Closers */}
						<button
							type="button"
							className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:focus:ring-offset-slate-950 dark:hover:bg-blue-600"
							onClick={handleInitiateCheckout}
							disabled={isCheckoutLoading}
						>
							{isCheckoutLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
									<span className="sr-only">Processing…</span>
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
										aria-labelledby="hireTitle"
									>
										<title id="hireTitle">Hire</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"
										/>
									</svg>
									<span>Hire</span>
								</>
							)}
						</button>
					</>
				) : (
					<>
						{/* Add to Cart Button for Regular Products */}
						<button
							type="button"
							className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:focus:ring-offset-slate-950 dark:hover:bg-slate-900"
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
						{/* Purchase Button for Regular Products */}
						<button
							type="button"
							className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:focus:ring-offset-slate-950 dark:hover:bg-blue-600"
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
					</>
				)}
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
