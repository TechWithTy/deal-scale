// src/utils/discountValidator.ts
import type { DiscountCode } from "@/types/discount/discountCode";
import type { ProductCategory } from "@/types/products";
import type { Plan, PricingCategoryValue } from "@/types/service/plans";
import type { ServiceCategoryValue } from "@/types/service/services";

interface ValidationResult {
	isValid: boolean;
	errorMessage: string | null;
}

/**
 * Validates a discount code against a given plan.
 * @param discountCode The discount code to validate.
 * @param plan The plan the code is being applied to.
 * @returns An object with validation result.
 */
export const validateDiscountCode = (
	discountCode: DiscountCode,
	validationData: {
		plan?: Plan;
		serviceId?: string;
		serviceCategoryId?: ServiceCategoryValue;
		planId?: string;
		planCategoryId?: PricingCategoryValue;
		productId?: string;
		productCategories?: ProductCategory[];
	},
): ValidationResult => {
	// 1. Check basic code validity (active, not expired)
	if (!discountCode.isActive) {
		console.log("Discount validation failed: code is not active.", {
			discountCode,
		});
		return {
			isValid: false,
			errorMessage: "This discount code is no longer active.",
		};
	}
	if (discountCode.expires && new Date(discountCode.expires) < new Date()) {
		console.log("Discount validation failed: code has expired.", {
			discountCode,
		});
		return { isValid: false, errorMessage: "This discount code has expired." };
	}

	// 2. Check usage limits
	if (
		discountCode.maxUses !== undefined &&
		(discountCode.usedCount ?? 0) >= discountCode.maxUses
	) {
		console.log("Discount validation failed: usage limit reached.", {
			discountCode,
		});
		return {
			isValid: false,
			errorMessage: "This discount code has reached its usage limit.",
		};
	}

	// 3. Check service and category restrictions
	if (
		discountCode.serviceIds &&
		(!validationData.serviceId ||
			!discountCode.serviceIds.includes(validationData.serviceId))
	) {
		console.log("Discount validation failed: service ID mismatch.", {
			required: discountCode.serviceIds,
			actual: validationData.serviceId,
		});
		return {
			isValid: false,
			errorMessage: "This code is not valid for this service.",
		};
	}
	if (
		discountCode.serviceCategoryIds &&
		(!validationData.serviceCategoryId ||
			!discountCode.serviceCategoryIds.includes(
				validationData.serviceCategoryId,
			))
	) {
		console.log("Discount validation failed: service category ID mismatch.", {
			required: discountCode.serviceCategoryIds,
			actual: validationData.serviceCategoryId,
		});
		return {
			isValid: false,
			errorMessage: "This code is not valid for this service category.",
		};
	}

	// 3.5. Check plan and plan category restrictions
	if (
		discountCode.planIds &&
		(!validationData.planId ||
			!discountCode.planIds.includes(validationData.planId))
	) {
		console.log("Discount validation failed: plan ID mismatch.", {
			required: discountCode.planIds,
			actual: validationData.planId,
		});
		return {
			isValid: false,
			errorMessage: "This code is not valid for the selected plan.",
		};
	}
	if (
		discountCode.planCategoryIds &&
		(!validationData.planCategoryId ||
			!discountCode.planCategoryIds.includes(validationData.planCategoryId))
	) {
		console.log("Discount validation failed: plan category ID mismatch.", {
			required: discountCode.planCategoryIds,
			actual: validationData.planCategoryId,
		});
		return {
			isValid: false,
			errorMessage: "This code is not valid for this plan category.",
		};
	}

	// 4. Check product and product category restrictions
	if (
		discountCode.productIds &&
		(!validationData.productId ||
			!discountCode.productIds.includes(validationData.productId))
	) {
		console.log("Discount validation failed: product ID mismatch.", {
			required: discountCode.productIds,
			actual: validationData.productId,
		});
		return {
			isValid: false,
			errorMessage: "This code is not valid for this product.",
		};
	}

	// Check if any of the product's categories are in the allowed list
	if (
		discountCode.productCategoryIds &&
		discountCode.productCategoryIds.length > 0
	) {
		const allowedCategories = discountCode.productCategoryIds;
		const hasMatchingCategory = validationData.productCategories?.some((cat) =>
			allowedCategories.includes(cat),
		);
		if (!hasMatchingCategory) {
			console.log("Discount validation failed: product category ID mismatch.", {
				required: discountCode.productCategoryIds,
				actual: validationData.productCategories,
			});
			return {
				isValid: false,
				errorMessage: "This code is not valid for this product category.",
			};
		}
	}

	// If all checks pass, the code is valid
	return { isValid: true, errorMessage: null };
};
