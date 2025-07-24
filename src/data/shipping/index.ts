import type {
	ProductShippingInfo,
	ShippingDimensions,
	ShippingWeight,
	ShippingOption,
	ShippingCarrier,
	ShippingPrice,
	ShippingTimeEstimate,
} from "@/types/products/shipping";

// Define common shipping carriers
const carriers: Record<string, ShippingCarrier> = {
	ups: {
		name: "UPS",
		serviceLevel: "Standard",
		carrierCode: "ups",
		trackingUrl: "https://www.ups.com/track?tracknum=",
	},
	fedex: {
		name: "FedEx",
		serviceLevel: "Express",
		carrierCode: "fedex",
		trackingUrl: "https://www.fedex.com/fedextrack/?tracknumbers=",
	},
	dhl: {
		name: "DHL",
		serviceLevel: "Express",
		carrierCode: "dhl",
		trackingUrl:
			"https://www.dhl.com/us-en/home/tracking/tracking-parcel.html?submit=1&tracking-id=",
	},
};

// Define common shipping options
const standardShipping: ShippingOption = {
	id: "standard",
	label: "Standard Shipping",
	carrier: carriers.ups,
	price: {
		amount: 4.99,
		currency: "USD",
		taxIncluded: false,
		breakdown: {
			base: 3.99,
			handlingFee: 1.0,
		},
	},
	estimatedTime: {
		minDays: 3,
		maxDays: 7,
		guaranteed: false,
	},
	isAvailable: true,
};

const expressShipping: ShippingOption = {
	id: "express",
	label: "Express Shipping",
	carrier: carriers.fedex,
	price: {
		amount: 12.99,
		currency: "USD",
		taxIncluded: false,
		breakdown: {
			base: 9.99,
			fuelSurcharge: 2.0,
			handlingFee: 1.0,
		},
	},
	estimatedTime: {
		minDays: 1,
		maxDays: 2,
		guaranteed: true,
		deliveryWindow: {
			from: "09:00",
			to: "17:00",
		},
	},
	isAvailable: true,
};

// Define product shipping information
export const shippingData: Record<string, ProductShippingInfo> = {
	"prod-001": {
		packageDimensions: {
			length: 30,
			width: 20,
			height: 10,
			unit: "cm",
		},
		packageWeight: {
			value: 0.5,
			unit: "kg",
		},
		availableOptions: [standardShipping, expressShipping],
		defaultOptionId: "standard",
		originCountry: "US",
		hazardous: false,
	},
	"prod-002": {
		packageDimensions: {
			length: 40,
			width: 30,
			height: 20,
			unit: "cm",
		},
		packageWeight: {
			value: 1.5,
			unit: "kg",
		},
		availableOptions: [standardShipping, expressShipping],
		defaultOptionId: "express",
		originCountry: "US",
		hazardous: false,
	},
	"prod-003": {
		packageDimensions: {
			length: 50,
			width: 40,
			height: 30,
			unit: "cm",
		},
		packageWeight: {
			value: 3.0,
			unit: "kg",
		},
		availableOptions: [standardShipping, expressShipping],
		defaultOptionId: "standard",
		originCountry: "US",
		hazardous: true,
	},
};

export function getShippingInfo(
	productId: string,
): ProductShippingInfo | undefined {
	return shippingData[productId];
}

export function getShippingOption(
	productId: string,
	optionId: string,
): ShippingOption | undefined {
	const productInfo = shippingData[productId];
	if (!productInfo) return undefined;

	return productInfo.availableOptions.find((option) => option.id === optionId);
}

export function calculateShippingCost(
	productId: string,
	optionId: string,
	quantity = 1,
): number {
	const option = getShippingOption(productId, optionId);
	if (!option) return 0;

	// Base price
	let cost = option.price.amount;

	// Add additional charges for quantity (example: $0.50 per additional item)
	if (quantity > 1) {
		cost += (quantity - 1) * 0.5;
	}

	return Number.parseFloat(cost.toFixed(2));
}
