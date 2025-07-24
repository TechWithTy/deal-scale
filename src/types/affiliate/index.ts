import type { z } from "zod";
import type { affiliateFormSchema } from "@/data/contact/affiliate";
import type { BetaUser } from "@/types/user/beta";
import type { PilotUser } from "@/types/user/pilot";
import type { DiscountCode } from "@/types/discount/discountCode";

/**
 * @description Base affiliate type derived from the affiliate sign-up form.
 * Contains core information required for an affiliate account.
 * @see affiliateFormSchema
 */
export type Affiliate = z.infer<typeof affiliateFormSchema>;

/**
 * @description Extends the base Affiliate type with optional user profile data.
 * This allows an affiliate to also be a beta or pilot user, and adds fields for internal use.
 */
export type AffiliateProfile = Affiliate & {
	id: string;
	userProfile?: BetaUser | PilotUser;
	commissionRate?: number;
	discountCodes?: DiscountCode[];
	approved?: boolean;
	createdAt?: string;
};
