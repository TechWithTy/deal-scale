import type { ROIEstimator } from "@/types/service/plans";

export const ROI_ESTIMATOR: ROIEstimator = {
	inputs: [
		"averageDealAmount",
		"monthlyDealsClosed",
		"averageTimePerDealHours",
		"industry",
	],
	industryFactors: {
		"Residential Real Estate": 1.0,
		"Commercial Real Estate": 1.3,
		"Mortgage / Lending": 1.5,
		"Property Management": 0.8,
		"SaaS / Agency": 0.6,
		"General Sales": 0.7,
		Insurance: 1.2,
		"Government Ops": 1.8,
		Other: 1.0,
	},
	exampleInput: {
		averageDealAmount: 12000,
		monthlyDealsClosed: 20,
		averageTimePerDealHours: 12,
		industry: "Residential Real Estate",
	},
	calculations: {
		estimatedRevenueGain:
			"$36,000–$72,000 new monthly revenue (3–6 added closings)",
		estimatedSetupCost: "≈5–10% of first-year projected ROI",
		profitProjection: {
			year1: "2–3× return on initial deployment investment",
			year5: "Cumulative profit $400K–$1.2M assuming steady growth",
			year10: "Cumulative profit $1.2M–$3M under consistent adoption",
		},
		buyoutScenario: {
			setupEstimate: "≈10–15% of projected 5-year ROI",
			maintenance: "Optional $4.5K/year compliance renewal",
			ownership: "Full perpetual ownership of deployment, models, and data",
		},
	},
	summaryOutput: {
		header: "Projected ROI Summary",
		points: [
			"Setup cost typically equals 5–10% of Year-1 ROI.",
			"Average partners see a 2–3× ROI in Year-1 and $1M+ profit within 5 years.",
			"Revenue-Share and Hybrid models offer flexible scaling.",
			"Buyout grants full lifetime ownership after a 3-year revenue-share sunset.",
		],
	},
	cta: {
		label: "Calculate ROI",
		behavior: "openModal",
		fields: [
			"Average Deal Amount ($)",
			"Deals Closed / Month",
			"Average Time Per Deal (Hours)",
			"Industry / Vertical",
		],
		output:
			"Displays 1-, 5-, and 10-year ROI table with setup %, profit, and model comparisons.",
	},
	tiers: {
		selfHosted: {
			label: "Self-Hosted Buyout",
			kind: "selfHosted",
			revenueLift: { low: 0.15, high: 0.3 },
			efficiency: 0.5,
			setupPercentRange: { low: 0.05, high: 0.1 },
			showSetupByDefault: true,
			default: true,
		},
		monthly: {
			label: "Monthly License",
			kind: "subscription",
			revenueLift: { low: 0.1, high: 0.18 },
			efficiency: 0.4,
			costs: {
				monthly: 5000,
				setup: { low: 3000, high: 7500 },
			},
			showSetupByDefault: false,
		},
		annual: {
			label: "Annual License",
			kind: "subscription",
			revenueLift: { low: 0.12, high: 0.22 },
			efficiency: 0.42,
			costs: {
				annual: 42500,
				setup: { low: 5000, high: 12000 },
			},
			showSetupByDefault: false,
		},
		oneTime: {
			label: "Launch Accelerator",
			kind: "subscription",
			revenueLift: { low: 0.09, high: 0.18 },
			efficiency: 0.38,
			costs: {
				oneTime: 15000,
			},
			showSetupByDefault: true,
		},
	},
	defaultTier: "selfHosted",
};

export default ROI_ESTIMATOR;
