import type { DropshippingIntegration } from ".";

export interface AmazonDropshippingItem {
	asin: string; // Amazon Standard Identification Number
	title: string;
	description?: string;
	brand?: string;
	images: string[];
	category: string;
	price: {
		amount: number;
		currency: string;
		originalAmount?: number;
		discounts?: Array<{
			type: string;
			amount: number;
		}>;
	};
	seller: {
		name: string;
		sellerId: string;
		rating?: number;
		isPrime: boolean;
		shipsFrom?: string;
	};
	availability: {
		isInStock: boolean;
		estimatedDelivery?: string;
		quantityAvailable?: number;
	};
	shipping: {
		options: Array<{
			method: string;
			cost: number;
			estimatedArrival: string;
			isPrimeEligible: boolean;
		}>;
		shipsFrom: string;
		shipsTo: string[];
		handlingTimeDays?: number;
	};
	fulfillment: {
		fulfilledByAmazon: boolean;
		dropshipped: boolean;
		marketplaceId?: string;
	};
	dimensions?: {
		length: number;
		width: number;
		height: number;
		unit: string;
		weight: number;
		weightUnit: string;
	};
	features?: string[];
	variations?: Array<{
		asin: string;
		attributes: Record<string, string>;
		price?: {
			amount: number;
			currency: string;
		};
		images?: string[];
	}>;
	ratings?: {
		average: number;
		count: number;
		breakdown?: Record<string, number>;
	};
	compliance?: {
		isHazmat: boolean;
		isFBARestricted: boolean;
		warnings?: string[];
	};
	// Additional fields for dropshipping context
	dropshipping?: DropshippingIntegration;
}
