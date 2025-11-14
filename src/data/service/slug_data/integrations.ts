import type { TechStack } from "@/types/service/services";
import freedomsoftSvg from "../../../assets/svgs/integrations/FreedomSoft.svg";
import gohighlevelSvg from "../../../assets/svgs/integrations/GHL.svg";
import reisiftSvg from "../../../assets/svgs/integrations/REISift.svg";
import resimpliSvg from "../../../assets/svgs/integrations/REsimpli.svg";
import dialerSvg from "../../../assets/svgs/integrations/dialer.svg";
import googleSheetsSvg from "../../../assets/svgs/integrations/google-sheets.svg";
import instantlySvg from "../../../assets/svgs/integrations/instantly.svg";
import podioSvg from "../../../assets/svgs/integrations/podio.svg";
import salesforceSvg from "../../../assets/svgs/integrations/salesforce.svg";
import superhumanSvg from "../../../assets/svgs/integrations/superhuman.svg";
import universalSvg from "../../../assets/svgs/integrations/universal.svg";
import zapierSvg from "../../../assets/svgs/integrations/zapier.svg";

export const leadGenIntegrations: TechStack[] = [
	{
		category: "Universal Connectivity",
		libraries: [
			{
				name: "Universal CSV Export",
				description:
					"Export any lead list as a CSV file, making it compatible with virtually any CRM, dialer, or marketing platform on the market.",
				customSvg: universalSvg,
			},
			{
				name: "Zapier",
				description:
					"Connect Deal Scale to thousands of other apps. Automatically send your lead lists to your CRM or start marketing campaigns without writing any code.",
				customSvg: zapierSvg,
			},
		],
	},
	{
		category: "Popular CRM & Marketing Platforms",
		libraries: [
			{
				name: "GoHighLevel",
				description:
					"Directly import your lead lists to power your funnels, automate marketing, and manage client communication within the GoHighLevel platform.",
				customSvg: gohighlevelSvg,
			},
			{
				name: "Podio",
				description:
					"A favorite for its customizability. Directly import your Deal Scale lead lists to manage your entire wholesaling and investment workflow in Podio.",
				customSvg: podioSvg,
			},
			{
				name: "REISift",
				description:
					"The go-to for data management. Upload your lists to stack data, filter, and manage your leads with precision before pushing to your dialer or CRM.",
				customSvg: reisiftSvg,
			},
			{
				name: "FreedomSoft",
				description:
					"Easily import your lead lists into this all-in-one   system to manage deals, run marketing campaigns, and automate your real estate business.",
				customSvg: freedomsoftSvg,
			},
			{
				name: "REsimpli",
				description:
					"Export your lists from Deal Scale and import into REsimpli to track your KPIs, manage leads, and run your entire business from one place.",
				customSvg: resimpliSvg,
			},
			{
				name: "Salesforce",
				description:
					"For larger teams. Seamlessly upload your lead lists to Salesforce to leverage its powerful deal tracking and enterprise-grade automation.",
				customSvg: salesforceSvg,
			},
		],
	},
	{
		category: "Outreach & General Tools",
		libraries: [
			{
				name: "Instantly.ai",
				description:
					"Upload your lead lists to Instantly to launch and scale your cold email outreach campaigns with industry-leading deliverability.",
				customSvg: instantlySvg,
			},
			{
				name: "Superhuman",
				description:
					"Import contacts from your CSV exports to the fastest email experience ever made, perfect for high-touch, individual outreach to key prospects.",
				customSvg: superhumanSvg,
			},
			{
				name: "SMS & Dialer Platforms",
				description:
					"Easily import your lists into any major dialing or SMS platform (e.g., BatchDialer, Smarter Contact, ReadyMode) to begin outreach immediately.",
				customSvg: dialerSvg,
			},
			{
				name: "Google Sheets / Excel",
				description:
					"Directly export your targeted lead lists to Google Sheets or Microsoft Excel for easy analysis, sharing, and manual tracking.",
				customSvg: googleSheetsSvg,
			},
		],
	},
];

