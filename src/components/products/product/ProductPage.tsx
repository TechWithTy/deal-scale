"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ProductSelectionProvider } from "@/contexts/ProductSelectionContext";
import { abTestExample } from "@/data/products/copy";
import type { ProductType } from "@/types/products";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Breadcrumbs from "./Breadcrumbs";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import { ProductCheckoutForm } from "@/components/checkout/product/ProductCheckoutForm";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
	: null;

interface ProductPageProps {
	product?: ProductType | null;
	callbackUrl?: string;
}

const ProductPage = ({ product, callbackUrl }: ProductPageProps) => {
	const [selectedColor, setSelectedColor] = useState("black");
	const [selectedSize, setSelectedSize] = useState("M");
	const [selectedType, setSelectedType] = useState("extended");
	const [stripeLoaded, setStripeLoaded] = useState(false);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [checkoutPrice, setCheckoutPrice] = useState<number>(0);

	useEffect(() => {
		let isMounted = true;
		if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
			loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).then(
				(stripe) => {
					if (isMounted) setStripeLoaded(!!stripe);
				},
			);
		}
		return () => {
			isMounted = false;
		};
	}, []);

	const handleInitiateCheckout = async (checkoutDetails: {
		price: number;
		description: string;
		metadata: object;
	}) => {
		setCheckoutLoading(true);
		try {
			const response = await fetch("/api/stripe/intent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					price: Math.round(checkoutDetails.price * 100),
					description: checkoutDetails.description,
					metadata: checkoutDetails.metadata,
					...(callbackUrl ? { callbackUrl } : {}),
				}),
			});

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: "Failed to create payment intent" }));
				throw new Error(errorData.message || "Failed to create payment intent");
			}

			const { clientSecret } = await response.json();
			if (!clientSecret) {
				throw new Error("Client secret not received from server.");
			}

			setCheckoutPrice(checkoutDetails.price);
			setClientSecret(clientSecret);
		} catch (error: unknown) {
			let errorMessage = "Payment failed. Please try again.";
			if (error instanceof Error) errorMessage = error.message;
			toast.error(errorMessage);
			console.error("Checkout initiation failed:", error);
		} finally {
			setCheckoutLoading(false);
		}
	};

	const handleCloseCheckout = () => {
		setClientSecret(null);
	};

	if (!product) {
		return (
			<div className="flex min-h-[50vh] flex-col items-center justify-center">
				<div className="mb-2 h-12 w-12 animate-spin rounded-full border-4 border-card border-t-primary" />
				<p className="text-lg text-muted-foreground">Loading product...</p>
			</div>
		);
	}

	const breadcrumbItems = [
		{ label: "Products", href: "/products" },
		{
			label: product.name,
			href: `/products/${product.sku || product.slug || ""}`,
		},
	];

	// Select the first AB test variant's copy (if present)
	const variantCopy = product.abTest?.variants?.[0]?.copy;

	return (
		<ProductSelectionProvider>
			<div className="bg-background">
				<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
					<Breadcrumbs items={breadcrumbItems} />

					<div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
						{/* Image gallery */}
						<ImageGallery images={product.images} productTitle={product.name} />

						{/* Product info */}
						<div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
							<ProductInfo
								product={product}
								onInitiateCheckout={handleInitiateCheckout}
								checkoutLoading={checkoutLoading}
								stripeLoaded={stripeLoaded}
								setActiveTab={setActiveTab}
								ctaText={variantCopy?.buttonCta || "Purchase"}
							/>
						</div>
					</div>

					{/* Product details */}
					<div className="mt-16">
						<ProductTabs
							description={product.description}
							highlights={variantCopy?.highlights}
							shipping={
								product.shippingInfo?.availableOptions?.[0]?.estimatedTime
							}
							reviews={product.reviews}
							faqs={product.faqs}
							licenseName={product.licenseName}
							abTestCopy={variantCopy}
							value={activeTab}
							onValueChange={setActiveTab}
						/>
					</div>
				</div>
			</div>

			{/* Stripe Checkout Modal */}
			{clientSecret && stripePromise && product ? (
				<Elements
					key={clientSecret} // Add key to force re-render when clientSecret changes
					stripe={stripePromise}
					options={{
						clientSecret,
						appearance: {
							theme: "stripe",
							variables: {
								colorPrimary: "#4f46e5",
							},
						},
					}}
				>
					<ProductCheckoutForm
						product={product}
						onClose={handleCloseCheckout}
						clientSecret={clientSecret}
					/>
				</Elements>
			) : null}
		</ProductSelectionProvider>
	);
};

export default ProductPage;
