import type { ROIEstimator, RoiEstimatorTier } from "@/types/service/plans";
import {
	ComputeTierResultOptions,
	RoiCostBreakdown,
	RoiInputs,
	RoiTierConfig,
	RoiTierKey,
	RoiTierResult,
} from "./types";

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const BASE_REVENUE_LIFT = { low: 0.15, high: 0.3 };
const BASE_SETUP_PERCENT = { low: 0.05, high: 0.1 };
const BASE_EFFICIENCY = 0.5;

const defaultSelfHostedTier: RoiEstimatorTier = {
	label: "Self-Hosted",
	kind: "selfHosted",
	revenueLift: BASE_REVENUE_LIFT,
	setupPercentRange: BASE_SETUP_PERCENT,
	efficiency: BASE_EFFICIENCY,
	showSetupByDefault: true,
};

export const resolveTierConfigs = (
	estimator: ROIEstimator,
): RoiTierConfig[] => {
	const entries = Object.entries(estimator.tiers ?? {}) as Array<[
		RoiTierKey,
		RoiEstimatorTier,
	]>;

	if (!entries.length) {
		const key: RoiTierKey = "selfHosted";
		return [
			{
				key,
				tier: defaultSelfHostedTier,
				showSetupDefault:
					estimator.tiers?.[key]?.showSetupByDefault ?? true,
				group: "selfHosted",
				groupLabel: "Self-Hosted",
				isGroupDefault: true,
			},
		];
	}

	return entries.map(([key, tier]) => {
		const group = tier.group ?? tier.kind ?? key;
		const groupLabel = tier.groupLabel ?? tier.label;

		return {
			key,
			tier,
			showSetupDefault: tier.showSetupByDefault ?? tier.kind === "selfHosted",
			group,
			groupLabel,
			isGroupDefault: tier.defaultForGroup ?? false,
		};
	});
};

const getActiveTier = (
	tiers: RoiTierConfig[],
	tierKey?: RoiTierKey,
): RoiTierConfig => {
	const fallback = tiers[0];
	if (!tierKey) {
		return fallback;
	}
	return tiers.find((entry) => entry.key === tierKey) ?? fallback;
};

const resolveRevenueLift = (tier: RoiEstimatorTier) =>
	tier.revenueLift ?? BASE_REVENUE_LIFT;

const resolveEfficiency = (tier: RoiEstimatorTier) =>
	tier.efficiency ?? (tier.kind === "selfHosted" ? BASE_EFFICIENCY : 0.4);

const computeSetupRange = (
	tier: RoiEstimatorTier,
	annualRevenueHigh: number,
): { low: number; high: number } | null => {
	if (tier.costs?.setup !== undefined) {
		if (typeof tier.costs.setup === "number") {
			return { low: tier.costs.setup, high: tier.costs.setup };
		}
		const { low, high } = tier.costs.setup;
		return { low, high: high ?? low };
	}

	const percentRange =
		tier.setupPercentRange ??
		(tier.kind === "selfHosted" ? BASE_SETUP_PERCENT : undefined);

	if (!percentRange) {
		return null;
	}

	return {
		low: annualRevenueHigh * percentRange.low,
		high: annualRevenueHigh * (percentRange.high ?? percentRange.low),
	};
};

const computeCostBreakdown = (
	tier: RoiEstimatorTier,
	annualRevenueHigh: number,
): RoiCostBreakdown => {
	const monthlyCost = tier.costs?.monthly;
	const annualCost = tier.costs?.annual ?? (monthlyCost ? monthlyCost * 12 : undefined);
	const oneTimeCost = tier.costs?.oneTime;
	const setupRange = computeSetupRange(tier, annualRevenueHigh);

	return {
		monthlyCost,
		annualCost,
		oneTimeCost,
		setupRange,
	};
};

