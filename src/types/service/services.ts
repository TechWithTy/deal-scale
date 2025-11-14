import { type LucideIcon, ShieldCheck } from "lucide-react";
import type { Plan } from "../../types/service/plans";
import type { FAQProps } from "../faq";
import type { Testimonial } from "../testimonial";
import type { FlowChartNode } from "./howItWorks";

export type IconName =
	| "Zap"
	| "Bolt"
	| "ChartBar"
	| "ShieldCheck"
	| "Network"
	| "RefreshCw"
	| "Puzzle"
	| "Palette"
	| "RocketLaunch"
	| "Lightbulb"
	| "Rocket"
	| "Brain"
	| "Smartphone"
	| "Users"
	| "Database"
	| "Globe"
	| "Search"
	| "Pencil"
	| "Code"
	| "Cloud"
	| "Share"
	| "Mail"
	| "MailCheck"
	| "Phone"
	| "AtSign"
	| "SlidersHorizontal"
	| "FileText"
	| "Fingerprint"
	| "User"
	| "FileCheck"
	| "DatabaseZap"
	| "CheckSquare"
	| "BarChartBig"
	| "MessageSquare"
	| "BrainCircuit"
	| "LayoutGrid"
	| "Sparkles"
	| "UploadCloud"
	| "Power"
	| "CalendarCheck"
	| "PieChart"
	| "BarChart";

// --- ServicesData Structure (remains the same conceptually) ---
export type ServicesData = {
	// Use stricter typing if possible, ensures keys match SERVICE_CATEGORIES values
	[key in ServiceCategoryValue]?: {
		// Make category optional '?' if needed
		[serviceKey: string]: ServiceItemData; // Values must conform to ServiceItemData
	};
};

export type TechStack = {
	category: string;
	libraries: {
		name: string;
		description: string;
		link?: string; // <-- add this line
		customSvg?: string;
		lucideIcon?: string;
	}[];
};

// --- Constants and Category Types (remain the same) ---
export const SERVICE_CATEGORIES = {
	LEAD_GENERATION: "lead_generation",
	LEAD_PREQUALIFICATION: "lead_prequalification",
	SKIP_TRACING: "skip_tracing",
	AI_FEATURES: "ai_features",
	REAL_ESTATE_TOOLS: "real_estate_tools",
} as const;

export type ServiceCategoryKey = keyof typeof SERVICE_CATEGORIES;
export type ServiceCategoryValue =
	(typeof SERVICE_CATEGORIES)[ServiceCategoryKey];

// Service HowItWorks type
export type ServiceHowItWorks = FlowChartNode & {
	stepNumber: number;
	title: string;
	subtitle: string;
	description: string;
	icon: IconName;
};

// Service Testimonial type
export type ServiceTestimonial = {
	name: string;
	role: string;
	quote: string;
};

// Service ProblemSolution type
export type ServiceProblemSolution = {
	problem: string;
	solution: string;
};

// Service Copyright type
export type ServiceCopyright = {
	title: string;
	subtitle: string;
	ctaText: string;
	ctaLink: string;
};

export type SplineUrl = {
	splineUrl: string;
	defaultZoom: number;
};
// Service Slug Details type (nested under slug)
export type ServiceSlugDetails = {
	slug: string;
	dilemma: string;
	solution: string;
	pricing: Plan[];
	faq: FAQProps;
	splineUrl?: SplineUrl;
	defaultZoom: number;
	problemsAndSolutions: ServiceProblemSolution[];
	howItWorks: ServiceHowItWorks[];
	testimonials: Testimonial[];
	integrations: TechStack[];
	copyright: ServiceCopyright;
	lastModified?: Date;
	datePublished?: Date;
};

// Individual Feature type
export interface Feature {
	id: string;
	name: string;
	categoryId?: string;
}

// Main Service Item Data type
export type ServiceItemData = {
	id: string; // Unique identifier for the service
	iconName: IconName;
	title: string;
	description: string;
	features: Array<Feature["name"]>;
	price?: number | string;
	onSale?: boolean;
	showBanner?: boolean;
	bannerText?: string;
	bannerColor?: string;
	categories: ServiceCategoryValue[]; // Use the stricter category type
	slugDetails: ServiceSlugDetails; // Now nested under slugDetails
};
