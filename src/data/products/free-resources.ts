import {
	ProductCategory,
	type ProductResource,
	type ProductType,
} from "@/types/products";
import {
	coldOutreachMessagePackABTest,
	dealAnalyzerWorkbookABTest,
	investProsHandbookABTest,
	marketMetricsSnapshotABTest,
} from "./free-resource-copy";

const defaultTypes: ProductType["types"] = [
	{ name: "Download", value: "download", price: 0 },
];

const defaultColors: ProductType["colors"] = [];

const defaultSizes: ProductType["sizes"] = [];

const workbookResource: ProductResource = {
	type: "download",
	url: "https://assets.dealscale.ai/free-resources/deal-analyzer-workbook.pdf",
	fileName: "deal-analyzer-workbook.pdf",
	fileSize: "2.4 MB",
	demoUrl: "https://app.supademo.com/embed/9J8F7KZ",
};

const outreachResource: ProductResource = {
	type: "external",
	url: "https://dealscale.notion.site/Cold-Outreach-Message-Pack-0c3e32d1f3d34f0e87a91f6136489bd1",
	demoUrl: "https://app.supademo.com/embed/7L5Q3VA",
};

const investProsHandbookResource: ProductResource = {
	type: "download",
	url: "https://assets.dealscale.ai/free-resources/tinthe-investpros-handbook.pdf",
	fileName: "tinthe-investpros-handbook.pdf",
	fileSize: "6.1 MB",
	demoUrl: "https://app.supademo.com/embed/1A2B3C4",
};

const marketSnapshotResource: ProductResource = {
	type: "external",
	url: "https://dealscale.notion.site/Market-Metrics-Snapshot-Toolkit-2f712b49d74d4c7a983fe43b0af552a7",
	demoUrl: "https://app.supademo.com/embed/5D6E7F8",
};

export const freeResourceProducts: ProductType[] = [
	{
		id: "deal-analyzer-workbook",
		name: "Deal Analyzer Workbook",
		description:
			"Download a guided, spreadsheet-ready workbook that helps you evaluate real estate investment opportunities in minutes.",
		price: 0,
		sku: "FREE-RESOURCE-DA-001",
		slug: "deal-analyzer-workbook",
		categories: [
			ProductCategory.FreeResources,
			ProductCategory.Workflows,
			ProductCategory.Essentials,
		],
		images: ["/products/essentials.png"],
		types: defaultTypes,
		reviews: [],
		colors: defaultColors,
		sizes: defaultSizes,
		faqs: [
			{
				question: "What formats are included?",
				answer:
					"The workbook ships in Google Sheets and Excel-ready formats with formulas to automate ROI calculations.",
			},
			{
				question: "How often is the workbook updated?",
				answer:
					"We refresh the templates quarterly with the latest acquisition metrics and underwriting assumptions we use internally at Deal Scale.",
			},
		],
		resource: workbookResource,
		abTest: dealAnalyzerWorkbookABTest,
		isFeaturedFreeResource: true,
	},
	{
		id: "cold-outreach-message-pack",
		name: "Cold Outreach Message Pack",
		description:
			"Access 15+ proven SMS, email, and voicemail scripts tailored for motivated seller lookalike audience expansion inspired by How to Win Friends and Influence People.",
		price: 0,
		sku: "FREE-RESOURCE-OUTREACH-001",
		slug: "cold-outreach-message-pack",
		categories: [
			ProductCategory.FreeResources,
			ProductCategory.Automation,
			ProductCategory.Monetize,
			ProductCategory.SalesScripts,
		],
		images: ["/products/workflows.png"],
		types: defaultTypes,
		reviews: [],
		colors: defaultColors,
		sizes: defaultSizes,
		faqs: [
			{
				question: "Is there guidance on when to send each message?",
				answer:
					"Yes. Each script includes recommended timing, target persona, and follow-up notes to keep your cadence on track.",
			},
			{
				question: "Can I edit the templates for my market?",
				answer:
					"Absolutely—duplicate the Notion workspace and customize the scripts with your brand voice and service areas.",
			},
		],
		resource: outreachResource,
		abTest: coldOutreachMessagePackABTest,
		isFeaturedFreeResource: true,
	},
	{
		id: "tinthe-investpros-handbook",
		name: "Tinthe InvestPros Handbook",
		description:
			"Download the full Tinthe InvestPros operating handbook covering acquisition frameworks, marketing playbooks, and team rituals for scaling deal flow.",
		price: 0,
		sku: "FREE-RESOURCE-HANDBOOK-001",
		slug: "tinthe-investpros-handbook",
		categories: [
			ProductCategory.FreeResources,
			ProductCategory.Essentials,
			ProductCategory.Workflows,
		],
		images: ["/products/essentials.png"],
		types: defaultTypes,
		reviews: [],
		colors: defaultColors,
		sizes: defaultSizes,
		faqs: [
			{
				question: "What topics does the handbook cover?",
				answer:
					"The handbook walks through Tinthe's deal sourcing funnels, investor reporting cadences, and standard operating procedures for acquisitions teams.",
			},
			{
				question: "How often is the handbook updated?",
				answer:
					"We refresh the handbook each quarter with new scripts, checklist updates, and lessons learned from recent portfolio wins.",
			},
		],
		resource: investProsHandbookResource,
		abTest: investProsHandbookABTest,
	},
	{
		id: "market-metrics-snapshot",
		name: "Market Metrics Snapshot Toolkit",
		description:
			"Access Tinthe's live market metrics dashboard that curates up-to-date KPIs, comps, and neighborhood insights for new acquisitions.",
		price: 0,
		sku: "FREE-RESOURCE-MARKET-001",
		slug: "market-metrics-snapshot",
		categories: [
			ProductCategory.FreeResources,
			ProductCategory.Data,
			ProductCategory.Automation,
		],
		images: ["/products/workflows.png"],
		types: defaultTypes,
		reviews: [],
		colors: defaultColors,
		sizes: defaultSizes,
		faqs: [
			{
				question: "What data sources power the dashboard?",
				answer:
					"The toolkit blends MLS pulls, census data, and Tinthe's proprietary deal database to highlight emerging opportunities.",
			},
			{
				question: "Does the snapshot update automatically?",
				answer:
					"Yes, the embedded Notion dashboard refreshes weekly with new comps, rent trends, and absorption data for your saved markets.",
			},
		],
		resource: marketSnapshotResource,
		abTest: marketMetricsSnapshotABTest,
	},
].map((product) => ({
	...product,
	colors: product.colors ?? defaultColors,
	sizes: product.sizes ?? defaultSizes,
	types: product.types ?? defaultTypes,
}));
