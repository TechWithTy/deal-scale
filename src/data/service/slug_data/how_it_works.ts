import type { ServiceHowItWorks } from "@/types/service/services"; // Assuming types are in a file at this path

export const generalHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Connect",
		subtitle: "Seamless Onboarding",
		description:
			"Get started quickly with an intuitive onboarding process. Integrate your favorite tools and set up your account in minutes.",
		icon: "Puzzle",
		label: "Connect Tools",
		positionLabel: "left-[-40px] top-[30px]",
		payload: [
			{ name: "Integrations", value: 95, fill: "hsl(var(--primary))" },
			{ name: "Setup Speed", value: 90, fill: "hsl(var(--secondary))" },
		],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Discover",
		subtitle: "Access Quality Data",
		description:
			"Tap into a vast, constantly updated database of real estate opportunities. Use advanced filters to zero in on the best deals for your business.",
		icon: "Search",
		label: "Discover Deals",
		positionLabel: "left-[120px] top-[5px]",
		payload: [
			{ name: "Data Coverage", value: 98, fill: "hsl(var(--accent))" },
			{ name: "Filter Options", value: 93, fill: "hsl(var(--muted))" },
		],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Automate",
		subtitle: "AI-Driven Workflows",
		description:
			"Leverage AI to enrich, score, and route leads. Automate repetitive tasks so your team can focus on closing deals.",
		icon: "Brain",
		label: "AI Automation",
		positionLabel: "left-[-35px] top-[55px]",
		payload: [
			{ name: "Task Automation", value: 97, fill: "hsl(var(--chart-1))" },
			{ name: "Lead Scoring", value: 94, fill: "hsl(var(--chart-2))" },
		],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Scale",
		subtitle: "Grow Your Pipeline",
		description:
			"Effortlessly scale your operations. Expand into new markets, manage outreach, and track results—all from one unified platform.",
		icon: "BarChart",
		label: "Scale Results",
		positionLabel: "left-[135px] top-[15px]",
		payload: [
			{ name: "Growth Potential", value: 100, fill: "hsl(var(--success))" },
			{ name: "Operational Efficiency", value: 89, fill: "hsl(var(--info))" },
		],
		indicator: "dot",
	},
];

