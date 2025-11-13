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
		expect(result.setupHigh).toBeGreaterThan(result.setupLow ?? 0);
		expect(result.costs.setupRange).not.toBeNull();
	});

	it("derives monthly tier subscription costs", () => {
		const result = computeTierResult({
			estimator: ROI_ESTIMATOR,
			inputs: coerceInputs(ROI_ESTIMATOR),
			tierKey: "monthly",
		});

		expect(result.tier.label).toBe("Monthly License");
		expect(result.costs.monthlyCost).toBeGreaterThan(0);
		expect(result.costs.setupRange).not.toBeNull();
		expect(result.showSetupDefault).toBe(false);
	});

	it("coerces partial inputs to estimator defaults", () => {
		const inputs = coerceInputs(ROI_ESTIMATOR, {
			averageDealAmount: 15000,
			monthlyDealsClosed: 10,
		});

		expect(inputs.averageDealAmount).toBe(15000);
		expect(inputs.monthlyDealsClosed).toBe(10);
		expect(inputs.industry).toBe(ROI_ESTIMATOR.exampleInput.industry);
	});
});
