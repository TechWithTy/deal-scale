import type { ABTest } from "@/types/testing";

export const dealAnalyzerWorkbookABTest: ABTest = {
	id: "free-resource-abtest-deal-analyzer",
	name: "Deal Analyzer Workbook Messaging",
	description:
		"Test messaging for the Deal Analyzer Workbook hero copy to ensure the free resource CTA aligns with investor expectations.",
	startDate: new Date("2024-09-01T00:00:00.000Z"),
	isActive: true,
	variants: [
		{
			name: "Value Positioning",
			percentage: 100,
			copy: {
				cta: "Download the Analyzer",
				buttonCta: "Get the Workbook",
				tagline: "Underwrite every deal with confidence.",
				subtitle:
					"A proven underwriting workbook trusted by acquisition teams scaling their portfolios.",
				description:
					"Run the exact underwriting process Deal Scale uses internally. Prebuilt models, ROI calculators, and risk guardrails keep every acquisition disciplined.",
				whatsInItForMe:
					"Make faster go/no-go calls with the same diligence framework our team uses before writing an offer.",
				target_audience:
					"Real estate investors evaluating lookalike off-market deals with similarity feature overlays",
				pain_point:
					"You waste hours recreating underwriting models and second-guess the math on every deal.",
				solution:
					"Plug numbers into a guided workbook that handles the heavy analysis and surfaces the red flags instantly.",
				hope: "Confidently move forward on deals knowing every metric is vetted inside a proven model.",
				fear: "Missing a hidden risk in your analysis could cost six figures when a deal goes sideways.",
				highlights: [
					"Spreadsheet-ready templates",
					"ROI and cash-on-cash calculators",
					"Scenario planning for financing options",
				],
			},
		},
	],
};

export const coldOutreachMessagePackABTest: ABTest = {
	id: "free-resource-abtest-outreach-pack",
	name: "Cold Outreach Message Pack Messaging",
	description:
		"Optimize the CTA for the cold outreach scripts bundle to highlight speed-to-launch and channel coverage.",
	startDate: new Date("2024-09-01T00:00:00.000Z"),
	isActive: true,
	variants: [
		{
			name: "Ready-to-send",
			percentage: 100,
			copy: {
				cta: "Grab the Outreach Scripts",
				buttonCta: "Download the Scripts",
				tagline: "Launch a motivated seller campaign today.",
				subtitle:
					"15+ plug-and-play templates covering SMS, email, and voicemail nurture cadences.",
				description:
					"Skip the blank page. Personalize proven scripts, layered cadences, and follow-up reminders designed to convert cold leads into booked calls.",
				whatsInItForMe:
					"Spin up a full outreach sequence in minutes instead of spending weekends writing copy.",
				target_audience: "Acquisitions managers and inside sales reps",
				pain_point:
					"It takes too long to craft multi-channel messaging that actually gets replies.",
				solution:
					"Drop in field-tested scripts with ready-made cadences so you can start contacting sellers right away.",
				hope: "Launch a polished outreach cadence in minutes and keep your pipeline full of seller conversations.",
				fear: "Heading into the week without messaging ready means hot leads will disengage before you ever reach them.",
				highlights: [
					"Channel-specific templates",
					"Follow-up timelines",
					"Personalization cues for motivated sellers",
				],
			},
		},
	],
};

export const investProsHandbookABTest: ABTest = {
	id: "free-resource-abtest-investpros-handbook",
	name: "InvestPros Handbook Messaging",
	description:
		"Ensure the operations handbook landing copy emphasizes repeatable systems and leadership rituals.",
	startDate: new Date("2024-09-01T00:00:00.000Z"),
	isActive: true,
	variants: [
		{
			name: "Playbook Focus",
			percentage: 100,
			copy: {
				cta: "Download the Operating Handbook",
				buttonCta: "Access the Handbook",
				tagline: "Run your acquisitions team like a top producer.",
				subtitle:
					"Step-by-step operating procedures, meeting cadences, and scorecards from the InvestPros team.",
				description:
					"Adopt the rituals, dashboards, and pipeline reviews used by teams closing dozens of transactions each quarter.",
				whatsInItForMe:
					"Install a proven operating system so your team scales without chaos.",
				target_audience: "Team leaders and ops managers",
				pain_point:
					"Your acquisitions team relies on tribal knowledge and lacks consistent processes.",
				solution:
					"Apply templated SOPs, meeting agendas, and performance scorecards to create predictable execution.",
				hope: "Build a repeatable machine where every team member knows exactly how to drive revenue.",
				fear: "Without structure, growth stalls and top performers burn out under chaotic leadership.",
				highlights: [
					"Quarterly planning templates",
					"Weekly pipeline ritual breakdowns",
					"Team onboarding checklists",
				],
			},
		},
	],
};

export const marketMetricsSnapshotABTest: ABTest = {
	id: "free-resource-abtest-market-metrics",
	name: "Market Metrics Snapshot Messaging",
	description:
		"Clarify the value of the live metrics toolkit for investors watching multiple territories.",
	startDate: new Date("2024-09-01T00:00:00.000Z"),
	isActive: true,
	variants: [
		{
			name: "Insight Focus",
			percentage: 100,
			copy: {
				cta: "Open the Market Dashboard",
				buttonCta: "Launch the Snapshot",
				tagline: "Track rent, absorption, and comps in one place.",
				subtitle:
					"Always-fresh KPIs curated from MLS, census, and Deal Scale's proprietary dataset.",
				description:
					"Monitor the metrics that matter before you deploy marketing dollars: inventory shifts, rent velocity, and neighborhood absorption trends.",
				whatsInItForMe:
					"Spot which submarkets deserve campaigns this week without pulling a dozen reports.",
				target_audience: "Data-driven investors and marketing leads",
				pain_point:
					"Collecting market stats is fragmented across MLS exports, spreadsheets, and old reports.",
				solution:
					"Get a single dashboard that updates itself so you always know where to focus sourcing efforts.",
				hope: "Spot emerging opportunities early and deploy capital where ROI is climbing.",
				fear: "Flying blind on market shifts leads to wasted spend and missed deals in hotter submarkets.",
				highlights: [
					"Weekly refreshed KPIs",
					"Neighborhood-level filters",
					"Portfolio benchmark comparisons",
				],
			},
		},
	],
};
