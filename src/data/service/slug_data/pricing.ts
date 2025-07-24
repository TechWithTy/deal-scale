import { type Plan, PRICING_CATEGORIES } from "@/types/service/plans";

export const PricingPlans: Plan[] = [
	{
		id: "basic-plan",
		pricingCategoryId: PRICING_CATEGORIES.LEAD_GENERATION,
		name: "Basic",
		price: {
			monthly: {
				amount: 500,
				description: "per month",
				features: [
					"400 AI Credits",
					"100 Skip Trace Credits",
					"400 Lead Credits",
					"$75/mo per Additional Seat",
					"Standard Campaign Goals",
				],
			},
			annual: {
				amount: 5000,
				description: "Per Year + (2 Months Free)",
				features: [
					"4,800 AI Credits",
					"1,200 Skip Trace Credits",
					"4,800 Lead Credits",
					"$75/mo per Additional Seat",
					"Standard Campaign Goals",
				],
				discount: {
					code: require("@/data/discount/mockDiscountCodes")
						.mockDiscountCodes[0],
					autoApply: true,
				},
				bannerText: "Limited time: 50% off annual!",
			},
			oneTime: { amount: 0, description: "", features: [] },
		},
		highlighted: false,
		cta: { text: "Choose Basic", type: "checkout" },
	},
	{
		id: "starter-plan",
		pricingCategoryId: PRICING_CATEGORIES.LEAD_GENERATION,
		name: "Starter",
		price: {
			monthly: {
				amount: 2000,
				description: "per month",
				features: [
					"2,000 AI Credits",
					"500 Skip Trace Credits",
					"2,000 Lead Credits",
					"$50/mo per Additional Seat",
					"AI Powered Kanban Board",
					"Voice Cloning & Custom Voicemail",
					"Custom Campaign Goals",
				],
			},
			annual: {
				amount: 20000,
				description: "Per Year + (2 Months Free)",
				features: [
					"24,000 AI Credits",
					"6,000 Skip Trace Credits",
					"24,000 Lead Credits",
					"$50/mo per Additional Seat",
					"AI Powered Kanban Board",
					"Voice Cloning & Custom Voicemail",
					"Custom Campaign Goals",
				],
				discount: {
					code: require("@/data/discount/mockDiscountCodes")
						.mockDiscountCodes[0],
					autoApply: true,
				},
				bannerText: "Limited time: 50% off annual!",
			},
			oneTime: { amount: 0, description: "", features: [] },
		},
		highlighted: true,
		cta: { text: "Choose Starter", type: "checkout" },
	},
	{
		id: "growth-plan",
		pricingCategoryId: PRICING_CATEGORIES.LEAD_GENERATION,
		name: "Enterprise",
		price: {
			monthly: {
				amount: 4500,
				description: "per month",
				features: [
					"Everything in Starter, plus:",
					"7,000 AI Credits",
					"Unlimited Skip Trace & Lead Credits",
					"Unlimited User Seats",
					"Priority Zip Code Access",
					"AI Inbound Call Agent",
					"Customizable Workflows",
				],
			},
			annual: {
				amount: 45000,
				description: "Per Year + (2 Months Free)",
				features: [
					"Everything in Starter, plus:",
					"84,000 AI Credits",
					"Unlimited Skip Trace & Lead Credits",
					"Unlimited User Seats",
					"Priority Zip Code Access",
					"AI Inbound Call Agent",
					"Customizable Workflows",
				],
				discount: {
					code: require("@/data/discount/mockDiscountCodes")
						.mockDiscountCodes[0],
					autoApply: true,
				},
				bannerText: "Limited time: 50% off annual!",
			},
			oneTime: { amount: 0, description: "", features: [] },
		},
		highlighted: false,
		cta: { text: "Choose Growth", type: "checkout" },
	},
	{
		id: "commission-partner",
		name: "Commission Partner",
		price: {
			oneTime: {
				amount: "35%",
				description: "35-50% of buyer-side commission per closed home purchase",
				features: [
					"Application & Qualification Required",
					"For high-volume agents, teams, and brokers",
					"Proven expertise closing buyer transactions at scale",
					"Leverage Deal Scale's tech to streamline escrow-to-close",
					"No Subscription or Platform Fees",
					"Unlimited AI & Data Credits Included",
					"Full Access to All Deal Scale Features",
					"Partnership model designed to maximize agent ROI",
				],
			},
			monthly: { amount: 0, description: "Commission-Based", features: [] },
			annual: { amount: 0, description: "Commission-Based", features: [] },
		},
		highlighted: true,
		cta: {
			text: "Apply for Commission Partnership",
			type: "link",
			href: "/contact",
		},
	},
	{
		id: "pay-per-lead",
		pricingCategoryId: PRICING_CATEGORIES.LEAD_GENERATION,
		name: "Pay-Per-Lead",
		price: {
			oneTime: {
				amount: 200,
				description: "+ per qualified lead delivered",
				features: [
					"Subject to Zip Code Availability & Qualification",
					"Pay only for sales-ready appointments",
					"Requires a proven intake process for hot transfers",
					"We handle all outreach & qualification",
					"No Subscription or Platform Fees",
					"Pricing may vary based on market demand",
				],
			},
			monthly: { amount: 0, description: "Usage-Based", features: [] },
			annual: { amount: 0, description: "Usage-Based", features: [] },
		},
		highlighted: false,
		cta: { text: "Check Availability", type: "link", href: "/contact" },
	},
];
