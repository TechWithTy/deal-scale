import {
	HERO_COPY_V7,
	DEFAULT_PERSONA as HERO_DEFAULT_PERSONA,
	PERSONA_GOAL as HERO_INVESTOR_GOAL,
	type HeroPersonaKey,
} from "@/components/home/heros/live-dynamic-hero-demo/_config";

export type PersonaKey = HeroPersonaKey;

const HERO_PERSONA_LABELS: Record<PersonaKey, string> = {
	agent: "Real Estate Agents",
	investor: "Real Estate Investors",
	founder: "Proptech Founders",
	wholesaler: "Real Estate Wholesalers",
	loan_officer: "Mortgage Loan Officers",
};

const GOAL_OVERRIDES: Partial<Record<PersonaKey, string>> = {
	investor: HERO_INVESTOR_GOAL,
	agent: "Win listings while AI handles seller follow-up",
	wholesaler: "Scale assignments with 24/7 seller conversations",
	founder: "Launch AI-powered outbound without extra hires",
	loan_officer: "Keep borrowers engaged automatically",
};

const deriveGoal = (persona: PersonaKey): string => {
	const override = GOAL_OVERRIDES[persona];
	if (override) {
		return override;
	}

	const personaConfig = HERO_COPY_V7.personas[persona];

	return (
		personaConfig.solution[0] ?? personaConfig.hope[0] ?? HERO_INVESTOR_GOAL
	);
};

export const PERSONA_GOALS: Record<PersonaKey, string> = (
	Object.keys(HERO_COPY_V7.personas) as PersonaKey[]
).reduce(
	(accumulator, key) => ({
		...accumulator,
		[key]: deriveGoal(key),
	}),
	{} as Record<PersonaKey, string>,
);

export const PERSONA_LABELS: Record<PersonaKey, string> = HERO_PERSONA_LABELS;

export const PERSONA_DISPLAY_ORDER: PersonaKey[] = [
	"investor",
	"wholesaler",
	"agent",
];

export const ALL_PERSONA_KEYS = Object.keys(
	HERO_COPY_V7.personas,
) as PersonaKey[];

export const DEFAULT_PERSONA_KEY: PersonaKey = HERO_DEFAULT_PERSONA;
