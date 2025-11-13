import type { Plan, PricingCatalog } from "@/types/service/plans";
import { ROI_ESTIMATOR } from "./pricing/roiEstimator";

export const pricingCatalog: PricingCatalog = {
	pricing: {
		monthly: [
			{
				id: "free",
				name: "Free Trial",
				price: 0,
				unit: "month",
				ctaType: "upgrade",
				idealFor: "New users exploring DealScale",
				credits: { ai: 5, skipTrace: 0, lead: 0 },
				seats: 1,
				features: [
					"5 AI demo credits (approx. 4–5 minutes of AI call time)",
					"1 active campaign",
					"Dashboard + CRM preview",
					"Upgrade anytime for full automation access",
				],
			},
			{
				id: "basic",
				name: "Basic",
				price: 2000,
				unit: "month",
				ctaType: "subscribe",
				idealFor: "Solo agents, small teams, wholesalers",
				credits: { ai: 2000, skipTrace: 500, lead: 2000 },
				seats: { included: 3, additionalSeat: 50 },
				features: [
					"AI Voice & SMS Outreach",
					"Voice Cloning & Custom Voicemail",
					"2 Custom Voice Models",
					"AI Kanban Board & CRM Integrations",
					"Custom Campaign Goals",
					"3 seats included, $50/mo per additional seat",
				],
			},
			{
				id: "starter",
				name: "Starter (Pro)",
				price: 5000,
				unit: "month",
				ctaType: "subscribe",
				idealFor: "Growing teams, investors, brokerages",
				credits: { ai: 5000, skipTrace: 1500, lead: 5000 },
				seats: { included: 10, additionalSeat: 0 },
				features: [
					"Everything in Basic plus:",
					"Priority Zip Access (Medium Queue)",
					"AI Inbound Agent",
					"Workflow Automation",
					"Custom Voice Library Builder",
					"Unlimited campaign types",
					"10 seats included, additional seats free",
				],
			},
			{
				id: "enterprisePlus",
				name: "Enterprise+",
				price: 10000,
				unit: "month",
				ctaType: "contactSales",
				idealFor: "National brokerages, franchises, enterprise data users",
				credits: { ai: 10000, skipTrace: "unlimited", lead: "unlimited" },
				seats: { included: "unlimited", additionalSeat: 0 },
				features: [
					"Everything in Starter plus:",
					"Priority Zip Access",
					"Private Data Environment (isolated infrastructure)",
					"Custom API + Webhook Integrations",
					"AI Training Pipelines",
					"Dedicated Account Manager & Private Slack Channel",
					"Quarterly AI Performance Reviews",
					"Early Access to New AI Models & Beta Features",
					"Data Warehouse / BI Integrations (Snowflake, PowerBI, Looker)",
					"Custom Workflow Builder (Kestra / n8n orchestration)",
					"Custom Compliance Reports (TCPA, GDPR, Colorado AI Act)",
					"Up to 10 Voice Models per Organization",
					"24/7 Priority Support",
				],
			},
		],
		annual: [
			{
				id: "basicAnnual",
				name: "Basic",
				price: 17000,
				unit: "year",
				ctaType: "subscribe",
				idealFor: "Solo agents, small teams",
				credits: { ai: 24000, skipTrace: 6000, lead: 24000 },
				seats: { included: 3, additionalSeat: 50 },
				features: [
					"All Basic monthly features",
					"24,000 AI credits/year",
					"Save 15% with annual billing",
				],
			},
			{
				id: "starterAnnual",
				name: "Starter (Pro)",
				price: 42500,
				unit: "year",
				ctaType: "subscribe",
				idealFor: "Investors, brokerages",
				credits: { ai: 60000, skipTrace: 18000, lead: 60000 },
				seats: { included: 10, additionalSeat: 0 },
				features: [
					"All Starter monthly features",
					"60,000 AI credits/year",
					"Priority onboarding & success engineer",
				],
			},
			{
				id: "enterpriseAnnual",
				name: "Enterprise+",
				price: 85000,
				unit: "year",
				ctaType: "contactSales",
				idealFor: "National teams, franchises, enterprise brokers",
				credits: { ai: 120000, skipTrace: "unlimited", lead: "unlimited" },
				seats: { included: "unlimited", additionalSeat: 0 },
				features: [
					"All Enterprise+ monthly features",
					"120,000 AI credits/year",
					"Dedicated compliance & integration team",
				],
			},
		],
		oneTime: [
			{
				id: "selfHosted",
				name: "Self-Hosted / AI Enablement License",
				pricingModel: "Custom — Contact Sales",
				ctaPrimary: {
					label: "Contact Sales",
					type: "contactSales",
					action: "openLeadForm",
					description:
						"Connect with our enterprise team to customize deployment and licensing terms.",
				},
				ctaSecondary: {
					label: "Estimate ROI & Setup Cost",
					type: "openCalculator",
					action: "openModal",
					description:
						"Open the ROI Estimator to project profit, setup range, and compare models.",
				},
				idealFor:
					"Brokerages, agencies, and regulated enterprises requiring private AI control",
				includes: [
					"Private on-prem or cloud deployment (Docker/Kubernetes ready)",
					"White-label branding & domain",
					"Private API keys, RBAC, and tenant isolation",
					"Train AI agents on your CRM, voice, and workflow data",
					"Partner Revenue Engine for usage billing and analytics",
					"Compliance Toolkit (TCPA, GDPR, Colorado AI Act 2026)",
					"1-Year success & compliance onboarding (renewable annually)",
				],
				aiCredits: {
					plan: "Discounted Partner AI Credits",
					description:
						"Enterprise-rate AI credits with up to 60% volume discount",
				},
				pricingOptions: [
					{
						model: "Revenue-Share",
						details:
							"20–35% of net new revenue created through DealScale automation",
						vesting: "12-month cliff; quarterly reconciliation",
					},
					{
						model: "Hybrid License",
						details:
							"Base annual license + discounted AI credits; no revenue share",
					},
					{
						model: "Full Buyout License",
						details:
							"One-time perpetual license with 3-year revenue-share sunset and lifetime infrastructure ownership",
					},
				],
				roiEstimator: ROI_ESTIMATOR,
				notes: [
					"Pricing derived from projected ROI, not fixed subscriptions.",
					"Revenue-Share model uses a 12-month cliff for alignment.",
					"Buyout option ends revenue-share after 3 years, granting full ownership.",
					"Industry multipliers adjust AI workload complexity for accurate ROI modeling.",
					"Primary CTA: Contact Sales",
					"Secondary CTA: Estimate ROI & Setup Cost",
				],
				requirements: [
					"Executive alignment on AI governance and compliance",
					"Dedicated technical contact for deployment integrations",
					"Secure infrastructure budget for private hosting (cloud or on-prem)",
					"Annual compliance review cadence with DealScale success team",
				],
			},
			{
				id: "commissionPartner",
				name: "Commission Partner",
				pricingModel: "35–50% of buyer-side commission per closed deal",
				ctaType: "apply",
				idealFor: "High-volume agents, teams, and brokers",
				includes: [
					"No subscription or platform fees",
					"Unlimited AI & Data Credits",
					"Full DealScale suite access",
					"Performance-based partnership",
				],
				requirements: [
					"Application & qualification required",
					"Proven transaction volume and track record",
				],
			},
			{
				id: "payPerLead",
				name: "Pay-Per-Lead",
				pricingModel: "$200 per qualified lead (subject to zip availability)",
				ctaType: "apply",
				idealFor: "Agents & teams seeking predictable pipeline",
				includes: [
					"Pay only for sales-ready appointments",
					"DealScale manages outreach, qualification, and warm transfer",
					"Dynamic pricing by market demand",
				],
				requirements: ["Proven intake process for hot transfers"],
			},
		],
	},
};

