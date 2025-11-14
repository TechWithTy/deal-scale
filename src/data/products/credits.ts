import {
	LicenseType,
	ProductCategory,
	type ProductType,
	type Review,
} from "@/types/products";
import type { ABTestCopy } from "@/types/testing";
import {
	AIConversationCreditsABTest,
	abTestExample,
	skipTraceCreditsABTests,
} from "./copy";
import { reviews } from "./reviews";
import { sizingChart } from "./sizingChart";

export const creditProducts: ProductType[] = [
	{
		id: "ai-credits-bundle",
		name: "AI Conversation Credits",
		price: 100, // Starting price for the smallest bundle
		sku: "DS-AI-CRED",
		slug: "ai-conversation-credits",
		licenseName: LicenseType.Proprietary,
		abTest: AIConversationCreditsABTest,
		description:
			"Power your AI Virtual Agents with conversation credits. Each credit is used for AI-driven interactions like making calls, sending texts, and nurturing leads. Keep your pipeline automation running smoothly by topping up your credits anytime.",
		categories: [
			ProductCategory.Credits,
			ProductCategory.AddOn,
			ProductCategory.Automation,
		],
		images: ["/products/coins.png"],
		// Different bundle sizes are offered as 'types'
		types: [
			{ name: "1,000", value: "1k-credits", price: 100 },
			{ name: "5,000", value: "5k-credits", price: 450 }, // Bulk discount
			{ name: "15,000", value: "15k-credits", price: 1200 }, // Better discount
		],
		reviews: [], // * Required by ProductType
		colors: [], // * Required by ProductType
		sizes: [], // * Required by ProductType
		faqs: [
			{
				question: "What is an AI Credit used for?",
				answer:
					"AI Credits are consumed during interactions managed by your AI Virtual Agent. This includes analyzing responses, making decisions, and sending personalized follow-ups across various channels.",
			},
			{
				question: "Do these credits expire?",
				answer:
					"Purchased credits do not expire and will roll over each month as long as you have an active Deal Scale account.",
			},
		],
	},
	{
		id: "skip-trace-credits-bundle",
		name: "Skip Trace Credits",
		price: 75, // Starting price
		sku: "DS-SKIP-CRED",
		slug: "skip-trace-credits",
		abTest: skipTraceCreditsABTests[0], // Use the first test from the array
		licenseName: LicenseType.Proprietary,
		description:
			"Instantly find accurate contact information for property owners. Use Skip Trace Credits to uncover phone numbers and email addresses for your target leads, enabling direct outreach and transforming a simple address into a real conversation.",
		categories: [
			ProductCategory.Credits,
			ProductCategory.AddOn,
			ProductCategory.Data,
		],
		images: ["/products/coins.png"],
		types: [
			{ name: "100", value: "100-credits", price: 75 },
			{ name: "500", value: "500-credits", price: 325 },
			{ name: "1,500", value: "1500-credits", price: 900 },
		],
		reviews: [], // * Required by ProductType
		colors: [], // * Required by ProductType
		sizes: [], // * Required by ProductType
		faqs: [
			{
				question: "What does one Skip Trace Credit provide?",
				answer:
					"One credit is used to search for the contact details associated with one property owner or record. We provide the most up-to-date information available from our data partners.",
			},
			{
				question: "What is the typical success rate?",
				answer:
					"Our data is highly accurate, but success rates can vary based on the public availability of information for a given individual. We continuously update our databases to ensure the highest possible accuracy.",
			},
		],
	},
	{
		id: "lead-credits-bundle",
		name: "Targeted Lead Credits",
		price: 200, // Starting price
		sku: "DS-LEAD-CRED",
		slug: "targeted-lead-credits",
		licenseName: LicenseType.Proprietary,
		description:
			"Purchase new, high-quality leads directly from our database of over 140M+ properties. Use Lead Credits to build hyper-targeted lists based on your specific investment criteria, such as location, property type, and owner details.",
		categories: [
			ProductCategory.Credits,
			ProductCategory.AddOn,
			ProductCategory.Leads,
		],
		images: ["/products/coins.png"],
		types: [
			{ name: "50", value: "50-leads", price: 200 },
			{ name: "200", value: "200-leads", price: 700 },
			{ name: "500", value: "500-leads", price: 1500 },
		],
		reviews: [], // * Required by ProductType
		colors: [], // * Required by ProductType
		sizes: [], // * Required by ProductType
		faqs: [
			{
				question: "What information is included with each lead?",
				answer:
					"Each lead includes the property address, owner's name (when available), and basic property characteristics. You can then use Skip Trace credits to acquire direct contact information.",
			},
			{
				question: "Can I filter the leads I want to purchase?",
				answer:
					"Yes. Our platform allows you to apply various filters to define your ideal customer profile (ICP) before purchasing a list, ensuring you only pay for leads that match your strategy.",
			},
		],
	},
];