export const instantLeadEngagement: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Engage",
		subtitle: "Instant Lead Engagement",
		description:
			"The moment a lead shows interest, our AI Virtual Agent initiates a dynamic, personalized conversation via call or text, ensuring zero delay.",
		icon: "Bolt",
		label: "Start Conversation",
		positionLabel: "left-[-40px] top-[30px]",
		payload: [
			{ name: "Response Speed", value: 99, fill: "hsl(var(--primary))" },
			{ name: "Personalization", value: 95, fill: "hsl(var(--secondary))" },
		],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Qualify",
		subtitle: "Intelligent Qualification",
		description:
			"The AI agent nurtures the conversation, asking key qualifying questions and adapting based on real-time responses to gauge motivation and readiness.",
		icon: "Network",
		label: "Qualification",
		positionLabel: "left-[120px] top-[5px]",
		payload: [
			{ name: "Qualification Accuracy", value: 96, fill: "hsl(var(--accent))" },
			{ name: "Engagement Depth", value: 91, fill: "hsl(var(--muted))" },
		],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Handoff",
		subtitle: "Seamless Handoff",
		description:
			"Once a lead is qualified, the AI either schedules them directly on your calendar or initiates a live 'hot-transfer' to an available agent for immediate closing.",
		icon: "ShieldCheck",
		label: "Schedule or Transfer",
		positionLabel: "left-[-35px] top-[55px]",
		payload: [
			{ name: "Booking Rate", value: 93, fill: "hsl(var(--chart-1))" },
			{ name: "Transfer Success", value: 89, fill: "hsl(var(--chart-2))" },
		],
		indicator: "dashed",
	},
];
export const aiIntegrationHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Automate High-Cost Functions",
		subtitle: "Deploy AI for Sales & Service",
		description:
			"Implement AI agents to automate the most labor-intensive tasks in sales: outbound prospecting and inbound lead qualification.",
		icon: "Bolt",
		label: "AI Automation",
		positionLabel: "left-[-40px] top-[30px]",
		payload: [
			{ name: "Automated Tasks", value: 97, fill: "hsl(var(--primary))" },
			{ name: "Coverage", value: 92, fill: "hsl(var(--secondary))" },
		],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Drive Down Acquisition Costs",
		subtitle: "Lower Your Cost-Per-Lead",
		description:
			"The AI works 24/7 to nurture leads, dramatically reducing the man-hours and operational costs required to produce a sales-ready appointment.",
		icon: "ChartBar",
		label: "Reduce Costs",
		positionLabel: "left-[120px] top-[5px]",
		payload: [
			{ name: "Cost Reduction", value: 94, fill: "hsl(var(--accent))" },
			{ name: "Lead Nurturing", value: 96, fill: "hsl(var(--muted))" },
		],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Increase Team Productivity",
		subtitle: "Focus Humans on High-Value Tasks",
		description:
			"By delivering only qualified opportunities, your sales team's productivity soars, as they focus entirely on closing deals instead of searching for them.",
		icon: "ShieldCheck",
		label: "Boost Productivity",
		positionLabel: "left-[-35px] top-[55px]",
		payload: [
			{ name: "Qualified Leads", value: 95, fill: "hsl(var(--chart-1))" },
			{ name: "Productivity Boost", value: 98, fill: "hsl(var(--chart-2))" },
		],
		indicator: "dashed",
	},
];
export const followUpHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Supercharge Your CRM",
		subtitle: "Enhance Your Existing Tech Stack",
		description:
			"Deal Scale integrates with your workflow, acting as the action-oriented engine that your passive CRM lacks.",
		icon: "Network",
		label: "Integrate CRM",
		positionLabel: "left-[-40px] top-[30px]",
		payload: [
			{ name: "CRM Sync", value: 98, fill: "hsl(var(--primary))" },
			{ name: "Integration Depth", value: 94, fill: "hsl(var(--secondary))" },
		],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Automate the Follow-Up",
		subtitle: "Solve the #1 Tech Challenge",
		description:
			"Our AI agents take over the entire lead nurturing process, ensuring every lead gets persistent, intelligent, and timely follow-up without any manual work.",
		icon: "RefreshCw",
		label: "AI Follow-Up",
		positionLabel: "left-[120px] top-[5px]",
		payload: [
			{ name: "Follow-Up Rate", value: 97, fill: "hsl(var(--accent))" },
			{ name: "Timeliness", value: 92, fill: "hsl(var(--muted))" },
		],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Receive Qualified Appointments",
		subtitle: "Turn Raw Leads into Revenue",
		description:
			"Instead of a list of cold leads, your agents receive a calendar filled with sales-ready appointments, allowing them to focus exclusively on closing.",
		icon: "ShieldCheck",
		label: "Booked Meetings",
		positionLabel: "left-[-35px] top-[55px]",
		payload: [
			{ name: "Appointment Volume", value: 93, fill: "hsl(var(--chart-1))" },
			{ name: "Qualification Rate", value: 89, fill: "hsl(var(--chart-2))" },
		],
		indicator: "dashed",
	},
];
export const offMarketAdvantageHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Target with Precision",
		subtitle: "Access 140M+ Property Records",
		description:
			"Utilize our comprehensive database to create hyper-targeted lists based on criteria like home equity, ownership duration, and absentee status.",
		icon: "ChartBar",
		label: "Target Properties",
		positionLabel: "left-[-40px] top-[30px]",
		payload: [
			{ name: "Database Size", value: 100, fill: "hsl(var(--primary))" },
			{ name: "Targeting Accuracy", value: 94, fill: "hsl(var(--secondary))" },
		],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Deploy AI Outreach",
		subtitle: "Automate Direct-to-Seller Contact",
		description:
			"Launch AI agents to systematically contact thousands of targeted homeowners with personalized, compliant outreach via calls and texts.",
		icon: "Bolt",
		label: "AI Outreach",
		positionLabel: "left-[120px] top-[5px]",
		payload: [
			{ name: "Automation Scale", value: 97, fill: "hsl(var(--accent))" },
			{ name: "Personalization", value: 92, fill: "hsl(var(--muted))" },
		],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Secure Exclusive Appointments",
		subtitle: "Find Motivated Sellers First",
		description:
			"The AI identifies and qualifies motivated sellers, booking appointments directly on your calendar, giving you first access to exclusive, off-market opportunities.",
		icon: "ShieldCheck",
		label: "Book Appointments",
		positionLabel: "left-[-35px] top-[55px]",
		payload: [
			{ name: "Appointment Rate", value: 93, fill: "hsl(var(--chart-1))" },
			{ name: "Lead Exclusivity", value: 90, fill: "hsl(var(--chart-2))" },
		],
		indicator: "dashed",
	},
];
export const leadGenHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Define",
		subtitle: "Set Your Ideal Criteria",
		description:
			"Specify your ideal investment criteria using our intuitive interface. Filter by location, property type, keywords, owner information, and more.",
		icon: "Search",
		label: "Define Audience",
		positionLabel: "left-[-45px] top-[45px]", // Example positioning
		payload: [
			{ name: "Filters Applied", value: 100, fill: "hsl(var(--primary))" },
			{ name: "Target Area", value: 90, fill: "hsl(var(--secondary))" },
		],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Generate",
		subtitle: "Build From 140M+ Properties",
		description:
			"Instantly build your lead list from our comprehensive database of over 140 million on- and off-market properties.",
		icon: "Database",
		label: "Generate Lists",
		positionLabel: "left-[125px] top-[-5px]", // Example positioning
		payload: [
			{ name: "Off-Market Leads", value: 95, fill: "hsl(var(--accent))" },
			{ name: "On-Market Leads", value: 85, fill: "hsl(var(--muted))" },
		],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Enrich & Score",
		subtitle: "AI-Powered Data Insights",
		description:
			"Our AI automatically enriches lists with accurate contact information and scores each lead's motivation level.",
		icon: "Brain",
		label: "AI Enrichment",
		positionLabel: "left-[-40px] top-[50px]", // Example positioning
		payload: [
			{ name: "Data Enrichment", value: 92, fill: "hsl(var(--chart-1))" },
			{ name: "Lead Scoring", value: 98, fill: "hsl(var(--chart-2))" },
		],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Launch",
		subtitle: "Start Automated Outreach",
		description:
			"Seamlessly push your high-potential leads into automated outreach and nurturing campaigns to start conversations instantly.",
		icon: "Rocket",
		label: "Launch Campaigns",
		positionLabel: "left-[130px] top-[10px]", // Example positioning
		payload: [
			{ name: "Campaign Automation", value: 100, fill: "hsl(var(--success))" },
			{ name: "Lead Engagement", value: 88, fill: "hsl(var(--info))" },
		],
		indicator: "dot",
	},
];

