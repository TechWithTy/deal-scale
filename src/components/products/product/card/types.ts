import type { ProductCategory, ProductType } from "@/types/products";
import type { ABTest } from "@/types/testing";

export interface ProductCardProps
	extends Pick<
		ProductType,
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
}

export interface ProductHeaderProps {
	id: string;
	slug?: string;
	name: string;
	salesIncentive?: {
		discountPercent?: number;
	};
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
