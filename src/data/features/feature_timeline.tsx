import type { FeatureTimelineMilestone } from "@/components/features/FeatureTimelineTable";

/**
 * Feature delivery roadmap used on /features.
 * Keeps copy anchored to the actual modules surfaced across the application.
 */
export const featureTimeline: FeatureTimelineMilestone[] = [
	{
		quarter: "Q1–Q2 2025",
		status: "Completed",
		initiative: "Discovery, ICP Validation & Industry Networking",
		focus: "Real Problem Identification & Underground Distribution",
		summary:
			'This was our "zero-to-one" period before writing product code. We conducted extensive interviews, mapped common failures, and validated the AI Wealth Engine positioning.',
		highlights: [
			"120+ founder, agent, investor, and wholesaler interviews",
			"Map of common failures: follow-up, enrichment, CRM chaos, outreach inconsistency",
			"First partnerships with coaches, brokerages & investment groups",
			"Blueprint for the AI Wealth Engine positioning",
			"Validation of Automation + AI + CRM overlay as a Blue Ocean category",
			"Early experiments with content creators, agents, and investor channels",
		],
	},
	{
		quarter: "Q3 2025",
		status: "Alpha",
		initiative: "Alpha Build (Internal & Controlled Cohorts)",
		focus: "Core System Development + Private Access",
		summary:
			"The foundational feature set powering our very first internal operators & alpha users. This includes the core pipeline engine, basic enrichment, and manual-first AI-assisted tooling.",
		highlights: [
			"AI Outreach Studio (alpha)",
			"Core pipeline engine + unified contact schema",
			"Basic enrichment using external sources",
			"Manual-first → AI-assisted follow-up tooling",
			"Internal dashboards for operator workflows",
			"First version of the Integrations table (Podio → Salesforce mapping)",
			"Internal activity feed (operator-only visibility)",
		],
	},
	{
		quarter: "Q4 2025",
		status: "Active",
		initiative: "Pilot Test Cohorts (Closed Access)",
		focus: "Validate Workflows, Improve AI, Strengthen Distribution",
		summary:
			"We are currently onboarding select pilot cohorts to test core motions end-to-end. This includes real estate investors, wholesalers, small agencies, agent teams, and solo operators.",
		highlights: [
			"Adaptive scripts (persona-aware)",
			"Conversation insights + warm handoffs",
			"Alpha version of AI Pace scoring",
			"Early CRM Sync (Podio, Salesforce, FUB, Lofty)",
			"Real-time signal tracking (conversion-intent signals)",
			"Experiment Lab (controlled tests for messaging & pacing)",
		],
	},
	{
		quarter: "Q4 2025",
		status: "In Build",
		initiative: "Social Growth Engine (Meta-Integrated)",
		focus: "AI-Driven Content, Meta Automation, Lead Capture, & Awareness",
		summary:
			"AI-generated UGC videos, product videos, and real estate walkthroughs with Meta Marketing API + Messenger API integration. Automated lead capture from IG/FB ads & engagement with full integration into Deal Scale analytics & Activity Stream.",
		highlights: [
			"AI-generated UGC videos, product videos, and real estate walkthroughs",
			"AI script + scene generation tailored to each persona",
			"Meta Marketing API + Messenger API integration",
			"Automated lead capture from IG/FB ads & engagement",
			"Auto comment-reply → auto DM → auto qualify sequences",
			"Cross-platform outreach automations (IG, TikTok, LinkedIn, YouTube)",
			"AI-driven lead finding + auto-enrichment",
			"Dynamic UTM tracking + funnel attribution",
			"Influencer outreach automation",
			"Full integration into Deal Scale analytics & Activity Stream",
		],
	},
	{
		quarter: "Q4 2025",
		status: "In Build",
		initiative: "AI-Cloned Video Outreach",
		focus: "Personalized Video Prospecting & SMS/MMS Automation",
		summary:
			"AI-cloned video generation via face/voice cloning for personalized video outreach to cold, warm, and dead leads. Instant video drops triggered by replies, form fills, or ad responses with full event tracking.",
		highlights: [
			"AI-cloned video generation via face/voice cloning",
			"Personalized video outreach for cold, warm, and dead leads",
			"Instant video drops triggered by replies, form fills, or ad responses",
			"Auto-DM sequences (IG/TikTok/Facebook/LinkedIn) with personalized videos",
			"Automated ad responder flows (Send Message → Video → Qualify → Book)",
			"SMS/MMS delivery with fallback GIF preview + smart compression",
			"Persona-aware script engine aligned with investor, agent & wholesaler playbooks",
			"Full event tracking inside Activity Stream and Analytics Command Center",
		],
	},
	{
		quarter: "Q1 2026",
		status: "Upcoming",
		initiative: "Beta Launch (First External User Base)",
		focus: "Public Stability, Onboarding, Multi-Vertical Expansion",
		summary:
			"This is where we expand from Alpha → Beta access. Full CRM Sync engine, enrichment partners, Analytics Command Center, and user-facing Activity Stream will be ready.",
		highlights: [
			"Full CRM Sync engine",
			"Enrichment + skip tracing partners integrated",
			"Analytics Command Center (beta)",
			"Activity Stream (real-time, user-facing)",
			"User onboarding narratives mapped to live events",
			"RevOps-ready integrations store",
			"Experiment Lab (external testers)",
		],
	},
	{
		quarter: "Q1 2026",
		status: "Planned",
		initiative: "AI-Personalized Direct Mail Campaigns",
		focus: "Offline + Online Hybrid Lead Activation",
		summary:
			"AI-generated postcards, letters, and soft offer sheets with personalized content using property data, comps, skip trace, and owner insights. QR-coded mail pieces linking to personalized landing pages with USPS tracking triggers.",
		highlights: [
			"AI-generated postcards, letters, and soft offer sheets",
			"Personalized content using property data, comps, skip trace, and owner insights",
			"QR-coded mail pieces linking to personalized landing pages",
			"USPS tracking → triggers SMS follow-ups + pipeline actions",
			"Print automation integrations (Lob, PostGrid, Click2Mail)",
			"Automated nurturing sequences tied to mail delivery events",
			'Dynamic offer generation ("Confirm your cash offer" landing flows)',
			"Lead scoring boosts when mail engagement detected via QR/URL visits",
		],
	},
	{
		quarter: "Q2 2026",
		status: "In Build",
		initiative: "Automation Playbooks Library",
		focus: "Hands-Free Deal Operations",
		summary:
			"This is where Deal Scale becomes set-and-run for operators. Packaging workshop-tested workflows into deployable playbooks connected to Services filters.",
		highlights: [
			"Skiptracing → Follow-up → Appointment playbooks",
			"Agent nurturing sequences",
			"Investor funnel workflows",
			"AI multi-step scripts (voice cloned + SMS + email)",
			"Workshop-tested flows from pilot cohorts",
			"Persona-based automations for investors / wholesalers / agents",
			"Services-linked templates (Website → CRM → Outreach → Analytics)",
		],
	},
	{
		quarter: "Q3 2026",
		status: "Planned",
		initiative: "Public Launch Track",
		focus: "Ready for Scale & Marketing",
		summary:
			"Public onboarding, full voice automation, multi-tenant dashboard, and partner integrations. Growth + sales machines built from your social outreach engine.",
		highlights: [
			"Public onboarding (self-serve)",
			"Full voice automation",
			"Multi-tenant dashboard",
			"Real-time analytics refinement",
			"Partner integrations (Lead Orchestra, Anywhere, Apify, N8N, Make, Kestra, GoHighLevel, Follow Up Boss, Bigger Pockets)",
			"Growth + sales machines built from your social outreach engine",
		],
	},
];
