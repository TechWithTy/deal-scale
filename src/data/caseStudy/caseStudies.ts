import type { CaseStudy, Category } from "@/types/case-study";
import {
	aiIntegrationHowItWorks,
	dealScaleProprietaryProcess,
	followUpHowItWorks,
	generalHowItWorks,
	instantLeadEngagement,
} from "../service/slug_data/how_it_works";

export type CaseStudyCopyright = {
	title: string;
	subtitle: string;
	ctaText: string;
	ctaLink: string;
};

export const caseStudies: CaseStudy[] = [
	{
		id: "time-efficiency-study-01",
		title: "Automating the 72% How Top Agents Reclaim Their Sales Day",
		subtitle:
			"Based on Salesforce Research, Deal Scale addresses the #1 productivity killer in real estate sales by automating the tasks that prevent agents from selling.",
		referenceLink:
			"https://www.salesforce.com/content/dam/web/en_us/www/images/form/pdf/pdf/state-of-sales-report-salesforce.pdf",
		slug: "reclaiming-the-sales-day-with-ai",
		categories: ["sales-automation", "lead-generation"],
		industries: ["real-estate"],
		copyright: {
			title: "Ready to Reclaim Your Time?",
			subtitle:
				"See how Deal Scale can automate your lead flow and free up your team to focus on what matters: closing deals.",
			ctaText: "Request a Demo",
			ctaLink: "/contact",
		},
		tags: [
			"Time Efficiency",
			"Salesforce",
			"Productivity",
			"Automation",
			"Lead Nurturing",
		],
		clientName: "Industry Data: Salesforce Research",
		clientDescription:
			"This case study is based on the findings of the Salesforce 'State of Sales' Report, an annual, globally recognized benchmark for sales performance and challenges.",
		featuredImage: "/case-studies/72-wasted-time.png",
		thumbnailImage: "/case-studies/72-wasted-time.png",
		businessChallenges: [
			"Sales representatives spend only 28% of their week actively selling.",
			"Over 72% of agent time is consumed by administrative tasks, manual data entry, and repetitive follow-ups.",
			"Inability to scale prospecting efforts due to manual constraints leads to lost revenue opportunities and agent burnout.",
		],
		lastModified: new Date("2024-10-26T10:00:00.000Z"),
		howItWorks: generalHowItWorks,
		businessOutcomes: [
			{
				title: "Massively Increased Selling Time",
				subtitle:
					"By automating the 72% of time spent on administrative work, agents can triple their focus on revenue-generating activities and client-facing conversations.",
			},
			{
				title: "Improved Agent Morale & Retention",
				subtitle:
					"Automating tedious, repetitive tasks reduces burnout and allows agents to focus on the more rewarding aspects of their job, like building relationships and closing deals.",
			},
		],
		solutions: [
			"24/7 AI-Powered Lead Engagement and Nurturing",
			"Automated Follow-up Sequences via Call, Text, and Socials",
			"Direct Calendar Integration for Sales-Ready Appointments",
			"Elimination of Manual Data Entry for Prospecting",
		],

		description:
			"The modern real estate agent's greatest challenge isn't a lack of leads; it's a lack of time. Industry-leading data from Salesforce confirms that nearly three-quarters of a sales professional's week is wasted on non-selling tasks. Deal Scale was built to solve this exact problem. By deploying AI-powered virtual agents, we automate the entire top-of-funnel process, from initial outreach and persistent follow-up to data entry and appointment setting. This allows our partners to transform their operations, shifting their team's focus from being busy to being productive.",
		results: [
			{
				title: "Time Reclaimed for Selling Activities",
				value: "72%",
			},
			{
				title: "Reduction in Manual Calling Time",
				value: "70%",
			},
			{
				title: "Improvement in Nurturing Efficiency",
				value: "40%",
			},
		],
		featured: false,
		redirectToContact: false,
	},
	{
		id: "speed-to-lead-study-02",
		title:
			"The 5-Minute Rule: How Instant Response Unlocks 21x More Qualified Leads",
		subtitle:
			"Based on Harvard Business Review research, Deal Scale's AI capitalizes on the critical lead response window that human teams physically cannot.",
		slug: "instant-response-21x-leads",
		referenceLink:
			"https://www.researchgate.net/profile/Kristina-Mcelheran/publication/298137032_The_short_life_of_online_sales_leads/links/5771477608ae0b3a3b7d5d49/The-short-life-of-online-sales-leads.pdf",
		categories: ["lead-conversion", "sales-automation"],
		industries: ["real-estate"],
		copyright: {
			title: "Don't Let Another Hot Lead Go Cold",
			subtitle:
				"Engage every lead instantly with Deal Scale's 24/7 AI Agents. See how it works.",
			ctaText: "Book Your Demo",
			ctaLink: "/contact",
		},
		tags: [
			"Speed to Lead",
			"Harvard Business Review",
			"Lead Conversion",
			"Automation",
			"Sales-Ready Appointments",
		],
		clientName: "Industry Data: Harvard Business Review",
		clientDescription:
			"This case study leverages findings from the landmark 'Lead Response Management Study' published in the Harvard Business Review, which scientifically proved the direct correlation between response speed and lead qualification rates.",
		featuredImage: "/case-studies/5-minuete-rule.png",
		thumbnailImage: "/case-studies/5-minuete-rule.png",
		businessChallenges: [
			"The odds of qualifying a new lead decrease by 21x if contact is made after 30 minutes versus within 5 minutes.",
			"Up to 80% of initial real estate leads go cold due to slow or inconsistent follow-up.",
			"Human-only teams cannot operate 24/7, leading to missed opportunities from off-hour inquiries.",
			"Valuable marketing spend is wasted when leads are not engaged at their peak moment of interest.",
		],
		lastModified: new Date("2024-10-27T10:00:00.000Z"),
		howItWorks: instantLeadEngagement,
		businessOutcomes: [
			{
				title: "Maximized Lead Conversion Rate",
				subtitle:
					"By engaging leads within the critical 5-minute window, you capitalize on peak interest, drastically increasing the likelihood of conversion.",
			},
			{
				title: "Superior Marketing ROI",
				subtitle:
					"Ensure no prospect is wasted. Instantaneous follow-up guarantees that every dollar invested in lookalike audience expansion, executed with relationship-first principles from How to Win Friends and Influence People, has the maximum possible impact.",
			},
		],
		solutions: [
			"24/7 AI-Powered Virtual Agents for Instant Response",
			"Automated Lead Qualification and Nurturing",
			"Hot-Transfer Functionality for Immediate Conversations",
			"Automated Calendar Scheduling for Qualified Appointments",
		],

		description:
			"Harvard Business Review proved that the first 5 minutes are the most critical in a lead's lifecycle. A human team, no matter how dedicated, cannot guarantee an instant response every time. Deal Scale's AI can. We deploy 'always-on' virtual agents that engage every single lead the moment they show interest, ensuring you capitalize on that golden window of opportunity. This transforms lead management from a race against the clock into a systematic, automated process that delivers a consistent pipeline of warm, sales-ready appointments.",
		results: [
			{
				title: "Increase in Lead Qualification Odds",
				value: "21x",
			},
			{
				title: "Typical Lead-to-Appt Conversion (Manual)",
				value: "<2%",
			},
			{
				title: "Initial Leads Lost (Without Automation)",
				value: "80%",
			},
		],
		featured: false,
		redirectToContact: false,
	},
	{
		id: "dealscale-proprietary-process-01",
		title: "From Grind to Growth: The New Philosophy of Real Estate Investing",
		subtitle:
			"DealScale’s real estate AI builds your proprietary deal pipeline by finding, scoring, and engaging motivated sellers before they ever reach the market.",
		slug: "the-dealscale-automated-investment-engine",
		categories: [
			"real-estate-automation",
			"ai-lead-generation",
			"off-market-deals",
			"proptech",
		],
		industries: [
			"real-estate-investing",
			"wholesaling",
			"property-acquisition",
		],
		copyright: {
			title: "Stop Prospecting. Start Closing.",
			subtitle:
				"See how our AI-powered platform can automate your entire deal pipeline.",
			ctaText: "Request a Demo",
			ctaLink: "/contact",
		},
		tags: [
			"Real Estate AI",
			"AI Sentiment Score",
			"AI Virtual Agents",
			"Real Estate Automation",
			"Motivated Sellers",
			"Off-Market Deals",
			"Scalable Growth",
		],
		clientName: "The DealScale Method",
		featuredImage: "/case-studies/off-market-36.png",
		thumbnailImage: "/case-studies/off-market-36.png",
		clientDescription:
			"This outlines DealScale's proprietary methodology for real estate investment, leveraging a powerful combination of total market data access, a predictive AI Sentiment Score, and automated AI Virtual Agents to create a fully autonomous deal pipeline.",
		businessChallenges: [
			"The traditional real estate grind is inefficient, relying on manual prospecting and outdated lead lists.",
			"High competition on the public market (MLS) leads to bidding wars and compressed profit margins.",
			"Inconsistent deal flow makes it impossible to scale a real estate business predictably.",
			"Valuable time is wasted chasing unqualified, dead-end leads instead of talking to motivated sellers.",
		],
		howItWorks: dealScaleProprietaryProcess,
		lastModified: new Date("2024-10-27T10:00:00.000Z"),
		description:
			"The old way of finding real estate deals is broken. We believe the future belongs to investors who leverage intelligent automation to originate deals others can't see. DealScale is a complete real estate automation engine built to give you an unfair advantage. We provide access to over 140 million properties, but our power lies in our proprietary AI process. Our system analyzes ownership history and local market signals to generate a unique AI Sentiment Score, predicting which properties are viable lookalike off-market deals. This allows you to build a hyper-targeted, pre-qualified pipeline informed by similarity features and focus only on deals with the highest potential.",
		solutions: [
			"Define & Target: Instantly build hyper-targeted lead lists by defining your ideal property criteria (location, type, budget).",
			"Deploy AI Virtual Agents: Launch automated campaigns where AI agents conduct dynamic, realistic conversations via calls, text, and social media to qualify leads.",
			"Nurture & Pre-Qualify: Our AI understands market data and personal messaging, adapting its approach to nurture leads based on their actual responses.",
			"Automated Hand-off: Receive sales-ready leads via a hot-transfer call or an automatically scheduled appointment on your calendar.",
			"Focus on Closing: Delegate the entire prospecting and qualification process to AI so you can focus on high-value conversations and closing deals.",
		],
		businessOutcomes: [
			{
				title: "Build a Predictable Off-Market Pipeline",
				subtitle:
					"Transform your deal sourcing into a consistent, automated engine that delivers exclusive, high-margin opportunities 24/7.",
			},
			{
				title: "Scale Without The Headcount",
				subtitle:
					"Dramatically increase your deal flow and business capacity without the cost and complexity of hiring a larger team.",
			},
		],
		results: [
			{
				title: "Focus",
				value: "High-Intent Deals Only",
			},
			{
				title: "Efficiency",
				value: "Fully Automated Pipeline",
			},
			{
				title: "Advantage",
				value: "Proprietary AI Scoring",
			},
		],
		featured: false,
		redirectToContact: true,
	},
	{
		id: "tech-adoption-gap-04",
		title: "Bridging the Gap: Why Standard Agent Tech Fails at Follow-Up",
		subtitle:
			"NAR research shows that while agents have basic tools, they still struggle with the most critical task: lead follow-up. Deal Scale provides the missing automation layer.",
		referenceLink:
			"https://www.nar.realtor/research-and-statistics/research-reports/realtor-technology-survey",
		slug: "bridging-the-real-estate-tech-gap",
		categories: ["proptech", "sales-automation", "lead-management"],
		industries: ["real-estate-brokerage", "real-estate-investing"],
		copyright: {
			title: "Get the Tech That Actually Does the Work",
			subtitle:
				"Stop just managing leads and start converting them. See how Deal Scale's automation platform can transform your process.",
			ctaText: "Explore the Solution",
			ctaLink: "/contact",
		},
		tags: [
			"NAR",
			"PropTech",
			"Tech Gap",
			"Lead Follow-up",
			"CRM",
			"AI Automation",
		],
		clientName: "Industry Data: National Association of REALTORS® (NAR)",
		clientDescription:
			"This case study is based on insights from the National Association of REALTORS®' annual Technology Survey, which benchmarks technology adoption and identifies the top challenges facing real estate professionals today.",
		featuredImage: "/case-studies/deal-scale-follow-up.png",
		thumbnailImage: "/case-studies/deal-scale-follow-up.png",
		businessChallenges: [
			"Lead management and follow-up remain a top technological challenge for brokers, despite high CRM adoption.",
			"While 46% of agents use a CRM, these systems are often passive databases that require immense manual effort to be effective.",
			"Agents are equipped with tools for organization (CRMs) and closing (e-signatures), but lack technology for the crucial, time-consuming work in between.",
			"The gap in automation leads to inconsistent follow-up, cold leads, and wasted opportunities.",
		],
		lastModified: new Date("2024-10-29T10:00:00.000Z"),
		howItWorks: followUpHowItWorks,
		businessOutcomes: [
			{
				title: "Closing the Real Estate Tech Gap",
				subtitle:
					"Deal Scale provides the missing automation layer that turns a simple CRM from a passive database into a proactive revenue-generating machine.",
			},
			{
				title: "Increased ROI on Tech Spend",
				subtitle:
					"Maximize the value of your existing CRM and lead sources by ensuring no lead is ever dropped due to a lack of follow-up.",
			},
		],
		solutions: [
			"Advanced AI Automation for Lead Follow-Up",
			"Fills the functionality gap in standard real estate CRMs",
			"Delivers sales-ready appointments, not just raw leads",
			"Reduces agent time spent on manual lead management",
			"Seamless integration with existing sales processes",
		],

		description:
			"The National Association of REALTORS®' own research reveals a clear technology paradox: agents have tools, but they lack the *right* tools. While CRMs can store data, they can't perform the single most time-consuming part of the job: the relentless follow-up required to convert a lead. Deal Scale is specifically designed to fill this critical gap. Our AI platform acts as the intelligent, automated engine that your CRM is missing, handling all lead nurturing and qualification so your agents can do what they were hired to do: build relationships and close deals.",
		results: [
			{
				title: "Agent CRM Adoption Rate",
				value: "46%",
			},
			{
				title: "Top Reported Tech Challenge for Brokers",
				value: "Lead Follow-Up",
			},
			{
				title: "Deal Scale's Role",
				value: "The Missing Automation Layer",
			},
		],
		featured: false,
		redirectToContact: false,
	},
	{
		id: "ai-productivity-study-05",
		title:
			"The McKinsey Principle: How AI Drives a Productivity Revolution in Sales",
		subtitle:
			"Global authority McKinsey confirms that AI's biggest impact is in sales and marketing. Deal Scale is a direct application of this finding for the real estate industry.",
		referenceLink:
			"https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
		slug: "ai-sales-productivity-revolution-mckinsey",
		categories: ["ai-in-business", "sales-productivity", "cost-savings"],
		industries: ["real-estate-investing", "real-estate-brokerage"],
		copyright: {
			title: "Implement a Winning AI Strategy",
			subtitle:
				"Leverage AI to cut costs and dramatically increase the productivity of your sales team. See how Deal Scale makes it possible.",
			ctaText: "Discover the ROI",
			ctaLink: "/contact",
		},
		tags: [
			"McKinsey",
			"AI in Business",
			"Productivity",
			"Cost Savings",
			"Sales Automation",
			"Generative AI",
		],
		clientName: "Industry Data: McKinsey & Company",
		clientDescription:
			"This study is based on insights from McKinsey's global survey, 'The State of AI', a leading annual report on AI adoption, impact, and strategic implementation across industries.",
		featuredImage: "/case-studies/sales-marketing-benefits.png",
		thumbnailImage: "/case-studies/sales-marketing-benefits.png",
		businessChallenges: [
			"High operational costs in marketing and sales departments limit profitability and scalability.",
			"Human teams are a bottleneck to productivity, unable to handle high volumes of customer interactions efficiently.",
			"Companies struggle to adopt AI in a way that generates tangible cost savings and measurable productivity gains.",
			"The cost of customer acquisition remains high due to the time and labor required for lookalike audience expansion and relationship-first nurturing.",
		],
		lastModified: new Date("2024-10-30T10:00:00.000Z"),
		howItWorks: aiIntegrationHowItWorks,
		businessOutcomes: [
			{
				title: "Significant Decrease in Operational Costs",
				subtitle:
					"By automating sales and service functions, businesses can achieve the dramatic cost savings in marketing and sales that McKinsey identifies.",
			},
			{
				title: "Revolutionized Sales Productivity",
				subtitle:
					"Aligns with McKinsey's findings by leveraging AI to increase the effectiveness and efficiency of customer-facing interactions, boosting overall team output.",
			},
		],
		solutions: [
			"AI-driven automation of marketing and sales functions",
			"Reduction in manual labor for customer acquisition",
			"Scalable service operations through AI Virtual Agents",
			"Increased effectiveness of customer-facing interactions",
			"Delivers tangible ROI through cost savings and productivity gains",
		],

		description:
			"McKinsey, a global authority on business strategy, has confirmed where AI makes the biggest difference: marketing and sales automation. The findings are clear: companies that adopt AI in these areas see significant cost savings and productivity gains. Deal Scale is the purpose-built application of this principle for the real estate industry. We leverage advanced AI to automate the entire lookalike audience expansion and nurturing process, infusing every touch with the rapport-building steps championed in How to Win Friends and Influence People. The result is a more efficient, cost-effective, and productive sales operation.",
		results: [
			{
				title: "Primary AI Impact Area (McKinsey)",
				value: "Marketing & Sales",
			},
			{
				title: "Reduction in Manual Calling Time",
				value: "70%",
			},
			{
				title: "Improvement in Nurturing Efficiency",
				value: "40%",
			},
		],
		featured: false,
		redirectToContact: false,
	},
	{
		id: "globalconsult-lead-response-study-06",
		title:
			"How GlobalConsult cut lead-to-follow-up time from 6 h → under 2 min and boosted demo bookings by 22%",
		subtitle:
			"GlobalConsult (mid-market consulting firm) was drowning in inbound leads: response lag of 4–6 hours, manual triage, and many cold leads falling through cracks. By deploying Deal Scale's unified lead-capture, AI-based lead-scoring + automated outreach engine, GlobalConsult shrank lead-response time to under 2 minutes, improved demo booking rate from 8% → 30%, and increased monthly new-client revenue by 18%.",
		slug: "globalconsult-lead-response-automation",
		categories: [
			"lead-conversion",
			"sales-automation",
			"lead-management",
			"crm-integration",
		],
		industries: ["consulting", "professional-services"],
		copyright: {
			title: "Want to cut your lead-response time to under 2 minutes?",
			subtitle:
				"See how Deal Scale can automate your lead capture, scoring, and outreach to double your demo conversions.",
			ctaText: "Book a demo with Deal Scale",
			ctaLink: "/contact",
		},
		tags: [
			"Lead Response Time",
			"Demo Booking",
			"Lead Scoring",
			"CRM Integration",
			"Multi-Channel Outreach",
			"Revenue Growth",
		],
		clientName: "GlobalConsult",
		clientDescription:
			"Mid-market consulting firm specializing in business transformation and strategic advisory services.",
		featuredImage: "/case-studies/globalconsult-lead-automation.png",
		thumbnailImage: "/case-studies/globalconsult-lead-automation.png",
		businessChallenges: [
			"High inbound lead volume; manual qualification overload (small sales team).",
			"Slow response times (4–6 hours) — many leads lost before contact.",
			"No prioritization: all leads treated equally → wasted SDR bandwidth.",
			"CRM fragmentation: some leads entered via web-form, others via spreadsheet, many duplicates, inconsistent data.",
		],
		lastModified: new Date("2025-01-15T10:00:00.000Z"),
		howItWorks: instantLeadEngagement,
		businessOutcomes: [
			{
				title: "Dramatic Response Time Improvement",
				subtitle:
					"Cut lead-to-follow-up time from 6 hours to under 2 minutes, ensuring no hot lead goes cold before contact.",
			},
			{
				title: "Scaled Operations Without Headcount",
				subtitle:
					"Same SDR team handled 2.5× leads automatically, eliminating the need for additional hires while increasing revenue.",
			},
		],
		solutions: [
			"Unified lead capture + enrichment: All inbound leads (web-form, API, manual import) routed into canonical lead schema; enriched missing firmographics, de-duped duplicates.",
			"AI-driven lead scoring & prioritization: Using embedding + firmographic model, leads automatically scored; only top-tier leads (top 25%) routed for immediate outreach.",
			"Automated multi-channel outreach: High-score leads entered a multi-touch outreach queue (email → SMS → call → calendar link) with dynamic templates + personalization, triggered within minutes.",
			"CRM sync & pipeline update: Response triggers auto-update CRM, assign to rep, create follow-up tasks; no manual data entry.",
			"Realtime dashboard & reporting: Live metrics: lead response time, outreach attempts, booked demos, revenue pipeline, conversion rates.",
		],
		description:
			"GlobalConsult was drowning in inbound leads with a response lag of 4–6 hours, manual triage, and many cold leads falling through cracks. By deploying Deal Scale's unified lead-capture, AI-based lead-scoring + automated outreach engine, GlobalConsult shrank lead-response time to under 2 minutes, improved demo booking rate from 8% → 30%, and increased monthly new-client revenue by 18%. GlobalConsult scaled inbound without hiring more staff, cut lead leakage, improved conversion quality, and increased revenue, demonstrating how Deal Scale's automation + AI + data backbone delivers real business impact quickly.",
		results: [
			{
				title: "Average Lead Response Time",
				value: "6 h → 1.8 min",
			},
			{
				title: "Demo Booking Rate",
				value: "8% → 30%",
			},
			{
				title: "Monthly New-Client Revenue Increase",
				value: "+18%",
			},
		],
		featured: false,
		redirectToContact: false,
	},
	{
		id: "case-crm-integration-2025-11",
		title:
			"How BetaCorp cut their sales cycle time by 3× after unified CRM integration with Deal Scale",
		subtitle:
			"Fragmented data and slow pipeline → streamlined CRM, unified sales data & faster conversions",
		referenceLink: null,
		slug: "betacorp-crm-integration-pipeline-2025",
		categories: [
			"crm-integration",
			"workflow-automation",
			"pipeline-management",
		],
		industries: ["manufacturing-software", "enterprise"],
		copyright: {
			title: "Need a unified sales workflow?",
			subtitle: "Deal Scale can connect your silos and speed up sales.",
			ctaText: "Contact us",
			ctaLink: "/contact",
		},
		tags: [
			"CRM integration",
			"pipeline",
			"automation",
			"sales velocity",
			"case-study",
		],
		clientName: "BetaCorp",
		clientDescription:
			"Enterprise-software vendor serving manufacturing firms, ~200 employees, multiple fragmented lead & deal sources (sheet, CRM, manual).",
		featuredImage: "/images/case-betacorp-crm-hero.jpg",
		thumbnailImage: "/images/case-betacorp-crm-thumb.jpg",
		businessChallenges: [
			"Leads and deals tracked in multiple places: spreadsheet, legacy CRM, manual logs",
			"Lack of unified pipeline made forecasting and prioritization unreliable",
			"Sales reps wasted time switching between systems; inconsistent follow-up and data loss",
		],
		lastModified: new Date("2025-11-26T10:00:00.000Z"),
		howItWorks: [
			{
				stepNumber: 1,
				title: "Audit lead & deal sources",
				subtitle: "Inventory all lead and deal data sources",
				description:
					"Mapped all existing spreadsheets, CRM exports, manual forms, collected legacy deal logs and consolidated into centralized database.",
				icon: "Database",
				label: "audit",
				positionLabel: "step-1",
				payload: [],
			},
			{
				stepNumber: 2,
				title: "CRM integration & pipeline rationalization",
				subtitle: "Unified pipeline schema and data model",
				description:
					"Built canonical lead/deal schema; migrated legacy data; mapped into unified pipeline, ensuring consistent data fields, tagging, stage definitions.",
				icon: "Code",
				label: "integrate",
				positionLabel: "step-2",
				payload: [],
			},
			{
				stepNumber: 3,
				title: "Automated workflows & reminders",
				subtitle: "Auto-assignment, follow-up reminders, stage change triggers",
				description:
					"Configured automation: when lead converted to opportunity, auto-assign to rep; reminders if no contact in 7 days; automated pipeline status updates.",
				icon: "Zap",
				label: "automate",
				positionLabel: "step-3",
				payload: [],
			},
			{
				stepNumber: 4,
				title: "Reporting & forecasting dashboard",
				subtitle: "Real-time deal pipeline visibility",
				description:
					"Built live dashboard tracking deals by stage, time-to-close averages, rep performance, and forecasting, enabling leadership to make data-driven decisions.",
				icon: "BarChartBig",
				label: "visualize",
				positionLabel: "step-4",
				payload: [],
			},
		],
		businessOutcomes: [
			{
				title: "Sales cycle shortened",
				subtitle: "Average time-to-close reduced by 66%",
			},
			{
				title: "Pipeline visibility & reliability",
				subtitle:
					"Unified data + forecasting dashboard enabled accurate forecasts and better prioritization",
			},
		],
		solutions: [
			"CRM + data source consolidation",
			"Canonical pipeline schema",
			"Automated follow-up workflows & reminders",
			"Real-time reporting dashboard",
		],
		techStacks: [
			{
				category: "data & backend",
				libraries: [
					{
						name: "PostgreSQL",
						description: "Central lead/deal database",
						link: null,
						lucideIcon: "Database",
					},
				],
			},
			{
				category: "automation & orchestration",
				libraries: [
					{
						name: "Workflow Engine (Lead Orchestra)",
						description: "Handles automated triggers, reminders, assignment",
						link: null,
						lucideIcon: "Bolt",
					},
				],
			},
			{
				category: "dashboard & reporting",
				libraries: [
					{
						name: "React + Chart.js",
						description: "Real-time deal pipeline dashboard",
						link: null,
						lucideIcon: "PieChart",
					},
				],
			},
		],
		description:
			"BetaCorp had been accruing leads and deals across spreadsheets, legacy CRM exports, and manual forms. This fragmented setup resulted in lost deals, inconsistent follow-up, and almost no reliable forecasting. Deal Scale performed a full audit of all lead/deal sources, migrated and normalized all records into a unified canonical schema, and consolidated into a single pipeline. We implemented automated workflows: leads were auto-assigned, follow-up reminders triggered automatically, and deal stages consistently updated. Finally, we built a real-time reporting dashboard giving leadership visibility into pipeline health, time-to-close averages, rep performance, and forecast accuracy. As a result the average sales cycle dropped by ~66%, conversion consistency improved, and forecasting for future revenue became reliable.",
		results: [
			{
				title: "Average time-to-close before",
				value: "90 days",
			},
			{
				title: "Average time-to-close after",
				value: "30 days",
			},
			{
				title: "Forecast accuracy improvement",
				value: "≈ 95%",
			},
			{
				title: "Deal data consolidation",
				value: "100% of pipelines unified",
			},
		],
		featured: false,
		redirectToContact: false,
	},
	{
		id: "case-full-automation-2025-11",
		title:
			"From inbound lead to closed deal: 100% automated sales funnel for Gamma Ltd",
		subtitle:
			"Zero manual touch: AI scoring, automated follow-up, pipeline tracking, closed deals",
		referenceLink: null,
		slug: "gamma-full-automation-2025",
		categories: [
			"full-automation",
			"lead-scoring",
			"crm-automation",
			"workflow",
		],
		industries: ["digital-services", "consulting"],
		copyright: {
			title: "Automate your sales funnel end-to-end",
			subtitle:
				"Let Deal Scale handle lead scoring, outreach, follow-ups, and deal closing.",
			ctaText: "See how",
			ctaLink: "/contact",
		},
		tags: [
			"full automation",
			"lead scoring",
			"workflow automation",
			"case-study",
			"AI-sales",
		],
		clientName: "Gamma Ltd",
		clientDescription:
			"Boutique consulting firm specializing in industrial compliance, high-volume inbound leads, lean sales team (3 reps).",
		featuredImage: "/images/case-gamma-automation-hero.jpg",
		thumbnailImage: "/images/case-gamma-automation-thumb.jpg",
		businessChallenges: [
			"High volume of inbound leads, difficult to qualify manually at scale",
			"Small sales team couldn't keep up with follow-up volume, delays in outreach, lost opportunities",
			"Lack of consistent lead scoring, prioritization, and pipeline hygiene",
		],
		lastModified: new Date("2025-11-26T10:00:00.000Z"),
		howItWorks: [
			{
				stepNumber: 1,
				title: "AI-based lead scoring & prioritization",
				subtitle:
					"Automatically score inbound leads based on firmographics, intent, previous interaction data",
				description:
					"Inbound leads get auto-scored; only leads above threshold are routed to outreach queue.",
				icon: "BrainCircuit",
				label: "score",
				positionLabel: "step-1",
				payload: [],
			},
			{
				stepNumber: 2,
				title: "Automated multi-channel outreach",
				subtitle: "Email → SMS → call → calendar link",
				description:
					"High-score leads are automatically enrolled in a 7-touch, multi-channel sequence with dynamic personalization via templates.",
				icon: "Zap",
				label: "outreach",
				positionLabel: "step-2",
				payload: [],
			},
			{
				stepNumber: 3,
				title: "CRM sync & pipeline update",
				subtitle: "Sync responses to CRM and update deal status automatically",
				description:
					"Once a lead replies or books meeting, CRM automatically updates; tasks generated for follow-up; no manual data entry.",
				icon: "DatabaseZap",
				label: "sync",
				positionLabel: "step-3",
				payload: [],
			},
			{
				stepNumber: 4,
				title: "Automated nurturing & re-engagement",
				subtitle: "If no response, schedule re-engagement after 30 days",
				description:
					"Leads that went cold get re-entered into a lower-touch nurturing sequence, keeps pipeline warm without manual effort.",
				icon: "RefreshCw",
				label: "nurture",
				positionLabel: "step-4",
				payload: [],
			},
		],
		businessOutcomes: [
			{
				title: "Leads handled automatically",
				subtitle: "100% of inbound leads processed via automation",
			},
			{
				title: "Sales throughput increased",
				subtitle: "Closed deals without additional headcount or manual labor",
			},
		],
		solutions: [
			"AI-driven lead scoring",
			"Automated multi-channel outreach",
			"CRM synchronization & pipeline management",
			"Automated nurturing & re-engagement workflows",
		],
		techStacks: [
			{
				category: "AI & scoring",
				libraries: [
					{
						name: "Embedding-based intent & firmographic model",
						description:
							"Scores leads automatically based on embeddings + heuristics",
						link: null,
						lucideIcon: "Brain",
					},
				],
			},
			{
				category: "automation & workflow",
				libraries: [
					{
						name: "Lead Orchestra workflow engine",
						description: "Orchestrates outreach, follow-ups, re-engagements",
						link: null,
						lucideIcon: "Bolt",
					},
				],
			},
			{
				category: "communication",
				libraries: [
					{
						name: "Twilio + SendGrid",
						description: "Handles automated SMS, call, email outreach",
						link: null,
						lucideIcon: "Mail",
					},
				],
			},
			{
				category: "CRM & data sync",
				libraries: [
					{
						name: "PostgreSQL + Webhooks",
						description: "Syncs responses and updates CRM automatically",
						link: null,
						lucideIcon: "DatabaseZap",
					},
				],
			},
		],
		description:
			"Gamma Ltd receives hundreds of inbound leads per month, but their small sales team (3 reps) struggled to follow up fast enough, resulting in lost opportunities and low conversion. Deal Scale implemented full-funnel automation: AI-based lead scoring, dynamic multi-channel outreach, CRM sync, automated deal tracking and nurturing. As a result, 100% of inbound leads were processed automatically. Outreach response times dropped to under 30 minutes on average, deals closed, and Gamma scaled sales throughput, without hiring more sales staff. The system also continuously nurtured cold leads, keeping the pipeline healthy and evergreen.",
		results: [
			{
				title: "Inbound leads processed automatically",
				value: "100%",
			},
			{
				title: "Average response time",
				value: "< 30 minutes",
			},
			{
				title: "Closed deals per month (post-automation)",
				value: "4–6 (vs 1–2 before)",
			},
			{
				title: "Sales team headcount",
				value: "3 (no change)",
			},
		],
		featured: false,
		redirectToContact: false,
	},
	{
		id: "rei-operator-deal-flow-2025-01",
		title:
			"How a Mid-Size Real Estate Investor (REI Operator) Scaled Deal Flow: 40+ Qualified Leads, 5 Closing Deals ($120K+) in 45 Days",
		subtitle:
			"A real-estate investing firm with an existing rental portfolio and acquisition pipeline struggled to keep up with new leads from multiple sources. By implementing Deal Scale's unified lead ingestion, AI scoring, multi-channel outreach, CRM integration, and automated follow-up workflows, they processed 100% of inbound and sourced leads, generated 40+ qualified leads, closed 5 deals totaling over $120,000 net profit, all within 45 days, without adding headcount.",
		referenceLink: null,
		slug: "rei-operator-automated-deal-pipeline-2025",
		categories: [
			"real-estate-automation",
			"lead-scoring",
			"pipeline-management",
			"workflow-automation",
		],
		industries: [
			"real-estate-investing",
			"property-acquisition",
			"wholesaling",
		],
		copyright: {
			title:
				"Want to turn every lead into a repeatable, automated acquisition machine?",
			subtitle:
				"Book a Deal Scale demo and see how you can process 100% of your leads, automatically follow up, and close more deals, without adding staff.",
			ctaText: "Book a Deal Scale demo",
			ctaLink: "/contact",
		},
		tags: [
			"Real Estate Investing",
			"Deal Flow",
			"Lead Scoring",
			"Pipeline Automation",
			"Property Acquisition",
			"REI Operator",
		],
		clientName: "REI Operator (Mid-Size Real Estate Investor)",
		clientDescription:
			"Mid-size real-estate operator/investor focusing on acquisition of off-market properties and rental/flip deals. Small operations team: 2 acquisitions managers, 1 acquisitions coordinator; no dedicated SDR/outreach team.",
		featuredImage: "/case-studies/rei-operator-deal-flow.png",
		thumbnailImage: "/case-studies/rei-operator-deal-flow.png",
		businessChallenges: [
			"Multiple lead sources: public MLS searches, bandit signs, direct mail responses, investor networks, leads scattered across spreadsheets, email inboxes, and legacy CRM.",
			"High lead volume but low follow-up consistency, many leads went cold, or were missed entirely.",
			"Time-consuming manual qualification and follow-up; long delays in outreach caused many sellers to go with other buyers.",
			"No systematic way to score leads, prioritize high-potential deals, nurture cold leads, or track conversion rates.",
		],
		lastModified: new Date("2025-01-20T10:00:00.000Z"),
		howItWorks: [
			{
				stepNumber: 1,
				title: "Unified Lead Ingestion & Data Normalization",
				subtitle: "Consolidate all lead sources into canonical schema",
				description:
					"All lead sources (spreadsheets, web forms, direct mail responses manually entered, legacy CRM) were fed into a canonical Deal Scale lead schema. Duplicate detection, deduplication, and enrichment (firmographic data, property/address info, seller history, publicly available property data) to ensure clean, standardized data for scoring.",
				icon: "Database",
				label: "ingest",
				positionLabel: "step-1",
				payload: [],
			},
			{
				stepNumber: 2,
				title: "AI-Driven Lead Scoring & Prioritization",
				subtitle: "Rank leads based on intent and deal-fit criteria",
				description:
					"Deal Scale's lookalike & embedding-based scoring engine ranked leads based on intent, property characteristics, historical seller behavior, and deal-fit criteria. Top 20–25% of leads automatically flagged as 'high-priority' and queued for immediate outreach; others routed to a lower-touch nurturing stream.",
				icon: "BrainCircuit",
				label: "score",
				positionLabel: "step-2",
				payload: [],
			},
			{
				stepNumber: 3,
				title: "Automated Multi-Channel Outreach & Follow-Up",
				subtitle: "Email → SMS → phone-call → calendar link",
				description:
					"High-priority leads received automated outreach via email → SMS → phone-call → calendar link for property evaluation calls. Lower-priority leads entered drip-nurture sequences (occasional check-ins, property-value estimate offers, 'we buy houses' marketing) to keep pipeline warm, without manual effort.",
				icon: "Zap",
				label: "outreach",
				positionLabel: "step-3",
				payload: [],
			},
			{
				stepNumber: 4,
				title: "CRM Sync + Pipeline Management + Deal Tracking",
				subtitle: "Real-time pipeline visibility and deal tracking",
				description:
					"Outbound and inbound responses automatically synced to CRM. Lead status, engagement, follow-ups, property evaluation appointments, offer submissions, all tracked centrally. Dashboard for real-time pipeline view: total leads processed, high-priority leads flagged, outreach attempts count, response rates, appointments booked, offers submitted, deals closed, profit per deal, etc.",
				icon: "BarChartBig",
				label: "track",
				positionLabel: "step-4",
				payload: [],
			},
			{
				stepNumber: 5,
				title: "Automated Re-Engagement / Evergreen Nurture",
				subtitle: "Keep cold leads warm with automated nurture",
				description:
					"Cold leads (no response after initial outreach) were re-entered into nurture streams after 60 days (e.g. 'still interested in selling?', 'market update', value-add content). Leads that resurfaced were re-scored and re-prioritized, increasing chances of capturing deals that might have been missed otherwise.",
				icon: "RefreshCw",
				label: "nurture",
				positionLabel: "step-5",
				payload: [],
			},
		],
		businessOutcomes: [
			{
				title: "Rapid Deal Flow Expansion",
				subtitle:
					"Scaled deal flow dramatically without increasing headcount or overhead, keeping margins high.",
			},
			{
				title: "Evergreen Deal Pipeline",
				subtitle:
					"Built a scalable, repeatable acquisition process with continuous nurture and re-engagement, creating a long-term evergreen pipeline.",
			},
		],
		solutions: [
			"Unified lead ingestion & data normalization: All lead sources consolidated into canonical schema with duplicate detection and enrichment.",
			"AI-driven lead scoring & prioritization: Top 20–25% of leads automatically flagged as high-priority for immediate outreach.",
			"Automated multi-channel outreach & follow-up: High-priority leads receive automated sequences; lower-priority leads enter drip-nurture streams.",
			"CRM sync + pipeline management + deal tracking: Real-time dashboard tracking all pipeline metrics, appointments, offers, and closed deals.",
			"Automated re-engagement / evergreen nurture: Cold leads re-entered into nurture streams after 60 days, keeping pipeline warm.",
		],
		description:
			"A real-estate investing firm with an existing rental portfolio and acquisition pipeline struggled to keep up with new leads from multiple sources (property owner leads, off-market leads, referrals). By implementing Deal Scale's unified lead ingestion, AI scoring, multi-channel outreach, CRM integration, and automated follow-up workflows, they processed 100% of inbound and sourced leads, generated 40+ qualified leads, closed 5 deals totaling over $120,000 net profit (after rehab/transaction costs), all within 45 days, without adding headcount. The firm now has a scalable, repeatable acquisition process with continuous nurture and re-engagement, creating an evergreen deal pipeline that eliminates missed deals due to manual follow-up gaps.",
		results: [
			{
				title: "Inbound & sourced leads processed",
				value: "~30% → 100%",
			},
			{
				title: "Qualified high-priority leads generated",
				value: "5–8/month → 40+ in 45 days",
			},
			{
				title: "Outreach speed (first contact after lead)",
				value: "12–48 hrs → < 15 minutes",
			},
			{
				title: "Response / engagement rate",
				value: "~10% → 28%",
			},
			{
				title: "Deals closed",
				value: "1–2 per quarter → 5 in 45 days",
			},
			{
				title: "Net profit from closed deals",
				value: "$30–50K per quarter → $120K+ in 45 days",
			},
		],
		featured: true,
		redirectToContact: false,
	},
	{
		id: "taylor-spreadsheet-to-scale-2025-01",
		title: "From Spreadsheet Chaos to Seamless Scale",
		subtitle:
			"A real investor case study: how a small team moved from spreadsheet lead chaos to a connected workflow with automation + AI—and improved lead-to-deal consistency.",
		referenceLink: null,
		slug: "taylor-spreadsheet-chaos-to-seamless-scale",
		categories: [
			"workflow-automation",
			"crm-integration",
			"lead-management",
			"pipeline-management",
		],
		industries: ["real-estate-investing", "property-acquisition"],
		copyright: {
			title:
				"Want help mapping your workflow and identifying the exact breakpoints?",
			subtitle:
				"Stop wasting time on manual data entry and missed follow-ups. See how DealScale's AI can automate your entire pipeline and give you back your day.",
			ctaText: "Request a Live Demo",
			ctaLink: "/contact",
		},
		tags: [
			"Spreadsheet Automation",
			"Workflow Consolidation",
			"AI Integration",
			"Pipeline Management",
			"Lead Conversion",
			"Ecosystem Thinking",
		],
		clientName: "Taylor",
		clientDescription:
			"Small-to-mid investor operation with steady inbound flow (referrals + marketing), a part-time VA, and a simple acquisitions rhythm. Goal: close consistently without living in the inbox.",
		featuredImage: "/case-studies/taylor-spreadsheet-to-scale.png",
		thumbnailImage: "/case-studies/taylor-spreadsheet-to-scale.png",
		businessChallenges: [
			"Leads living in multiple spreadsheets (Spreadsheet A = lead intake, Spreadsheet B = follow-up tracker)",
			"Notes scattered across texts, DMs, and call logs with no centralized location",
			"Follow-ups that depend on memory rather than systematic processes",
			"The same lead 'owned' by three different people, causing confusion and missed opportunities",
			"No single place to trust to answer: 'What's the next move?'",
			"Pipeline was a mix of tabs, memory, and good intentions rather than a reliable system",
			"Reporting was 'best guess' rather than data-driven insights",
		],
		lastModified: new Date("2025-01-22T10:00:00.000Z"),
		howItWorks: [
			{
				stepNumber: 1,
				title: "Consolidate into a Single Source of Truth",
				subtitle: "Define minimum viable pipeline with consistent structure",
				description:
					"Taylor defined the minimum viable pipeline: one record per lead, consistent stages, consistent required fields, one owner per lead, and one 'next action' + 'next follow-up date'. This eliminated the 'it's in the other sheet' problem and created a trustworthy foundation.",
				icon: "Database",
				label: "consolidate",
				positionLabel: "step-1",
				payload: [],
			},
			{
				stepNumber: 2,
				title: "Automate the Handoffs",
				subtitle: "Set triggers so follow-up doesn't depend on memory",
				description:
					"The team set simple triggers: when a lead is added → assign an owner; when a lead is marked 'warm' → create next-step tasks; when follow-up date hits → surface it automatically; when status changes → log it consistently. This is where the operation began to feel lighter—not because they worked less, but because the workflow carried the load.",
				icon: "Zap",
				label: "automate",
				positionLabel: "step-2",
				payload: [],
			},
			{
				stepNumber: 3,
				title: "Add AI Where It Creates Leverage",
				subtitle: "Remove the slowest, most repetitive friction",
				description:
					"Taylor added AI to remove the slowest, most repetitive friction: initial intake qualification, summarizing lead context into usable notes, making sure no lead sits untouched, and keeping outreach consistent when the team is busy. AI wasn't added to 'sound futuristic'—it was added to create real leverage.",
				icon: "BrainCircuit",
				label: "ai-leverage",
				positionLabel: "step-3",
				payload: [],
			},
		],
		businessOutcomes: [
			{
				title: "Pipeline Stability & Predictability",
				subtitle:
					"The pipeline stopped feeling random. Taylor could finally say: 'I know what's next. I know what's stuck. I know we're not dropping opportunities.'",
			},
			{
				title: "Measurable Conversion Improvements",
				subtitle:
					"Lead-to-deal conversion improved from 0.6% to 1.8%—a 3x increase—while reducing weekly time spent updating records from 10 hours to 1.5 hours.",
			},
		],
		solutions: [
			"Standardized intake into one unified pipeline (eliminated multiple spreadsheets)",
			"Centralized lead context with consistent fields and AI-generated summaries",
			"Clear ownership and routing rules (one owner per lead, no more confusion)",
			"Automated tasks and required follow-up dates (no more memory-dependent follow-ups)",
			"Pipeline truth with visibility into where deals stall (replaced 'best guess' reporting)",
			"AI-powered initial intake qualification and lead context summarization",
			"Automated outreach consistency when the team is busy",
		],
		description:
			"Taylor runs a lean investor operation with steady inbound flow, a part-time VA, and a simple acquisitions rhythm. The problem wasn't effort—it was fragmentation. Leads lived in multiple spreadsheets, notes were scattered across texts and email, follow-ups depended on memory, and there was no single place to trust for 'What's the next move?' This case study shows how Taylor moved from spreadsheet chaos to a connected workflow that scales without replacing every tool they already used. The transition happened in three phases: (1) Consolidate into a single source of truth, (2) Automate the handoffs so follow-up doesn't depend on memory, and (3) Add AI where it creates leverage, not noise. The result? Lead response time dropped from 24 hours to 15 minutes, leads touched within 24 hours increased from 35% to 95%, follow-ups completed on time jumped from 40% to 96%, and lead-to-deal conversion improved from 0.6% to 1.8%. The biggest win wasn't just numbers—it was stability. The pipeline stopped feeling random, and Taylor could finally operate with confidence.",
		results: [
			{
				title: "Lead Response Time",
				value: "24 hours → 15 minutes",
			},
			{
				title: "Leads Touched Within 24 Hours",
				value: "35% → 95%",
			},
			{
				title: "Follow-ups Completed on Time",
				value: "40% → 96%",
			},
			{
				title: "Lead-to-Deal Conversion",
				value: "0.6% → 1.8%",
			},
			{
				title: "Weekly Time Spent Updating Records",
				value: "10 hours → 1.5 hours",
			},
		],
		featured: true,
		redirectToContact: false,
	},
	{
		id: "beta-data-report-2025-q4",
		title:
			"DealScale Beta Data Report: Real Metrics from 500+ AI-Powered Lead Interactions",
		subtitle:
			"Early beta findings across investors and wholesalers, focused on speed, coverage, throughput, and clean handoffs. Anonymized, aggregated data revealing what established teams care about when scaling responsibly.",
		referenceLink: null,
		slug: "dealscale-beta-data-report-2025",
		categories: [
			"data-report",
			"beta-insights",
			"ai-automation",
			"lead-management",
			"workflow-automation",
		],
		industries: [
			"real-estate-investing",
			"property-acquisition",
			"wholesaling",
		],
		copyright: {
			title: "Want to be part of the next wave and help shape the Q1 roadmap?",
			subtitle:
				"See how DealScale's AI can automate your entire pipeline with real data-driven insights.",
			ctaText: "Request a Demo",
			ctaLink: "/contact",
		},
		tags: [
			"Beta Data",
			"Performance Metrics",
			"AI Automation",
			"Lead Response Time",
			"Follow-up Coverage",
			"Qualification Speed",
			"Data-Driven Insights",
		],
		clientName: "DealScale Beta Users (Aggregated)",
		clientDescription:
			"Early beta activity across 500+ AI-powered lead interactions (conversations + automations triggered) from established investors and wholesalers. All metrics are anonymized and aggregated, with outliers trimmed to ensure accurate representation.",
		featuredImage: "/case-studies/beta-data-report-2025.png",
		thumbnailImage: "/case-studies/beta-data-report-2025.png",
		businessChallenges: [
			"Most operators don't lose deals because they lack leads—they lose deals because the follow-up system can't keep up",
			"Response time slips, causing hot leads to cool off in silence",
			"Notes get fragmented across multiple systems and touchpoints",
			"Handoffs get messy, leading to missed opportunities and dropped leads",
			"Teams need operator-grade metrics: speed, coverage, throughput, and clean handoffs",
		],
		lastModified: new Date("2025-12-22T10:00:00.000Z"),
		howItWorks: [
			{
				stepNumber: 1,
				title: "Speed to First Touch",
				subtitle: "Median: 18 minutes from lead creation",
				description:
					"Fast response isn't a 'nice-to-have'—it's your first compounding advantage. Beta results show median time to first touch of 18 minutes, with 42% touched within 15 minutes and 81% within 60 minutes.",
				icon: "Bolt",
				label: "speed",
				positionLabel: "step-1",
				payload: [],
			},
			{
				stepNumber: 2,
				title: "Follow-up Coverage Within SLA",
				subtitle: "88% within 2 hours, 97% within 24 hours",
				description:
					"AI handles follow-ups within defined windows: 88% within 2 hours and 97% within 24 hours. Only 2.5% of leads receive zero follow-ups. This is what 'scaling responsibly' looks like: not just more outreach, but more coverage with fewer blind spots.",
				icon: "CheckSquare",
				label: "coverage",
				positionLabel: "step-2",
				payload: [],
			},
			{
				stepNumber: 3,
				title: "Lead Qualification & AI Task Completion",
				subtitle: "1.6 hour median qualification, 86% AI completion rate",
				description:
					"Median qualification time is 1.6 hours, with 93% qualified within 24 hours. AI completes 86% of tasks end-to-end without human intervention, while 14% require handoff for complex situations, missing data, or compliance needs.",
				icon: "BrainCircuit",
				label: "qualification",
				positionLabel: "step-3",
				payload: [],
			},
			{
				stepNumber: 4,
				title: "Engagement Signal & Next Steps",
				subtitle: "41% reply rate, 18% positive intent, 9% appointments set",
				description:
					"Engagement metrics reveal real impact: 41% reply rate, 63% conversation completion rate, 18% positive intent rate (warm/hot signals), and 9% appointment/next-step set rate. If you're measuring only 'messages sent,' you're blind—measure engagement → intent → next step → conversion.",
				icon: "BarChart",
				label: "engagement",
				positionLabel: "step-4",
				payload: [],
			},
		],
		businessOutcomes: [
			{
				title: "Operator-Grade Performance Metrics",
				subtitle:
					"When follow-up becomes automatic, teams stop 'hoping' their pipeline is real and start operating like it is. Clear visibility into speed, coverage, throughput, and handoff reasons.",
			},
			{
				title: "AI-First Execution with Clean Handoffs",
				subtitle:
					"AI handles the repeatable work (86% completion rate) while cleanly escalating complex situations, missing data, compliance needs, and negotiation complexity to humans (14% handoff rate).",
			},
		],
		solutions: [
			"Speed to first touch: Median 18 minutes from lead creation to first outreach",
			"Follow-up coverage within SLA: 88% within 2 hours, 97% within 24 hours",
			"Lead qualification automation: Median 1.6 hours from creation to qualified/disqualified status",
			"AI task completion: 86% of tasks completed end-to-end without human intervention",
			"Human handoff system: 14% of cases escalated for missing data, edge cases, compliance, or complexity",
			"Engagement tracking: Reply rates, conversation completion, positive intent, and next-step metrics",
			"Data quality and enrichment: Reduced handoff friction through standardized fields and data enrichment",
		],
		description:
			"Most operators don't lose deals because they lack leads—they lose deals because the follow-up system can't keep up. Response time slips, notes get fragmented, handoffs get messy, and 'hot' leads cool off in silence. This original data post is based on early beta usage across investors and wholesalers, summarizing 500+ AI-powered lead interactions with a focus on operator-grade metrics: speed, coverage, throughput, and clean handoffs. Key findings include median time to first touch of 18 minutes (with 42% touched within 15 minutes), follow-up coverage of 88% within 2 hours and 97% within 24 hours, median qualification time of 1.6 hours, AI task completion rate of 86% with 14% human handoff rate, and engagement signals showing 41% reply rate and 18% positive intent rate. The data reveals where real estate ops are ready for AI today: fast response, consistent follow-up, structured qualification, and context summarization. Humans still win at negotiation, complex situations, judgment calls, compliance nuance, and relationship dynamics. The 'right' model is AI-first execution with clean handoffs, not automation theater.",
		results: [
			{
				title: "Median Speed to First Touch",
				value: "18 minutes",
			},
			{
				title: "Touched Within 15 Minutes",
				value: "42%",
			},
			{
				title: "Touched Within 60 Minutes",
				value: "81%",
			},
			{
				title: "Follow-up Coverage Within 2 Hours",
				value: "88%",
			},
			{
				title: "Follow-up Coverage Within 24 Hours",
				value: "97%",
			},
			{
				title: "Median Lead Qualification Time",
				value: "1.6 hours",
			},
			{
				title: "AI Task Completion Rate",
				value: "86%",
			},
			{
				title: "Human Handoff Rate",
				value: "14%",
			},
			{
				title: "Reply Rate",
				value: "41%",
			},
			{
				title: "Conversation Completion Rate",
				value: "63%",
			},
			{
				title: "Positive Intent Rate",
				value: "18%",
			},
			{
				title: "Appointment/Next-Step Set Rate",
				value: "9%",
			},
		],
		featured: false,
		redirectToContact: false,
	},
];

// Debug: Log case studies on module load
if (typeof window === "undefined") {
	// Server-side logging
	console.log(
		"[caseStudies.ts] Total case studies exported:",
		caseStudies.length,
	);
	console.log(
		"[caseStudies.ts] Case study IDs:",
		caseStudies.map((s) => s.id),
	);
}

export const caseStudyCategories: Category[] = [
	{ id: "all", name: "All" },
	...Array.from(new Set(caseStudies.flatMap((study) => study.categories))).map(
		(category) => ({
			id: category,
			name: category.charAt(0).toUpperCase() + category.slice(1),
		}),
	),
];
