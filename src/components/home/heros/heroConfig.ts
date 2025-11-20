import type { PersonaKey } from "@/data/personas/catalog";
import type { Plan } from "@/types/service/plans";
import type {
	HeroCopy,
	HeroCopyRotations,
	ResolveHeroCopyOptions,
} from "@external/dynamic-hero";

export const HERO_ROTATIONS: HeroCopyRotations = {
	problems: [
		"losing track of off-market leads",
		"babysitting scattered STEPS tokens",
		"copying animations across codebases",
	],
	solutions: [
		"STEPS automations expand warm audiences",
		"automated seller nurturing",
		"guided STEPS motions launch faster",
	],
	fears: [
		"your deal pipeline dries up",
		"stakeholders churn on stale demos",
		"brand QA fire drills return",
	],
};

export const HERO_COPY_INPUT: HeroCopy = {
	values: {
		problem: "losing track of off-market leads",
		solution: "qualifying AI real estate leads",
		fear: "your next profitable deal stalls",
		socialProof: "Join 200+ teams speeding up delivery.",
		benefit: "Ship dynamic marketing pages",
		time: "7",
	},
	rotations: HERO_ROTATIONS,
};

export const QUICK_START_PERSONA_KEY: PersonaKey = "founder";
export const QUICK_START_PERSONA_GOAL = HERO_COPY_INPUT.values.benefit;

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
	name: "DealScale",
};

export const createHeroTrialPlan = (): Plan => ({
	id: `${HERO_TRIAL_PLAN.id}-trial-monthly`,
	name: HERO_TRIAL_PLAN.name,
	price: {
		monthly: {
			amount: 0,
			description: "Free trial - no charge today",
			features: [
				"Full access to DealScale AI automation features during your trial.",
				"Stay active after the trial to keep full access.",
			],
		},
		annual: { amount: 0, description: "", features: [] },
		oneTime: { amount: 0, description: "", features: [] },
	},
	cta: { text: "Complete Checkout", type: "checkout" },
});