export const socialLeadGenHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Connect",
		subtitle: "Link Your Social Accounts",
		description:
			"Securely connect your Facebook and Instagram business pages to Deal Scale in just a few clicks.",
		icon: "Share",
		label: "Connect Accounts",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Activate",
		subtitle: "Choose Your Campaign",
		description:
			"Select from our library of AI-optimized conversation flows, proven to pre-qualify real estate leads effectively.",
		icon: "Bolt",
		label: "Activate AI Flow",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Engage",
		subtitle: "Capture Leads Automatically",
		description:
			"When a user comments, our AI instantly sends a DM and begins the pre-qualification conversation.",
		icon: "Zap",
		label: "Automated Engagement",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Deliver",
		subtitle: "Get Appointments & Hot Transfers",
		description:
			"The AI nurtures the qualified lead with automated follow-ups. When they are sales-ready, it either schedules an appointment directly on your calendar or initiates a live hot transfer call to you.",
		icon: "RocketLaunch",
		label: "Secure Appointment",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const snailMailHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Select List & Campaign",
		subtitle: "Choose Your Targets",
		description:
			"Select any lead list from your Deal Scale CRM and choose one of our proven, multi-touch campaign sequences.",
		icon: "Users",
		label: "Select Audience",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Launch Initial Contact",
		subtitle: "The First Touchpoint",
		description:
			"With one click, our system sends the first piece of mail—typically a high-response 'Yellow Letter'—to every lead through our national print and mail network.",
		icon: "Mail",
		label: "Send First Mailer",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Automated Follow-Up",
		subtitle: "Nurture on Autopilot",
		description:
			"The system automatically sends postcards and professional letters at proven 3-4 week intervals, but only to leads who haven't responded yet.",
		icon: "RefreshCw",
		label: "Automated Sequence",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "AI Call Handling",
		subtitle: "Convert Inbound Calls to Deals",
		description:
			"When a prospect calls the unique number on the mailer, your AI Sales Agent answers 24/7. It qualifies the seller, and if they're a fit, it automatically books a meeting on your calendar or hot-transfers the live call directly to you.",
		icon: "RocketLaunch",
		label: "AI Secures Appointment",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];
