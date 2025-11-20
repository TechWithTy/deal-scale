import type { ProductType } from "@/types/products";
import { LicenseType, ProductCategory } from "@/types/products";
import { ABTest } from "../../types/testing/index";
import {
	buyerLeadNurtureWorkflowABTests,
	motivatedSellerWorkflowABTests,
	openHouseWorkflowABTests,
} from "./copy";

// Extended type for workflow products
export interface WorkflowProductType extends ProductType {
	workflowId: string;
	userId: string;
}

export const workflowProducts: WorkflowProductType[] = [
	{
		id: "motivated-seller-workflow",
		name: "Motivated Seller Automation Workflow",
		abTest: motivatedSellerWorkflowABTests[0],
		price: 499,
		sku: "WF-MOTIVATED-SELLER",
		slug: "motivated-seller-workflow",
		licenseName: LicenseType.Proprietary,
		description:
			"Automate outreach, follow-up, and lead nurturing for motivated seller campaigns. Includes pre-built triggers, multi-channel messaging, and pipeline automation.",
		categories: [
			ProductCategory.Workflows,
			ProductCategory.Automation,
			ProductCategory.Monetize,
		],
		images: ["/products/workflows.png"],
		types: [
			{ name: "Standard", value: "standard", price: 499 },
			{ name: "Premium", value: "premium", price: 799 },
		],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "What does this workflow automate?",
				answer:
					"This workflow automates lead intake, qualification, follow-up, and multi-channel communication for motivated seller campaigns.",
			},
		],
		workflowId: "wf-001-motivated-seller",
		userId: "user-assign-on-purchase",
	},
	{
		id: "buyer-lead-nurture-workflow",
		name: "Buyer Lead Nurture Workflow",
		abTest: buyerLeadNurtureWorkflowABTests[0],
		price: 399,
		sku: "WF-BUYER-LEAD",
		slug: "buyer-lead-nurture-workflow",
		licenseName: LicenseType.Proprietary,
		description:
			"Automate buyer lead follow-up, appointment scheduling, and drip campaigns. Designed for real estate teams and agents to maximize conversion.",
		categories: [
			ProductCategory.Workflows,
			ProductCategory.Automation,
			ProductCategory.Monetize,
		],
		images: ["/products/workflows.png"],
		types: [
			{ name: "Standard", value: "standard", price: 399 },
			{ name: "Premium", value: "premium", price: 699 },
		],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "How does this workflow help with buyer leads?",
				answer:
					"It automates follow-up, appointment reminders, and sends personalized messages to nurture buyer leads through your pipeline.",
			},
		],
		workflowId: "wf-002-buyer-lead",
		userId: "user-assign-on-purchase",
	},
	{
		id: "open-house-workflow",
		name: "Open House Follow-Up Workflow",
		price: 299,
		sku: "WF-OPEN-HOUSE",
		slug: "open-house-workflow",
		abTest: openHouseWorkflowABTests[0],
		licenseName: LicenseType.Proprietary,
		description:
			"Automate follow-up with open house attendees, send thank-you messages, and schedule post-event calls or emails.",
		categories: [
			ProductCategory.Workflows,
			ProductCategory.Automation,
			ProductCategory.Monetize,
		],
		images: ["/products/workflows.png"],
		types: [{ name: "Standard", value: "standard", price: 299 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "What is included in this open house workflow?",
				answer:
					"Automated attendee follow-up, thank-you messages, and reminders for agents to connect with prospects after the event.",
			},
		],
		workflowId: "wf-003-open-house",
		userId: "user-assign-on-purchase",
	},
];
