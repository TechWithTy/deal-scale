import type { DiscountCode } from "../discount/discountCode";
import type { ProductCategory } from "../products";
import type { Feature } from "./services";

export type PlanType = "monthly" | "annual" | "oneTime";

// * A string literal representing a percentage, e.g., "25%"
export type PercentageString = `${number}%`;

export const PRICING_CATEGORIES = {
	LEAD_GENERATION: "lead_generation_plan",
} as const;

export type PricingCategoryKey = keyof typeof PRICING_CATEGORIES;
export type PricingCategoryValue =
	(typeof PRICING_CATEGORIES)[PricingCategoryKey];

interface BasePlanPrice {
	amount: number | PercentageString;
	description: string;
	features: string[];
	discount?: { code: DiscountCode; autoApply: boolean };
}

export interface Plan {
	id: string;
	pricingCategoryId?: PricingCategoryValue;
	productId?: string;
	productCategoryId?: ProductCategory;
	name: string;

	price: {
		oneTime: BasePlanPrice & {
			amount: number | PercentageString;
		};
		monthly: BasePlanPrice & {
			amount: number;
		};
		annual: BasePlanPrice & {
			amount: number;
			bannerText?: string;
		};
	};
	highlighted?: boolean;
	cta: {
		text: string;
		type: "checkout" | "link";
		href?: string;
	};
}