export const aiSocialMediaOutreachIntegrations: TechStack[] = [
	{
		category: "Social Media Platforms",
		libraries: [
			{
				name: "LinkedIn",
				description:
					"Leverage AI for targeted B2B prospecting, investor networking, and identifying professional sellers or buyers.",
				lucideIcon: "Linkedin", // Ensure 'Linkedin' is a valid LucideIcon name in your IconName type
			},
			{
				name: "Facebook",
				description:
					"Automate outreach in relevant groups and identify local sellers/buyers based on activity and profile data.",
				lucideIcon: "Facebook", // Ensure 'Facebook' is a valid LucideIcon name
			},
			{
				name: "Instagram",
				description:
					"Engage visually with prospects, identify lifestyle-driven sellers/buyers, and connect with local influencers or property showcases.",
				lucideIcon: "Instagram", // Ensure 'Instagram' is a valid LucideIcon name
			},
		],
	},
	{
		category: "Deal Scale Core Integrations",
		libraries: [
			{
				name: "Deal Scale CRM Sync",
				description:
					"Automatically sync new leads and interactions from social media outreach to your Deal Scale CRM or connected third-party CRM.",
				lucideIcon: "DatabaseZap", // Ensure 'DatabaseZap' is valid
			},
			{
				name: "AI Virtual Agent Handoff",
				description:
					"Seamlessly transition warm social media leads to Deal Scale's AI Virtual Agents for automated call follow-ups and appointment setting.",
				lucideIcon: "PhoneForwarded", // Ensure 'PhoneForwarded' is valid, or use an alternative like "PhoneCall" or "Bot"
			},
		],
	},
];

export const embeddableAIChatbotIntegrations: TechStack[] = [
	{
		category: "Website Integration",
		libraries: [
			{
				name: "HTML Embed Code",
				description:
					"Simple JavaScript snippet for easy embedding on any website.",
				lucideIcon: "Code2",
			}, // Assuming Code2 is valid
		],
	},
	{
		category: "Deal Scale Core Platform",
		libraries: [
			{
				name: "Deal Scale CRM",
				description:
					"Automatic synchronization of lead data, conversation history, and qualification status.",
				lucideIcon: "DatabaseZap",
			},
			{
				name: "Deal Scale Calendar",
				description:
					"Direct appointment booking into connected sales team calendars.",
				lucideIcon: "CalendarPlus",
			},
			{
				name: "Deal Scale AI Conversation Engine",
				description:
					"Powers the natural language understanding and dialogue management of the chatbot.",
				lucideIcon: "BrainCircuit",
			},
			{
				name: "Deal Scale Notifications",
				description:
					"Real-time alerts to sales agents for hot leads or live transfer requests.",
				lucideIcon: "Bell",
			},
		],
	},
	{
		category: "Optional Third-Party Integrations",
		libraries: [
			{
				name: "Google Analytics",
				description:
					"Track chatbot interactions and conversions within your website analytics.",
				lucideIcon: "BarChartHorizontal",
			}, // Assuming valid icon
			{
				name: "Zapier / Webhooks",
				description:
					"Connect chatbot events to thousands of other applications for custom workflows.",
				lucideIcon: "Zap",
			},
		],
	},
];

export const aiSocialMediaIntegrations: TechStack[] = [
	{
		category: "Official Social Platform APIs",
		libraries: [
			{
				name: "Meta for Developers",
				description:
					"Our system is built on the official, compliant Messenger API from Meta, ensuring reliable and safe integration with Facebook and Instagram.",
				customSvg: "/logos/meta-logo.svg",
			},
		],
	},
	{
		category: "Integrated CRM",
		libraries: [
			{
				name: "Deal Scale CRM",
				description:
					"All qualified leads and conversation data are automatically synced to your native Deal Scale CRM, creating a unified system of record.",
				customSvg: "/logos/dealscale-logo.svg",
			},
		],
	},
];
