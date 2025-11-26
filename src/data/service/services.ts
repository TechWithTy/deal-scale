// src/data/services.ts OR src/types/services.ts

import { SERVICE_CATEGORIES } from "@/types/service/services";
import type {
	IconName,
	ServiceCategoryValue,
	ServicesData,
} from "@/types/service/services";
import {
	aiDirectMailCopyright,
	aiInboundAgentCopyright,
	aiInboundCopyright,
	aiOutboundQualificationCopyright,
	aiPhoneAgentCopyright,
	aiSocialMediaCopyright,
	aiSocialMediaOutreachCopyright,
	aiTextMessageCopyright,
	aiTextMessageOutreachCopyright,
	dataEnrichmentCopyright,
	domainReconCopyright,
	emailIntelligenceCopyright,
	embeddableAIChatbotCopyright,
	leadDossierCopyright,
	leadGenCopyright,
	marketAnalysisCopyright,
	marketAnalyzerCopyright,
	performanceHubCopyright,
	phoneNumberHunterCopyright,
	portfolioDashboardCopyright,
	proprietaryVoiceCloningCopyright,
	rentEstimatorCopyright,
	snailMailCopyright,
	socialLeadGenCopyright,
	socialProfileHunterCopyright,
} from "./slug_data/copyright";
import {
	aiDirectMailFAQ,
	aiInboundAgentFAQ,
	aiInboundFAQ,
	aiOutboundQualificationFAQ,
	aiPhoneAgentFAQ,
	aiSocialMediaOutreachFAQ,
	aiTextMessageOutreachFAQ,
	dataEnrichmentFAQ,
	domainReconFAQ,
	emailIntelligenceFAQ,
	embeddableAIChatbotFAQ,
	leadDossierFAQ,
	leadGenFAQ,
	marketAnalysisFAQ,
	marketAnalyzerFAQ,
	performanceHubFAQ,
	phoneNumberHunterFAQ,
	portfolioDashboardFAQ,
	proprietaryVoiceCloningFAQ,
	rentEstimatorFAQ,
	snailMailFAQ,
	socialLeadGenFAQ,
	socialMediaQualificationFAQ,
	socialProfileHunterFAQ,
	textMessageFAQ,
} from "./slug_data/faq";
import {
	aiDirectMailNurturingHowItWorks,
	aiInboundAgentHowItWorks,
	aiInboundHowItWorks,
	aiOutboundQualificationHowItWorks,
	aiPhoneAgentHowItWorks,
	aiSocialMediaHowItWorks,
	aiSocialMediaOutreachHowItWorks,
	aiTextMessageHowItWorks,
	aiTextMessageOutreachHowItWorks,
	dataEnrichmentHowItWorks,
	domainReconHowItWorks,
	emailIntelligenceHowItWorks,
	embeddableAIChatbotHowItWorks,
	leadDossierHowItWorks,
	leadGenHowItWorks,
	marketAnalysisHowItWorks,
	marketAnalyzerHowItWorks,
	performanceHubHowItWorks,
	phoneNumberHunterHowItWorks,
	portfolioDashboardHowItWorks,
	proprietaryVoiceCloningHowItWorks,
	rentEstimatorHowItWorks,
	snailMailHowItWorks,
	socialLeadGenHowItWorks,
	socialProfileHunterHowItWorks,
} from "./slug_data/how_it_works";
import {
	aiSocialMediaIntegrations,
	aiSocialMediaOutreachIntegrations,
	embeddableAIChatbotIntegrations,
	leadGenIntegrations,
} from "./slug_data/integrations";

import { PricingPlans } from "./slug_data/pricing";
import {
	aiDirectMailNurturingProblemsSolutions,
	aiInboundAgentProblemsSolutions,
	aiInboundProblemsSolutions,
	aiOutboundQualificationProblemsSolutions,
	aiPhoneAgentProblemsSolutions,
	aiSocialMediaOutreachProblemsSolutions,
	aiSocialMediaProblemsSolutions,
	aiTextMessageOutreachProblemsSolutions,
	aiTextMessageProblemsSolutions,
	dataEnrichmentProblemsSolutions,
	domainReconProblemsSolutions,
	emailIntelligenceProblemsSolutions,
	embeddableAIChatbotProblemsSolutions,
	leadDossierProblemsSolutions,
	leadGenProblemsSolutions,
	marketAnalysisProblemsSolutions,
	marketAnalyzerProblemsSolutions,
	performanceHubProblemsSolutions,
	phoneNumberHunterProblemsSolutions,
	portfolioDashboardProblemsSolutions,
	proprietaryVoiceCloningProblemsSolutions,
	rentEstimatorProblemsSolutions,
	snailMailProblemsSolutions,
	socialLeadGenProblemsSolutions,
	socialProfileHunterProblemsSolutions,
} from "./slug_data/problems_solutions";
import {
	aiDirectMailNurturingTestimonials,
	aiInboundAgentTestimonials,
	aiInboundTestimonials,
	aiOutboundQualificationTestimonials,
	aiPhoneAgentTestimonials,
	aiSocialMediaOutreachTestimonials,
	aiSocialMediaTestimonials,
	aiTextMessageOutreachTestimonials,
	aiTextMessageTestimonials,
	dataEnrichmentTestimonials,
	domainReconTestimonials,
	emailIntelligenceTestimonials,
	embeddableAIChatbotTestimonials,
	leadDossierTestimonials,
	leadGenTestimonials,
	marketAnalysisTestimonials,
	marketAnalyzerTestimonials,
	performanceHubTestimonials,
	phoneNumberHunterTestimonials,
	portfolioDashboardTestimonials,
	proprietaryVoiceCloningTestimonials,
	rentEstimatorTestimonials,
	snailMailTestimonials,
	socialLeadGenTestimonials,
	socialProfileHunterTestimonials,
} from "./slug_data/testimonials";

