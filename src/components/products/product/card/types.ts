import type { ProductType } from "@/types/products";

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
	name: string;
	salesIncentive?: {
		discountPercent?: number;
	};
}

export interface ProductMetadataProps {
	price: number;
	reviews?: Array<{ rating: number }>;
}

export interface ProductActionsProps {
	onAddToCart: () => void;
	onPurchase: () => void;
	isLoading: boolean;
}

import type { ProductCategory } from "@/types/products";

export interface CheckoutDialogProps {
	isOpen: boolean;
	onClose: () => void;
	clientSecret: string | null;
	price: number;
	name: string;
	sku?: string;
	categories?: ProductCategory[];
}
