import type {
	HeroCopy,
	HeroCopyRotations,
	ResolveHeroCopyOptions,
} from "@external/dynamic-hero";
import type { Plan } from "@/types/service/plans";

export const HERO_ROTATIONS: HeroCopyRotations = {
	problems: [
		"manually stitching hero sections",
		"babysitting inconsistent brand tokens",
		"copying animations from five codebases",
	],
	solutions: [
		"reusing shared UI modules",
		"dropping in synced motion presets",
		"launching personas from one package",
	],
	fears: [
		"launch delays creep in",
		"stakeholders churn on stale demos",
		"brand QA turns into fire drills",
	],
};

export const HERO_COPY_INPUT: HeroCopy = {
	values: {
		problem: "manually stitching hero sections",
		solution: "reusing shared UI modules",
		fear: "launch delays creep in",
		socialProof: "Join 200+ teams speeding up delivery.",
		benefit: "Ship dynamic marketing pages",
		time: "7",
	},
	rotations: HERO_ROTATIONS,
};

export const HERO_COPY_FALLBACK: ResolveHeroCopyOptions = {
	fallbackPrimaryChip: {
		label: "Shared UI Library",
		sublabel: "Lighting-fast iterations",
		variant: "secondary",
	},
	fallbackSecondaryChip: {
		label: "External Demo",
		variant: "outline",
	},
};

export const PRIMARY_CTA = {
	label: "Launch Quick Start Hero",
	description: "Deploy the reusable hero module in under seven minutes.",
	emphasis: "solid" as const,
	badge: "Guided Setup",
};

export const SECONDARY_CTA = {
	label: "Preview Guided Demo",
	description: "Tour the module before plugging it into production.",
	emphasis: "outline" as const,
	badge: "See it in action",
};

export const CTA_MICROCOPY =
	'Reusable hero experiences adopted by builders. <link href="#dynamic-hero-details">Explore the KPI impact</link>.';

export const HERO_TRIAL_PLAN = {
	id: "dynamic-hero-basic",
	name: "Dynamic Hero Quick Start",
};

export const createHeroTrialPlan = (): Plan => ({
	id: `${HERO_TRIAL_PLAN.id}-trial-monthly`,
	name: HERO_TRIAL_PLAN.name,
	price: {
		monthly: {
			amount: 0,
		description: "Free trial - no charge today",
			features: [
				"Guided dynamic hero onboarding during the trial window.",
				"Stay active after the trial to keep full access.",
			],
		},
		annual: { amount: 0, description: "", features: [] },
		oneTime: { amount: 0, description: "", features: [] },
	},
	cta: { text: "Complete Checkout", type: "checkout" },
});

