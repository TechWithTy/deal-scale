import type { CaseStudy, Category } from "@/types/case-study";
import {
	aiIntegrationHowItWorks,
	aiPhoneAgentHowItWorks,
	dealScaleProprietaryProcess,
	followUpHowItWorks,
	generalHowItWorks,
	instantLeadEngagement,
	leadGenHowItWorks,
	offMarketAdvantageHowItWorks,
} from "../service/slug_data/how_it_works";
import { leadGenIntegrations } from "../service/slug_data/integrations";

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
			"The modern real estate agent's greatest challenge isn't a lack of leads; it's a lack of time. Industry-leading data from Salesforce confirms that nearly three-quarters of a sales professional's week is wasted on non-selling tasks. Deal Scale was built to solve this exact problem. By deploying AI-powered virtual agents, we automate the entire top-of-funnel process—from initial outreach and persistent follow-up to data entry and appointment setting. This allows our partners to transform their operations, shifting their team's focus from being busy to being productive.",
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
					"Ensure no lead is wasted. Instantaneous follow-up guarantees that every dollar spent on lead generation has the maximum possible impact.",
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
			"The old way of finding real estate deals is broken. We believe the future belongs to investors who leverage intelligent automation to originate deals others can't see. DealScale is a complete real estate automation engine built to give you an unfair advantage. We provide access to over 140 million properties, but our power lies in our proprietary AI process. Our system analyzes ownership history and local market signals to generate a unique AI Sentiment Score, predicting which properties are viable off-market deals. This allows you to build a hyper-targeted, pre-qualified pipeline and focus only on deals with the highest potential.",
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
		featured: true,
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
			"The cost of customer acquisition remains high due to the time and labor required for lead generation and nurturing.",
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
			"McKinsey, a global authority on business strategy, has confirmed where AI makes the biggest difference: marketing and sales automation. The findings are clear—companies that adopt AI in these areas see significant cost savings and productivity gains. Deal Scale is the purpose-built application of this principle for the real estate industry. We leverage advanced AI to automate the entire lead generation and nurturing process, directly targeting the functions McKinsey identifies as having the highest potential for AI-driven transformation. The result is a more efficient, cost-effective, and productive sales operation.",
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
];

export const caseStudyCategories: Category[] = [
	{ id: "all", name: "All" },
	...Array.from(new Set(caseStudies.flatMap((study) => study.categories))).map(
		(category) => ({
			id: category,
			name: category.charAt(0).toUpperCase() + category.slice(1),
		}),
	),
];
