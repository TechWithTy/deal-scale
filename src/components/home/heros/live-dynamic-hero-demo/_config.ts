import {
	DEFAULT_HERO_SOCIAL_PROOF,
	type HeroVideoConfig,
	resolveHeroCopy,
} from "@external/dynamic-hero";

const HERO_COPY_V7 = {
	id: "hero-seo-v7",
	category: "landing_hero_dynamic_copy",
	version: 7,
	structure: "problem_solution_fear_hope_persona",
	personas: {
		agent: {
			problem: [
				"spending hours on manual real estate lead follow-up",
				"juggling too many cold calling lists and CRM tabs",
			],
			solution: [
				"AI real estate cold calling that runs directly from your CRM",
				"automated real estate lead follow-up with AI voice and SMS",
			],
			fear: [
				"other agents win your hottest seller leads first",
				"your real estate pipeline quietly goes cold",
			],
			hope: [
				"every morning you wake up to new appointments booked for you",
				"you finally spend more time closing and less time chasing leads",
				"your clients rave about your speed and consistency",
			],
		},
		investor: {
			problem: [
				"losing track of off-market and motivated seller leads",
				"spending too long qualifying real estate deals by hand",
			],
			solution: [
				"AI real estate deal flow automation that connects data, CRM, and outreach",
				"automated real estate lead generation and nurturing in one dashboard",
			],
			fear: [
				"your next profitable real estate deal slips to a faster investor",
				"your deal pipeline dries up when the market shifts",
			],
			hope: [
				"you wake up to ready-to-close seller leads every week",
				"you scale your portfolio while competitors chase spreadsheets",
				"your next million-dollar flip starts automatically",
			],
		},
		founder: {
			problem: [
				"building outbound and follow-up systems by hand for your sales team",
				"spending time you don’t have managing real estate outreach workflows",
			],
			solution: [
				"launching scalable AI real estate sales workflows in minutes",
				"automating sales follow-up across voice, SMS, and email from one hub",
			],
			fear: [
				"growth slows because outreach can’t keep up",
				"your team burns out before you hit your revenue targets",
			],
			hope: [
				"your team scales 3x without adding headcount",
				"your pipeline runs 24/7 while you focus on strategy",
				"you finally build a company that runs itself",
			],
		},
		wholesaler: {
			problem: [
				"spending nights cold calling seller lists manually",
				"forgetting to follow up with warm sellers after the first call",
			],
			solution: [
				"AI wholesaling calls that nurture motivated sellers 24/7",
				"automated follow-up campaigns that keep you top of mind with sellers",
			],
			fear: [
				"other wholesalers lock up your best contracts first",
				"your marketing spend gets wasted on unworked leads",
			],
			hope: [
				"you lock up more deals while you sleep",
				"your AI assistant keeps your seller pipeline warm 24/7",
				"you scale from hustler to business owner",
			],
		},
		loan_officer: {
			problem: [
				"spending hours calling borrowers who never answer",
				"losing track of loan applications across multiple CRM systems",
			],
			solution: [
				"AI-powered borrower follow-up that runs automatically from your mortgage CRM",
				"automated call, text, and email sequences that keep loan applicants engaged",
			],
			fear: [
				"competitors capture your pre-approved borrowers first",
				"your pipeline dries up when rates change or leads go cold",
			],
			hope: [
				"your borrowers feel supported from first inquiry to closing day",
				"you grow referral business while AI handles routine calls",
				"you hit record closings without burning out your team",
			],
		},
	},
	template: "Stop {problem}, start {solution} — before {fear}. Imagine {hope}.",
	ctas: {
		primary: [
			"Try DealScale Free",
			"Automate My Outreach",
			"Launch My First AI Campaign",
			"Start 5 Free AI Calls",
			"Automate Borrower Follow-Up",
		],
		secondary: [
			"See How It Works",
			"Watch a 1-Minute AI Demo",
			"Take the Quick Start Tour",
			"View Real Estate Case Studies",
			"See Mortgage Automation in Action",
		],
		social: [
			"Join 200+ Agents Using AI",
			"Share with a Teammate",
			"Invite My Team to DealScale",
			"Refer a Friend and Earn Credits",
			"Join Loan Officers Using DealScale",
		],
	},
	demo_mode: {
		enabled: true,
		headline_variant:
			"Automate Real Estate & Mortgage Outreach with AI — See DealScale in Action",
		cta: "Start Interactive Demo",
	},
	metadata: {
		tone: "hopeful_motivational",
		vertical: [
			"real_estate",
			"investor",
			"founder",
			"wholesaler",
			"loan_officer",
		],
		emotion_trigger: ["hope", "relief", "fomo", "social_currency"],
		updated_by: "Ty",
	},
} as const;

export type HeroPersonaKey = keyof typeof HERO_COPY_V7.personas;

export const DEFAULT_PERSONA: HeroPersonaKey = "investor";
export const DEFAULT_PERSONA_DISPLAY = "AI Sales Coworker";

const PERSONA_LABEL = "For Investors";
const PERSONA_GOAL = "Automate deal flow conversations";
const PERSONA_SOCIAL_PROOF =
	"Investors trust DealScale to automate deal flow outreach.";

const pickPersonaField = (field: "problem" | "solution" | "fear" | "hope") => {
	const persona = HERO_COPY_V7.personas[DEFAULT_PERSONA];
	const entries = persona[field];
	return entries[0] ?? "";
};

const TEMPLATE_PROBLEM = pickPersonaField("problem");
const TEMPLATE_SOLUTION = pickPersonaField("solution");
const TEMPLATE_FEAR = pickPersonaField("fear");
const TEMPLATE_HOPE = pickPersonaField("hope");

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
			socialProof: PERSONA_SOCIAL_PROOF,
			benefit: PERSONA_GOAL,
			time: "5",
			hope: TEMPLATE_HOPE,
		},
		rotations: {
			problems: [...HERO_COPY_V7.personas[DEFAULT_PERSONA].problem],
			solutions: [...HERO_COPY_V7.personas[DEFAULT_PERSONA].solution],
			fears: [...HERO_COPY_V7.personas[DEFAULT_PERSONA].fear],
		},
	},
	{
		fallbackPrimaryChip: {
			label: DEFAULT_PERSONA_DISPLAY,
			sublabel: "AI pipeline automation",
			variant: "secondary",
		},
		fallbackSecondaryChip: {
			label: PERSONA_GOAL,
			variant: "outline",
		},
	},
);

export const LIVE_PRIMARY_CTA = {
	label: "Get Started in 1 Click",
	description:
		"Stop dialing. Start closing. Your AI coworker books qualified sellers while you sleep.",
	emphasis: "solid" as const,
	badge: "AI Sales Coworkers",
};

export const LIVE_SECONDARY_CTA = {
	label: HERO_COPY_V7.ctas.secondary[0],
	description: "Preview the four-pillar lead engine in a guided tour.",
	emphasis: "outline" as const,
	badge: "Live Demo",
};

export const LIVE_MICROCOPY =
	'Stop dialing. Start closing. Your AI coworker books qualified sellers while you sleep. <link href="#live-hero-details">Review the rollout steps</link>. "People buy from people who make them feel capable and confident." - Dale Carnegie.';

export const LIVE_SOCIAL_PROOF = {
	...DEFAULT_HERO_SOCIAL_PROOF,
	// caption: "Reusable hero experiences adopted by DealScale builders.",
};

export { PERSONA_GOAL, PERSONA_LABEL, HERO_COPY_V7, PERSONA_SOCIAL_PROOF };
