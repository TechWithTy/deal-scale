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
 * The copy mirrors the investor automation storyline used across the
 * live hero and service flows so the visuals remain consistent.
 */
export const activityStream: ActivityEvent[] = [
	{
		id: "lead-sync",
		label: "Pipeline Sync",
		actor: "DealScale AI Router",
		action: "Synced 48 lookalike off-market seller leads from InvestorFuse CRM using similarity clustering.",
		timeAgo: "2m ago",
		impact: "+12% response SLA",
		tags: ["sync", "crm"],
	},
	{
		id: "warm-transfer",
		label: "Warm Transfer",
		actor: "AI Concierge",
		action: "Handed off a motivated seller to Acquisitions Partner Taylor.",
		timeAgo: "5m ago",
		impact: "Booked intro call",
		tags: ["handoff", "voice"],
	},
	{
		id: "drip-campaign",
		label: "Nurture Sequence",
		actor: "Follow-Up Engine",
		action: "Triggered a 3-step SMS and voice drip for cold seller prospects.",
		timeAgo: "11m ago",
		impact: "Queue refreshed",
		tags: ["drip", "automation"],
	},
	{
		id: "compliance-audit",
		label: "Compliance Audit",
		actor: "Audit Bot",
		action:
			"Archived diligence calls and attached transcripts to the investor CRM.",
		timeAgo: "18m ago",
		impact: "Audit ready",
		tags: ["compliance"],
	},
	{
		id: "rate-alert",
		label: "Funding Alert",
		actor: "Market Pulse",
		action: "Pushed instant funding readiness alerts to 23 equity partners.",
		timeAgo: "26m ago",
		impact: "Action window 2h",
		tags: ["alerts", "rates"],
	},
	{
		id: "campaign-report",
		label: "Campaign Report",
		actor: "Insights Engine",
		action:
			"Published weekly deal flow uplift report for the acquisitions desk.",
		timeAgo: "1h ago",
		impact: "+31% demos",
		tags: ["reporting", "insights"],
	},
];