export const PricingPlans: Plan[] = [
	{
		id: "free-trial",
		name: "Free Trial",
		price: {
			monthly: {
				amount: 0,
				description: "Explore DealScale with 5 AI demo credits.",
				features: [
					"5 AI demo credits (approx. 4–5 minutes of AI call time)",
					"1 active campaign",
					"Dashboard + CRM preview",
					"Upgrade anytime for full automation access",
				],
			},
			annual: { amount: 0, description: "", features: [] },
			oneTime: { amount: 0, description: "", features: [] },
		},
		cta: { text: "Start Free Trial", type: "link", href: "/signup" },
	},
	{
		id: "basic-plan",
		name: "Basic",
		price: {
			monthly: {
				amount: 2000,
				description: "per month",
				features: [
					"AI Voice & SMS Outreach",
					"Voice Cloning & Custom Voicemail",
					"AI Kanban Board & CRM Integrations",
					"Custom Campaign Goals",
					"3 seats included, $50/mo per additional seat",
				],
			},
			annual: {
				amount: 17000,
				description: "per year (save 15%)",
				features: [
					"All Basic monthly features",
					"24,000 AI credits/year",
					"Save 15% with annual billing",
				],
			},
			oneTime: { amount: 0, description: "", features: [] },
		},
		highlighted: false,
		cta: { text: "Subscribe", type: "checkout" },
	},
	{
		id: "starter-plan",
		name: "Starter (Pro)",
		price: {
			monthly: {
				amount: 5000,
				description: "per month",
				features: [
					"Everything in Basic plus:",
					"AI Inbound Agent",
					"Workflow Automation",
					"Priority Zip Access",
					"Unlimited campaign types",
					"10 seats included, additional seats free",
				],
			},
			annual: {
				amount: 42500,
				description: "per year (priority onboarding included)",
				features: [
					"All Starter monthly features",
					"60,000 AI credits/year",
					"Priority onboarding & success engineer",
				],
			},
			oneTime: { amount: 0, description: "", features: [] },
		},
		highlighted: true,
		cta: { text: "Get Started", type: "checkout" },
	},
	{
		id: "enterprise-plus",
		name: "Enterprise+",
		price: {
			monthly: {
				amount: 10000,
				description: "per month (custom AI infrastructure)",
				features: [
					"Everything in Starter plus:",
					"Priority Zip Access (Instant Queue)",
					"Private Data Environment (isolated infrastructure)",
					"Custom API + Webhook Integrations",
					"Dedicated Account Manager & Private Slack Channel",
					"Custom Compliance Reports (TCPA, GDPR, Colorado AI Act)",
					"Up to 10 Voice Models per Organization",
					"24/7 Priority Support",
				],
			},
			annual: {
				amount: 85000,
				description: "per year (dedicated compliance & integration team)",
				features: [
					"All Enterprise+ monthly features",
					"120,000 AI credits/year",
					"Dedicated compliance & integration team",
				],
			},
			oneTime: { amount: 0, description: "", features: [] },
		},
		highlighted: false,
		cta: { text: "Contact Sales", type: "link", href: "/contact" },
	},
	{
		id: "commission-partner",
		name: "Commission Partner",
		price: {
			monthly: { amount: 0, description: "", features: [] },
			annual: { amount: 0, description: "", features: [] },
			oneTime: {
				amount: "35%",
				description: "35–50% of buyer-side commission per closed deal",
				features: [
					"No subscription or platform fees",
					"Unlimited AI & Data Credits",
					"Full DealScale suite access",
					"Performance-based partnership",
				],
			},
		},
		highlighted: false,
		cta: { text: "Apply Now", type: "link", href: "/contact" },
	},
	{
		id: "pay-per-lead",
		name: "Pay-Per-Lead",
		price: {
			monthly: { amount: 0, description: "", features: [] },
			annual: { amount: 0, description: "", features: [] },
			oneTime: {
				amount: 200,
				description: "$200 per qualified lead (subject to zip availability)",
				features: [
					"Pay only for sales-ready appointments",
					"DealScale manages outreach, qualification, and warm transfer",
					"Dynamic pricing by market demand",
				],
			},
		},
		highlighted: false,
		cta: { text: "Check Availability", type: "link", href: "/contact" },
	},
];

export default pricingCatalog;
