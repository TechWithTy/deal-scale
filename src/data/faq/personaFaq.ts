export type PersonaKey =
	| "agent"
	| "investor"
	| "wholesaler"
	| "agency"
	| "enterprise";

export interface PersonaFaqItem {
	id: string;
	question: string;
	answers: Record<PersonaKey, string>;
}

export const PERSONA_OPTIONS: Array<{ key: PersonaKey; label: string }> = [
	{ key: "agent", label: "Agent" },
	{ key: "investor", label: "Investors" },
	{ key: "wholesaler", label: "Wholesaler" },
	{ key: "agency", label: "Agency" },
	{ key: "enterprise", label: "Enterprise" },
];

export const PERSONA_FAQ_ITEMS: PersonaFaqItem[] = [
	{
		id: "what-is-dealscale",
		question: "What is DealScale and how does it help me?",
		answers: {
			agent:
				"DealScale is your AI-powered sales coworker that finds, qualifies, and follows up with seller and listing leads using your own cloned voice. It automates outreach, books appointments, and syncs with your CRM so you can focus on closing listings.",
			investor:
				"DealScale is an AI sales coworker that automates skip tracing, AI cold calling, and seller qualification for agents and investors. Unlike list providers, it handles outreach, follow-up, and appointment booking so you can focus on closing deals. For investors like you, DealScale ships with playbooks that spark seller trust, convert influencer partners, and keep you top-of-mind without extra hiring.",
			wholesaler:
				"DealScale automates lead qualification for wholesalers. It calls and texts property owners, pre-screens motivation, and drops warm leads straight into your CRM or pipeline automatically.",
			agency:
				"DealScale lets marketing and sales agencies deliver AI outreach at scale. You can manage multiple clients, automate campaigns, and provide compliant AI calling, texting, and CRM syncing under your own brand.",
			enterprise:
				"DealScale is an AI automation platform that enables enterprise teams to deploy secure, compliant outreach and qualification workflows across departments or clients, with options for self-hosting and private data environments.",
		},
	},
	{
		id: "voice-cloning",
		question: "How does voice cloning work?",
		answers: {
			agent:
				"You record a short voice sample and DealScale securely trains a private model that replicates your tone and pacing. Your AI sounds like you, authentic, human, and fully exclusive to your account.",
			investor:
				"Record a brief voice sample once and DealScale creates your AI voice clone. It's private, secure, and sounds like you when calling or texting sellers, building trust and saving time.",
			wholesaler:
				"After a quick setup, DealScale clones your voice so sellers hear your tone and style when the AI calls. This builds trust and boosts response rates while you focus on deal analysis.",
			agency:
				"Each client can upload a short sample to generate a unique AI voice model for their brand or agent. Voice data stays encrypted and limited to that workspace only.",
			enterprise:
				"DealScale’s enterprise voice cloning supports per-user models with encryption, audit trails, and full compliance. Voice data never leaves your controlled environment.",
		},
	},
	{
		id: "roi",
		question: "What kind of ROI can I expect?",
		answers: {
			agent:
				"Most agents see around a 3×–7× ROI within 60 days. Every $1 spent on DealScale returns roughly $5 in additional commissions from converted listings or referrals.",
			investor:
				"Investors typically generate $3–$8 in closed-deal revenue for every $1 spent within 90 days, often covering an annual plan with one wholesale or flip deal.",
			wholesaler:
				"Wholesalers usually see 4×–10× ROI. For example, closing one $10,000 assignment deal often pays for an entire year of DealScale Pro.",
			agency:
				"Agencies report 4×–6× ROI from client retainers and labor savings when automating outreach with DealScale’s AI engine.",
			enterprise:
				"Enterprise teams typically achieve 5× ROI through reduced labor costs, faster conversions, and higher data accuracy across campaigns.",
		},
	},
	{
		id: "compliance",
		question:
			"Is DealScale compliant with TCPA, GDPR, and the Colorado AI Act?",
		answers: {
			agent:
				"Yes. DealScale automatically filters Do Not Call numbers, respects time-zone safe windows, and provides compliant voicemail drops. We also include disclosure templates to stay ahead of the 2026 Colorado AI Act.",
			investor:
				"DealScale handles compliance for every outreach: TCPA filtering, consent tracking, and AI transparency for upcoming laws like Colorado's 2026 AI Act.",
			wholesaler:
				"Yes. All calls, texts, and voicemails are fully TCPA and carrier-compliant. Colorado AI transparency updates will be built in before 2026.",
			agency:
				"DealScale offers compliance documentation for TCPA, GDPR, and the Colorado AI Act so agencies can safely use AI outreach for clients.",
			enterprise:
				"Compliance is built into every layer. DealScale aligns with TCPA, GDPR, CCPA, and Colorado AI Act standards, including AI labeling, audit logs, and opt-out controls.",
		},
	},
	{
		id: "crm",
		question: "Does DealScale integrate with my CRM?",
		answers: {
			agent:
				"Yes. DealScale connects with CRMs like HubSpot, Lofty, GoHighLevel, Zoho, and FollowUpBoss for instant two-way sync of leads, calls, and appointments.",
			investor:
				"Yes. It integrates with REI tools like Podio, InvestorFuse, and REsimpli, or any major CRM through API and webhooks.",
			wholesaler:
				"Yes. DealScale pushes qualified leads and call summaries directly into your CRM or deal tracker using built-in integrations.",
			agency:
				"Yes. Agencies can link multiple CRMs and manage data sync per client workspace from a unified dashboard.",
			enterprise:
				"Yes. DealScale supports custom API integrations with enterprise CRMs such as Salesforce, HubSpot Enterprise, and Microsoft Dynamics.",
		},
	},
];