export const phoneNumberHunterHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Input Number(s)",
		subtitle: "Enter or Upload Phone Numbers",
		description:
			"Copy and paste a single U.S. phone number, or upload a CSV file with multiple numbers, into the Phone Number Hunter tool on your dashboard.",
		icon: "Phone",
		label: "Enter or Upload",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Initiate Search",
		subtitle: "One-Click Analysis",
		description:
			"With a single click, our system queries multiple OSINT and public data sources in real-time for every number submitted.",
		icon: "Search",
		label: "Run Search",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Review Report(s)",
		subtitle: "Get Instant Insights",
		description:
			"In seconds, view a complete report for each number—detailing the owner's name, carrier, line type, location, spam score, and more.",
		icon: "ShieldCheck",
		label: "Analyze Data",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Qualify & Act",
		subtitle: "Make Data-Driven Decisions",
		description:
			"Use the enriched data to instantly qualify or disqualify leads, whether working one number at a time or in bulk.",
		icon: "Zap",
		label: "Take Action",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const emailIntelligenceHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Input Clue",
		subtitle: "Start With a Name or Email",
		description:
			"Enter an email address to find social profiles, OR enter a name and company domain to generate likely email combinations.",
		icon: "Search",
		label: "Enter Data",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Launch Discovery",
		subtitle: "Scan Public Sources",
		description:
			"Our proprietary system scours the web for linked social media profiles and analyzes domain patterns to generate email addresses.",
		icon: "Globe",
		label: "Run Analysis",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Review Report",
		subtitle: "Get Actionable Intel",
		description:
			"In seconds, view a complete report detailing discovered social accounts and a list of the most probable email addresses.",
		icon: "ShieldCheck",
		label: "Generate Report",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Connect & Personalize",
		subtitle: "Reach Out With Confidence",
		description:
			"Use the enriched data to contact the right email and reference their professional background for a highly personalized message.",
		icon: "RocketLaunch",
		label: "Take Action",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const domainReconHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Enter Domain",
		subtitle: "Start With a Website",
		description:
			"Enter the domain name of any company you want to investigate (e.g., 'oakridgeproperties.com').",
		icon: "Globe",
		label: "Enter Domain",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Select Search Depth",
		subtitle: "Choose Free or Premium",
		description:
			"Choose a 'Standard' search using public sources, or a 'Deep Recon' search which uses Skip Trace Credits to query our premium, API-integrated data sources.",
		icon: "SlidersHorizontal",
		label: "Set Depth",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Aggregate Intelligence",
		subtitle: "Scan Dozens of Sources",
		description:
			"Our system gathers all discoverable emails, names, subdomains, IPs, and technologies associated with the domain.",
		icon: "Search",
		label: "Gather Intel",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Review Dossier",
		subtitle: "Get Your Full Report",
		description:
			"Analyze the comprehensive intelligence report to identify key contacts, understand their digital footprint, and plan your outreach.",
		icon: "FileText",
		label: "View Report",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const socialProfileHunterHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Input Identifier",
		subtitle: "Start With a Username or Email",
		description:
			"Enter a username or email address you want to investigate into the Social Profile Hunter tool.",
		icon: "Search",
		label: "Enter Identifier",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Launch Comprehensive Search",
		subtitle: "Scan 600+ Platforms",
		description:
			"Our proprietary system queries over 600 social media, forum, and online platforms in real-time to find matching accounts.",
		icon: "Globe",
		label: "Run Search",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Analyze with AI",
		subtitle: "Extract Key Metadata",
		description:
			"Our AI model analyzes the data from discovered profiles to extract key entities like names and locations, providing faster insights.",
		icon: "Brain",
		label: "AI Analysis",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Review & Export Report",
		subtitle: "Get Your Digital Footprint",
		description:
			"View a complete list of all found profiles. Export the report as a PDF or CSV for your records or to import into other systems.",
		icon: "FileText",
		label: "View Report",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const leadDossierHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Input Username",
		subtitle: "Start With a Single Clue",
		description:
			"Enter a single username you want to build a dossier on. Our tool uses this as the starting point for the investigation.",
		icon: "User",
		label: "Enter Username",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Comprehensive Search",
		subtitle: "Scan 3000+ Websites",
		description:
			"Our proprietary system queries over 3000 global websites, forums, and social media platforms to find all accounts linked to the username.",
		icon: "Globe",
		label: "Run Initial Search",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Recursive Discovery",
		subtitle: "Connect the Dots",
		description:
			"This is our secret sauce. If our tool finds a new username on a discovered profile, it automatically launches a *new search* for that second username, creating a web of interconnected accounts.",
		icon: "Network",
		label: "Recursive Analysis",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Generate Dossier",
		subtitle: "Get The Full Picture",
		description:
			"Review a comprehensive report with a visual relationship map, showing all discovered profiles and the connections between them. Export it as a PDF or HTML file.",
		icon: "FileText",
		label: "View Dossier",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const dataEnrichmentHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Select Your Data",
		subtitle: "Choose a Lead or a List",
		description:
			"Select a single lead or an entire list from your Deal Scale CRM that you want to enrich or validate.",
		icon: "Users",
		label: "Select Data",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Choose Enrichment Action",
		subtitle: "Select a Premium Tool",
		description:
			"Choose the specific action you want to perform, such as 'Reverse Address Lookup' or 'Validate Phone Numbers'.",
		icon: "CheckSquare",
		label: "Select Action",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Consume Credits & Run",
		subtitle: "Query Premium Data Sources",
		description:
			"The system securely queries our enterprise-grade data partners, debiting the required Skip Tracing Credits from your account.",
		icon: "DatabaseZap",
		label: "Query Databases",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Get Enriched Results",
		subtitle: "Update Your CRM Automatically",
		description:
			"The new, validated information is automatically appended to your lead records, giving you a complete and accurate dataset to work with.",
		icon: "FileCheck",
		label: "View Enriched Data",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const marketAnalysisHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Analyze Market",
		subtitle: "Enter a Zip Code or Address",
		description:
			"Instantly pull a detailed analysis for any US zip code, including rent averages, historical trends, and property type composition.",
		icon: "Search",
		label: "Run Analysis",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Chat with Data",
		subtitle: "Ask Questions in Plain English",
		description:
			"Instead of just viewing charts, ask our AI specific questions about the market data, like 'What are the average rents for 3-bedroom houses?'",
		icon: "MessageSquare",
		label: "AI Chat Interface",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Generate Report",
		subtitle: "Create Branded Reports",
		description:
			"With one click, generate a professional PDF or online report with your company's branding to share with clients or partners.",
		icon: "FileText",
		label: "Export Report",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Arm Your Agents",
		subtitle: "Feed Insights to Your AI Team",
		description:
			"Pass the market analysis to your AI Sales Agents. They will intelligently weave these stats into their conversations to build authority and create compelling arguments.",
		icon: "BrainCircuit",
		label: "Empower AI Agents",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const performanceHubHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Visualize Your Pipeline",
		subtitle: "See Every Deal in Motion",
		description:
			"Your entire deal flow is on a visual Kanban board. Drag-and-drop leads from 'New' to 'Appointment Set' to 'Closed'.",
		icon: "LayoutGrid",
		label: "Manage Pipeline",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "AI Proactively Adds Tasks",
		subtitle: "Automated Opportunity Detection",
		description:
			"The AI monitors your board 24/7. When it spots a key opportunity (e.g., a lead is inactive for 3 days), it *automatically creates and assigns a new task* for you.",
		icon: "BrainCircuit",
		label: "AI Adds Tasks",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "You Manually Add Tasks",
		subtitle: "Create Your Own To-Dos",
		description:
			"Create any custom task for yourself or your team, like 'Send comps to Jane Doe' or 'Prepare offer for 123 Main St'.",
		icon: "CheckSquare",
		label: "Create Manual Tasks",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "AI Offers to Complete Them",
		subtitle: "Automate Your Workflow",
		description:
			"Our AI instantly reads the manual tasks you create. If it detects a task it can perform, it will ask for your permission to complete it automatically.",
		icon: "Sparkles",
		label: "AI Automates Your Work",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const aiPhoneAgentHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Activate a Campaign",
		subtitle: "Select a Lead List",
		description:
			"Choose any lead list from your CRM and assign it to your AI Phone Agent with a single click.",
		icon: "Users",
		label: "Select Lead List",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "AI Initiates Calls",
		subtitle: "Tireless Outbound Dialing",
		description:
			"Your agent begins calling leads from your unique local number, using our proven, human-like conversation scripts,or your custom sales script.",
		icon: "Phone",
		label: "AI Starts Calling",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Intelligent Qualification",
		subtitle: "Asking the Right Questions",
		description:
			"The AI engages leads in a natural conversation, asking key qualifying questions about the property's condition, their timeline, and asking price.",
		icon: "BrainCircuit",
		label: "Qualify Lead",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Get Sales-Ready Appointments",
		subtitle: "Appointments & Hot Transfers",
		description:
			"Once a lead is qualified, the AI either books an appointment directly on your calendar or initiates a live hot-transfer phone call to you.",
		icon: "RocketLaunch",
		label: "Secure Appointment",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const aiInboundAgentHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Assign a Number",
		subtitle: "Point Your Marketing Here",
		description:
			"Assign a unique Deal Scale phone number to your marketing channels (e.g., a specific number for your direct mail campaign).",
		icon: "Phone",
		label: "Assign Number",
		positionLabel: "left-[-45px] top-[45px]",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "AI Answers Inbound Calls",
		subtitle: "Instant, 24/7 Call Pickup",
		description:
			"When a lead calls your number, the AI Inbound Agent answers immediately using a natural, human-like voice.",
		icon: "Phone",
		label: "AI Answers 24/7",
		positionLabel: "left-[125px] top-[-5px]",
		payload: [],
		indicator: "line",
	},
	{
		stepNumber: 3,
		title: "Intelligent Qualification",
		subtitle: "Asking the Right Questions",
		description:
			"The AI engages the caller in a conversation, asking key qualifying questions about their property, timeline, and motivation.",
		icon: "BrainCircuit",
		label: "Qualify Lead",
		positionLabel: "left-[-40px] top-[50px]",
		payload: [],
		indicator: "dashed",
	},
	{
		stepNumber: 4,
		title: "Get Sales-Ready Appointments",
		subtitle: "Appointments & Hot Transfers",
		description:
			"Once qualified, the AI either books an appointment directly on your calendar or offers to hot-transfer the live call to you or a team member.",
		icon: "RocketLaunch",
		label: "Secure Appointment",
		positionLabel: "left-[130px] top-[10px]",
		payload: [],
		indicator: "dot",
	},
];

export const proprietaryVoiceCloningHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Secure Voice Signature Upload",
		subtitle: "Provide a brief, clear audio sample via our platform.",
		description:
			"Using the secure Deal Scale dashboard, upload a short, high-quality recording of your voice. Our intuitive system provides clear guidance to ensure optimal sample quality for cloning.",
		icon: "UploadCloud", // Ensure 'UploadCloud' is a valid IconName
		label: "Step 1: Submit Voice Sample",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Deal Scale's Advanced AI Voice Replication",
		subtitle: "Our proprietary engine creates your digital voice twin.",
		description:
			"Our cutting-edge, in-house AI meticulously analyzes the unique characteristics of your voice – its tone, pitch, cadence, and nuances – to construct a high-fidelity, indistinguishable digital clone.",
		icon: "BrainCircuit", // Ensure 'BrainCircuit' is a valid IconName
		label: "Step 2: AI Voice Cloning",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Activate Your Cloned Voice Identity",
		subtitle: "Seamless integration with your Deal Scale AI Agents.",
		description:
			"Your newly crafted, proprietary cloned voice is seamlessly integrated and activated, ready to become the default authentic voice for all your Deal Scale AI Virtual Agents.",
		icon: "Power", // Ensure 'Power' is a valid IconName
		label: "Step 3: Activate Cloned Voice",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Deploy Hyper-Personalized Outreach",
		subtitle: "Engage leads with your authentic, cloned voice at scale.",
		description:
			"Launch your automated outreach campaigns with AI agents that communicate using your perfectly cloned voice. This establishes an unparalleled level of authenticity and personal connection with every prospect.",
		icon: "Mail", // Ensure 'Send' is a valid IconName
		label: "Step 4: Engage Authentically",
		positionLabel: "bottom",
		payload: [],
	},
];

export const aiSocialMediaOutreachHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Connect & Strategize",
		subtitle: "Link social accounts and choose your engagement playbooks.",
		description:
			"Securely connect your social profiles. Select from our library of proven outreach scripts (or customize your own) and define when dynamic AI messaging should be employed.",
		icon: "User",
		label: "Step 1: Setup & Strategy",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "AI Interaction Monitoring",
		subtitle: "AI detects engagement signals like comments and DMs.",
		description:
			"Deal Scale's AI actively monitors your connected social profiles for engagement triggers such as comments on posts, direct messages, or specific keyword mentions you define.",
		icon: "Database", // Assuming 'Eye' is valid, or "Search"
		label: "Step 2: Monitor Interactions",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Automated Smart Engagement",
		subtitle: "AI initiates conversations using preset scripts or dynamic AI.",
		description:
			"Based on the trigger and your strategy, our AI (powered by our proprietary messaging engine) engages prospects by sending an initial DM, replying to comments, using approved scripts for common scenarios, or crafting unique AI-generated messages for nuanced interactions.",
		icon: "MessageSquare",
		label: "Step 3: AI Engagement",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Intelligent Qualification & Nurturing",
		subtitle: "AI qualifies leads through conversation and follow-ups.",
		description:
			"The AI continues the conversation, asking qualifying questions from your scripts, providing information, and nurturing the lead. It can handle objections and follow up based on predefined logic or AI understanding.",
		icon: "BrainCircuit",
		label: "Step 4: Qualify & Nurture",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 5,
		title: "Conversion to Appointment/Call",
		subtitle: "Qualified leads are booked or hot-transferred.",
		description:
			"Once a lead is qualified and sales-ready, the AI seamlessly schedules an appointment on your calendar or can initiate a live hot-transfer call directly to you or your sales team.",
		icon: "CalendarCheck", // Assuming 'CalendarCheck' or "PhoneCall"
		label: "Step 5: Convert to Sales",
		positionLabel: "bottom",
		payload: [],
	},
];

export const aiTextMessageOutreachHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Import & Segment Lists",
		subtitle: "Upload your contact lists and define target segments.",
		description:
			"Easily import your prospect lists. Use Deal Scale's smart segmentation tools to group contacts based on criteria like property interest, lead source, or engagement history for targeted campaigns.",
		icon: "Users", // Or "Users"
		label: "Step 1: List Management",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Craft AI-Powered Campaigns",
		subtitle: "Design your SMS messaging strategy with AI assistance.",
		description:
			"Develop your SMS templates with AI suggestions for personalization tokens (like name, property address). Define conversation flows and how the AI should respond to different keyword triggers or questions.",
		icon: "Pencil", // Or "Wand2"
		label: "Step 2: Campaign Design",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Automated & Compliant Sending",
		subtitle: "Launch your personalized SMS campaigns at scale.",
		description:
			"Schedule your campaigns or trigger them based on specific actions. Our AI ensures messages are personalized and sent in a compliant manner, respecting quiet hours and managing opt-outs automatically.",
		icon: "MessageSquare",
		label: "Step 3: Launch Campaign",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "AI-Managed Two-Way Conversations",
		subtitle: "AI handles initial replies and qualifies leads.",
		description:
			"When prospects reply, our AI engages in natural, two-way SMS conversations. It can answer FAQs, gather more information, qualify leads based on your criteria, and identify buying/selling intent.",
		icon: "MessageSquare", // Or "BotMessageSquare"
		label: "Step 4: AI Conversation",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 5,
		title: "Actionable Insights & Handoff",
		subtitle: "Monitor results and escalate hot leads.",
		description:
			"Track campaign performance, delivery rates, and engagement. Hot leads identified by the AI can be automatically flagged, synced to your CRM, or trigger notifications for your team to take over with a call or personalized follow-up.",
		icon: "PieChart", // Or "UserCheck"
		label: "Step 5: Analytics & Conversion",
		positionLabel: "bottom",
		payload: [],
	},
];

