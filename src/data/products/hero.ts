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
                description: "Instant access to downloadable playbooks, scripts, and templates.",
                link: "/products#category=free-resources",
                ariaLabel: "Explore free resources",
                colSpan: 2,
                rowSpan: 2,
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
                label: "Motivated Seller Workflows",
                categoryId: "workflows",
                description: "Automate your outreach and find motivated sellers faster.",
                link: "/products/motivated-seller-workflows",
                ariaLabel: "Explore Motivated Seller Workflows",
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
