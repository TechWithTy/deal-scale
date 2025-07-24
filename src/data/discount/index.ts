// ! Discount Code Data Store
// This file contains mock discount code objects for the Deal Scale platform.
// todo: Replace with real data source (DB/API) as needed.

import type { DiscountCode } from "@/types/discount/discountCode";

export const discountCodes: DiscountCode[] = [
	{
		id: "DSAFF10-12345",
		code: "AFFILIATE-12345",
		expires: new Date("2025-12-31T23:59:59Z"),
		affiliateId: "AFFILIATE-12345",
		created: new Date("2025-07-01T00:00:00Z"),
		maxUses: 100,
		usedCount: 0,
		discountPercent: 10,
		isActive: true,
		description: "10% off for Deal Scale affiliate referrals.",
	},
];