export const embeddableAIChatbotHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Customize & Configure",
		subtitle:
			"Tailor the chatbot's appearance, greeting, and qualification script.",
		description:
			"Use the Deal Scale dashboard to customize your chatbot's branding, welcome messages, and the specific questions it will ask to pre-qualify visitors based on your business needs (e.g., budget, timeline, property type).",
		icon: "Palette", // Or "Settings2"
		label: "Step 1: Customize Chatbot",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Embed on Your Website",
		subtitle: "Easily add the chatbot to any page with a simple code snippet.",
		description:
			"Generate a unique embed code from Deal Scale and paste it into your website's HTML. No complex coding required – your AI chatbot will be live in minutes.",
		icon: "Code",
		label: "Step 2: Embed Code",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "AI-Powered Visitor Engagement",
		subtitle:
			"Chatbot proactively engages and interacts with website visitors.",
		description:
			"Once live, the AI chatbot greets visitors, answers their questions based on its configured knowledge base, and guides them through the pre-qualification process using natural conversation.",
		icon: "MessageSquare", // Or "Bot"
		label: "Step 3: AI Engagement",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Intelligent Lead Pre-Qualification",
		subtitle: "Chatbot asks your key questions to identify hot leads.",
		description:
			"The AI asks your pre-defined qualifying questions. Based on responses, it scores and segments leads, identifying those who are sales-ready or require further nurturing.",
		icon: "CheckSquare", // Or "Filter"
		label: "Step 4: Lead Qualification",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 5,
		title: "Seamless Deal Scale Integration & Handoff",
		subtitle: "Qualified leads are synced, booked, or transferred.",
		description:
			"Qualified leads and their conversation history are automatically synced to your Deal Scale CRM. The chatbot can book appointments directly into your integrated calendar or notify your sales team for an immediate live chat takeover or call back.",
		icon: "Share", // Or "Zap"
		label: "Step 5: Integration & Conversion",
		positionLabel: "bottom",
		payload: [],
	},
];

export const aiOutboundQualificationHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Lead List & Campaign Setup",
		subtitle: "Import leads and define your qualification & scheduling rules.",
		description:
			"Upload your outbound lead lists. Configure your ideal prospect profile, key qualification questions, AI conversation scripts (for calls & SMS), and rules for appointment scheduling or hot transfers.",
		icon: "UploadCloud", // Ensure 'UploadCloud' is a valid IconName
		label: "Step 1: Configure Campaign",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Automated AI Outreach",
		subtitle: "AI agent initiates contact via intelligent calls & SMS.",
		description:
			"Deal Scale's AI agent begins outbound communication with your leads using AI-powered voice calls and personalized text messages, tailored to your campaign goals.",
		icon: "Phone", // Ensure 'PhoneOutgoing' is a valid IconName
		label: "Step 2: AI Initiates Contact",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Conversational Pre-Qualification",
		subtitle: "AI engages leads to assess interest and fit.",
		description:
			"The AI engages in natural, two-way conversations (voice & SMS), asking your defined qualifying questions, understanding responses, and identifying lead intent and suitability.",
		icon: "MessageSquare", // Ensure 'MessagesSquare' is a valid IconName
		label: "Step 3: AI Qualifies",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Intelligent Action: Schedule or Transfer",
		subtitle: "Qualified leads are either booked or hot-transferred.",
		description:
			"Based on the qualification outcome and your rules: sales-ready leads are automatically scheduled into your team's calendar, OR the AI initiates an immediate hot transfer to connect the lead with a live sales agent.",
		icon: "CalendarCheck", // Ensure 'CalendarCheck' is a valid IconName
		label: "Step 4: Book or Transfer",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 5,
		title: "Sync & Report",
		subtitle: "All activities are logged, and performance is tracked.",
		description:
			"Lead status, conversation summaries, appointments, and transfer details are automatically synced to your Deal Scale CRM. Monitor campaign performance through detailed analytics.",
		icon: "BarChart", // Ensure 'BarChartHorizontal' is a valid IconName
		label: "Step 5: Track & Optimize",
		positionLabel: "bottom",
		payload: [],
	},
];

export const aiDirectMailNurturingHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Target & Segment Leads",
		subtitle:
			"Identify prime candidates for direct mail nurturing in Deal Scale.",
		description:
			"Use your Deal Scale CRM to segment leads ideal for a high-touch direct mail campaign (e.g., unresponsive high-value leads, specific farm areas, probate leads).",
		icon: "Users", // Or "Target"
		label: "Step 1: Select Audience",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "AI-Personalized Design",
		subtitle: "Craft compelling mailers with AI-suggested personalization.",
		description:
			"Choose from proven templates (postcards, letters) or upload your own. Deal Scale's AI helps personalize content with recipient data, property specifics, or tailored messaging based on lead status.",
		icon: "Palette", // Or "PenTool"
		label: "Step 2: Design & Personalize",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Automate Campaign & Triggers",
		subtitle:
			"Schedule one-off drops or integrate into automated nurture sequences.",
		description:
			"Set up your direct mail campaign for a one-time send or as a step in a longer automated multi-channel nurture flow within Deal Scale, triggered by specific lead behaviors or time intervals.",
		icon: "CalendarCheck", // Or "Settings2"
		label: "Step 3: Schedule & Automate",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Deal Scale Print & Mail Fulfillment",
		subtitle:
			"Our integrated network handles all printing and mailing logistics.",
		description:
			"Once your campaign is approved, Deal Scale's integrated print and mail network manages the high-quality printing, addressing, and timely mailing of your personalized pieces.",
		icon: "User", // Or "Truck"
		label: "Step 4: Automated Fulfillment",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 5,
		title: "Track Responses & ROI",
		subtitle:
			"Monitor engagement and measure campaign success within Deal Scale.",
		description:
			"Incorporate unique QR codes, personalized URLs (PURLs), or specific call-to-actions to track responses. View delivery statuses and analyze campaign effectiveness directly in your Deal Scale dashboard.",
		icon: "BarChart", // Or "Goal"
		label: "Step 5: Track & Optimize",
		positionLabel: "bottom",
		payload: [],
	},
];

