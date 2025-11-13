import type { DiscountCode } from "../discount/discountCode";
import type { ProductCategory } from "../products";
import type { Feature } from "./services";

export type PricingInterval = "monthly" | "annual";
export type PricingUnit = "month" | "year";
export type UnlimitedValue = number | "unlimited";

export interface PricingCredits {
	ai: UnlimitedValue;
	skipTrace: UnlimitedValue;
	lead: UnlimitedValue;
}

export type SeatAllocation =
	| number
	| {
			included: UnlimitedValue;
			additionalSeat?: number;
	  };

export interface RecurringPlan {
	id: string;
	name: string;
	price: number;
	unit: PricingUnit;
	ctaType: string;
	idealFor?: string;
	credits?: PricingCredits;
	seats?: SeatAllocation;
	features: string[];
	ctaLabel?: string;
	bannerText?: string;
}

export interface PricingOption {
	model: string;
	details: string;
	vesting?: string;
}

export interface PricingCTA {
	label: string;
	type: string;
	action?: string;
	description?: string;
}

export interface ProfitProjection {
	year1: string;
	year5: string;
	year10: string;
}

export interface BuyoutScenario {
	setupEstimate: string;
	maintenance: string;
	ownership: string;
}

export interface ROIEstimatorCalculations {
	estimatedRevenueGain: string;
	estimatedSetupCost: string;
	profitProjection: ProfitProjection;
	buyoutScenario: BuyoutScenario;
}

export interface ROIEstimatorSummary {
	header: string;
	points: string[];
}

export interface ROIEstimatorCTA {
	label: string;
	behavior: string;
	fields: string[];
	output: string;
}

export interface ROIEstimator {
	inputs: string[];
	industryFactors: Record<string, number>;
	exampleInput: {
		averageDealAmount: number;
		monthlyDealsClosed: number;
		averageTimePerDealHours: number;
		industry: string;
	};
	calculations: ROIEstimatorCalculations;
	summaryOutput: ROIEstimatorSummary;
	cta: ROIEstimatorCTA;
}

export interface SelfHostedPlan {
	id: string;
	name: string;
	pricingModel: string;
	ctaPrimary: PricingCTA;
	ctaSecondary: PricingCTA;
	idealFor?: string;
	includes: string[];
	aiCredits: {
		plan: string;
		description: string;
	};
	pricingOptions: PricingOption[];
	roiEstimator: ROIEstimator;
	notes: string[];
	requirements?: string[];
}

export interface PartnershipPlan {
	id: string;
	name: string;
	pricingModel: string;
	ctaType: string;
	idealFor?: string;
	includes: string[];
	requirements?: string[];
}

export type OneTimePlan = SelfHostedPlan | PartnershipPlan;

export interface PricingSchema {
	monthly: RecurringPlan[];
	annual: RecurringPlan[];
	oneTime: OneTimePlan[];
}

export interface PricingCatalog {
	pricing: PricingSchema;
}

// ---- Legacy plan model (still used by service detail pages & checkout) ----

export type LegacyPlanType = "monthly" | "annual" | "oneTime";
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

export interface LegacyPlan {
	id: string;
	pricingCategoryId?: PricingCategoryValue;
	productId?: string;
	productCategoryId?: ProductCategory;
	name: string;
	price: {
		oneTime: BasePlanPrice & { amount: number | PercentageString };
		monthly: BasePlanPrice & { amount: number };
		annual: BasePlanPrice & { amount: number; bannerText?: string };
	};
	highlighted?: boolean;
	cta: { text: string; type: "checkout" | "link"; href?: string };
}

export type Plan = LegacyPlan;
export type PlanType = LegacyPlanType;
