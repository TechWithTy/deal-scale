import type { ProductCategory, ProductType } from "../products";
import type { Plan } from "../service/plans";
import type {
	Feature,
	ServiceCategoryValue,
	ServiceItemData,
} from "../service/services";

// Discount code type for payment forms
export interface DiscountCode {
	code: string;
	id: string;
	expires: Date; // Expiry date
	affiliateId?: string; // Optional affiliate or partner ID
	created: Date;
	updated?: Date;
	maxUses?: number; // Optional: limit how many times this code can be used
	usedCount?: number; // Optional: track usage
	discountAmount?: number; // Optional: flat discount in cents
	discountPercent?: number; // Optional: percent discount (0-100)
	isActive: boolean;
	description?: string;

	// Product-specific restrictions
	productIds?: Array<ProductType["id"]>;
	productCategoryIds?: ProductCategory[];

	// Service-specific restrictions
	serviceIds?: Array<ServiceItemData["id"]>;
	serviceCategoryIds?: ServiceCategoryValue[];
	planIds?: Array<Plan["id"]>;
	planCategoryIds?: Plan["pricingCategoryId"][];

	// Feature-specific restrictions
}
