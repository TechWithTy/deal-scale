import type { ProductCategory, ProductType } from "@/types/products";
import type { ABTest } from "@/types/testing";

export interface ProductCardProps
	extends Pick<
		ProductType,
		| "id"
		| "name"
		| "description"
		| "price"
		| "images"
		| "salesIncentive"
		| "sku"
		| "reviews"
		| "types"
		| "colors"
		| "sizes"
		| "categories"
		| "abTest"
	> {
	className?: string;
	showBanner?: boolean;
	bannerText?: string;
	bannerColor?: string;
	onSale?: boolean;
	slug?: string;
	callbackUrl?: string;
}

export interface ProductImageProps {
	imageUrl: string;
	alt: string;
	slug?: string;
	categories?: ProductCategory[];
}

export interface ProductHeaderProps {
	id: string;
	slug?: string;
	name: string;
	salesIncentive?: {
		discountPercent?: number;
	};
	categories?: ProductCategory[];
}

export interface ProductSummaryProps {
	description?: string;
	abTest?: ABTest;
}

export interface ProductMetadataProps {
	price: number;
	reviews?: Array<{ rating: number }>;
}

export interface ProductActionsProps {
	onAddToCart: () => void;
	onPurchase: () => void;
	isLoading: boolean;
	onBeforePurchase?: () => Promise<boolean | void> | boolean | void;
	// Custom button labels for marketplace products (e.g., closers)
	addToCartLabel?: string;
	purchaseLabel?: string;
	addToCartIcon?: React.ReactNode;
	purchaseIcon?: React.ReactNode;
}

export interface CheckoutDialogProps {
	isOpen: boolean;
	onClose: () => void;
	clientSecret: string | null;
	price: number;
	name: string;
	sku?: string;
	categories?: ProductCategory[];
}
