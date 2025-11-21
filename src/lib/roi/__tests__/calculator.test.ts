import { describe, expect, it } from "vitest";

import { ROI_ESTIMATOR } from "@/data/service/slug_data/pricing/roiEstimator";
import {
	coerceInputs,
	computeTierResult,
	getDefaultTierKey,
	resolveTierConfigs,
} from "@/lib/roi/calculator";

describe("ROI tier calculations", () => {
	it("computes default self-hosted results", () => {
		const tiers = resolveTierConfigs(ROI_ESTIMATOR);
		expect(tiers.length).toBeGreaterThan(0);

		const result = computeTierResult({
			estimator: ROI_ESTIMATOR,
			inputs: coerceInputs(ROI_ESTIMATOR),
		});

		expect(result.tierKey).toBe(getDefaultTierKey(ROI_ESTIMATOR));
		expect(result.gainLow).toBeGreaterThan(0);
		expect(result.grossGainHigh).toBeGreaterThan(0);
		expect(result.grossGainHigh).toBeGreaterThanOrEqual(result.gainHigh);
		expect(result.costs.setupRange).not.toBeNull();
	});

	it("maps basic monthly plan pricing into the calculator", () => {
		const result = computeTierResult({
			estimator: ROI_ESTIMATOR,
			inputs: coerceInputs(ROI_ESTIMATOR),
			tierKey: "basicMonthly",
		});

		expect(result.tier.label).toBe("Basic Monthly");
		expect(result.costs.monthlyCost).toBe(2000);
		expect(result.showSetupDefault).toBe(false);
		expect(result.monthlyNetBenefit).toBeLessThan(result.grossGainHigh);
	});

	it("subtracts user monthly operating cost", () => {
		const result = computeTierResult({
			estimator: ROI_ESTIMATOR,
			inputs: coerceInputs(ROI_ESTIMATOR, {
				monthlyOperatingCost: 3000,
			}),
			tierKey: "starterMonthly",
		});

		expect(result.monthlyOperatingCost).toBe(3000);
		expect(result.gainHigh).toBeLessThan(result.grossGainHigh);
	});

	it("coerces partial inputs to estimator defaults", () => {
		const inputs = coerceInputs(ROI_ESTIMATOR, {
			averageDealAmount: 15000,
			monthlyDealsClosed: 10,
		});

		expect(inputs.averageDealAmount).toBe(15000);
		expect(inputs.monthlyDealsClosed).toBe(10);
		expect(inputs.industry).toBe(ROI_ESTIMATOR.exampleInput.industry);
		expect(inputs.monthlyOperatingCost).toBe(0);
	});
});
