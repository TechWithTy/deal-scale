import { PRICING_CATEGORIES, type Plan } from "@/types/service/plans";

/**
 * Additional pricing packages for advanced service offerings.
 */
export const AdditionalPricingPlans = [
	{
		id: "pro_tier",
		pricingCategoryId: PRICING_CATEGORIES.LEAD_GENERATION,
		name: "Pro",
		price: {
			monthly: {
				amount: 2499,
				description: "per month, billed monthly",
				features: [
					"Up to 5 users",
					"Access to 140M+ property records",
					"10,000 AI credits",
					"500 skip trace credits",
					"200 lead credits",
					"Standard AI outreach flows",
					"Email & chat support",
				],
			},
			annual: {
				amount: 24990,
				description: "per year, billed annually",
				features: [
					"Up to 5 users",
					"Access to 140M+ property records",
					"120,000 AI credits (10k/mo)",
					"6,000 skip trace credits (500/mo)",
					"2,400 lead credits (200/mo)",
					"Standard AI outreach flows",
					"Priority email & chat support",
				],
				bannerText: "Save 17% with annual billing",
			},
			oneTime: {
				amount: 0,
				description: "Not available for this plan",
				features: [],
			},
		},
		highlighted: false,
		cta: { text: "Choose Pro", type: "checkout" },
	},
	{
		id: "performance_tier",
		pricingCategoryId: PRICING_CATEGORIES.LEAD_GENERATION,
		name: "Performance",
		price: {
			monthly: {
				amount: 0,
				description: "Not available for this plan",
				features: [],
			},
			annual: {
				amount: 0,
				description: "Not available for this plan",
				features: [],
			},
			oneTime: {
				amount: 200,
				description: "per qualified appointment delivered",
				features: [
					"No monthly subscription fee",
					"Pay only for results",
					"Fully managed AI campaigns",
					"Sales-ready appointments delivered",
					"Ideal for validating deal flow",
					"Optional 5-25% finders fee on closed deals",
				],
			},
		},
		highlighted: true,
		cta: { text: "Apply", type: "link", href: "/contact" },
	},
	{
		id: "scale_tier",
		pricingCategoryId: PRICING_CATEGORIES.LEAD_GENERATION,
		name: "Scale",
		price: {
			monthly: {
				amount: 5999,
				description: "per month, billed monthly",
				features: [
					"Everything in Pro",
					"Unlimited users",
					"50,000 AI credits",
					"1,500 skip trace credits",
					"500 lead credits",
					"Customizable AI agent flows",
					"Priority access to premium zip codes",
					"Dedicated account manager",
				],
			},
			annual: {
				amount: 59990,
				description: "per year, billed annually",
				features: [
					"Everything in Pro",
					"Unlimited users",
					"600,000 AI credits (50k/mo)",
					"18,000 skip trace credits (1.5k/mo)",
					"6,000 lead credits (500/mo)",
					"Customizable AI agent flows",
					"Priority access to premium zip codes",
					"Dedicated account manager & onboarding",
				],
				bannerText: "Save 17% with annual billing",
			},
			oneTime: {
				amount: 0,
				description: "Not available for this plan",
				features: [],
			},
		},
		highlighted: false,
		cta: { text: "Choose Scale", type: "checkout" },
	},
] satisfies Plan[];

/**
 * Lookup helper for consumers that need a deterministic plan by identifier.
 */
export const getAdditionalPricingPlanById = (planId: string) =>
	AdditionalPricingPlans.find((plan) => plan.id === planId) ?? null;
