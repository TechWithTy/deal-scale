import { z } from "zod";

/**
 * Zod schema describing a metric badge rendered alongside the feature content.
 */
const featureMetricSchema = z.object({
	label: z.string().min(1),
	value: z.string().min(1),
});

/**
 * Zod schema representing a single highlight bullet for a feature.
 */
const featureHighlightSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	metric: featureMetricSchema.optional(),
	visual: z.string().optional(),
});

/**
 * Zod schema for the Macbook media payload.
 */
const featureMediaSchema = z.object({
	src: z.string().min(1),
	alt: z.string().min(1),
});

/**
 * Schema describing the optional analytics chart block.
 */
const featureChartDatumSchema = z.object({
	period: z.string().min(1),
	current: z.number(),
	previous: z.number().optional(),
	target: z.number().optional(),
});

const featureChartSchema = z.object({
	heading: z.string().min(1),
	description: z.string().min(1),
	data: z.array(featureChartDatumSchema).min(1),
	currentLabel: z.string().min(1),
	previousLabel: z.string().optional(),
	targetLabel: z.string().optional(),
});

/**
 * Schema for a single demo feature entry.
 */
export const realTimeFeatureSchema = z.object({
	id: z.string().min(1),
	label: z.string().min(1),
	eyebrow: z.string().min(1),
	description: z.string().min(1),
	media: featureMediaSchema,
	highlights: z.array(featureHighlightSchema).min(1),
	metrics: z.array(featureMetricSchema).default([]),
	chart: featureChartSchema.optional(),
});

/**
 * Schema for the full feature list.
 */
const realTimeFeatureListSchema = z.array(realTimeFeatureSchema).min(1);

