import type { FeatureTimelineMilestone } from "@/components/features/FeatureTimelineTable";

/**
 * Feature delivery roadmap used on /features.
 * Keeps copy anchored to the actual modules surfaced across the application.
 */
export const featureTimeline: FeatureTimelineMilestone[] = [
	{
		quarter: "Q4 2024",
		status: "Live",
		initiative: "AI Outreach Studio",
		focus: "Pipeline automation",
		summary:
			"Our AI Outreach Studio powers the hero on the home page with adaptive copy, real-time context, and persona-aware goal tracking.",
		highlights: [
			"Adaptive SMS and call scripts tuned by persona-specific playbooks.",
			"Live conversation insights with session monitoring and warm handoffs.",
			"Pre-built workflows aligned to investor, wholesaler, and agency playbooks.",
		],
	},
	{
		quarter: "Q1 2025",
		status: "Live",
		initiative: "Live Activity Stream",
		focus: "Revenue telemetry",
		summary:
			"The activity stream module that feeds our homepage FeatureSectionActivity keeps every automation event, outreach touch, and conversion surfaced in real time.",
		highlights: [
			"Streams automation events directly into onboarding narratives.",
			"Supports Schema.org instrumentation for rich results and analytics parity.",
			"Runs through our progressive hydration pattern, so performance stays sharp.",
		],
	},
	{
		quarter: "Q1 2025",
		status: "Limited Beta",
		initiative: "Real-Time Analytics Command Center",
		focus: "Leadership visibility",
		summary:
			"Real-time analytics demos now back the FeatureShowcase carousel, exposing live pipeline metrics, AI pacing forecasts, and experiment readouts.",
		highlights: [
			"Embeddable dashboards mirror the real-time analytics demo showcased on the homepage.",
			"Charting integrates streaming data, sprint comparisons, and target pacing.",
			"Beta customers receive Experiment Lab readouts via Slack and email digests.",
		],
	},
	{
		quarter: "Q2 2025",
		status: "Live",
		initiative: "CRM & Calendar Sync",
		focus: "Workflow orchestration",
		summary:
			"Call demo scheduling, CRM sync, and lead enrichment now connect via our integrations data module surfaced in TechStackSection.",
		highlights: [
			"Call demo flows auto-route handraisers into preferred calendars.",
			"Integrations store tracks Podio, Salesforce, and marketing automation links.",
			"Services catalog entries mirror synced categories for RevOps and acquisitions.",
		],
	},
	{
		quarter: "Q3 2025",
		status: "In Build",
		initiative: "Automation Playbooks Library",
		focus: "Lifecycle operations",
		summary:
			"We are packaging workshop-tested workflows—skip tracing, nurturing, real estate tooling—into deployable playbooks tied to Services filters.",
		highlights: [
			"Packages leverage our service categories to preconfigure by ICP and motion.",
			"Will expose starter templates inside the services browsing experience.",
			"Hooks into Feature Voting so customers steer the backlog in real time.",
		],
	},
];
