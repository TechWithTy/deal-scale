// src/utils/__tests__/api/stripe/discounts/discountValidation.test.ts
import { validateDiscountCode } from "@/utils/discountValidator";
import type { DiscountCode } from "@/types/discount/discountCode";
import type { PricingCategoryValue } from "@/types/service/plans";
import type { ProductCategory } from "@/types/products";

describe("validateDiscountCode", () => {
	const baseDiscountCode: DiscountCode = {
		id: "DISCOUNT123",
		code: "TESTCODE",
		isActive: true,
		discountPercent: 10,
		created: new Date(),
		expires: new Date("2099-01-01T00:00:00.000Z"),
	};

	// Test case 1: Valid code with no restrictions
	it("should return valid for an active, non-expired code with no restrictions", () => {
		const result = validateDiscountCode(baseDiscountCode, {});
		expect(result.isValid).toBe(true);
		expect(result.errorMessage).toBeNull();
	});

	// Test case 2: Inactive code
	it("should return invalid for an inactive code", () => {
		const inactiveCode = { ...baseDiscountCode, isActive: false };
		const result = validateDiscountCode(inactiveCode, {});
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe("This discount code is no longer active.");
	});

	// Test case 3: Expired code
	it("should return invalid for an expired code", () => {
		const expiredCode = {
			...baseDiscountCode,
			expires: new Date("2020-01-01T00:00:00.000Z"),
		};
		const result = validateDiscountCode(expiredCode, {});
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe("This discount code has expired.");
	});

	// Test case 4: Usage limit reached
	it("should return invalid when usage limit is reached", () => {
		const usedCode = { ...baseDiscountCode, maxUses: 100, usedCount: 100 };
		const result = validateDiscountCode(usedCode, {});
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe(
			"This discount code has reached its usage limit.",
		);
	});

	// Test case 5: Valid code with matching planId
	it("should return valid for a code with a matching planId restriction", () => {
		const planRestrictedCode = { ...baseDiscountCode, planIds: ["plan_basic"] };
		const result = validateDiscountCode(planRestrictedCode, {
			planId: "plan_basic",
		});
		expect(result.isValid).toBe(true);
	});

	// Test case 6: Invalid code with non-matching planId
	it("should return invalid for a code with a non-matching planId restriction", () => {
		const planRestrictedCode = {
			...baseDiscountCode,
			planIds: ["plan_premium"],
		};
		const result = validateDiscountCode(planRestrictedCode, {
			planId: "plan_basic",
		});
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe(
			"This code is not valid for the selected plan.",
		);
	});

	// Test case 7: Valid code with matching planCategoryId
	it("should return valid for a code with a matching planCategoryId restriction", () => {
		const categoryRestrictedCode = {
			...baseDiscountCode,
			planCategoryIds: ["monthly" as PricingCategoryValue],
		};
		const result = validateDiscountCode(categoryRestrictedCode, {
			planCategoryId: "monthly" as PricingCategoryValue,
		});
		expect(result.isValid).toBe(true);
	});

	// Test case 8: Invalid code with non-matching planCategoryId
	it("should return invalid for a code with a non-matching planCategoryId restriction", () => {
		const categoryRestrictedCode = {
			...baseDiscountCode,
			planCategoryIds: ["yearly" as PricingCategoryValue],
		};
		const result = validateDiscountCode(categoryRestrictedCode, {
			planCategoryId: "monthly" as PricingCategoryValue,
		});
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe(
			"This code is not valid for this plan category.",
		);
	});

	// Test case 9: Valid code with matching productId
	it("should return valid for a code with a matching productId restriction", () => {
		const productRestrictedCode = {
			...baseDiscountCode,
			productIds: ["prod_1"],
		};
		const result = validateDiscountCode(productRestrictedCode, {
			productId: "prod_1",
		});
		expect(result.isValid).toBe(true);
	});

	// Test case 10: Invalid code with non-matching productId
	it("should return invalid for a code with a non-matching productId restriction", () => {
		const productRestrictedCode = {
			...baseDiscountCode,
			productIds: ["prod_1"],
		};
		const result = validateDiscountCode(productRestrictedCode, {
			productId: "prod_2",
		});
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe(
			"This code is not valid for this product.",
		);
	});

	// Test case 11: Valid code with matching productCategoryId
	it("should return valid for a code with a matching productCategoryId restriction", () => {
		const categoryRestrictedCode = {
			...baseDiscountCode,
			productCategoryIds: ["Workflows" as ProductCategory],
		};
		const result = validateDiscountCode(categoryRestrictedCode, {
			productCategories: ["Workflows" as ProductCategory],
		});
		expect(result.isValid).toBe(true);
	});

	// Test case 12: Invalid code with non-matching productCategoryId
	it("should return invalid for a code with a non-matching productCategoryId restriction", () => {
		const categoryRestrictedCode = {
			...baseDiscountCode,
			productCategoryIds: ["Automation" as ProductCategory],
		};
		const result = validateDiscountCode(categoryRestrictedCode, {
			productCategories: ["Workflows" as ProductCategory],
		});
		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toBe(
			"This code is not valid for this product category.",
		);
	});
});