export const aiDirectMailHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Build & Fund",
		subtitle: "Define Your Target List & Purchase AI Credits",
		description:
			"Use our intuitive filters to build a precise mailing list from our 140M+ property database or upload your own. Then, purchase a flexible package of AI Credits to power your campaign.",
		icon: "DatabaseZap",
		label: "Step 1: Build Audience",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Personalize & Deploy",
		subtitle: "AI Crafts Your Campaign for In-House Fulfillment",
		description:
			"Use AI Credits to generate hyper-personalized copy for each mailer. Once approved, our proprietary network handles the printing and mailing at a simple, flat rate per piece.",
		icon: "Pencil",
		label: "Step 2: Personalize & Send",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Engage & Qualify",
		subtitle: "AI Qualifies Every Inbound Response 24/7",
		description:
			"When a homeowner responds via the unique tracking number or URL, our AI uses credits to engage them in a natural conversation, qualifying their intent, timeline, and property condition.",
		icon: "BrainCircuit",
		label: "Step 3: AI Qualifies Responses",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Receive Qualified Leads",
		subtitle: "Get Sales-Ready Appointments & Hot Transfers",
		description:
			"Fully-qualified, motivated sellers are either hot-transferred to your sales team for a live conversation or automatically booked as appointments directly on your calendar. Your pipeline fills with high-intent leads.",
		icon: "CalendarCheck",
		label: "Step 4: Book or Transfer",
		positionLabel: "bottom",
		payload: [],
	},
];

// How It Works (Typed as ServiceHowItWorks[])
export const aiInboundHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Configure Your Agent",
		subtitle: "Define your qualification script and business rules in minutes.",
		description:
			"Use our simple interface to customize the questions your AI will ask, define what makes a lead qualified, and set rules for call routing and appointment booking.",
		icon: "SlidersHorizontal",
		label: "Step 1: Configure Agent",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "AI Answers 24/7",
		subtitle: "Your AI Agent instantly answers every inbound call.",
		description:
			"The moment a call comes in to your dedicated Deal Scale number, the AI answers. It works 24/7/365, ensuring you never miss a lead, even after hours or on weekends.",
		icon: "Phone",
		label: "Step 2: AI Answers Calls",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Conversational Qualification",
		subtitle: "The AI engages the caller to determine their needs.",
		description:
			"The agent engages in a natural, two-way conversation, asking your pre-defined questions to understand the caller's needs, motivation, and timeline, just like a human assistant would.",
		icon: "BrainCircuit",
		label: "Step 3: AI Qualifies",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Book, Transfer, or Log",
		subtitle: "The AI takes the appropriate next step automatically.",
		description:
			"If the caller is qualified, the AI books an appointment directly on your calendar. If they need to speak to a human, it can initiate a hot transfer. All call details and transcripts are logged in your CRM.",
		icon: "CalendarCheck",
		label: "Step 4: Take Action",
		positionLabel: "bottom",
		payload: [],
	},
];

export const aiSocialMediaHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Connect Your Accounts",
		subtitle: "Securely link your Facebook & Instagram business pages.",
		description:
			"With a few clicks, authorize Deal Scale to manage your messages and comments through Meta's official API. Your account remains secure and compliant.",
		icon: "Share",
		label: "Step 1: Connect Accounts",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Design Your Conversation",
		subtitle: "Build your automated qualification flow visually.",
		description:
			"Define keyword triggers (like 'info' or 'price') and map out the entire conversation, including your qualifying questions, multiple-choice answers, and data capture points.",
		icon: "Pencil",
		label: "Step 2: Build Flow",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "AI Engages Instantly",
		subtitle: "The agent responds to all comments and DMs 24/7.",
		description:
			"The moment a lead comments on your ad or sends a DM, the AI agent instantly engages them, starting the exact qualification conversation you designed, any time of day or night.",
		icon: "MessageSquare",
		label: "Step 3: AI Engages Leads",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Qualify & Book",
		subtitle: "The AI qualifies leads and takes the next logical step.",
		description:
			"The agent gathers crucial information and, once a lead is qualified, it can automatically send them a link to your calendar to book a call, seamlessly converting a social interaction into a sales appointment.",
		icon: "CalendarCheck",
		label: "Step 4: Qualify & Book",
		positionLabel: "bottom",
		payload: [],
	},
];

export const aiTextMessageHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Import & Configure",
		subtitle: "Upload your lead list and customize the conversation.",
		description:
			"Import your contacts and use our visual editor to define your qualification script, key questions, and desired outcomes for the AI to follow.",
		icon: "SlidersHorizontal",
		label: "Step 1: Configure Campaign",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "AI Initiates Outreach",
		subtitle: "The agent begins sending personalized, compliant texts.",
		description:
			"Your AI agent starts the outreach, leveraging our proprietary network to deliver messages as native iMessage (blue bubbles) or SMS, ensuring high engagement from the very first touchpoint.",
		icon: "MessageSquare",
		label: "Step 2: AI Sends Texts",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Two-Way Conversation",
		subtitle: "The AI engages leads in natural, back-and-forth dialogue.",
		description:
			"This isn't a simple auto-responder. The AI understands responses, asks follow-up questions, and intelligently navigates the conversation to qualify the lead based on your script.",
		icon: "BrainCircuit",
		label: "Step 3: AI Qualifies",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Book or Notify",
		subtitle: "The agent books appointments or alerts your team.",
		description:
			"Once a lead is qualified, the AI can send a calendar link for booking, or it can tag the lead in your CRM and notify you to take over for a live conversation, seamlessly handing off the warm lead.",
		icon: "CalendarCheck",
		label: "Step 4: Take Action",
		positionLabel: "bottom",
		payload: [],
	},
];

