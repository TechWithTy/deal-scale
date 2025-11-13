// Mock discount code data for testing payment form functionality
import type { DiscountCode } from "@/types/discount/discountCode";
import { v4 as uuidv4 } from "uuid";

// Helper to generate affiliateId in format: handle-XXXXXX
export function mockGenDiscountCode(handle: string): string {
	const clean = handle.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
	return `${clean}-${uuidv4().slice(0, 6).toUpperCase()}`;
}

import { ProductCategory } from "@/types/products";
import { PRICING_CATEGORIES } from "@/types/service/plans";
import { SERVICE_CATEGORIES } from "@/types/service/services";

export const mockDiscountCodes: DiscountCode[] = [
	{
		code: "SERVICEONLY",
		id: uuidv4(),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		created: new Date(),
		discountPercent: 15,
		isActive: true,
		description: "15% off a specific service.",
		serviceIds: ["lead-generation-management"], // ! ID for AI outbound qualification service
	},
	{
		code: "SERVICECATEGORY",
		id: uuidv4(),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		created: new Date(),
		discountPercent: 20,
		isActive: true,
		description:
			"20% off any lookalike audience expansion service inspired by How to Win Friends and Influence People.",
		serviceCategoryIds: [SERVICE_CATEGORIES.LEAD_GENERATION],
	},
	{
		code: "PRODUCTONLY",
		id: uuidv4(),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		created: new Date(),
		discountAmount: 50,
		isActive: true,
		description: "$50 off AI Credits Bundle.",
		productIds: ["DS-AI-CRED"],
	},
	{
		code: "PRODUCTCATEGORY",
		id: uuidv4(),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		created: new Date(),
		discountPercent: 25,
		isActive: true,
		description: "25% off any product in the 'Data' category.",
		productCategoryIds: [ProductCategory.Credits],
	},
	{
		code: "SCALE50",
		id: uuidv4(),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
		created: new Date(),
		discountPercent: 50,
		isActive: true,
		description: "Limited-time 50% launch coupon for AI Conversation Credits.",
		productCategoryIds: [ProductCategory.Credits, ProductCategory.Automation],
		planIds: [
			"basic",
			"starter",
			"enterprisePlus",
			"basicAnnual",
			"starterAnnual",
			"enterpriseAnnual",
		],
	},
	{
		code: "STARTER25",
		id: uuidv4(),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		created: new Date(),
		discountPercent: 25,
		isActive: true,
		description: "25% off the Starter Plan only.",
		planIds: ["starter-plan"], // ! Matches the Plan ID
	},
	{
		code: "LEADGEN15",
		id: uuidv4(),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		created: new Date(),
		discountPercent: 15,
		isActive: true,
		description: "15% off any Lookalike Audience Expansion Inspired By How To Win Friends And Influence People plan.",
		planCategoryIds: [PRICING_CATEGORIES.LEAD_GENERATION],
	},
	{
		code: mockGenDiscountCode("partnerpilot"),
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		affiliateId: mockGenDiscountCode("partnerpilot"),
		created: new Date(Date.now() - 1000 * 60 * 60 * 24),
		discountPercent: 50,
		isActive: true,
		description: "Free pilot for partners!",
		id: "DSAFF10-12345",
		maxUses: 100,
		usedCount: 0,
	},
	{
		code: "SAVE10",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
		created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
		discountAmount: 1000,
		isActive: true,
		description: "$10 off your pilot deposit!",
		id: uuidv4(),
		maxUses: 100,
		usedCount: 0,
		affiliateId: mockGenDiscountCode("savewithus"),
	},
	{
		code: "EXPIRED20",
		expires: new Date(Date.now() - 1000 * 60 * 60 * 24),
		created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
		discountPercent: 20,
		isActive: false,
		description: "20% off (expired)",
		id: "DSAFF10-12345",
		maxUses: 100,
		usedCount: 0,
		affiliateId: mockGenDiscountCode("expireduser"),
	},
	{
		code: "AFFILIATE5",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		affiliateId: mockGenDiscountCode("affxyz"),
		created: new Date(),
		discountAmount: 500,
		isActive: true,
		description: "$5 off via affiliate program",
		id: "DSAFF10-12345",
		maxUses: 100,
		usedCount: 0,
	},
];