export const services: ServicesData = {
	[SERVICE_CATEGORIES.LEAD_GENERATION]: {
		leadManagement: {
			id: "lead-management",
			iconName: "Users",
			title: "Lookalike Audience Expansion and Management",
			description:
				"Tap into our database of over 140 million on-market and off-market properties. Our AI-powered platform allows you to define precise search criteria to build targeted lead lists in minutes, not weeks, ensuring you connect with motivated sellers and find the right deals, faster.",
			features: [
				"Access to 140M+ Property Records",
				"AI-Powered Lead Scoring",
				"Automated List Building & Enrichment",
				"Seamless CRM Integration",
				"Pipeline Management Dashboards",
			],
			price: "Core Feature",
			showBanner: true,
			bannerText: "Access 140M+ Leads",
			bannerColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
			categories: [
				SERVICE_CATEGORIES.LEAD_GENERATION,
				SERVICE_CATEGORIES.AI_FEATURES,
				SERVICE_CATEGORIES.REAL_ESTATE_TOOLS,
				SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
				SERVICE_CATEGORIES.SKIP_TRACING,
			],
			slugDetails: {
				integrations: leadGenIntegrations,
				defaultZoom: 1,
				slug: "lead-generation-management",
				dilemma:
					"Sourcing a consistent flow of high-quality real estate leads feels like searching for a needle in a haystack. Manual prospecting is inefficient, data is often outdated, and valuable time is wasted on unqualified prospects.",
				solution:
					"Tap into our database of over 140 million on-market and off-market properties. Our AI-powered platform allows you to define precise search criteria to build targeted lead lists in minutes, not weeks, ensuring you connect with motivated sellers and find the right deals, faster.",
				problemsAndSolutions: leadGenProblemsSolutions,
				howItWorks: leadGenHowItWorks,
				testimonials: leadGenTestimonials,
				pricing: PricingPlans,
				copyright: leadGenCopyright,
				faq: leadGenFAQ,
			},
		},
		socialLeadGen: {
			id: "social-lead-generation",
			iconName: "Share",
			title: "Automated Social Lookalike Audience Expansion",
			description:
				"Turn social media comments into closed deals. Our AI engages prospects, qualifies them with proven scripts, and nurtures them until they are ready for a sales call, then it books the appointment on your calendar or hot-transfers the live call directly to you.",
			features: [
				// Feature list updated to reflect the powerful outcome
				"Automated Comment-to-DM Engagement",
				"AI-Powered Nurturing & Follow-up",
				"Automated Calendar Scheduling",
				"Live Hot Transfer Phone Calls",
				"Direct-to-CRM Lead Sync",
			],
			price: "Premium Add-on",
			showBanner: true,
			bannerText: "Social Appointments",
			bannerColor: "bg-gradient-to-r from-pink-500 to-orange-500",
			categories: [
				SERVICE_CATEGORIES.LEAD_GENERATION,
				SERVICE_CATEGORIES.AI_FEATURES,
			],
			slugDetails: {
				integrations: leadGenIntegrations, // Assumes defined
				defaultZoom: 1,
				slug: "social-lead-generation",
				dilemma:
					"Social media generates comments, but turning that fleeting interest into a concrete sales appointment is a massive, time-consuming challenge. Leads often go cold before you can even talk to them.",
				solution:
					"Our system doesn't just find leads; it delivers them. The AI handles every step from the initial comment to qualification and nurturing, culminating in a booked appointment on your calendar or a live phone call with a sales-ready prospect.",
				problemsAndSolutions: socialLeadGenProblemsSolutions, // Assumes defined
				howItWorks: socialLeadGenHowItWorks, // Uses the updated version from above
				testimonials: socialLeadGenTestimonials, // Assumes defined
				pricing: PricingPlans, // Assumes defined
				copyright: socialLeadGenCopyright, // Assumes defined
				faq: socialLeadGenFAQ, // Assumes defined
			},
		},
		directMailCampaigns: {
			id: "direct-mail-campaigns",
			iconName: "Mail",
			title: "Automated Direct Mail Campaigns",
			description:
				"Launch proven, multi-touch direct mail campaigns in minutes. Select a lead list, choose an industry-tested sequence, and our proprietary system automatically sends the right mail piece at the right time to get your phone ringing.",
			features: [
				"Proven Multi-Touch Sequences",
				"Professionally Designed Templates",
				"Automated Sending & Scheduling",
				"Intelligent Non-Responder Follow-up",
				"Proprietary National Print & Mail Network", // Updated feature
			],
			price: "Usage-Based",
			showBanner: true,
			bannerText: "Autopilot Direct Mail",
			bannerColor: "bg-gradient-to-r from-teal-500 to-blue-500",
			categories: [
				SERVICE_CATEGORIES.LEAD_GENERATION,
				SERVICE_CATEGORIES.AI_FEATURES,
			],
			slugDetails: {
				integrations: [],
				defaultZoom: 1,
				slug: "automated-direct-mail",
				dilemma:
					"Direct mail is a powerful lead source, but it's incredibly manual and hard to scale. Printing, stuffing envelopes, managing lists, and tracking follow-ups is a logistical nightmare that kills productivity.",
				solution:
					"Our system automates the entire process. Choose a lead list and activate a pre-built, 4-step mail campaign that uses industry-proven templates and timing to maximize response rates, all without you ever touching a stamp.",
				problemsAndSolutions: snailMailProblemsSolutions,
				howItWorks: snailMailHowItWorks,
				testimonials: snailMailTestimonials,
				pricing: PricingPlans,
				copyright: snailMailCopyright,
				faq: snailMailFAQ,
			},
		},
	},
	[SERVICE_CATEGORIES.LEAD_PREQUALIFICATION]: {
		aiOutboundQualificationAgent: {
			id: "ai-outbound-qualification-agent",
			iconName: "UserCheck" as IconName,
			title: "AI Outbound Qualification Agent",
			description:
				"Automate your outbound lead qualification with our AI Agent. It intelligently calls and texts your leads, pre-qualifies them through natural conversation, and then either books appointments directly on your calendar or initiates a hot transfer to your sales team.",
			features: [
				"Automated outbound AI voice calls and SMS campaigns",
				"Intelligent conversational AI for deep lead pre-qualification",
				"Customizable qualification scripts and lead scoring logic",
				"Direct calendar integration for automated appointment scheduling",
				"Seamless hot-transfer capability for sales-ready leads",
				"Real-time CRM synchronization of all lead activities",
				"Comprehensive performance analytics and reporting",
			],
			price: "Custom Pricing", // Or refer to plans like "Starts at $499/mo"
			showBanner: true,
			bannerText: "Leads on Autopilot ",
			bannerColor: "bg-gradient-to-r from-orange-500 to-amber-500",
			categories: [
				SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
				SERVICE_CATEGORIES.AI_FEATURES,
			],
			slugDetails: {
				integrations: [],
				defaultZoom: 1, // You might want to adjust this if you have a Spline/3D model
				slug: "ai-outbound-qualification-agent",
				dilemma:
					"Your sales team is bogged down making countless unproductive outbound calls to unqualified leads, while scheduling and timely follow-ups on genuinely interested prospects become a bottleneck.",
				solution:
					"Deal Scale's AI Outbound Qualification Agent revolutionizes this. It tirelessly works your lead lists, engaging prospects via AI calls and SMS, expertly pre-qualifying them. Qualified leads are then instantly converted into booked appointments or hot-transferred to your sales reps, ensuring they only spend time on high-potential conversations.",
				problemsAndSolutions: aiOutboundQualificationProblemsSolutions,
				howItWorks: aiOutboundQualificationHowItWorks,
				testimonials: aiOutboundQualificationTestimonials,
				pricing: PricingPlans, // This is an array of Plan objects
				copyright: aiOutboundQualificationCopyright,
				faq: aiOutboundQualificationFAQ, // This is an FAQProps object
				// splineUrl: { splineUrl: "your-spline-url-for-outbound-agent", defaultZoom: 1 }, // Optional
				// datePublished: new Date("YYYY-MM-DD"), // Optional
				// lastModified: new Date("YYYY-MM-DD"), // Optional
			},
		},
		aiDirectMailQualificationAgent: {
			id: "ai-direct-mail-qualification-agent",
			iconName: "MailCheck" as IconName,
			title: "AI Direct Mail Qualification Agent",
			description:
				"Transform direct mail into a precision-guided lead machine. Our AI identifies ideal off-market targets, sends hyper-personalized letters that get responses, and then automatically pre-qualifies interested sellers for you.",
			features: [
				"AI-powered list building from 140M+ property records",
				"Pay-as-you-go mail fulfillment via Propietary Mailing System",
				"Use AI Credits for mail personalization & skip tracing",
				"24/7 AI agent to handle and qualify all inbound responses",
				"Seamless hot-transfer of qualified leads to your sales team",
				"Direct calendar integration for automated appointment setting",
			],
			price: "Usage-Based",
			showBanner: true,
			bannerText: "Mailbox To Motivated",
			bannerColor: "bg-gradient-to-r from-blue-500 to-sky-500",
			categories: [
				SERVICE_CATEGORIES.LEAD_GENERATION,
				SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
				SERVICE_CATEGORIES.AI_FEATURES,
			],
			slugDetails: {
				slug: "ai-direct-mail-qualification-agent",
				dilemma:
					"Your direct mail campaigns are an expensive gamble. High monthly software fees, opaque printing costs, and the 'spray and pray' approach kill your ROI before the letters even land in mailboxes.",
				solution:
					"Deal Scale severs the link between effort and outcome. Pay transparent, at-cost prices for mailers via  Propietary Mailing System. Use our flexible AI Credits only for the tasks that create value: hyper-personalizing copy, skip tracing to find owners, and having our AI qualify every single inbound lead. Stop paying for software; start paying for results.",
				defaultZoom: 1,
				integrations: [],
				problemsAndSolutions: aiDirectMailNurturingProblemsSolutions,
				howItWorks: aiDirectMailNurturingHowItWorks,
				testimonials: aiDirectMailNurturingTestimonials,
				pricing: PricingPlans,
				faq: aiDirectMailFAQ,
				copyright: aiDirectMailCopyright,
				// Optional Fields
				// splineUrl: { splineUrl: "your-spline-url-for-direct-mail", defaultZoom: 1 },
				// datePublished: new Date("2023-11-01"),
				// lastModified: new Date("2023-11-01"),
			},
		},
		aiInboundCallQualificationAgent: {
			id: "ai-inbound-call-qualification-agent",
			iconName: "Phone",
			title: "AI Inbound Call Qualification Agent",
			description:
				"Never miss a lead again. Our AI agent answers your calls 24/7, qualifies leads in real-time through natural conversation, and books appointments directly on your calendar, ensuring every inbound call is a revenue opportunity.",
			features: [
				"24/7 Instant & Automated Call Answering",
				"AI-Powered Conversational Lead Qualification",
				"Customizable Qualification Scripts & Business Logic",
				"Direct Calendar Integration for Automated Booking",
				"Intelligent Call Routing & Hot-Transfer Capability",
				"Automatic CRM Logging with Call Transcripts",
			],
			price: "Usage-Based",
			showBanner: true,
			bannerText: "Qualify Inbound Calls",
			bannerColor: "bg-gradient-to-r from-green-500 to-teal-500",
			categories: [
				SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
				SERVICE_CATEGORIES.AI_FEATURES,
			],
			slugDetails: {
				slug: "ai-inbound-call-qualification-agent",
				dilemma:
					"Missed calls are missed revenue. Your team can't answer every call, especially after hours. Voicemails get ignored, and staff spend too much time on repetitive qualification instead of high-value tasks.",
				solution:
					"Deal Scale’s AI Inbound Agent acts as your perfect 24/7 receptionist. It instantly answers every call, engages callers with intelligent, natural conversation, and executes your qualification process flawlessly. It filters out spam, booking only high-intent prospects directly into your calendar.",
				defaultZoom: 1,
				integrations: [],
				problemsAndSolutions: aiInboundProblemsSolutions,
				howItWorks: aiInboundHowItWorks,
				testimonials: aiInboundTestimonials,
				pricing: PricingPlans,
				faq: aiInboundFAQ,
				copyright: aiInboundCopyright,
			},
		},
		aiSocialMediaQualificationAgent: {
			id: "ai-social-media-qualification-agent",
			iconName: "MessageSquare",
			title: "AI Social Media Qualification Agent",
			description:
				"Turn your Facebook and Instagram comments and DMs into qualified leads, 24/7. Our AI agent instantly engages prospects, qualifies them through automated conversations, and syncs their data directly to your CRM.",
			features: [
				"24/7 Automated Engagement on Comments & DMs",
				"Works with Facebook & Instagram",
				"Visual Flow Builder for Custom Conversations",
				"Automatic Lead Data Capture & CRM Sync",
				"Calendar Integration for Direct Appointment Booking",
				"100% Meta API Compliant",
			],
			price: "Usage-Based",
			showBanner: true,
			bannerText: "Comments into Deals",
			bannerColor: "bg-gradient-to-r from-blue-600 to-purple-600",
			categories: [
				SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
				SERVICE_CATEGORIES.AI_FEATURES,
			],
			slugDetails: {
				slug: "ai-social-media-qualification-agent",
				dilemma:
					"Your social media is a lead graveyard. Comments on your ads go unanswered for hours, DMs get seen too late, and you're manually trying to qualify everyone, wasting time on people who aren't serious.",
				solution:
					"Deal Scale's AI Agent acts as your dedicated social media manager that never sleeps. It instantly engages every prospect, runs them through your custom qualification script, and automatically separates the hot leads from the noise, so you only spend time on conversations that lead to deals.",
				defaultZoom: 1,
				integrations: aiSocialMediaIntegrations,
				problemsAndSolutions: aiSocialMediaProblemsSolutions,
				howItWorks: aiSocialMediaHowItWorks,
				testimonials: aiSocialMediaTestimonials,
				pricing: PricingPlans,
				faq: socialMediaQualificationFAQ,
				copyright: aiSocialMediaCopyright,
			},
		},
		aiTextMessagePrequalificationAgent: {
			id: "ai-text-message-prequalification-agent",
			iconName: "MessageSquare",
			title: "AI Text Message Prequalification Agent",
			description:
				"Engage, qualify, and book leads through intelligent, two-way SMS and iMessage conversations. Our AI agent handles the entire process, turning your lead lists into a pipeline of sales-ready appointments.",
			features: [
				"Two-Way Conversational AI (SMS & iMessage)",
				"Exclusive iMessage (Blue Bubble) Support",
				"Automated Lead Qualification & Nurturing",
				"Built-in TCPA Compliance & Opt-Out Management",
				"Direct Calendar & CRM Integration",
				"Visual Flow Builder for Custom Scripts",
			],
			price: "Usage-Based",
			showBanner: true,
			bannerText: "Blue Bubble Deals",
			bannerColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
			categories: [
				SERVICE_CATEGORIES.AI_FEATURES,
				SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
			],
			slugDetails: {
				slug: "ai-text-message-prequalification-agent",
				dilemma:
					"Your leads ignore calls and emails. You know you need to reach them via text, but manual texting is impossible to scale, and standard SMS blasts are impersonal, ineffective, and legally risky.",
				solution:
					"Deal Scale's AI agent revolutionizes text outreach. It leverages our proprietary network to engage leads with trusted iMessage conversations, qualifies them through intelligent back-and-forth dialogue, and moves only the sales-ready prospects into your pipeline, all while maintaining strict compliance.",
				defaultZoom: 1,
				integrations: [],
				problemsAndSolutions: aiTextMessageProblemsSolutions,
				howItWorks: aiTextMessageHowItWorks,
				testimonials: aiTextMessageTestimonials,
				pricing: PricingPlans,
				faq: textMessageFAQ,
				copyright: aiTextMessageCopyright,
			},
		},
	},

	[SERVICE_CATEGORIES.SKIP_TRACING]: {
		phoneNumberHunter: {
			id: "phone-number-hunter-skip-trace",
			iconName: "Search",
			title: "Phone Number Hunter (Free Skip Trace) Limited Time",
			description:
				"Instantly enrich any phone number with critical data. Before you even dial, uncover the owner's name, line type, location, and spam score. A free, unlimited tool for all subscribers.",
			features: [
				"Owner Name Lookup",
				"Line Type (Mobile/VoIP/Landline)",
				"Carrier and Location Data",
				"Spam & Reputation Score",
				"Free & Unlimited for Early Subscribers",
			],
			price: "Free For Early Subscribers",
			showBanner: true,
			bannerText: "Pilot Tester Perk",
			bannerColor: "bg-gradient-to-r from-green-500 to-teal-500",
			categories: [
				SERVICE_CATEGORIES.SKIP_TRACING,
				SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
			],
			slugDetails: {
				integrations: [], // This is a self-contained tool
				defaultZoom: 1,
				slug: "phone-number-hunter-skip-trace",
				dilemma:
					"You get an inbound call or a raw phone number, but you have no context. Is it a real lead? A landline? A known spammer? You waste time calling back dead-end numbers and sound unprofessional without knowing who you're calling.",
				solution:
					"Our Phone Number Hunter instantly enriches any phone number with critical data. Before you dial, you'll know the owner's name, carrier, and line type, allowing you to prioritize real leads and personalize your first contact.",
				problemsAndSolutions: phoneNumberHunterProblemsSolutions,
				howItWorks: phoneNumberHunterHowItWorks,
				testimonials: phoneNumberHunterTestimonials,
				pricing: PricingPlans,
				copyright: phoneNumberHunterCopyright,
				faq: phoneNumberHunterFAQ,
			},
		},
		emailIntelligence: {
			id: "email-intelligence",
			iconName: "MailCheck",
			title: "Email Intelligence (Free Discovery Tool)",
			description:
				"Go beyond the inbox. Instantly find associated social profiles and generate likely email combinations to turn any contact into a warm lead. A free, unlimited tool for all subscribers.",
			features: [
				"Social Media Account Discovery",
				"Likely Email Address Generation",
				"Digital Footprint Verification",
				"Free & Unlimited for Subscribers",
			],
			price: "Free Tool",
			showBanner: true,
			bannerText: "Pilot Tester Perk",
			bannerColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
			categories: [SERVICE_CATEGORIES.LEAD_PREQUALIFICATION],
			slugDetails: {
				integrations: [], // Self-contained tool
				defaultZoom: 1,
				slug: "email-intelligence-discovery",
				dilemma:
					"You have a name and a company, but you don't know their email. Or you have an email, but no context. Your outreach is generic, your bounce rates are high, and your messages get ignored.",
				solution:
					"Our Email Intelligence tool solves both problems. It generates the most likely email addresses from a name and domain, and uncovers the social profiles linked to an email, giving you the data you need to connect and personalize.",
				problemsAndSolutions: emailIntelligenceProblemsSolutions,
				howItWorks: emailIntelligenceHowItWorks,
				testimonials: emailIntelligenceTestimonials,
				pricing: PricingPlans,
				copyright: emailIntelligenceCopyright,
				faq: emailIntelligenceFAQ,
			},
		},

		domainRecon: {
			id: "domain-recon",
			iconName: "Fingerprint",
			title: "Domain Recon (Website Intelligence)",
			description:
				"Go beyond the homepage. Enter any domain to uncover associated emails, subdomains, employee names, and the technologies a company uses. Features a free tier and a premium, deep-dive search.",
			features: [
				"Email and Name Discovery",
				"Subdomain & IP Enumeration",
				"Technology Stack Identification",
				"Free Public Search Tier",
				"Premium Deep-Dive (Credit-Based)",
			],
			price: "Freemium Tool",
			showBanner: true,
			bannerText: "Pilot Tester Perk",
			bannerColor: "bg-gradient-to-r from-gray-700 to-gray-900",
			categories: [SERVICE_CATEGORIES.SKIP_TRACING],
			slugDetails: {
				integrations: [], // Self-contained tool
				defaultZoom: 1,
				slug: "domain-recon-intelligence",
				dilemma:
					"You find a property owned by an LLC with a basic website. The contact form is a black hole, and you have no idea who works there, what they do, or how to reach a real person.",
				solution:
					"Our Domain Recon tool acts as your digital investigator. It transforms a simple domain name into actionable intelligence, revealing direct emails, key names, and hidden assets so you can bypass gatekeepers and personalize your outreach.",
				problemsAndSolutions: domainReconProblemsSolutions,
				howItWorks: domainReconHowItWorks,
				testimonials: domainReconTestimonials,
				pricing: PricingPlans,
				copyright: domainReconCopyright,
				faq: domainReconFAQ,
			},
		},
		socialProfileHunter: {
			id: "social-profile-hunter",
			iconName: "Users",
			title: "Social Profile Hunter",
			description:
				"Discover your lead's complete digital footprint. Use a username or email to find all associated accounts across 600+ social media and online platforms. A free, unlimited OSINT tool for all subscribers.",
			features: [
				"Username & Email Search",
				"Scans 600+ Online Platforms",
				"AI-Powered Metadata Extraction",
				"PDF & CSV Reporting",
				"Free & Unlimited for Subscribers",
			],
			price: "Free Tool",
			showBanner: true,
			bannerText: "Pilot Tester Perk",
			bannerColor: "bg-gradient-to-r from-red-500 to-orange-500",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				integrations: [], // Self-contained tool
				defaultZoom: 1,
				slug: "social-profile-hunter",
				dilemma:
					"You have a single piece of contact info, a username from a forum or an email address, but no other context. You can't verify their identity, understand their background, or personalize your outreach, making your efforts feel like a shot in the dark.",
				solution:
					"Our Social Profile Hunter instantly scans over 600 online platforms to create a complete map of your lead's digital footprint. It verifies their identity, uncovers their professional background, and gives you the crucial context needed to have an intelligent conversation.",
				problemsAndSolutions: socialProfileHunterProblemsSolutions,
				howItWorks: socialProfileHunterHowItWorks,
				testimonials: socialProfileHunterTestimonials,
				pricing: PricingPlans,
				copyright: socialProfileHunterCopyright,
				faq: socialProfileHunterFAQ,
			},
		},
		leadDossierGenerator: {
			id: "lead-dossier-generator",
			iconName: "FileText",
			title: "Lead Dossier Generator",
			description:
				"The ultimate OSINT tool. Start with a single username to discover a web of associated accounts across 3000+ sites. Our proprietary recursive search finds secondary usernames to build a complete digital dossier.",
			features: [
				"Recursive Search (Finds New Usernames)",
				"Comprehensive Search Across 3000+ Sites",
				"Profile Page Content Parsing",
				"Visual Relationship Map & Reports",
				"Free & Unlimited (No API Keys Needed)",
			],
			price: "Free Tool",
			showBanner: true,
			bannerText: "Pilot Tester Perk",
			bannerColor: "bg-gradient-to-r from-purple-600 to-red-600",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				integrations: [], // Self-contained tool
				defaultZoom: 1,
				slug: "lead-dossier-generator",
				dilemma:
					"You need to vet a potential partner or lead, but their online presence is fragmented across different platforms with different usernames. You only see a tiny piece of the puzzle, leaving you unable to conduct thorough due diligence.",
				solution:
					"Our Lead Dossier Generator solves this. Its unique recursive search finds a lead's secondary aliases and links all of their profiles together. It automatically builds a comprehensive map of their entire digital footprint, giving you the full picture.",
				problemsAndSolutions: leadDossierProblemsSolutions,
				howItWorks: leadDossierHowItWorks,
				testimonials: leadDossierTestimonials,
				pricing: PricingPlans,
				copyright: leadDossierCopyright,
				faq: leadDossierFAQ,
			},
		},
		dataEnrichmentSuite: {
			id: "data-enrichment-suite",
			iconName: "DatabaseZap",
			title: "Data Enrichment Suite",
			description:
				"A suite of premium, credit-based tools to verify, clean, and enrich your lead data. Turn any single piece of information, a phone, address, or name, into a complete, actionable lead profile.",
			features: [
				"Reverse Phone & Address Lookup",
				"Bulk Phone Number Validation",
				"Find Person by Name & Location",
				"Real-Time Caller Identification",
				"Uses Skip Tracing Credits",
			],
			price: "Premium Tool",
			showBanner: true,
			bannerText: "Premium Data Tools",
			bannerColor: "bg-gradient-to-r from-blue-600 to-indigo-700",
			categories: [SERVICE_CATEGORIES.SKIP_TRACING],
			slugDetails: {
				integrations: [], // Self-contained within Deal Scale
				defaultZoom: 1,
				slug: "data-enrichment-suite",
				dilemma:
					"Your CRM is filled with incomplete and outdated information. Disconnected numbers, old addresses, and missing names lead to wasted marketing spend, low connection rates, and missed opportunities.",
				solution:
					"Our Data Enrichment Suite solves this by providing a set of powerful tools to clean, validate, and enrich your data. Instantly append correct owner information and remove bad data to ensure every outreach action is based on accurate, up-to-the-minute intelligence.",
				problemsAndSolutions: dataEnrichmentProblemsSolutions,
				howItWorks: dataEnrichmentHowItWorks,
				testimonials: dataEnrichmentTestimonials,
				pricing: PricingPlans,
				copyright: dataEnrichmentCopyright,
				faq: dataEnrichmentFAQ,
			},
		},
	},
	[SERVICE_CATEGORIES.AI_FEATURES]: {
		aiMarketAnalysis: {
			id: "ai-market-analysis",
			iconName: "BarChartBig",
			title: "AI Market Analysis",
			description:
				"Get real-time rental data and market insights for any US zip code. Chat with our AI to understand trends, and arm your AI agents with market data to have more intelligent, persuasive conversations.",
			features: [
				"Nationwide Market Statistics & Trends",
				"Accurate Rent Estimates & Comps",
				"AI Chat Interface for Data Q&A",
				"Arm AI Agents with Market Insights",
				"Custom-Branded PDF & Online Reports",
			],
			price: "Included in Pro/Scale Plans",
			showBanner: true,
			bannerText: "Data-Driven Decisions",
			bannerColor: "bg-gradient-to-r from-green-600 to-cyan-600",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				integrations: [], // Self-contained feature
				defaultZoom: 1,
				slug: "ai-market-analysis",
				dilemma:
					"Making investment decisions feels like a gamble. You're never sure if a market is growing or declining, and manually researching comps is a slow, painful process that still leaves you with an incomplete picture.",
				solution:
					"Our AI Market Analysis tool removes the guesswork. It provides instant access to comprehensive data for any US market. More importantly, it allows you to 'chat' with the data to get clear answers and then pass that intelligence directly to your AI agents, turning raw data into a competitive advantage.",
				problemsAndSolutions: marketAnalysisProblemsSolutions,
				howItWorks: marketAnalysisHowItWorks,
				testimonials: marketAnalysisTestimonials,
				pricing: PricingPlans,
				copyright: marketAnalysisCopyright,
				faq: marketAnalysisFAQ,
			},
		},
		aiPerformanceHub: {
			id: "ai-performance-hub",
			iconName: "LayoutGrid",
			title: "AI Command Center",
			description:
				"The world's first proactive CRM. It analyzes your pipeline to automatically add high-impact tasks to your board, and detects which of your manual to-dos it can complete for you, truly automating your workflow.",
			features: [
				"Visual Deal Pipeline (Kanban)",
				"Proactive AI Task Generation",
				"AI-Powered Manual Task Completion",
				"Intelligent Lead Segmentation",
				"Real-Time Business Analytics",
			],
			price: "Core Feature",
			showBanner: true,
			bannerText: "AI Ops Manager",
			bannerColor: "bg-gradient-to-r from-gray-800 to-blue-900",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				integrations: [], // This is a self-contained core feature
				defaultZoom: 1,
				slug: "ai-command-center",
				dilemma:
					"Your CRM is a passive database. It holds information but requires you to do all the thinking and all the work, creating tasks, deciding priorities, and performing every repetitive action yourself.",
				solution:
					"Our AI Command Center is an active partner. It doesn't just store your data; it analyzes it to proactively *add* tasks to your board, then offers to *complete* the repetitive tasks you've created, freeing you to focus on high-value actions.",
				problemsAndSolutions: performanceHubProblemsSolutions,
				howItWorks: performanceHubHowItWorks,
				testimonials: performanceHubTestimonials,
				pricing: PricingPlans,
				copyright: performanceHubCopyright,
				faq: performanceHubFAQ,
			},
		},
		aiPhoneAgent: {
			id: "ai-phone-agent",
			iconName: "Phone",
			title: "AI Phone Agent",
			description:
				"Stop chasing cold leads. Our 24/7 AI Phone Agent tirelessly calls and pre-qualifies your seller leads with natural, intelligent conversations, then automatically schedules appointments or hot-transfers live, motivated sellers directly to you.",
			features: [
				"24/7 Automated Outbound Calling",
				"Natural, Human-Like Conversations",
				"Intelligent Seller Lead Qualification",
				"Automated Calendar Scheduling",
				"Live Call Hot-Transfer Capability",
			],
			price: "Credit-Based",
			showBanner: true,
			bannerText: "Autopilot Appraisals",
			bannerColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				integrations: [], // Self-contained feature
				defaultZoom: 1,
				slug: "ai-phone-agent",
				dilemma:
					"You spend countless hours making repetitive, draining cold calls, only to get low connection rates and leads who aren't serious. This manual grind is the biggest bottleneck to scaling your business.",
				solution:
					"Our AI Phone Agent completely automates your outbound calling. It tirelessly dials and qualifies leads, filtering out the noise and delivering only sales-ready appointments and live hot-transfers, freeing you to focus on closing deals.",
				problemsAndSolutions: aiPhoneAgentProblemsSolutions,
				howItWorks: aiPhoneAgentHowItWorks,
				testimonials: aiPhoneAgentTestimonials,
				pricing: PricingPlans,
				copyright: aiPhoneAgentCopyright,
				faq: aiPhoneAgentFAQ,
			},
		},
		aiInboundAgent: {
			id: "ai-inbound-agent",
			iconName: "Phone",
			title: "AI Inbound Agent",
			description:
				"Stop missing calls from motivated sellers. Our 24/7 AI Inbound Agent instantly answers and qualifies every call from your marketing, then automatically schedules appointments or hot-transfers the live, sales-ready lead directly to you.",
			features: [
				"24/7 Automated Inbound Call Answering",
				"Natural, Human-Like Conversations",
				"Intelligent Lead Qualification & Filtering",
				"Automated Calendar Scheduling",
				"Live Call Hot-Transfer Capability",
			],
			price: "Credit-Based",
			showBanner: true,
			bannerText: "24/7 Receptionist",
			bannerColor: "bg-gradient-to-r from-teal-500 to-green-500",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				integrations: [], // Self-contained feature
				defaultZoom: 1,
				slug: "ai-inbound-agent",
				dilemma:
					"You spend a fortune on marketing to make the phone ring, but you inevitably miss calls that come in while you're busy or after hours. Every call that goes to voicemail is a potential deal lost to a competitor.",
				solution:
					"Our AI Inbound Agent solves this by answering every call instantly, 24/7. It acts as your perfect receptionist, qualifying every lead and converting your marketing spend into concrete appointments, ensuring no lead is ever wasted.",
				problemsAndSolutions: aiInboundAgentProblemsSolutions,
				howItWorks: aiInboundAgentHowItWorks,
				testimonials: aiInboundAgentTestimonials,
				pricing: PricingPlans,
				copyright: aiInboundAgentCopyright,
				faq: aiInboundAgentFAQ,
			},
		},
		proprietaryVoiceCloning: {
			id: "proprietary-voice-cloning",
			iconName: "Sparkles" as IconName, // Changed to "Sparkles" as it's a valid IconName and fits "premium/magic"
			title: "Deal Scale Proprietary AI Voice Cloning",
			description:
				"Transform your AI interactions with Deal Scale's exclusive Voice Cloning technology. Our advanced, in-house AI creates a perfect digital replica of your voice, enabling hyper-personalized outreach that builds instant trust and dramatically boosts lead engagement.",
			features: [
				"Proprietary AI crafts a high-fidelity clone of your unique voice",
				"Deliver a truly consistent and authentic brand voice across all AI communications",
				"Achieve unparalleled personalization in automated outreach",
				"Build deeper trust and rapport with leads through familiar, human-like voice interactions",
				"Seamlessly integrated with your Deal Scale AI Virtual Agents for immediate use",
				"Powered entirely by Deal Scale's secure, advanced in-house technology",
			],
			price: "Exclusive Premium Tier Feature", // String type for price matches example
			showBanner: true,
			bannerText: "AI Voice Cloning",
			bannerColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				integrations: [], // This is Deal Scale's own tech, so no external integrations listed here
				defaultZoom: 1,
				slug: "dealscale-proprietary-ai-voice-cloning",
				dilemma:
					"In a crowded marketplace, generic AI voices create a barrier, feeling impersonal and failing to capture the unique essence of your brand, leading to missed opportunities and lower engagement.",
				solution:
					"Deal Scale's Proprietary AI Voice Cloning breaks through this barrier. By enabling your AI Virtual Agents to speak in *your own cloned voice*, we transform automated interactions into genuinely personal experiences. This fosters immediate familiarity and trust, making leads significantly more receptive and boosting conversion rates like never before with technology developed and secured by Deal Scale.",
				problemsAndSolutions: proprietaryVoiceCloningProblemsSolutions,
				howItWorks: proprietaryVoiceCloningHowItWorks,
				testimonials: proprietaryVoiceCloningTestimonials, // Uses the updated Testimonial interface
				pricing: PricingPlans,
				copyright: proprietaryVoiceCloningCopyright,
				faq: proprietaryVoiceCloningFAQ, // Uses the updated FAQProps interface
				// splineUrl, datePublished, lastModified are optional and can be added if needed
				// splineUrl: { splineUrl: "your-spline-url-here-for-voice-cloning", defaultZoom: 1.2 },
				// datePublished: new Date("2024-01-15"),
				// lastModified: new Date("2024-03-10"),
			},
		},
		aiSocialMediaEngagementService: {
			id: "ai-social-media-engagement-service",
			iconName: "MessagesSquare" as IconName, // Reflects the chat/DM engagement
			title: "AI Social Lead Conversion Engine",
			description:
				"Turn social media buzz into booked appointments. Our AI leverages proven scripts and dynamic messaging to engage prospects from comments or DMs, qualify them through intelligent conversation, and schedule sales-ready calls on your calendar.",
			features: [
				"Automated Comment-to-DM & Direct Message Engagement",
				"Utilizes Proven Preset Scripts & Dynamic AI-Generated Messages",
				"Intelligent Lead Qualification via Conversational AI",
				"Automated Calendar Scheduling for Sales-Ready Leads",
				"Optional Live Hot-Transfer for Immediate Sales Calls",
				"Seamless Integration with CRM & Deal Scale Virtual Agents",
			],
			price: "Premium Conversion Module", // Suggests higher value
			showBanner: true,
			bannerText: "Social Closed Deals",
			bannerColor: "bg-gradient-to-r from-purple-500 to-pink-500", // Engaging colors
			categories: [SERVICE_CATEGORIES.LEAD_GENERATION],
			slugDetails: {
				integrations: aiSocialMediaOutreachIntegrations,
				defaultZoom: 1,
				slug: "ai-social-lead-conversion", // Updated slug
				dilemma:
					"Your social media is buzzing with comments and messages, but manually converting that fleeting interest into concrete sales appointments is a time-consuming nightmare, leading to lost leads and frustration.",
				solution:
					"Deal Scale's AI Social Lead Conversion Engine acts as your 24/7 social sales assistant. Powered by our proprietary messaging technology, it intelligently engages prospects using optimized scripts or dynamic AI responses, qualifies them through natural conversation, and delivers sales-ready appointments directly to your calendar or as live call transfers.",
				problemsAndSolutions: aiSocialMediaOutreachProblemsSolutions, // Updated
				howItWorks: aiSocialMediaOutreachHowItWorks, // Updated
				testimonials: aiSocialMediaOutreachTestimonials, // Updated
				pricing: PricingPlans, // Ensure it reflects value
				copyright: aiSocialMediaOutreachCopyright,
				faq: aiSocialMediaOutreachFAQ, // Updated
			},
		},
		aiTextMessageOutreachService: {
			id: "ai-text-message-outreach-service",
			iconName: "MessageCircle" as IconName, // Or "Smartphone", "MailCheck"
			title: "AI Text Message Outreach",
			description:
				"Engage leads and nurture relationships at scale with intelligent, personalized, and compliant SMS campaigns. Our AI handles two-way conversations, qualifies prospects, and drives conversions directly from text messages.",
			features: [
				"AI-powered personalized SMS message generation",
				"Automated two-way conversational SMS with prospects",
				"Intelligent lead qualification and intent recognition via text",
				"Built-in TCPA compliance and opt-out management",
				"Smart list segmentation and targeted campaign delivery",
				"Seamless CRM integration for lead and conversation syncing",
				"Detailed analytics on SMS campaign performance",
			],
			price: "See Plans", // Or specific starting price
			showBanner: true,
			bannerText: "AI SMS",
			bannerColor: "bg-gradient-to-r from-green-500 to-emerald-600",
			categories: [SERVICE_CATEGORIES.LEAD_GENERATION],
			slugDetails: {
				integrations: [],
				defaultZoom: 1,
				slug: "ai-text-message-outreach",
				dilemma:
					"Standard bulk SMS is impersonal and ineffective, while manual texting isn't scalable. You need a way to reach and engage leads via text in a personalized, compliant, and efficient manner.",
				solution:
					"Deal Scale's AI Text Message Outreach empowers you to launch intelligent SMS campaigns that feel personal. Our AI crafts messages, engages in two-way conversations to qualify leads, ensures compliance, and integrates seamlessly with your workflow, turning text messages into a powerful conversion channel.",
				problemsAndSolutions: aiTextMessageOutreachProblemsSolutions,
				howItWorks: aiTextMessageOutreachHowItWorks,
				testimonials: aiTextMessageOutreachTestimonials,
				pricing: PricingPlans,
				copyright: aiTextMessageOutreachCopyright,
				faq: aiTextMessageOutreachFAQ,
			},
		},
		embeddableAIChatbotService: {
			id: "embeddable-ai-chatbot-service",
			iconName: "BotMessageSquare" as IconName, // Or "MessageSquarePlus"
			title: "Embeddable AI Sales Chatbot",
			description:
				"Turn your website into a 24/7 lookalike audience expansion engine inspired by How to Win Friends and Influence People. Our AI chatbot engages visitors, answers questions, pre-qualifies leads, and seamlessly integrates them into your Deal Scale workflow for immediate follow-up or booking.",
			features: [
				"Easy website embedding with a simple code snippet",
				"Customizable branding, greetings, and qualification scripts",
				"24/7 AI-powered visitor engagement and query handling",
				"Intelligent lead pre-qualification and scoring",
				"Direct integration with Deal Scale CRM & Calendar",
				"Automated appointment booking for qualified leads",
				"Live agent notification & chat transfer capabilities",
			],
			price: "Starts at $199/mo", // Or "Included in Premium Tier"
			showBanner: true,
			bannerText: "AI Chatbot",
			bannerColor: "bg-gradient-to-r from-teal-400 to-sky-500",
			categories: [SERVICE_CATEGORIES.LEAD_PREQUALIFICATION],
			slugDetails: {
				integrations: embeddableAIChatbotIntegrations,
				defaultZoom: 1,
				slug: "embeddable-ai-sales-chatbot",
				dilemma:
					"Your website attracts visitors, but many leave without a trace because there's no immediate, intelligent way to engage them, answer their questions, and guide them towards becoming a qualified lead.",
				solution:
					"Deal Scale's Embeddable AI Sales Chatbot transforms your website into an active sales assistant. It engages every visitor 24/7, provides instant answers, intelligently pre-qualifies them based on your criteria, and then seamlessly hands them off to your sales process by booking appointments or alerting your team, all automatically.",
				problemsAndSolutions: embeddableAIChatbotProblemsSolutions,
				howItWorks: embeddableAIChatbotHowItWorks,
				testimonials: embeddableAIChatbotTestimonials,
				pricing: PricingPlans,
				copyright: embeddableAIChatbotCopyright,
				faq: embeddableAIChatbotFAQ,
			},
		},
	},
	[SERVICE_CATEGORIES.REAL_ESTATE_TOOLS]: {
		aiRentEstimator: {
			id: "ai-rent-estimator",
			iconName: "BarChartBig",
			title: "AI Rent Estimator & Comps",
			description:
				"Look up accurate rent estimates, nearby rental comps, and local market trends for any property in the United States. Analyze new deals and maximize your portfolio's cash flow.",
			features: [
				"Instant Property Rent Estimates",
				"Nearby Rental Comps",
				"Local Market & Historical Trends",
				"Professional Reports with Custom Branding",
				"Rental Portfolio Dashboard",
				"Real-Time Rent Alerts",
			],
			price: "Freemium",
			showBanner: true,
			bannerText: "AI Rent Estimator",
			bannerColor: "bg-gradient-to-r from-green-600 to-cyan-600",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				slug: "ai-rent-estimator-and-comps",
				dilemma:
					"You're analyzing a new investment or renewing a lease, but you're just guessing the rent. This uncertainty leads to risky investments, lost monthly income, and prolonged vacancies.",
				solution:
					"Our AI Rent Estimator provides instant, accurate rent values and rental comps for any US property. It empowers you to analyze deals with confidence, maximize your cash flow, and minimize vacancies by knowing the true market rate, every time.",
				defaultZoom: 1,
				integrations: [],
				problemsAndSolutions: rentEstimatorProblemsSolutions,
				howItWorks: rentEstimatorHowItWorks,
				testimonials: rentEstimatorTestimonials,
				pricing: PricingPlans,
				faq: rentEstimatorFAQ,
				copyright: rentEstimatorCopyright,
			},
		},
		rentalMarketAnalyzer: {
			id: "rental-market-analyzer",
			iconName: "PieChart",
			title: "Rental Market Analyzer",
			description:
				"Analyze rental property markets and find new investment opportunities. View rent averages, historical trends, and detailed market statistics for any zip code in the US.",
			features: [
				"Market Statistics for 38k+ Zip Codes",
				"Historical Rent Performance Trends",
				"Local Market Composition Analysis",
				"Professional, Custom-Branded Reports",
				"Portfolio Market Tracking & Updates",
			],
			price: "Freemium",
			showBanner: true,
			bannerText: "AI Rental Market Analyzer",
			bannerColor: "bg-gradient-to-r from-indigo-500 to-sky-600",
			categories: [SERVICE_CATEGORIES.AI_FEATURES],
			slugDetails: {
				slug: "rental-market-analyzer",
				dilemma:
					"Choosing a new market to invest in feels like a blind bet. You're trying to find growth opportunities without reliable data on rent trends, market health, or property type demand.",
				solution:
					"Our Rental Market Analyzer gives you the 30,000-foot view you need. Instantly pull comprehensive reports for any zip code to analyze rent averages, historical trends, and market composition, allowing you to confidently identify and compare investment opportunities from your desk.",
				defaultZoom: 1,
				integrations: [],
				problemsAndSolutions: marketAnalyzerProblemsSolutions,
				howItWorks: marketAnalyzerHowItWorks,
				testimonials: marketAnalyzerTestimonials,
				pricing: PricingPlans,
				faq: marketAnalyzerFAQ,
				copyright: marketAnalyzerCopyright,
			},
		},
		enterprisePortfolioDashboard: {
			id: "enterprise-portfolio-dashboard",
			iconName: "LayoutGrid",
			title: "Enterprise Portfolio Dashboard",
			description:
				"Unify, monitor, and optimize your entire rental portfolio from a single command center. Built for funds, property managers, and large investors who need real-time data and automated insights to drive returns.",
			features: [
				"Centralized Portfolio Dashboard with Custom KPIs",
				"Proactive Rent Increase Alerts",
				"Historical Performance & Lease Tracking",
				"Automated Market Update Emails",
				"White-Labeled Reporting for Clients & Stakeholders",
				"Integration Access & Role-Based Permissions",
			],
			price: "Enterprise Tier",
			showBanner: true,
			bannerText: "Portfolio Command Center",
			bannerColor: "bg-gradient-to-r from-gray-800 to-blue-900",
			categories: [SERVICE_CATEGORIES.REAL_ESTATE_TOOLS],
			slugDetails: {
				slug: "enterprise-portfolio-dashboard",
				dilemma:
					"You're managing a large, valuable portfolio using a patchwork of disconnected spreadsheets and legacy software. This creates data silos, prevents real-time analysis, and forces your team to waste time on manual reporting instead of value-add activities.",
				solution:
					"Our Enterprise Dashboard provides a unified, live view of your entire portfolio's performance. It automates rent optimization, streamlines stakeholder reporting, and delivers the critical insights your team needs to make smarter, faster, and more profitable decisions at scale.",
				defaultZoom: 1,
				integrations: [],
				problemsAndSolutions: portfolioDashboardProblemsSolutions,
				howItWorks: portfolioDashboardHowItWorks,
				testimonials: portfolioDashboardTestimonials,
				pricing: PricingPlans,
				faq: portfolioDashboardFAQ,
				copyright: portfolioDashboardCopyright,
			},
		},
	},
};

// --- Helper functions (remain the same) ---
export const getAllServiceCategories = () => {
	// Adjust if ServicesData keys are guaranteed
	return Object.keys(services) as ServiceCategoryValue[];
};

export const getServicesByCategory = (category: ServiceCategoryValue) => {
	// Add a check for potentially missing category
	return services[category] || {};
};

export const getAllServices = () => {
	return Object.values(services).flatMap((categoryObj) =>
		Object.values(categoryObj),
	);
};
