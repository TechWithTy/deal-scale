import { timelineSummary } from "@/data/about/timelineSummary";
import type { SeoMeta } from "../../utils/seo/seo";

// Default SEO meta for Deal Scale
export const DEFAULT_SEO: SeoMeta = {
	title:
		"Deal Scale | AI-Powered Real Estate Lookalike Audience Expansion (Inspired by How to Win Friends and Influence People)",
	description:
		"Rated 5/5 by investors, agents, and wholesalers. Deal Scale delivers AI-powered lookalike audience expansion inspired by How to Win Friends and Influence People, qualification, and outreach to close more deals.",
	canonical: "https://dealscale.io",
	image: "/banners/main.png",
	keywords: [
		"Real estate AI",
		"Real estate CRM",
		"Real estate automation",
		"AI lookalike audience expansion inspired by How to Win Friends and Influence People",
		"Real Estate Investor Leads",
		"Real Estate Agent Leads",
		"wholesaling tools",
		"motivated sellers",
	],
	siteName: "Deal Scale | AI-Powered Real Estate Solutions",
	type: "website",
	ratingValue: 5,
	reviewCount: 9,
};

/**
 * Static SEO metadata for key pages
 */
export const STATIC_SEO_META: Record<string, SeoMeta> = {
	"/": {
		title: "Home | Deal Scale",
		description:
			"Deal Scale earns 5-star reviews from investors, agents, and wholesalers for AI-powered real estate automation and lookalike audience expansion inspired by How to Win Friends and Influence People.",
		canonical: "https://dealscale.io",
		keywords: DEFAULT_SEO.keywords,
		image: DEFAULT_SEO.image,
		ratingValue: 5,
		reviewCount: 9,
	},
	"/products": {
		title: "Products | Deal Scale",
		description:
			"Browse our curated collection of digital and physical products from Deal Scale.",
		canonical: "https://dealscale.io/products",
		keywords: [...DEFAULT_SEO.keywords, "products", "shop", "catalog"],
		image: DEFAULT_SEO.image,
	},
	"/blogs": {
		title: "Blogs | Deal Scale",
		description:
			"See the latest insights, stories, and updates for real estate investors and wholesalers from the Deal Scale team.",
		canonical: "https://dealscale.io/blogs",
		keywords: DEFAULT_SEO.keywords,
		image: DEFAULT_SEO.image,
	},
	"/pricing": {
		title: "Pricing | Deal Scale",
		description:
			"Check out our pricing options and packages tailored to your growth goals. Sensible investments for maximal growth.",
		canonical: "https://dealscale.io/pricing",
		keywords: [
			"deal scale pricing",
			"real estate ai pricing",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
		priority: 0.9,
		changeFrequency: "daily",
	},
	"/case-studies": {
		title: "Case Studies | Deal Scale",
		description:
			"Check out real-world solutions and success stories from real estate professionals using Deal Scale and its Technologies.",
		canonical: "https://dealscale.io/case-studies",
		keywords: DEFAULT_SEO.keywords,
		image: "/banners/CaseStudy2.png",
	},
	"/contact": {
		title: "Beta Test Sign Up | Deal Scale",
		description:
			"Get in touch with Deal Scale for expert AI-powered real estate solutions and support.",
		canonical: "https://dealscale.io/contact",
		keywords: DEFAULT_SEO.keywords,
		image: DEFAULT_SEO.image,
	},
	"/contact-pilot": {
		title: "Pilot Priority Access | Deal Scale",
		description:
			"Get Pilot Priority Access: Instantly claim 1 free lookalike off-market real estate lead, unlock similarity-driven targeting features, and enjoy unlimited free skip tracing with exclusive early access to our AI-powered tools. Accelerate your deal flow with Deal Scale.",
		canonical: "https://dealscale.io/contact-pilot",
		keywords: DEFAULT_SEO.keywords,
		image: DEFAULT_SEO.image,
	},
	"/about": {
		title: "About Us | Deal Scale",
		description:
			"Learn about Deal Scale's mission to revolutionize real estate with AI-powered solutions for investors, agents, and wholesalers.",
		canonical: "https://dealscale.io/about",
		keywords: [
			"About Deal Scale",
			"Our Mission",
			"Real Estate Technology",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
		manifestoSections: timelineSummary,
	},
	"/features": {
		title: "Features | Deal Scale",
		description:
			"Check out powerful features of Deal Scale's AI, including automated lead nurturing, outreach, and our AI Caller.",
		canonical: "https://dealscale.io/features",
		keywords: [
			"AI lead nurture",
			"real estate outreach",
			"AI personalization",
			...DEFAULT_SEO.keywords,
		],
		image: "/banners/Feature.png",
	},
	"/agents": {
		title: "AI for Real Estate Agents | Deal Scale",
		description:
			"Supercharge your real estate business with AI-driven lookalike audience expansion inspired by How to Win Friends and Influence People and client management tools for agents.",
		canonical: "https://dealscale.io/agents",
		keywords: [
			"real estate agent tools",
			"AI for agents",
			"lookalike audience expansion inspired by How to Win Friends and Influence People for agents",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},

	"/wholesalers": {
		title: "AI for Wholesalers | Deal Scale",
		description:
			"The best wholesaling software to automate your outreach, pre-qualify leads, and find motivated sellers faster.",
		canonical: "https://dealscale.io/wholesalers",
		keywords: [
			"automation for wholesalers",
			"best wholesaling software",
			"wholesaler outreach",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},
	"/investors": {
		title: "AI for Real Estate Investors | Deal Scale",
		description:
			"Find and nurture lookalike off-market deals with AI-powered precision, audience expansion features, and similarity scoring. Close more deals and accelerate your sales cycle.",
		canonical: "https://dealscale.io/investors",
		keywords: [
			"real estate investor tools",
			"passive real estate lookalike audience expansion inspired by How to Win Friends and Influence People",
			"close more deals with AI",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},
	"/events": {
		title: "Events | Deal Scale",
		description:
			"Stay updated on upcoming Deal Scale events, webinars, and real estate industry opportunities powered by AI.",
		canonical: "https://dealscale.io/events",
		keywords: [
			"real estate events",
			"deal scale webinars",
			"AI real estate events",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},
	"/portfolio": {
		title: "Portfolio | Deal Scale",
		description:
			"Browse Deal Scale's portfolio to see AI-powered real estate solutions in action.",
		canonical: "https://dealscale.io/portfolio",
		keywords: [
			"deal scale portfolio",
			"real estate case studies",
			"AI real estate success",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},

	"/partners": {
		title: "Partners | Deal Scale",
		description:
			"Meet Deal Scale's technology and channel partners powering AI-driven real estate growth.",
		canonical: "https://dealscale.io/partners",
		keywords: [
			"deal scale partners",
			"real estate technology partners",
			"ai integrations",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},

	"/careers": {
		title: "Careers | Deal Scale",
		description:
			"Explore open roles at Deal Scale and help build AI automation for modern real estate teams.",
		canonical: "https://dealscale.zohorecruit.com/jobs/Careers",
		keywords: [
			"deal scale careers",
			"real estate ai jobs",
			"proptech roles",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},

	"/faqs": {
		title:
			"DealScale FAQ | AI Voice, SMS, and Skip Tracing Automation for Real Estate Agents & Investors",
		description:
			"Learn how DealScale automates skip tracing, AI voice outreach, SMS, and social lead qualification while staying TCPA and GDPR compliant. Discover ROI examples, voice cloning, CRM syncs, and compliance with the 2026 Colorado AI Act.",
		canonical: "https://dealscale.io/faq",
		keywords: DEFAULT_SEO.keywords,
		image: DEFAULT_SEO.image,
	},
	"/tos": {
		title: "Terms of Service | Deal Scale",
		description:
			"Review the terms and conditions for using Deal Scale’s website and services.",
		canonical: "https://dealscale.io/tos",
		keywords: [
			"Terms of Service",
			"User Agreement",
			"Terms and Conditions",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},
	"/cookies": {
		title: "Cookies Policy | Deal Scale",
		description:
			"Learn how Deal Scale uses cookies to enhance your experience and protect your privacy.",
		canonical: "https://dealscale.io/cookies",
		keywords: DEFAULT_SEO.keywords,
		image: DEFAULT_SEO.image,
	},
	"/privacy": {
		title: "Privacy Policy | Deal Scale",
		description:
			"Read our Privacy Policy to understand how Deal Scale collects, uses, and protects your personal information.",
		canonical: "https://dealscale.io/privacy",
		keywords: [
			"Privacy Policy",
			"Data Protection",
			"GDPR Compliance",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},
	"/GDPR": {
		title: "GDPR | Deal Scale",
		description:
			"Read our GDPR policy to learn how Deal Scale protects your data.",
		canonical: "https://dealscale.io/GDPR",
		image: DEFAULT_SEO.image,
		keywords: DEFAULT_SEO.keywords,
	},
	"/hippa": {
		title: "HIPPA | Deal Scale",
		description:
			"Read our HIPPA policy to learn how Deal Scale protects your data.",
		canonical: "https://dealscale.io/hippa",
		image: DEFAULT_SEO.image,
		keywords: DEFAULT_SEO.keywords,
	},
	"/PII": {
		title: "PII | Deal Scale",
		description:
			"Read our PII policy to learn how Deal Scale protects your data.",
		canonical: "https://dealscale.io/PII",
		image: DEFAULT_SEO.image,
		keywords: DEFAULT_SEO.keywords,
	},
	"/tcpCompliance": {
		title: "TCP Compliance | Deal Scale",
		description:
			"Read our TCP Compliance policy to learn how Deal Scale protects your data.",
		canonical: "https://dealscale.io/tcpCompliance",
		image: DEFAULT_SEO.image,
		keywords: DEFAULT_SEO.keywords,
	},
	"/legal": {
		title: "Legal Center | Deal Scale",
		description:
			"Access all of Deal Scale's legal documents including Privacy Policy, Terms of Service, and compliance information in one place.",
		canonical: "https://dealscale.io/legal",
		keywords: [
			"Legal Documents",
			"Compliance Center",
			"Legal Information",
			"Company Policies",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},
	"/linktree": {
		title: "Link Tree | Deal Scale",
		description:
			"Quick access to DealScale's most important links, resources, and pages. Browse our products, services, blog posts, events, case studies, and more in one convenient place.",
		canonical: "https://dealscale.io/linktree",
		keywords: [
			"deal scale links",
			"deal scale resources",
			"real estate resources",
			"quick links",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
	},
	"/demos/real-time-analytics": {
		title: "Real-Time Analytics Demo | Deal Scale",
		description:
			"Explore Deal Scale’s real-time analytics workspace. Preview dashboards, experimentation workflows, and live collaboration features inside an interactive MacBook showcase.",
		canonical: "https://dealscale.io/demos/real-time-analytics",
		keywords: [
			"real-time analytics",
			"ai dashboards",
			"collaborative analytics",
			"a/b testing demo",
			"deal scale demo",
			...DEFAULT_SEO.keywords,
		],
		image: "/banners/Feature.png",
	},
	"/affiliate": {
		title: "Affiliate Program | Deal Scale",
		description:
			"Join the Deal Scale Partner Circle to earn recurring commissions and unlock VIP benefits for your real estate audience.",
		canonical: "https://dealscale.io/affiliate",
		keywords: [
			"deal scale affiliate program",
			"real estate affiliate marketing",
			"ai partner program",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
		priority: 0.75,
		changeFrequency: "monthly",
	},
	"/external-tools/roi-simulator": {
		title: "ROI Simulator | Deal Scale",
		description:
			"Model rehab budgets, marketing spend, and close rates with Deal Scale’s ROI simulator before you launch a campaign.",
		canonical: "https://app.dealscale.io/roi-simulator",
		keywords: [
			"roi calculator",
			"real estate roi",
			"deal analyzer",
			"campaign forecasting",
			...DEFAULT_SEO.keywords,
		],
		image: DEFAULT_SEO.image,
		priority: 0.85,
		changeFrequency: "weekly",
	},
};
