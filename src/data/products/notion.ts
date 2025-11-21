import {
	LicenseType,
	ProductCategory,
	type ProductType,
} from "@/types/products";
import {
	notionDealPipelineABTests,
	notionFundraisingTrackerABTests,
	notionInvestorCrmABTests,
	notionStartupOsABTests,
	notionTeamWikiABTests,
} from "./copy";

export const notionProducts: ProductType[] = [
	{
		id: "notion-investor-crm",
		name: "Notion Investor CRM Template",
		abTest: notionInvestorCrmABTests[0],
		price: 79,
		sku: "NOTION-CRM",
		slug: "notion-investor-crm",
		licenseName: LicenseType.Proprietary,
		description:
			"A modern, customizable CRM built in Notion for tracking investors, conversations, and deal status. Perfect for startups raising capital or managing investor relations.",
		categories: [ProductCategory.Notion, ProductCategory.Essentials],
		images: ["/products/notion-2.png"],
		types: [{ name: "Notion Template", value: "notion-template", price: 79 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Is this a digital Notion template?",
				answer:
					"Yes, you receive a share link to duplicate into your workspace.",
			},
		],
	},
	{
		id: "notion-deal-pipeline",
		name: "Notion Deal Pipeline Board",
		price: 59,
		abTest: notionDealPipelineABTests[0],
		sku: "NOTION-PIPELINE",
		slug: "notion-deal-pipeline",
		licenseName: LicenseType.Proprietary,
		description:
			"A Kanban-style deal pipeline for tracking opportunities, stages, and notes. Designed for founders and sales teams to manage deals from lead to close.",
		categories: [ProductCategory.Notion, ProductCategory.Essentials],
		images: ["/products/notion-2.png"],
		types: [{ name: "Notion Template", value: "notion-template", price: 59 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Can I customize stages?",
				answer:
					"Yes, all stages, fields, and views are fully customizable in Notion.",
			},
		],
	},
	{
		id: "notion-startup-os",
		name: "Notion Startup OS",
		price: 129,
		sku: "NOTION-STARTUP-OS",
		abTest: notionStartupOsABTests[0],
		slug: "notion-startup-os",
		licenseName: LicenseType.Proprietary,
		description:
			"An all-in-one Notion workspace for startups. Includes dashboards for product, marketing, hiring, fundraising, and more. Get organized from day one.",
		categories: [ProductCategory.Notion, ProductCategory.Essentials],
		images: ["/products/notion-2.png"],
		types: [
			{ name: "Notion Workspace", value: "notion-workspace", price: 129 },
		],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Does this work for solo founders?",
				answer: "Yes, it's flexible for individuals or teams of any size.",
			},
		],
	},
	{
		id: "notion-fundraising-tracker",
		name: "Notion Fundraising Tracker",
		price: 49,
		sku: "NOTION-FUNDRAISING",
		slug: "notion-fundraising-tracker",
		abTest: notionFundraisingTrackerABTests[0],
		licenseName: LicenseType.Proprietary,
		description:
			"Track investor outreach, commitments, follow-ups, and round progress in a single Notion dashboard. Stay organized during your raise.",
		categories: [ProductCategory.Notion, ProductCategory.Essentials],
		images: ["/products/notion-2.png"],
		types: [{ name: "Notion Template", value: "notion-template", price: 49 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "How do I get the template?",
				answer: "You receive a Notion share link for instant duplication.",
			},
		],
	},
	{
		id: "notion-team-wiki",
		name: "Notion Team Wiki & Handbook",
		price: 69,
		sku: "NOTION-WIKI",
		slug: "notion-team-wiki",
		abTest: notionTeamWikiABTests[0],
		licenseName: LicenseType.Proprietary,
		description:
			"A central wiki for your startup team. Document processes, policies, onboarding, and knowledge in a single Notion workspace.",
		categories: [ProductCategory.Notion, ProductCategory.Essentials],
		images: ["/products/notion-2.png"],
		types: [{ name: "Notion Template", value: "notion-template", price: 69 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Can I invite my team?",
				answer:
					"Yes, you can share the workspace with your team for collaboration.",
			},
		],
	},
];
