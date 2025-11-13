import type { ROIEstimator, RoiEstimatorTier } from "@/types/service/plans";

export type RoiTierKey = string;

export interface RoiInputs {
	averageDealAmount: number;
	monthlyDealsClosed: number;
	averageTimePerDealHours: number;
	industry: string;
}

export interface RoiComputedResults {
	gainLow: number;
	gainHigh: number;
	setupLow?: number;
	setupHigh?: number;
	year1Profit: number;
	year5Profit: number;
	year10Profit: number;
	buyoutSetup: number;
	buyoutMaintenance: number;
	paybackMonths: number;
	timeSavedMonthly: number;
	timeSavedAnnual: number;
	manualHoursMonthly: number;
}

export interface RoiCostBreakdown {
	monthlyCost?: number;
	annualCost?: number;
	oneTimeCost?: number;
	setupRange?: { low: number; high: number } | null;
}

export interface RoiTierResult extends RoiComputedResults {
	tierKey: RoiTierKey;
	tier: RoiEstimatorTier;
	costs: RoiCostBreakdown;
	automationReductionPercent: number;
	showSetupDefault: boolean;
}

export interface RoiTierConfig {
	key: RoiTierKey;
	tier: RoiEstimatorTier;
	showSetupDefault: boolean;
}

export interface ComputeTierResultOptions {
	estimator: ROIEstimator;
	inputs: RoiInputs;
	tierKey?: RoiTierKey;
}