export const rentEstimatorHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Search Any Property",
		subtitle: "Enter any US address to get started.",
		description:
			"Look up any single-family home, condo, or multi-family building in our nationwide database of over 140 million properties.",
		icon: "Search",
		label: "Step 1: Search Property",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Get Instant Estimate & Comps",
		subtitle: "View the property's estimated rent and nearby rentals.",
		description:
			"Instantly see a highly accurate rent estimate, a detailed list of comparable rental properties, and an interactive map of the surrounding area.",
		icon: "BarChartBig",
		label: "Step 2: View Estimate",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Analyze Market Trends",
		subtitle: "Understand the health of the local rental market.",
		description:
			"Go deeper by viewing historical rent trends, average days on market, and key statistics for the property's zip code to validate your investment strategy.",
		icon: "PieChart",
		label: "Step 3: Analyze Market",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Report & Track",
		subtitle: "Create branded reports and monitor your portfolio.",
		description:
			"Generate a professional PDF report with your own branding, or add the property to your Deal Scale portfolio to track its performance and receive real-time rent alerts.",
		icon: "FileText",
		label: "Step 4: Save & Share",
		positionLabel: "bottom",
		payload: [],
	},
];

export const marketAnalyzerHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Search Any Zip Code",
		subtitle: "Enter a zip code to view its rental market report.",
		description:
			"Instantly generate a comprehensive market report for any of the 38,000+ zip codes across the United States.",
		icon: "Search",
		label: "Step 1: Search Market",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Analyze Market Health",
		subtitle: "View rent averages, historical trends, and key statistics.",
		description:
			"Our dashboard displays critical market health indicators: average rent prices, historical performance, days on market, and property type composition.",
		icon: "PieChart",
		label: "Step 2: Analyze Data",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Compare Opportunities",
		subtitle: "Compare multiple markets side-by-side.",
		description:
			"Save markets to your watchlist and compare key metrics to identify which areas offer the best investment opportunities based on your criteria.",
		icon: "LayoutGrid",
		label: "Step 3: Compare Markets",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Generate & Share Reports",
		subtitle: "Create professional, custom-branded market reports.",
		description:
			"With one click, generate a beautiful PDF or online report with your company's branding to share with clients, partners, or your team.",
		icon: "FileText",
		label: "Step 4: Create Reports",
		positionLabel: "bottom",
		payload: [],
	},
];

export const portfolioDashboardHowItWorks: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Onboard Your Portfolio",
		subtitle: "Bulk import your properties via CSV or API.",
		description:
			"Seamlessly import hundreds or thousands of properties at once. Our system will automatically enrich them with real-time market and property data.",
		icon: "UploadCloud",
		label: "Step 1: Bulk Import",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 2,
		title: "Monitor Key KPIs",
		subtitle: "View your entire portfolio from a high-level dashboard.",
		description:
			"Track critical, real-time KPIs across your entire portfolio, such as total estimated value, gross rent potential, occupancy rates, and market-level performance.",
		icon: "PieChart",
		label: "Step 2: Monitor KPIs",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 3,
		title: "Automate Rent Optimization",
		subtitle: "Set proactive alerts to maximize rental income.",
		description:
			"Our system monitors market conditions for every property and sends you an alert when rents are below market rate, highlighting specific opportunities to increase cash flow.",
		icon: "Sparkles",
		label: "Step 3: Get Alerts",
		positionLabel: "bottom",
		payload: [],
	},
	{
		stepNumber: 4,
		title: "Generate Stakeholder Reports",
		subtitle: "Create custom-branded reports for clients or partners.",
		description:
			"Generate beautiful, comprehensive reports for your entire portfolio or specific property groups. Add your own branding to provide a white-labeled experience for your clients.",
		icon: "FileText",
		label: "Step 4: Report & Share",
		positionLabel: "bottom",
		payload: [],
	},
];

export const dealScaleProprietaryProcess: ServiceHowItWorks[] = [
	{
		stepNumber: 1,
		title: "Define Your Ideal Deal",
		subtitle: "Hyper-Targeted Lookalike Audience Expansion",
		description:
			"Tap into our database of 140M+ properties. Input precise criteria like location, property type, and budget to instantly generate a list of high-potential leads with our AI Sentiment Score.",
		icon: "SlidersHorizontal",
		label: "Step 1: Define Deal",
		positionLabel: "bottom",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 2,
		title: "Launch Your AI Campaign",
		subtitle: "Automated Multi-Channel Outreach",
		description:
			"Create and deploy a tailored campaign with our AI Virtual Agents. Customize the outreach schedule and messaging across calls, texts, and social media to personally engage your leads.",
		icon: "Rocket",
		label: "Step 2: Launch Campaign",
		positionLabel: "bottom",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 3,
		title: "AI Nurtures & Prequalifies",
		subtitle: "Intelligent Conversation Engine",
		description:
			"Our AI Virtual Agents have dynamic, realistic conversations. They understand market stats and adapt based on actual responses to intelligently nurture and pre-qualify every lead for you.",
		icon: "BrainCircuit",
		label: "Step 3: AI Prequalifies",
		positionLabel: "bottom",
		payload: [],
		indicator: "dot",
	},
	{
		stepNumber: 4,
		title: "Receive Sales-Ready Leads",
		subtitle: "Seamless Lead Hand-off",
		description:
			"Once a lead is qualified, they are seamlessly connected to you via a live hot-transfer call or automatically scheduled on your calendar. You just show up and close the deal.",
		icon: "CalendarCheck",
		label: "Step 4: Receive Leads",
		positionLabel: "bottom",
		payload: [],
		indicator: "dot",
	},
];
