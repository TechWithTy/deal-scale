export type ShippingDimensions = {
	length: number; // in cm
	width: number; // in cm
	height: number; // in cm
	unit?: "cm" | "in";
};

export type ShippingWeight = {
	value: number;
	unit: "kg" | "g" | "lb" | "oz";
};

export type ShippingTimeEstimate = {
	minDays: number;
	maxDays: number;
	guaranteed?: boolean;
	deliveryWindow?: {
		from: string; // e.g. "09:00"
		to: string; // e.g. "18:00"
	};
};

export type ShippingPrice = {
	amount: number;
	currency: string;
	taxIncluded?: boolean;
	breakdown?: {
		base: number;
		fuelSurcharge?: number;
		handlingFee?: number;
		insurance?: number;
		[key: string]: number | undefined;
	};
	discount?: {
		amount: number;
		description?: string;
	};
};

export type ShippingCarrier = {
	name: string;
	serviceLevel: string; // e.g. "Standard", "Express"
	carrierCode?: string;
	trackingUrl?: string;
};

export type ShippingOption = {
	id: string;
	label: string;
	carrier: ShippingCarrier;
	price: ShippingPrice;
	estimatedTime: ShippingTimeEstimate;
	weightLimit?: ShippingWeight;
	dimensionLimit?: ShippingDimensions;
	additionalServices?: Array<"signature" | "insurance" | "fragile" | string>;
	isAvailable: boolean;
	notes?: string;
};

export type ProductShippingInfo = {
	packageDimensions: ShippingDimensions;
	packageWeight: ShippingWeight;
	availableOptions: ShippingOption[];
	defaultOptionId?: string;
	originCountry: string;
	destinationCountry?: string;
	customsValue?: number;
	hazardous?: boolean;
};

/**
 * Default tax rate for shipping calculations
 * @default 0.0825 // 8.25%
 */
export const TAX_RATE = 0.0825;
