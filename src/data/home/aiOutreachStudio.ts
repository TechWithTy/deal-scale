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

export const AI_OUTREACH_STUDIO_SEO = {
	name: AI_OUTREACH_STUDIO_HEADING,
	headline: AI_OUTREACH_STUDIO_TAGLINE,
	description: AI_OUTREACH_STUDIO_DESCRIPTION,
	keywords: AI_OUTREACH_STUDIO_KEYWORDS,
	anchor: AI_OUTREACH_STUDIO_ANCHOR,
	features: AI_OUTREACH_STUDIO_FEATURES,
} as const;
