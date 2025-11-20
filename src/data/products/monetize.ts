import {
	LicenseType,
	ProductCategory,
	type ProductType,
} from "@/types/products";

/**
 * Marketplace entry point products for monetization
 * These allow users to EARN income by selling/listing their content
 */
export const monetizeProducts: ProductType[] = [
	{
		id: "sales-scripts-marketplace",
		name: "Sales Scripts Marketplace",
		price: 0, // Free to browse, application required to sell
		sku: "DS-SALES-SCRIPTS-MARKETPLACE",
		slug: "sales-scripts-marketplace",
		licenseName: LicenseType.Proprietary,
		description:
			"Publish and sell your proven sales scripts to thousands of Deal Scale operators. Share your best cadences, email sequences, and messaging templates to earn recurring revenue.",
		categories: [
			ProductCategory.SalesScripts,
			ProductCategory.Monetize,
		],
		images: ["https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop&q=80"],
		types: [],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "How do I sell my sales scripts?",
				answer:
					"Click on the Sales Scripts marketplace card to apply. Submit your proven scripts and we'll review them for quality and effectiveness. Once approved, your scripts will be available for purchase on the marketplace.",
			},
			{
				question: "How much can I earn?",
				answer:
					"Script creators earn a percentage of each sale. Popular scripts can generate recurring revenue as Deal Scale operators purchase licenses for their teams.",
			},
		],
	},
	{
		id: "workflows-marketplace",
		name: "Workflows Marketplace",
		price: 0, // Free to browse, application required to monetize
		sku: "DS-WORKFLOWS-MARKETPLACE",
		slug: "workflows-marketplace",
		licenseName: LicenseType.Proprietary,
		description:
			"Monetize your automation workflows by sharing them with the Deal Scale community. Sell your proven automations and earn revenue from thousands of operators who need your solutions.",
		categories: [
			ProductCategory.Workflows,
			ProductCategory.Monetize,
		],
		images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80"],
		types: [],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "How do I monetize my workflow?",
				answer:
					"Click on the Workflows marketplace card to submit your automation. We'll review and test your workflow for quality and functionality. Once approved, it will be available for purchase on the marketplace.",
			},
			{
				question: "What types of workflows can I sell?",
				answer:
					"You can sell any automation workflow including lead nurturing sequences, follow-up campaigns, data processing automations, and more. The workflow must be tested and proven effective.",
			},
		],
	},
	{
		id: "voices-marketplace",
		name: "Voices Marketplace",
		price: 0, // Free to browse, application required to monetize
		sku: "DS-VOICES-MARKETPLACE",
		slug: "voices-marketplace",
		licenseName: LicenseType.Proprietary,
		description:
			"Monetize your voice agents and AI concierges by listing them on Deal Scale. Deploy your voice automation solutions to our network of clients and earn recurring revenue.",
		categories: [
			ProductCategory.Voices,
			ProductCategory.Monetize,
		],
		images: ["https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=800&fit=crop&q=80"],
		types: [],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "How do I monetize my voice agent?",
				answer:
					"Click on the Voices marketplace card to submit your voice agent. We'll review your agent's capabilities, voice quality, and effectiveness. Once approved, clients can deploy your voice agent for their operations.",
			},
			{
				question: "What voice agents can I list?",
				answer:
					"You can list any AI voice concierge, call handling agent, or voice automation solution that provides value to real estate operators. The agent must be tested and ready for deployment.",
			},
		],
	},
];


