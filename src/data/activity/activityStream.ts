export type ActivityEvent = {
	id: string;
	label: string;
	actor: string;
	action: string;
	timeAgo: string;
	impact: string;
	tags?: string[];
};

/**
 * Curated activity feed for the FeatureSectionActivity component.
 *
 * The copy mirrors the mortgage automation storyline used across the
 * live hero and service flows so the visuals remain consistent.
 */
export const activityStream: ActivityEvent[] = [
	{
		id: "lead-sync",
		label: "Pipeline Sync",
		actor: "DealScale AI Router",
		action: "Synced 48 new borrower inquiries from Encompass CRM.",
		timeAgo: "2m ago",
		impact: "+12% response SLA",
		tags: ["sync", "crm"],
	},
	{
		id: "warm-transfer",
		label: "Warm Transfer",
		actor: "AI Concierge",
		action: "Handed off pre-qualified borrower to Loan Officer Taylor.",
		timeAgo: "5m ago",
		impact: "Booked intro call",
		tags: ["handoff", "voice"],
	},
	{
		id: "drip-campaign",
		label: "Nurture Sequence",
		actor: "Follow-Up Engine",
		action: "Triggered 3-step SMS + email drip for stalled FHA applicants.",
		timeAgo: "11m ago",
		impact: "Queue refreshed",
		tags: ["drip", "automation"],
	},
	{
		id: "compliance-audit",
		label: "Compliance Audit",
		actor: "Audit Bot",
		action: "Archived call recordings & attached transcripts to Salesforce.",
		timeAgo: "18m ago",
		impact: "Audit ready",
		tags: ["compliance"],
	},
	{
		id: "rate-alert",
		label: "Rate Alert",
		actor: "Market Pulse",
		action: "Pushed instant lock alert to 23 high-LTV borrowers.",
		timeAgo: "26m ago",
		impact: "Action window 2h",
		tags: ["alerts", "rates"],
	},
	{
		id: "campaign-report",
		label: "Campaign Report",
		actor: "Insights Engine",
		action: "Published weekly pipeline uplift report for retail mortgage team.",
		timeAgo: "1h ago",
		impact: "+31% demos",
		tags: ["reporting", "insights"],
	},
];
