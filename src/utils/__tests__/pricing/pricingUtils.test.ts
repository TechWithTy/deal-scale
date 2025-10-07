import {
	PLAN_TYPES,
	computeAnnualDiscountSummary,
	hasDisplayablePricing,
} from "@/components/home/pricing/pricingUtils";
import type { DiscountCode } from "@/types/discount/discountCode";
import type { Plan } from "@/types/service/plans";

function createDiscountCode(
	overrides: Partial<DiscountCode> = {},
): DiscountCode {
	const now = new Date();

	return {
		code: overrides.code ?? "TEST",
		id: overrides.id ?? "test-id",
		expires: overrides.expires ?? new Date(now.getTime() + 86_400_000),
		created: overrides.created ?? now,
		isActive: overrides.isActive ?? true,
		...overrides,
	};
}

function createPlan(overrides: Partial<Plan> = {}): Plan {
	const base: Plan = {
		id: "base-plan",
		name: "Base Plan",
		price: {
			monthly: {
				amount: 1000,
				description: "per month",
				features: ["Support"],
			},
			annual: {
				amount: 10_000,
				description: "per year",
				features: ["Support"],
			},
			oneTime: {
				amount: 1500,
				description: "one time",
				features: ["Support"],
			},
		},
		cta: { text: "Choose Plan", type: "checkout" },
	};

	return {
		...base,
		...overrides,
		price: {
			...base.price,
			...overrides.price,
			monthly: {
				...base.price.monthly,
				...overrides.price?.monthly,
			},
			annual: {
				...base.price.annual,
				...overrides.price?.annual,
			},
			oneTime: {
				...base.price.oneTime,
				...overrides.price?.oneTime,
			},
		},
	};
}

describe("pricingUtils", () => {
	describe("hasDisplayablePricing", () => {
		it("returns false when price data is missing", () => {
			expect(hasDisplayablePricing(undefined)).toBe(false);
		});

		it("returns false when amount is zero and there are no features", () => {
			expect(
				hasDisplayablePricing({
					amount: 0,
					description: "n/a",
					features: [],
				}),
			).toBe(false);
		});

		it("returns true when features are present even if amount is zero", () => {
			expect(
				hasDisplayablePricing({
					amount: 0,
					description: "n/a",
					features: ["Included"],
				}),
			).toBe(true);
		});

		it("returns true for percentage-based pricing strings", () => {
			expect(
				hasDisplayablePricing({
					amount: "35%",
					description: "percentage",
					features: [],
				}),
			).toBe(true);
		});

		it("returns true for positive numeric amounts", () => {
			expect(
				hasDisplayablePricing({
					amount: 500,
					description: "price",
					features: [],
				}),
			).toBe(true);
		});
	});

	describe("computeAnnualDiscountSummary", () => {
		it("returns undefined when no plans include discounts", () => {
			const result = computeAnnualDiscountSummary([createPlan()]);
			expect(result).toBeUndefined();
		});

		it("captures the maximum percentage and amount across plans", () => {
			const plans: Plan[] = [
				createPlan({
					id: "percent",
					price: {
						annual: {
							discount: {
								code: createDiscountCode({ discountPercent: 20 }),
								autoApply: true,
							},
						},
					},
				}),
				createPlan({
					id: "amount",
					price: {
						annual: {
							discount: {
								code: createDiscountCode({ discountAmount: 750 }),
								autoApply: false,
							},
						},
					},
				}),
			];

			const result = computeAnnualDiscountSummary(plans);
			expect(result).toEqual({ percent: 20, amount: 750 });
		});

		it("handles plans where later entries override smaller discounts", () => {
			const plans: Plan[] = [
				createPlan({
					id: "smaller",
					price: {
						annual: {
							discount: {
								code: createDiscountCode({
									discountPercent: 5,
									discountAmount: 100,
								}),
								autoApply: true,
							},
						},
					},
				}),
				createPlan({
					id: "larger",
					price: {
						annual: {
							discount: {
								code: createDiscountCode({
									discountPercent: 15,
									discountAmount: 250,
								}),
								autoApply: true,
							},
						},
					},
				}),
			];

			const result = computeAnnualDiscountSummary(plans);
			expect(result).toEqual({ percent: 15, amount: 250 });
		});
	});

	it("exposes plan types for downstream selectors", () => {
		expect(PLAN_TYPES).toEqual(["monthly", "annual", "oneTime"]);
	});
});
