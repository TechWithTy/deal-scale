import { describe, it, expect } from "vitest";
import { pricingCatalog } from "../service/slug_data/pricing";

describe("pricingCatalog dataset", () => {
	it("exposes monthly, annual, and one-time pricing tiers", () => {
		expect(pricingCatalog.pricing.monthly.length).toBeGreaterThanOrEqual(3);
		expect(pricingCatalog.pricing.annual.length).toBeGreaterThanOrEqual(2);
		expect(pricingCatalog.pricing.oneTime.length).toBeGreaterThanOrEqual(1);
	});

	it("includes the self-hosted plan with ROI estimator", () => {
		const selfHosted = pricingCatalog.pricing.oneTime.find(
			(plan) => "roiEstimator" in plan,
		);
		expect(selfHosted).toBeDefined();
		if (!selfHosted || !("roiEstimator" in selfHosted)) {
			return;
		}

		expect(selfHosted.ctaPrimary.label).toBe("Contact Sales");
		expect(selfHosted.ctaSecondary.label).toBe("Estimate ROI & Setup Cost");
		expect(selfHosted.roiEstimator.inputs).toContain("averageDealAmount");
		expect(
			Object.keys(selfHosted.roiEstimator.industryFactors).length,
		).toBeGreaterThan(3);
	});
});


