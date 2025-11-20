import { AdditionalPricingPlans } from "../service/slug_data/pricing/other";

describe("AdditionalPricingPlans dataset", () => {
	it("exposes well-formed pricing plans", () => {
		expect(Array.isArray(AdditionalPricingPlans)).toBe(true);
		expect(AdditionalPricingPlans.length).toBeGreaterThanOrEqual(3);

		for (const plan of AdditionalPricingPlans) {
			expect(typeof plan.id).toBe("string");
			expect(plan.id).not.toHaveLength(0);
			expect(typeof plan.name).toBe("string");
			expect(plan.name).not.toHaveLength(0);
			expect(typeof plan.price).toBe("object");

			const { price } = plan;
			expect(
				typeof price.oneTime.amount === "number" ||
					typeof price.oneTime.amount === "string",
			).toBe(true);
			expect(typeof price.oneTime.description).toBe("string");
			expect(Array.isArray(price.oneTime.features)).toBe(true);

			expect(typeof price.monthly.amount).toBe("number");
			expect(typeof price.monthly.description).toBe("string");
			expect(Array.isArray(price.monthly.features)).toBe(true);

			expect(typeof price.annual.amount).toBe("number");
			expect(typeof price.annual.description).toBe("string");
			expect(Array.isArray(price.annual.features)).toBe(true);

			expect(typeof plan.cta.text).toBe("string");
			expect(["checkout", "link"]).toContain(plan.cta.type);
		}
	});
});
