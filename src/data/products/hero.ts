// * Default props for demo/dev use

import type { ProductHeroProps } from "@/components/products/product/ProductHero";

export type HeroGridItem = {
	src: string;
	alt: string;
	label: string;
	categoryId: string; // * Used for robust category lookup
	description?: string;
	link: string;
	ariaLabel?: string;
	colSpan?: number;
	rowSpan?: number;
};

export const DEFAULT_GRID: HeroGridItem[] = [
	{
		src: "products/essentials.png",
		alt: "Free Deal Scale resources",
		label: "Free Resource Library",
		categoryId: "free-resources",
		description:
			"Instant access to downloadable playbooks, scripts, and templates.",
		link: "/products#category=free-resources",
		ariaLabel: "Explore free resources",
		colSpan: 2,
		rowSpan: 2,
	},
	{
		src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&h=800&fit=crop&q=80",
		alt: "Remote Closers Marketplace",
		label: "Remote Closers",
		categoryId: "remote-closers",
		description:
			"Connect with professional real estate closers or apply to become one. Join our marketplace and earn revenue by helping others close deals remotely.",
		link: "/products#category=remote-closers",
		ariaLabel: "Explore Remote Closers marketplace",
		colSpan: 2,
		rowSpan: 1,
	},
	{
		src: "products/coins.png",
		alt: "AI , Lead & Skip Tracing Credits for Real Estate",
		label: "Credits (AI & Skip Tracing)",
		categoryId: "credits",
		description: "Power your AI agents and instantly find owner contact info.",
		link: "/products/credits",
		ariaLabel: "View all credits for AI and skip tracing",
		colSpan: 2,
		rowSpan: 1,
	},
	{
		src: "products/essentials.png",
		alt: "Essential gear for real estate professionals",
		label: "Agent Essentials",
		categoryId: "essentials",
		description: "Exclusive discounts on curated gear and tech.",
		link: "/products/agent-essentials",
		ariaLabel: "Explore exclusive deals on agent essentials",
		colSpan: 1,
		rowSpan: 1,
	},
	{
		src: "/products/notion-2.png",
		alt: "Notion Templates for Real Estate",
		label: "Notion Templates",
		categoryId: "notion",
		description:
			"Streamline your workflow with ready-to-use Notion templates tailored for real estate professionals.",
		link: "/products/notion-templates",
		ariaLabel: "Discover Notion templates for real estate",
		colSpan: 1,
		rowSpan: 2,
	},
	{
		src: "products/workflows.png",
		alt: "Automated Real Estate Workflow",
		label: "Outreach Workflows",
		categoryId: "workflows",
		description: "Automate your outreach and find leads faster.",
		link: "/products/outreach-workflows",
		ariaLabel: "Explore Outreach Workflows",
		colSpan: 1,
		rowSpan: 1,
	},
	{
		src: "products/workflows.png",
		alt: "AI Agents for Real Estate",
		label: "AI Agents",
		categoryId: "agents",
		description:
			"Launch pre-configured Deal Scale agents with ready-to-go scripts and monetization.",
		link: "/products/atlas-voice-concierge",
		ariaLabel: "Explore marketplace-ready AI agents",
		colSpan: 1,
		rowSpan: 1,
	},
	{
		src: "products/workflows.png",
		alt: "AI voice concierge handling inbound calls",
		label: "Voice Agents",
		categoryId: "voices",
		description:
			"Deploy plug-and-play voice concierge agents that qualify leads 24/7.",
		link: "/products#category=voices",
		ariaLabel: "Filter marketplace inventory for voice agents",
		colSpan: 1,
		rowSpan: 1,
	},
	{
		src: "products/workflows.png",
		alt: "AI text agents handling conversations",
		label: "Text Agents",
		categoryId: "text-agents",
		description:
			"Deploy AI text messaging agents that qualify leads and handle conversations 24/7 via SMS and chat.",
		link: "/products#category=text-agents",
		ariaLabel: "Filter marketplace inventory for text agents",
		colSpan: 1,
		rowSpan: 1,
	},
	{
		src: "products/workflows.png",
		alt: "Sales script templates displayed on a laptop",
		label: "Sales Scripts",
		categoryId: "sales-scripts",
		description:
			"Download ready-to-use outreach scripts that convert cold leads into conversations.",
		link: "/products#category=sales-scripts",
		ariaLabel: "Filter marketplace inventory for sales scripts",
		colSpan: 1,
		rowSpan: 1,
	},
	{
		src: "products/workflows.png",
		alt: "Prompt library showcased on screen",
		label: "Prompt Libraries",
		categoryId: "prompts",
		description:
			"Plug in proven prompt packs to personalize agent conversations at scale.",
		link: "/products#category=prompts",
		ariaLabel: "Filter marketplace inventory for prompt libraries",
		colSpan: 1,
		rowSpan: 1,
	},
];
export const defaultHeroProps: ProductHeroProps = {
	headline: "The Deal Scale ",
	highlight: "Marketplace",
	subheadline:
		"Your new hub for exclusive credits, tools, and resources. Supercharge your real estate automation and get everything you need to scale your deal pipeline in one place.",
	grid: DEFAULT_GRID,
	testimonial: {
		quote: `"If you don't have a system for doing things, you'll be forever re-inventing the wheel. And you can't build a business on that."`,
		author:
			'Gary Keller, Founder of Keller Williams and Author of "The Millionaire Real Estate Agent"',
	},
};