const realTimeFeaturesSeed = [
	{
		id: "insight-pulse",
		label: "Insight Pulse",
		eyebrow: "Dynamic analytics overview",
		description:
			"Zoom into deal health, revenue velocity, and quota pacing inside a live charting workspace. Operators compare real-time performance to last sprint and quarterly targets without leaving the Macbook canvas.",
		media: {
			src: "/demos/static/charts/tab-1/baseline-kpis-top.png",
			alt: "Baseline analytics dashboard chart showing live KPI trends.",
		},
		chart: {
			heading: "Pipeline velocity vs. target",
			description:
				"Live pipeline units streamed from the orchestration layer. Benchmarks update every 30 seconds as data lands in the warehouse.",
			currentLabel: "Live pipeline",
			previousLabel: "Last sprint",
			targetLabel: "Target pace",
			data: [
				{ period: "Mon", current: 320, previous: 285, target: 300 },
				{ period: "Tue", current: 344, previous: 298, target: 310 },
				{ period: "Wed", current: 362, previous: 305, target: 320 },
				{ period: "Thu", current: 378, previous: 312, target: 335 },
				{ period: "Fri", current: 401, previous: 318, target: 348 },
			],
		},
		highlights: [
			{
				title: "Segment drill-downs",
				description:
					"Slice the live chart by region, AE pod, or campaign cohort and instantly compare to last sprint performance.",
				metric: {
					label: "Filters applied",
					value: "7 segments",
				},
				visual: "/demos/static/charts/tab-1/baseline-kpis-mid.png",
			},
			{
				title: "AI pacing forecasts",
				description:
					"Blend historical trendlines with AI projections so revenue leaders understand if they are ahead or behind pace.",
				metric: {
					label: "Forecast delta",
					value: "+6.4%",
				},
				visual: "/demos/static/charts/tab-1/baseline-kpis-bottom.png",
			},
		],
		metrics: [
			{
				label: "Deals in motion",
				value: "126 deals",
			},
			{
				label: "Revenue pace",
				value: "$4.2M",
			},
			{
				label: "Win uplift",
				value: "12.5%",
			},
		],
	},
	{
		id: "command-center",
		label: "Analytics Command Center",
		eyebrow: "Real-time dashboards",
		description:
			"Monitor revenue, pipeline velocity, and marketing lift without refreshing a single tab. The live dashboard layers AI forecasting with human-friendly calculators so operators can take action in seconds.",
		media: {
			src: "/demos/static/charts/tab-2/ai-agent-overview-top.png",
			alt: "AI agent analytics chart tracking live outcomes and assist volume.",
		},
		highlights: [
			{
				title: "Streaming KPI tiles",
				description:
					"Every metric updates from our analytics stream within 1.5 seconds, so leadership meetings stay aligned with reality, not stale exports.",
				metric: {
					label: "Refresh rate",
					value: "1.5s",
				},
				visual: "/demos/static/charts/tab-2/ai-agent-overview-mid.png",
			},
			{
				title: "Scenario calculators",
				description:
					"Model conversion lift and revenue impact instantly with reusable calculators tied to your live funnel stages.",
				metric: {
					label: "Forecast accuracy",
					value: "±3.2%",
				},
				visual: "/demos/static/charts/tab-2/ai-agent-overview-bottom.png",
			},
		],
		metrics: [
			{
				label: "Active dashboards",
				value: "12 teams",
			},
			{
				label: "Insights unlocked",
				value: "74 / week",
			},
		],
	},
	{
		id: "experiment-lab",
		label: "Experiment Lab",
		eyebrow: "A/B testing workflow",
		description:
			"Launch experiments, capture results, and promote winners with a single workflow. Experiments sync to analytics so you can compare uplift across every touchpoint.",
		media: {
			src: "/demos/static/charts/tab-3/premium-engagement-top.png",
			alt: "Premium analytics chart highlighting variant uplift and engagement.",
		},
		highlights: [
			{
				title: "Variant orchestration",
				description:
					"Roll out new copy, pricing, or onboarding flows with experiment templates and guardrails tied to your governance model.",
				metric: {
					label: "Launch time",
					value: "8 min setup",
				},
				visual: "/demos/static/charts/tab-3/premium-engagement-bottom.png",
			},
			{
				title: "Automated readouts",
				description:
					"Receive experiment summaries in Slack and email with significance, revenue impact, and recommended next steps.",
				metric: {
					label: "Time saved",
					value: "14 hrs / sprint",
				},
				visual: "/demos/static/charts/tab-3/premium-engagement-bottom-2.png",
			},
		],
		metrics: [
			{
				label: "Concurrent tests",
				value: "9 active",
			},
			{
				label: "Win rate",
				value: "62%",
			},
		],
	},
	{
		id: "team-hub",
		label: "Team Collaboration Hub",
		eyebrow: "Invite teammates & live chat",
		description:
			"Bring sales, marketing, and operations into the same command center. Role-aware invites, live commentary, and threaded decisions keep everyone on the same page.",
		media: {
			src: "/demos/static/charts/tab-3/premium-engagement-mid.png",
			alt: "Engagement and collaboration analytics chart for cross-functional teams.",
		},
		highlights: [
			{
				title: "Role-aware invites",
				description:
					"Provision teams with presets mapped to your CRM, support desk, and pipeline permissions in under 60 seconds.",
				metric: {
					label: "Teammates onboarded",
					value: "48 seats",
				},
				visual: "/demos/static/charts/tab-3/premium-engagement-bottom-3.png",
			},
			{
				title: "Real-time chat",
				description:
					"Thread decisions across analytics widgets and escalate to voice or video when deals need immediate attention.",
				metric: {
					label: "Response time",
					value: "<30s avg",
				},
				visual: "/demos/static/charts/tab-3/premium-engagement-mid.png",
			},
		],
		metrics: [
			{
				label: "Pending invites",
				value: "6 awaiting",
			},
			{
				label: "Resolved threads",
				value: "132 / week",
			},
		],
	},
] as const satisfies Array<z.input<typeof realTimeFeatureSchema>>;

export const REAL_TIME_FEATURES =
	realTimeFeatureListSchema.parse(realTimeFeaturesSeed);

export type RealTimeFeature = (typeof REAL_TIME_FEATURES)[number];
