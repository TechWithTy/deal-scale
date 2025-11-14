import type { DropshippingIntegration } from "./index";

export interface AliexpressDropshippingItem {
	id: string;
	title: string;
	description: string;
	categoryId: string;
	categoryName: string;
	sku: string;
	itemUrl: string;
	images: string[];
	videoUrl?: string;
	price: {
		currency: string;
		original: number;
		discounted: number;
		min: number;
		max: number;
	};
	availableQuantity: number;
	minOrderQuantity: number;
	shippingOptions: Array<{
		service: string;
		estimatedDeliveryTime: string;
		cost: number;
		currency: string;
		trackingAvailable: boolean;
		shipFrom: string;
		shipTo: string;
	}>;
	attributes: Array<{
		name: string;
		value: string;
	}>;
	seller: {
		id: string;
		name: string;
		storeUrl: string;
		positiveFeedbackRate: number;
		ratingsCount: number;
		yearsActive: number;
		isTopRated: boolean;
	};
	variants: Array<{
		id: string;
		sku: string;
		attributes: Array<{
			name: string;
			value: string;
		}>;
		price: number;
		availableQuantity: number;
		image?: string;
	}>;
	isAvailable: boolean;
	isAdultProduct: boolean;
	isBrandAuthorized: boolean;
	createdAt: string;
	updatedAt: string;
	dropshipping?: DropshippingIntegration;
}