export const computeTierResult = (
	options: ComputeTierResultOptions,
): RoiTierResult => {
	const { estimator, inputs } = options;
	const tiers = resolveTierConfigs(estimator);
	const activeTier = getActiveTier(tiers, options.tierKey);
	const tier = activeTier.tier;

	const factor =
		estimator.industryFactors[inputs.industry] ??
		estimator.industryFactors.Other ??
		1;

	const averageDeal = clamp(inputs.averageDealAmount, 1000, 250000);
	const monthlyDeals = clamp(inputs.monthlyDealsClosed, 1, 200);
	const timePerDeal = clamp(inputs.averageTimePerDealHours, 1, 40);
	const monthlyOperatingCost = Math.max(inputs.monthlyOperatingCost ?? 0, 0);

	const monthlyBase = averageDeal * monthlyDeals;
	const revenueLift = resolveRevenueLift(tier);
	const grossGainLow = monthlyBase * factor * revenueLift.low;
	const grossGainHigh = monthlyBase * factor * revenueLift.high;

	const annualRevenueHigh = grossGainHigh * 12;
	const efficiency = resolveEfficiency(tier);

	const manualHoursMonthly = timePerDeal * monthlyDeals;
	const automationReduction = clamp(0.35 * factor, 0.25, 0.7);
	const timeSavedMonthly = manualHoursMonthly * automationReduction;
	const timeSavedAnnual = timeSavedMonthly * 12;

	const costBreakdown = computeCostBreakdown(tier, annualRevenueHigh);

	const setupHigh = costBreakdown.setupRange?.high ?? 0;
	const setupLow = costBreakdown.setupRange?.low ?? 0;
	const oneTimeCost = costBreakdown.oneTimeCost ?? 0;
	const monthlyPlanCost = costBreakdown.monthlyCost ?? 0;
	const annualPlanCost = costBreakdown.annualCost ?? 0;
	const annualPlanCostAsMonthly = annualPlanCost / 12;

	const totalMonthlyCost = monthlyPlanCost + annualPlanCostAsMonthly + monthlyOperatingCost;

	const gainLow = grossGainLow - totalMonthlyCost;
	const gainHigh = grossGainHigh - totalMonthlyCost;

	const totalYearOneCost =
		setupHigh +
		oneTimeCost +
		annualPlanCost +
		monthlyPlanCost * 12 +
		monthlyOperatingCost * 12;
	const year1Profit = grossGainHigh * 12 * efficiency - totalYearOneCost;
	const year5Profit = year1Profit * 5 * 0.55;
	const year10Profit = year1Profit * 10 * 0.55 * 1.1;

	const monthlyNetBenefit = grossGainHigh - totalMonthlyCost;

	const netMonthlyForPayback = Math.max(gainHigh, 0.0001);
	const paybackMonths = netMonthlyForPayback > 0 ? (setupHigh + oneTimeCost) / netMonthlyForPayback : Infinity;

	return {
		gainLow,
		gainHigh,
		setupLow,
		setupHigh,
		year1Profit,
		year5Profit,
		year10Profit,
		buyoutSetup: costBreakdown.setupRange?.high ?? setupHigh,
		buyoutMaintenance: annualPlanCost,
		paybackMonths,
		timeSavedMonthly,
		timeSavedAnnual,
		manualHoursMonthly,
		automationReductionPercent: automationReduction * 100,
		tierKey: activeTier.key,
		tier,
		costs: costBreakdown,
		showSetupDefault: activeTier.showSetupDefault,
		grossGainLow,
		grossGainHigh,
		monthlyNetBenefit,
		monthlyOperatingCost,
	};
};

export const getDefaultTierKey = (estimator: ROIEstimator) => {
	if (estimator.defaultTier) {
		return estimator.defaultTier;
	}
	const tiers = resolveTierConfigs(estimator);
	const defaultEntry = tiers.find((entry) => entry.tier.default);
	return defaultEntry?.key ?? tiers[0]?.key ?? "selfHosted";
};

export const coerceInputs = (
	estimator: ROIEstimator,
	partial?: Partial<RoiInputs>,
): RoiInputs => ({
	averageDealAmount: partial?.averageDealAmount ?? estimator.exampleInput.averageDealAmount,
	monthlyDealsClosed: partial?.monthlyDealsClosed ?? estimator.exampleInput.monthlyDealsClosed,
	averageTimePerDealHours:
		partial?.averageTimePerDealHours ?? estimator.exampleInput.averageTimePerDealHours,
	industry: partial?.industry ?? estimator.exampleInput.industry,
	monthlyOperatingCost: partial?.monthlyOperatingCost ?? estimator.exampleInput.monthlyOperatingCost,
});
