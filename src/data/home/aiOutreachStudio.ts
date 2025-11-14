import {
	DEFAULT_PERSONA_KEY,
	PERSONA_GOALS,
	PERSONA_LABELS,
	type PersonaKey,
} from "@/data/personas/catalog";
import { getStaticSeo } from "@/utils/seo/staticSeo";

export type FeatureHighlight = {
	title: string;
	description: string;
};

export const AI_OUTREACH_STUDIO_ANCHOR = "ai-outreach-studio";
export const AI_OUTREACH_STUDIO_HEADING = "AI Outreach Studio";
export const AI_OUTREACH_STUDIO_TAGLINE =
	"Turn conversations into conversions automatically.";
export const AI_OUTREACH_STUDIO_DESCRIPTION =
	"Launch real call and text conversations powered by DealScale’s AI engine. Keep every message aligned with lead intent, then hand off to your team with full CRM context so nothing slips through the cracks.";

export const AI_OUTREACH_STUDIO_FEATURES: FeatureHighlight[] = [
	{
		title: "Personalized at scale",
		description:
			"Generate adaptive follow-ups from prompts or CRM data in seconds.",
	},
	{
		title: "Multi-channel ready",
		description:
			"Switch tone, timing, and delivery across SMS and calls seamlessly.",
	},
	{
		title: "Live AI insights",
		description:
			"Monitor conversations in real time with AI-assisted notes and outcomes.",
	},
] as const;

export const AI_OUTREACH_STUDIO_KEYWORDS = [
	"AI Outreach Studio",
	"AI call demo",
	"AI text demo",
	"DealScale call demo",
	"DealScale text demo",
	"AI seller follow-up",
	"AI outreach automation",
	"AI session monitor",
] as const;

type AiOutreachStudioSeo = {
	name: string;
	headline: string;
	description: string;
	keywords: string[];
	anchor: string;
	features: FeatureHighlight[];
};

const dedupeKeywords = (keywords: Iterable<string>) =>
	Array.from(new Set(Array.from(keywords)));

export const buildAiOutreachStudioSeo = (
	overrides: Partial<AiOutreachStudioSeo> = {},
): AiOutreachStudioSeo => {
	const homeSeo = getStaticSeo("/");
	const baseKeywords = homeSeo.keywords ?? [];
	const mergedKeywords =
		overrides.keywords ??
		dedupeKeywords([...AI_OUTREACH_STUDIO_KEYWORDS, ...baseKeywords]);

	const seo: AiOutreachStudioSeo = {
		name: overrides.name ?? AI_OUTREACH_STUDIO_HEADING,
		headline: overrides.headline ?? AI_OUTREACH_STUDIO_TAGLINE,
		description: overrides.description ?? AI_OUTREACH_STUDIO_DESCRIPTION,
		keywords: dedupeKeywords(mergedKeywords),
		anchor: overrides.anchor ?? AI_OUTREACH_STUDIO_ANCHOR,
		features: overrides.features ?? [...AI_OUTREACH_STUDIO_FEATURES],
	};

	return seo;
};

export const AI_OUTREACH_STUDIO_SEO = buildAiOutreachStudioSeo();

const toLowerFragment = (value: string) => value.toLowerCase();

type PersonaSeoInput = {
	persona?: PersonaKey;
	goal?: string;
};

const resolvePersonaLabel = (persona?: PersonaKey) =>
	PERSONA_LABELS[persona ?? DEFAULT_PERSONA_KEY] ??
	PERSONA_LABELS[DEFAULT_PERSONA_KEY];

const resolvePersonaGoal = (persona?: PersonaKey, goal?: string) => {
	if (goal?.trim()) {
		return goal.trim();
	}
	const key = persona ?? DEFAULT_PERSONA_KEY;
	return PERSONA_GOALS[key] ?? PERSONA_GOALS[DEFAULT_PERSONA_KEY];
};

export const buildPersonaAiOutreachStudioSeo = ({
	persona,
	goal,
}: PersonaSeoInput = {}): AiOutreachStudioSeo => {
	const personaLabel = resolvePersonaLabel(persona);
	const personaGoal = resolvePersonaGoal(persona, goal);
	const personaHeadline = `${AI_OUTREACH_STUDIO_TAGLINE} for ${personaLabel}`;
	const personaDescription = `AI outreach automation for ${toLowerFragment(
		personaLabel,
	)} teams to ${toLowerFragment(personaGoal)}. ${
		AI_OUTREACH_STUDIO_DESCRIPTION
	}`;

	return buildAiOutreachStudioSeo({
		headline: personaHeadline,
		description: personaDescription,
		keywords: dedupeKeywords([
			...AI_OUTREACH_STUDIO_KEYWORDS,
			personaLabel,
			personaGoal,
		]),
	});
};
