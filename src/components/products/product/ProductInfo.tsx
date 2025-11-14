import { ProductCategory, type ProductType } from "@/types/products";
import toast from "react-hot-toast";
import TrustedBySection from "./TrustedBySection";
import ProductActions from "./info/ProductActions";
import ProductColorPicker from "./info/ProductColorPicker";
import ProductQuantityPicker from "./info/ProductQuantitySelect";
import ProductSizePicker from "./info/ProductSizePicker";
import ProductStars from "./info/ProductStars";
// ! ProductInfo Orchestrator (modular, clean, DRY)
import ProductTitle from "./info/ProductTitle";
import ProductTypePicker from "./info/ProductTypePicker";
import getAverageRating from "./utils/getAverageRating";

interface ProductInfoProps {
	ctaText?: string;
	setActiveTab?: (tab: string) => void;
	product: ProductType;
	onInitiateCheckout: (checkoutDetails: {
		price: number;
		description: string;
		metadata: object;
	}) => Promise<void>;
	checkoutLoading: boolean;
	stripeLoaded: boolean;
	enableAddToCart?: boolean;
	/**
	 * Optional guard executed right before checkout.
	 * Return `false` to pause the flow (perfect for injecting a login modal later).
	 */
	onBeforeCheckout?: () => Promise<boolean | void> | boolean | void;
}

/**
 * * ProductInfo: Orchestrates all product info UI and actions
 * - Purely presentational; no modal/payment logic
 */
export default function ProductInfo({
	product,
	onInitiateCheckout,
	checkoutLoading,
	stripeLoaded,
	setActiveTab,
	ctaText,
	enableAddToCart = true,
	onBeforeCheckout,
}: ProductInfoProps) {
	// * Find selected type data for price
	const selectedTypeData = product.types.find(
		(type) => type.value === product.types?.[0].value,
	);
	const currentPrice = selectedTypeData?.price || product.price;
	const averageRating = getAverageRating(product.reviews);
	const reviewCount = product.reviews?.length ?? 0;

	// * Handler for purchase action
	const handleCheckoutClick = () => {
		try {
			// Debug log the product data
			console.group("Product Checkout Debug");
			console.log("Product:", product);
			console.log("Selected Type Data:", selectedTypeData);
			console.log("Product Types:", product.types);
			console.log("Product Colors:", product.colors);
			console.log("Product Sizes:", product.sizes);

			// Safely build description with fallbacks
			const typeName =
				selectedTypeData?.name || (product.types?.[0]?.name ?? "Standard");
			const colorName = product.colors?.[0]?.name ?? "Default";
			const sizeName = product.sizes?.[0]?.name ?? "One Size";

			const description = `${product.name} (${typeName}, ${colorName}, ${sizeName})`;

			// Log the computed values
			console.log("Computed Description:", description);
			console.groupEnd();

			onInitiateCheckout({
				price: currentPrice,
				description,
				metadata: {
					productId: product.id,
					productName: product.name,
					type: typeName,
					color: colorName,
					size: sizeName,
				},
			});
		} catch (error) {
			console.error("Error in handleCheckoutClick:", error);
			// Optionally show an error toast to the user
			toast.error("Failed to process checkout. Please try again.");
		}
	};

	const isFreeResource =
		product.categories?.includes(ProductCategory.FreeResources) &&
		Boolean(product.resource);

	return (
		<div>
			{/* Product title and price */}
			<ProductTitle product={product} currentPrice={currentPrice} />
			{/* Star rating and reviews */}
			<ProductStars
				rating={averageRating}
				reviewCount={reviewCount}
				setActiveTab={setActiveTab}
			/>
			<div className="mt-6">
				{!isFreeResource && (
					<>
						{/* Type picker */}
						<ProductTypePicker product={product} />
						{/* Color picker */}
						<ProductColorPicker product={product} />
						{/* Size picker */}
						<ProductSizePicker product={product} />
						{/* Purchase/Favorite/Share actions */}
						<ProductQuantityPicker />
					</>
				)}
				<ProductActions
					onCheckout={handleCheckoutClick}
					checkoutLoading={checkoutLoading}
					stripeLoaded={stripeLoaded}
					ctaText={isFreeResource ? undefined : ctaText}
					product={product}
					enableAddToCart={!isFreeResource && enableAddToCart}
					onBeforeCheckout={onBeforeCheckout}
				/>
				{/* Trusted by logos */}
				<TrustedBySection />
			</div>
		</div>
	);
}
