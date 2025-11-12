export interface BentoFeatureSeed {
	title: string;
	size: "sm" | "md" | "lg" | "xl";
	summary: string;
	description?: string;
	ctaLabel?: string;
	ctaUrl?: string;
}

export const landingBentoFeatureSeeds: BentoFeatureSeed[] = [
	{
		title: "Unlimited Free Skip Tracing",
		size: "md",
		summary:
			"Stop paying for data. Get unlimited, high-quality owner data for free with any subscription.",
		description:
			"A massive cost-saving advantage for teams that rely on accurate property contact data.",
	},
	{
		title: "Your 24/7 AI Qualification Agent",
		size: "xl",
		summary:
			"Instantly responds to every inquiry, pre-qualifies motivated sellers, and books appointments directly on your calendar.",
		description:
			"Deal Scale’s always-on agent nurtures leads day and night so your team can focus on closing deals.",
	},
	{
		title: "Hot Transfers",
		size: "md",
		summary:
			"Instantly connect with motivated sellers without manual follow-up.",
		description:
			"Our AI agent calls, texts, and nurtures leads so you never miss a sales-ready conversation.",
	},
	{
		title: "AI Voice Cloning",
		size: "md",
		summary:
			"Speak to prospects in your own cloned voice to build trust and rapport at scale.",
	},
	{
		title: "Appointments on Your Calendar",
		size: "md",
		summary:
			"Delivers sales-ready appointments straight to your calendar—no extra tools required.",
		description:
			"Automated scheduling keeps your pipeline full while your team focuses on high-value conversations.",
	},
	{
		title: "AI Audience Generator -- Total Market Access",
		size: "md",
		summary: "Build your perfect list in seconds -- not spreadsheets.",
		description:
			"DealScale's AI Audience Generator finds your next deal before your competitors do. Search 140M+ on-market and off-market properties, layer motivation signals, and let AI predict which owners are ready to sell next. No filters, no formulas -- just precision targeting powered by intent. Emotional hook: \"Go from guessing who to call -- to knowing who is ready.\"",
		ctaLabel: "Generate My Audience",
		ctaUrl: "/contact",
	},
	{
		title: "Authenticity at Scale -- Your AI, Your Voice",
		size: "lg",
		summary: "🎙️ Your Voice. Your Brand. Every Call.",
		description:
			"Clone your voice once. Close deals forever. Your AI speaks exactly like you -- tone, pacing, and personality included. It builds instant trust with sellers who feel like they are talking to you, not a robot. From the first \"hello\" to the final appointment, every conversation sounds authentic, confident, and on-brand. Emotional hook: \"Imagine scaling yourself -- without losing yourself.\"",
		ctaLabel: "Clone My Voice",
		ctaUrl: "/contact",
	},
	{
		title: "Save 20+ Hours a Week",
		size: "lg",
		summary:
			"From data gathering to appointment setting, Deal Scale automates the busywork so you can close more deals.",
		ctaLabel: "Save 20+ Hours / Week",
		ctaUrl: "/contact",
	},
];
