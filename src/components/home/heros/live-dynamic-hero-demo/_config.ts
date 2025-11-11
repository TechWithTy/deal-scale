import {
	DEFAULT_HERO_SOCIAL_PROOF,
	type HeroVideoConfig,
	resolveHeroCopy,
} from "@external/dynamic-hero";

const V6_SCHEMA = {
	template:
		"Automate {problem} with AI-powered {solution} — try DealScale free with 5 AI calls before {fear}.",
	persona: {
		problems: [
			"spending hours calling borrowers who never answer",
			"losing track of loan applications across multiple CRM systems",
			"manually following up with pre-approved clients who go cold",
			"juggling borrower outreach, referrals, and realtor relationships without automation",
		],
		solutions: [
			"AI-powered borrower follow-up that runs automatically from your mortgage CRM",
			"automated call, text, and email sequences that keep loan applicants engaged",
			"AI lending assistant that nurtures prospects until they’re ready to close",
			"real-time lead routing and pipeline automation for mortgage teams",
		],
		fears: [
			"competitors capture your pre-approved borrowers first",
			"your pipeline dries up when rates change or leads go cold",
			"realtor partners switch to faster loan officers",
			"you lose repeat borrowers because follow-up slips through the cracks",
		],
	},
	ctas: {
		primary: [
			"Try DealScale Free",
			"Automate My Real Estate Outreach",
			"Launch My First AI Campaign",
			"Start 5 Free AI Calls",
			"Automate Borrower Follow-Up",
		],
		secondary: [
			"See How AI Real Estate Outreach Works",
			"Watch a 1-Minute AI Demo",
			"Take the Quick Start Tour",
			"View Real Estate Case Studies",
			"See Mortgage Automation in Action",
		],
	},
};

const TEMPLATE_PROBLEM = V6_SCHEMA.persona.problems[0];
const TEMPLATE_SOLUTION = V6_SCHEMA.persona.solutions[0];
const TEMPLATE_FEAR = V6_SCHEMA.persona.fears[0];

export const LIVE_VIDEO: HeroVideoConfig = {
	src: "https://www.youtube.com/embed/O-3Mxf_kKQc?rel=0&controls=1&modestbranding=1",
	poster:
		"https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1920&auto=format&fit=crop",
	provider: "youtube",
};

export const LIVE_COPY = resolveHeroCopy(
	{
		values: {
			problem: TEMPLATE_PROBLEM,
			solution: TEMPLATE_SOLUTION,
			fear: TEMPLATE_FEAR,
			socialProof:
				"Loan officers trust DealScale to automate borrower outreach.",
			benefit: "Automate borrower conversations",
			time: "5",
			hope: "Keep borrowers engaged before competitors get there first.",
		},
		rotations: {
			problems: V6_SCHEMA.persona.problems,
			solutions: V6_SCHEMA.persona.solutions,
			fears: V6_SCHEMA.persona.fears,
		},
	},
	{
		fallbackPrimaryChip: {
			label: "Loan Officer Persona",
			sublabel: "Mortgage automation",
			variant: "secondary",
		},
		fallbackSecondaryChip: {
			label: "Production Ready",
			variant: "outline",
		},
	},
);

export const LIVE_PRIMARY_CTA = {
	label: V6_SCHEMA.ctas.primary[4],
	description: "Put AI borrower follow-up on autopilot with DealScale.",
	emphasis: "solid" as const,
	badge: "Mortgage AI",
};

export const LIVE_SECONDARY_CTA = {
	label: V6_SCHEMA.ctas.secondary[4],
	description: "See mortgage automation workflows in a live control center.",
	emphasis: "outline" as const,
	badge: "Live Demo",
};

export const LIVE_MICROCOPY =
	'Automate borrower outreach and mortgage follow-up with DealScale AI. <link href="#live-hero-details">Review the rollout steps</link>.';

export const LIVE_SOCIAL_PROOF = {
	...DEFAULT_HERO_SOCIAL_PROOF,
	caption: "Reusable hero experiences adopted by DealScale builders.",
};