export const FEATURED_FAQ_BY_PERSONA: Record<PersonaKey, PersonaFaqItem["id"]> =
	{
		agent: "what-is-dealscale",
		investor: "what-is-dealscale",
		wholesaler: "roi",
		agency: "what-is-dealscale",
		enterprise: "compliance",
	};

export const PERSONA_NEXT_STEP_FAQ: Record<
	PersonaKey,
	{
		question: string;
		answer: string;
	}
> = {
	agent: {
		question: "Agent Playbook: How do I launch my first AI campaign?",
		answer:
			'Upload your hottest seller list, clone your voice in under five minutes, and choose the "Seller Revival" template. DealScale will start booking listing appointments while syncing every conversation back to your CRM automatically.',
	},
	investor: {
		question: "Investor Playbook: How do I turn skip tracing into deals fast?",
		answer:
			'Drop in your driving-for-dollars or probate leads, enable the "Outreach Surge" workflow, and let DealScale run AI voice + SMS follow-up instantly. You’ll get qualified callbacks and hot leads posted to your CRM the same day.',
	},
	wholesaler: {
		question: "Wholesaler Playbook: How do I keep my pipeline full?",
		answer:
			'Import tired landlord or absentee-owner lists and activate the "Assignment Accelerator" cadence. DealScale will pre-screen motivation, confirm property condition, and send warm leads straight to your acquisitions board.',
	},
	agency: {
		question: "Agency Playbook: How do I roll this out to clients?",
		answer:
			'Spin up a client workspace, clone their brand voice, and launch the "Client Retainer Saver" campaign. DealScale keeps their pipeline working 24/7 while you report on booked appointments and retained revenue.',
	},
	enterprise: {
		question: "Enterprise Playbook: What does go-live look like?",
		answer:
			'Connect your CRM sandbox, provision AI agents for each region, and deploy the "Enterprise Compliance Guardrail" sequence. DealScale handles outreach, consent tracking, and audit-ready reporting to keep every team aligned.',
	},
};

export const PERSONA_ADVANCED_FAQ: Record<
	PersonaKey,
	{
		id: string;
		question: string;
		answer: string;
	}
> = {
	agent: {
		id: "agent-advanced",
		question: "How do I scale results after my first listings go live?",
		answer:
			"Layer DealScale into your expired, FSBO, and circle prospecting lists. Activate nurture cadences that drip market updates and prep videos from your AI voice so sellers stay warm until they are ready to list.",
	},
	investor: {
		id: "investor-advanced",
		question: "What’s the move once my first wholesale deal closes?",
		answer:
			"Clone the winning script, duplicate the campaign, and let DealScale retarget the entire owner cluster. Add AI SMS follow-up to surface referral properties the owner might sell next.",
	},
	wholesaler: {
		id: "wholesaler-advanced",
		question: "How can I keep dispositions humming automatically?",
		answer:
			"Hook DealScale to your buyers list, enable AI text follow-up, and broadcast new deals the instant acquisitions tags them. The AI handles reply sorting, proof of funds checks, and scheduling property walkthroughs.",
	},
	agency: {
		id: "agency-advanced",
		question:
			"What’s the best way to upsell clients once campaigns are working?",
		answer:
			"Package DealScale automations into premium retainers. Spin up additional vertical-specific cadences, sync results into their analytics dashboard, and show incremental ROI from AI voice + SMS blends.",
	},
	enterprise: {
		id: "enterprise-advanced",
		question: "How do I orchestrate multiple business units in one view?",
		answer:
			"Use DealScale’s workspace hierarchy to group regions, assign AI voices, and enforce compliance templates. Central reporting highlights campaign lift by unit while individual teams manage their own playbooks.",
	},
};
