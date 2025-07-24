// import type { Plan } from "@/types/service/plans";

// export const PricingPlans: Plan[] = [
// 	{
// 		id: "pro_tier",
// 		name: "Pro",
// 		price: {
// 			// Monthly SaaS Subscription
// 			monthly: {
// 				amount: 2499,
// 				description: "per month, billed monthly",
// 				features: [
// 					"Up to 5 Users",
// 					"Access to 140M+ Property Database",
// 					"10,000 AI Credits",
// 					"500 Skip Trace Credits",
// 					"200 Lead Credits",
// 					"Standard AI Outreach Flows",
// 					"Email & Chat Support",
// 				],
// 			},
// 			// Annual SaaS Subscription (with ~17% discount / 2 months free)
// 			annual: {
// 				amount: 24990,
// 				description: "per year, billed annually",
// 				features: [
// 					"Up to 5 Users",
// 					"Access to 140M+ Property Database",
// 					"120,000 AI Credits (10k/mo)",
// 					"6,000 Skip Trace Credits (500/mo)",
// 					"2,400 Lead Credits (200/mo)",
// 					"Standard AI Outreach Flows",
// 					"Priority Email & Chat Support",
// 				],
// 			},
// 			// No standard one-time option for this tier
// 			oneTime: {
// 				amount: 0,
// 				description: "Not available for this plan.",
// 				features: [],
// 			},
// 		},
// 		cta: { text: "Choose Pro", type: "checkout" },
// 	},
// 	{
// 		id: "performance_tier",
// 		name: "Performance",
// 		highlighted: true,
// 		price: {
// 			// Represents the PPA (Pay-Per-Appointment) model
// 			oneTime: {
// 				amount: 200,
// 				description: "per qualified appointment delivered",
// 				features: [
// 					"No Monthly Subscription Fee",
// 					"Pay Only for Results",
// 					"Fully Managed AI Campaigns",
// 					"Sales-Ready Appointments Delivered to Your Calendar",
// 					"Ideal for Validating Deal Flow",
// 					"5-25% Finders Fee on Closed Deals (Optional)",
// 				],
// 			},
// 			// N/A for this success-based model
// 			monthly: {
// 				amount: 0,
// 				description: "Not available for this plan.",
// 				features: [],
// 			},
// 			// N/A for this success-based model
// 			annual: {
// 				amount: 0,
// 				description: "Not available for this plan.",
// 				features: [],
// 			},
// 		},
// 		cta: { text: "Apply", type: "link" },
// 	},
// 	{
// 		id: "scale_tier",
// 		name: "Scale",
// 		price: {
// 			// Premium Monthly SaaS Subscription
// 			monthly: {
// 				amount: 5999,
// 				description: "per month, billed monthly",
// 				features: [
// 					"Everything in Pro, plus:",
// 					"Unlimited Users",
// 					"50,000 AI Credits",
// 					"1,500 Skip Trace Credits",
// 					"500 Lead Credits",
// 					"Customizable AI Agent Flows",
// 					"Priority Access to Premium Zip Codes",
// 					"Dedicated Account Manager",
// 				],
// 			},
// 			// Premium Annual SaaS Subscription
// 			annual: {
// 				amount: 59990,
// 				description: "per year, billed annually",
// 				features: [
// 					"Everything in Pro, plus:",
// 					"Unlimited Users",
// 					"600,000 AI Credits (50k/mo)",
// 					"18,000 Skip Trace Credits (1.5k/mo)",
// 					"6,000 Lead Credits (500/mo)",
// 					"Customizable AI Agent Flows",
// 					"Priority Access to Premium Zip Codes",
// 					"Dedicated Account Manager & Onboarding",
// 				],
// 			},
// 			// No standard one-time option for this tier
// 			oneTime: {
// 				amount: 0,
// 				description: "Not available for this plan.",
// 				features: [],
// 			},
// 		},
// 		cta: { text: "Choose Scale", type: "checkout" },
// 	},
// ];

// export const leadGenPricingPlans: Plan[] = [
// 	{
// 		id: "starter_leads",
// 		name: "Starter",
// 		price: {
// 			// Monthly subscription for a set number of lead credits
// 			monthly: {
// 				amount: 499,
// 				description: "per month, billed monthly",
// 				features: [
// 					"500 Lead Credits per month",
// 					"Access to 140M+ Property Database",
// 					"Standard Search Filters",
// 					"Email Support",
// 				],
// 			},
// 			// Annual subscription with a discount (e.g., 2 months free)
// 			annual: {
// 				amount: 4990,
// 				description: "per year, billed annually",
// 				features: [
// 					"6,000 Lead Credits per year",
// 					"Access to 140M+ Property Database",
// 					"Standard Search Filters",
// 					"Email Support",
// 				],
// 			},
// 			// This is not a one-time purchase plan
// 			oneTime: {
// 				amount: 0,
// 				description: "Subscription-based plan.",
// 				features: [],
// 			},
// 		},
// 		buttonText: "Choose Starter",
// 	},
// 	{
// 		id: "growth_leads",
// 		name: "Growth",
// 		highlighted: true,
// 		price: {
// 			// Monthly subscription for larger teams and volume
// 			monthly: {
// 				amount: 1999,
// 				description: "per month, billed monthly",
// 				features: [
// 					"2,500 Lead Credits per month",
// 					"Full Access to 140M+ Database",
// 					"Advanced & AI-Powered Filters",
// 					"Up to 5 Team Members",
// 					"Priority Support",
// 				],
// 			},
// 			// Annual subscription with a discount
// 			annual: {
// 				amount: 19990,
// 				description: "per year, billed annually",
// 				features: [
// 					"30,000 Lead Credits per year",
// 					"Full Access to 140M+ Database",
// 					"Advanced & AI-Powered Filters",
// 					"Up to 5 Team Members",
// 					"Priority Support & Onboarding",
// 				],
// 			},
// 			// This is not a one-time purchase plan
// 			oneTime: {
// 				amount: 0,
// 				description: "Subscription-based plan.",
// 				features: [],
// 			},
// 		},
// 		buttonText: "Choose Growth",
// 	},
// 	{
// 		id: "performance_partnership",
// 		name: "Performance Partnership",
// 		price: {
// 			// This is the one-time, success-based model
// 			oneTime: {
// 				amount: 200, // Starting price from the pitch deck
// 				description:
// 					"Starting price per qualified appointment delivered. Application required.",
// 				features: [
// 					"Pay Only for Qualified Appointments",
// 					"No Monthly Subscription Fee",
// 					"For High-Volume Investors & Teams",
// 					"Fully Managed AI Campaigns",
// 					"Ideal for Scaling Operations Predictably",
// 				],
// 			},
// 			// This model is not a subscription
// 			monthly: {
// 				amount: 0,
// 				description: "Success-based model.",
// 				features: [],
// 			},
// 			annual: {
// 				amount: 0,
// 				description: "Success-based model.",
// 				features: [],
// 			},
// 		},
// 		buttonText: "Apply to Qualify",
// 	},
// ];

// export const socialLeadGenPricingPlans: Plan[] = [
// 	{
// 		id: "social_growth_engine",
// 		name: "Social Growth Engine",
// 		highlighted: true,
// 		price: {
// 			monthly: {
// 				amount: 149,
// 				description: "per month, billed monthly",
// 				features: [
// 					"500 AI Conversation Credits / mo",
// 					"Connect up to 2 Social Accounts",
// 					"AI-Powered Nurturing & Follow-up",
// 					"Automated Appointment Booking",
// 					"Live Hot Transfer Capability",
// 					"Overage: $0.40 per extra conversation",
// 				],
// 			},
// 			annual: {
// 				amount: 1490,
// 				description: "Per Year + (2 Months Free)",
// 				features: [
// 					"6,000 AI Conversation Credits / yr",
// 					"Connect up to 2 Social Accounts",
// 					"AI-Powered Nurturing & Follow-up",
// 					"Automated Appointment Booking",
// 					"Live Hot Transfer Capability",
// 					"Overage: $0.40 per extra conversation",
// 				],
// 			},
// 			oneTime: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Start Automating",
// 	},
// 	{
// 		id: "social_scale_engine",
// 		name: "Social Scale Engine",
// 		price: {
// 			monthly: {
// 				amount: 349,
// 				description: "per month, billed monthly",
// 				features: [
// 					"1,500 AI Conversation Credits / mo",
// 					"Connect up to 5 Social Accounts",
// 					"Everything in Growth Engine",
// 					"Lower Overage: $0.30 per extra conversation",
// 					"Priority Support & Onboarding",
// 				],
// 			},
// 			annual: {
// 				amount: 3490,
// 				description: "Per Year + (2 Months Free)",
// 				features: [
// 					"18,000 AI Conversation Credits / yr",
// 					"Connect up to 5 Social Accounts",
// 					"Everything in Growth Engine",
// 					"Lower Overage: $0.30 per extra conversation",
// 					"Priority Support & Onboarding",
// 				],
// 			},
// 			oneTime: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Choose Scale Engine",
// 	},
// ];

// export const snailMailPricingPlans: Plan[] = [
// 	{
// 		id: "pay_per_piece_mail",
// 		name: "Direct Mail Fulfillment",
// 		highlighted: true,
// 		price: {
// 			// This is a pay-as-you-go model for physical mail
// 			oneTime: {
// 				amount: 0.89,
// 				description:
// 					"Starting from, per piece sent. Billed to your payment method.",
// 				features: [
// 					"Standard Postcard (4x6): $0.89 per piece",
// 					"Professional Letter: $1.19 per piece",
// 					"Handwritten 'Yellow Letter': $1.49 per piece",
// 					"All prices include printing, postage, and handling",
// 				],
// 			},
// 			// No monthly/annual fees for this part
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Launch a Campaign",
// 	},
// 	{
// 		id: "ai_features_usage",
// 		name: "AI Agent & Design",
// 		price: {
// 			// This describes how AI Credits are used for this feature
// 			oneTime: {
// 				amount: 0, // Base price is zero, it's all credit-based
// 				description: "Consumed from your universal AI credit balance.",
// 				features: [
// 					"AI Call Handling: 50 credits per call + 5 credits per minute",
// 					"AI Mailer Design Generation: 100 credits per design",
// 					"Credits are purchased separately from your dashboard",
// 					"Unused credits never expire",
// 				],
// 			},
// 			// No monthly/annual fees for this part
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Add AI Credits",
// 	},
// ];

// export const phoneNumberHunterPricingPlans: Plan[] = [
// 	{
// 		id: "phonenumberhunter_free_early_adopter",
// 		name: "Early Adopter Free Access",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Free for a limited time for early adopters.",
// 				features: [
// 					"Unlimited Phone Number Lookups",
// 					"Owner Name & Location",
// 					"Carrier & Line Type (Mobile/Landline)",
// 					"Spam Reputation Score",
// 					"No cost during early access period",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Claim Free Early Access",
// 	},
// ];

// export const emailIntelligencePricingPlans: Plan[] = [
// 	{
// 		id: "emailintelligence_free_for_early_adopters",
// 		name: "Free Subscriber Tool",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Included with any active Deal Scale subscription.",
// 				features: [
// 					"Unlimited Email Lookups",
// 					"Associated Social Media Profile Discovery",
// 					"Likely Email Address Generation",
// 					"No additional cost or credits required",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Access The Tool",
// 	},
// ];

// export const domainReconPricingPlans: Plan[] = [
// 	{
// 		id: "standard_recon",
// 		name: "Standard Recon",
// 		highlighted: false,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Free for all subscribers, unlimited use.",
// 				features: [
// 					"Public Email & Name Discovery",
// 					"Basic Subdomain Search (crt.sh, dnsdumpster)",
// 					"Technology Stack Analysis",
// 					"Results from public search engines (Bing, Yahoo)",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Run Standard Search",
// 	},
// 	{
// 		id: "deep_recon",
// 		name: "Deep Recon (Premium)",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Consumed from your universal Skip Tracecredit balance.",
// 				features: [
// 					"Deep Email Search (via Hunter, Tomba): 50 credits",
// 					"Subdomain Discovery (via WhoisXML): 50 credits",
// 					"Vulnerability Scan (via Pentest-Tools): 100 credits",
// 					"Security Report (via CriminalIP, Netlas): 100 credits",
// 					"Access to all premium, API-gated data sources",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Add AI Credits",
// 	},
// ];

// export const socialProfileHunterPricingPlans: Plan[] = [
// 	{
// 		id: "free_for_subscribers",
// 		name: "Free Subscriber Tool",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Included with any active Deal Scale subscription.",
// 				features: [
// 					"Unlimited Username & Email Searches",
// 					"Search Across 600+ Platforms",
// 					"AI-Powered Metadata Extraction",
// 					"PDF & CSV Export Options",
// 					"No additional cost or credits required",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Access The Tool",
// 	},
// ];

// export const leadDossierPricingPlans: Plan[] = [
// 	{
// 		id: "free_for_subscribers",
// 		name: "Free Subscriber Tool",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Included with any active Deal Scale subscription.",
// 				features: [
// 					"Unlimited Dossier Generation",
// 					"Recursive Username Search",
// 					"Search Across 3000+ Platforms",
// 					"Profile Page Content Parsing",
// 					"HTML, PDF & XMind Report Exports",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Access The Tool",
// 	},
// ];

// export const dataEnrichmentPricingPlans: Plan[] = [
// 	{
// 		id: "usage_based_enrichment",
// 		name: "Pay-Per-Enrichment",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"Actions are paid for using Skip Tracing Credits from your account balance.",
// 				features: [
// 					"Phone Validation: 1 Credit per number",
// 					"Reverse Phone Lookup: 5 Credits per number",
// 					"Reverse Address Lookup: 10 Credits per address",
// 					"Find Person Search: 15 Credits per search",
// 					"Full Contact Verification (Phone+Email+Address): 20 Credits",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Add Skip Tracing Credits",
// 	},
// ];

// export const marketAnalysisPricingPlans: Plan[] = [
// 	{
// 		id: "usage_based_analysis",
// 		name: "Usage-Based Analytics",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"Actions are paid for using your universal AI credit balance.",
// 				features: [
// 					"Generate Market Report: 1 AI Credit per property/row",
// 					"AI Chat with Data: 1 AI Credit per question",
// 					"Arm AI Agent with Relevant Market Data: 1 AI Credit per agent",
// 					"Custom Branded Reports: Included with report generation",
// 					"Credits can be purchased from your main dashboard",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Add AI Credits",
// 	},
// ];

// export const performanceHubPricingPlans: Plan[] = [
// 	{
// 		id: "growth_plan_access",
// 		name: "Growth Plan",
// 		price: {
// 			monthly: {
// 				amount: 0,
// 				description: "Core features are included in your plan.",
// 				features: [
// 					"Standard KPI Dashboard",
// 					"Kanban Workflow Board",
// 					"AI Lead Segmentation",
// 					"Automated Task Creation for Self",
// 				],
// 			},
// 			annual: { amount: 0, description: "", features: [] },
// 			oneTime: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Included in Growth",
// 	},
// 	{
// 		id: "scale_plan_access",
// 		name: "Scale Plan",
// 		highlighted: true,
// 		price: {
// 			monthly: {
// 				amount: 0,
// 				description: "Advanced features are included in your plan.",
// 				features: [
// 					"Everything in Growth, plus:",
// 					"Advanced Custom Dashboards & Reporting",
// 					"Team-Based Task Assignment",
// 					"AI-Driven Performance Forecasting",
// 				],
// 			},
// 			annual: { amount: 0, description: "", features: [] },
// 			oneTime: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Included in Scale",
// 	},
// ];

// export const aiPhoneAgentPricingPlans: Plan[] = [
// 	{
// 		id: "ai_agent_usage",
// 		name: "Pay-Per-Action",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Consumed from your universal AI credit balance.",
// 				features: [
// 					"Cost to Initiate Call: 5 AI Credits",
// 					"Conversation Time: 2 AI Credits per minute",
// 					"Automated Voicemail Drop: 1 AI Credit",
// 					"Includes Full Call Recording & Transcription",
// 					"Credits are purchased from your main dashboard",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Add AI Credits",
// 	},
// ];

// export const aiInboundAgentPricingPlans: Plan[] = [
// 	{
// 		id: "ai_agent_usage",
// 		name: "Pay-Per-Action",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Consumed from your universal AI credit balance.",
// 				features: [
// 					"Cost to Answer Call: 1 AI Credits",
// 					"Conversation Time: 2 AI Credits per minute",
// 					"Includes Full Call Recording & Transcription",
// 					"Unique Local Phone Numbers: 500 Credits / mo",
// 					"Credits are purchased from your main dashboard",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Add AI Credits",
// 	},
// ];

// export const proprietaryVoiceCloningPricingPlans: Plan[] = [
// 	{
// 		id: "dealscale-proprietary-voice-cloning",
// 		name: "Exclusive Premium Tier Access",
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"This advanced feature is not available as a standalone purchase.",
// 				features: [],
// 			},
// 			monthly: {
// 				amount: 4500, // Example, reflecting it's part of a premium package
// 				description:
// 					"Access our exclusive, proprietary AI Voice Cloning technology, a cornerstone of your Premium Tier Deal Scale subscription.",
// 				features: [
// 					"Cloning of one primary user voice using Deal Scale's proprietary AI",
// 					"Unlimited usage of your cloned voice with all your AI Virtual Agents",
// 					"Deal Scale's advanced technology ensures natural, high-fidelity sound",
// 					"Dedicated premium support for voice sample optimization and setup",
// 					"Secure, in-house management of your voice data and cloned identity",
// 				],
// 			},
// 			annual: {
// 				amount: 45000, // Example for annual pricing
// 				description:
// 					"Benefit from AI Voice Cloning with an Annual Premium Tier subscription, ensuring year-round personalized outreach.",
// 				features: [
// 					"Cloning of one primary user voice using Deal Scale's proprietary AI",
// 					"Unlimited usage of your cloned voice with all your AI Virtual Agents",
// 					"Deal Scale's advanced technology ensures natural, high-fidelity sound",
// 					"Dedicated premium support for voice sample optimization and setup",
// 					"Secure, in-house management of your voice data and cloned identity",
// 				],
// 			},
// 		},
// 		highlighted: true,
// 		buttonText: "Unlock with Premium",
// 	},
// ];
// export const aiSocialMediaOutreachPricingPlans: Plan[] = [
// 	{
// 		id: "social-outreach-ai-credits",
// 		name: "AI Social Outreach Module",
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"Actions are paid for using your universal AI credit balance.",
// 				features: [
// 					"Connect up to 3 social media profiles (LinkedIn, Facebook, Instagram)",
// 					"Automated personalized connection request: 1 AI Credit per request",
// 					"AI-generated initial message: 1 AI Credit per message",
// 					"AI-assisted engagement tracking and lead flagging: 1 AI Credit per tracked engagement",
// 					"Performance analytics dashboard included",
// 					"Credits are purchased from your main dashboard",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		highlighted: true,
// 		buttonText: "Add AI Credits",
// 	},
// ];

// export const aiTextMessageOutreachPricingPlans: Plan[] = [
// 	{
// 		id: "ai-sms-outreach-credits",
// 		name: "AI SMS Outreach (Pay-Per-Action)",
// 		highlighted: true,
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description: "Consumed from your universal AI credit balance.",
// 				features: [
// 					"Send AI-Powered SMS: 1 AI Credits per segment",
// 					"AI-powered two-way SMS conversations: 1 AI Credits per inbound/outbound message",
// 					"AI-assisted SMS campaign builder included",
// 					"Personalization tokens & dynamic content",
// 					"Automated compliant sending (TCPA, opt-out management)",
// 					"Lead qualification and intent recognition",
// 					"Analytics and reporting dashboard",
// 					"Dedicated phone number (optional, additional fee)",
// 					"Credits are purchased from your main dashboard",
// 				],
// 			},
// 			monthly: { amount: 0, description: "", features: [] },
// 			annual: { amount: 0, description: "", features: [] },
// 		},
// 		buttonText: "Add AI Credits",
// 	},
// ];

// export const embeddableAIChatbotPricingPlans: Plan[] = [
// 	{
// 		id: "ai-chatbot-plus",
// 		name: "AI Website Chatbot Plus",
// 		price: {
// 			oneTime: { amount: 0, description: "Not available.", features: [] },
// 			monthly: {
// 				amount: 199, // Example pricing as an add-on or part of a higher tier
// 				description:
// 					"Per month, per website. Includes a set number of AI conversations and qualified lead captures.",
// 				features: [
// 					"Embeddable on one website",
// 					"Customizable branding & greeting",
// 					"Configurable pre-qualification scripts",
// 					"AI-powered natural language understanding",
// 					"Automated lead data sync to Deal Scale CRM",
// 					"Calendar integration for direct appointment booking",
// 					"Live agent notification/transfer option",
// 				],
// 			},
// 			annual: {
// 				amount: 2150, // Example: 199 * 12 * 0.9 (approx 10% discount)
// 				description:
// 					"Annual subscription for continuous 24/7 AI lead capture and qualification on your website.",
// 				features: [
// 					"Embeddable on one website",
// 					"Customizable branding & greeting",
// 					"Configurable pre-qualification scripts",
// 					"AI-powered natural language understanding",
// 					"Automated lead data sync to Deal Scale CRM",
// 					"Calendar integration for direct appointment booking",
// 					"Live agent notification/transfer option",
// 				],
// 			},
// 		},
// 		highlighted: false, // Could be true if it's a popular add-on
// 		buttonText: "Add AI Chatbot",
// 	},
// ];

// export const aiOutboundQualificationPricingPlans: Plan[] = [
// 	{
// 		id: "ai-outbound-qualifier-pro",
// 		name: "AI Outbound Qualifier Pro",
// 		price: {
// 			oneTime: { amount: 0, description: "Not available.", features: [] },
// 			monthly: {
// 				amount: 499, // Example pricing
// 				description:
// 					"Per month. Includes a set number of outbound AI call minutes, SMS segments, and successful qualifications/bookings.",
// 				features: [
// 					"AI-powered outbound voice calls & SMS campaigns",
// 					"Customizable qualification scripts & logic",
// 					"Intelligent conversational AI for pre-qualification",
// 					"Automated calendar scheduling integration",
// 					"Live hot-transfer capability to sales agents",
// 					"CRM synchronization of all activities",
// 					"Performance analytics and reporting",
// 				],
// 			},
// 			annual: {
// 				amount: 5380, // Example: 499 * 12 * 0.9 (approx 10% discount)
// 				description:
// 					"Yearly plan for continuous AI-driven outbound lead qualification and sales pipeline generation.",
// 				features: [
// 					"AI-powered outbound voice calls & SMS campaigns",
// 					"Customizable qualification scripts & logic",
// 					"Intelligent conversational AI for pre-qualification",
// 					"Automated calendar scheduling integration",
// 					"Live hot-transfer capability to sales agents",
// 					"CRM synchronization of all activities",
// 					"Performance analytics and reporting",
// 				],
// 			},
// 		},
// 		highlighted: true,
// 		buttonText: "Activate AI Outbound Agent",
// 	},
// ];
// export const aiDirectMailPricing: Plan[] = [
// 	{
// 		id: "ai-direct-mail-usage-plan",
// 		name: "All-Inclusive Usage-Based Plan",
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"Simple, transparent pricing. Pay a flat rate per mail piece fulfilled by our network, and use flexible AI Credits to power the intelligence.",
// 				features: [
// 					"4x6 Postcard (First Class): $0.85 / piece",
// 					"Personalized Letter (First Class): $1.15 / piece",
// 					"AI Mailer Personalization: 1 Credit",
// 					"AI Inbound Lead Engagement: 5 Credits",
// 					"Premium Skip Trace: 1 Skip Trace Credit",
// 				],
// 			},
// 			monthly: { amount: 0, description: "Not Applicable", features: [] },
// 			annual: { amount: 0, description: "Not Applicable", features: [] },
// 		},
// 		highlighted: true,
// 		buttonText: "Purchase AI Credits",
// 	},
// ];

// export const aiInboundPricingPlans: Plan[] = [
// 	{
// 		id: "ai-inbound-call-plan",
// 		name: "Usage-Based Inbound AI",
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"Simple, transparent pricing. Pay a flat monthly rate for your dedicated phone number, and use flexible AI Credits to power the conversations.",
// 				features: [
// 					"Dedicated Local Phone Number: $5/month",
// 					"AI Inbound Call Engagement: 2 Credits/minute",
// 					"Call Recording & Transcription: Included",
// 					"CRM & Calendar Integration: Included",
// 					"Credits Never Expire",
// 				],
// 			},
// 			monthly: { amount: 0, description: "Not Applicable", features: [] },
// 			annual: { amount: 0, description: "Not Applicable", features: [] },
// 		},
// 		highlighted: true,
// 		buttonText: "Purchase AI Credits",
// 	},
// ];

// export const aiSocialMediaPricing: Plan[] = [
// 	{
// 		id: "ai-social-media-plan",
// 		name: "Usage-Based Social AI",
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"Simple, predictable pricing. Use flexible AI Credits to engage and qualify leads from your social media channels.",
// 				features: [
// 					"AI Conversation Start: 3 Credits/lead",
// 					"Unlimited Messages per Conversation",
// 					"Facebook & Instagram Pages: Included",
// 					"CRM & Calendar Integration: Included",
// 					"Credits Never Expire",
// 				],
// 			},
// 			monthly: { amount: 0, description: "Not Applicable", features: [] },
// 			annual: { amount: 0, description: "Not Applicable", features: [] },
// 		},
// 		highlighted: true,
// 		buttonText: "Purchase AI Credits",
// 	},
// ];

// export const aiTextMessagePricing: Plan[] = [
// 	{
// 		id: "ai-text-message-plan",
// 		name: "Usage-Based Text AI",
// 		price: {
// 			oneTime: {
// 				amount: 0,
// 				description:
// 					"Simple, pay-as-you-go pricing. Pay a low per-message fee via our proprietary network, and use flexible AI Credits to power the conversations.",
// 				features: [
// 					"Outbound SMS/iMessage: ~$0.015 / segment",
// 					"AI Conversation Start: 3 Credits/lead",
// 					"Ongoing AI Replies: Free after start",
// 					"Inbound Messages: Free",
// 					"Credits Never Expire",
// 				],
// 			},
// 			monthly: { amount: 0, description: "Not Applicable", features: [] },
// 			annual: { amount: 0, description: "Not Applicable", features: [] },
// 		},
// 		highlighted: true,
// 		buttonText: "Purchase AI Credits",
// 	},
// ];
// export const rentEstimatorPricing: Plan[] = [
// 	{
// 		id: "rent-estimator-unlimited",
// 		name: "Included with All Plans",
// 		price: {
// 			oneTime: { amount: 0, description: "", features: [] },
// 			monthly: {
// 				amount: 0,
// 				description: "Unlimited use included with all subscriptions",
// 				features: [
// 					"Unlimited Property Lookups",
// 					"Unlimited Rental Comps",
// 					"Local Market & Historical Trends",
// 					"Custom-Branded PDF Reports",
// 					"Portfolio Tracking & Alerts",
// 				],
// 			},
// 			annual: {
// 				amount: 0,
// 				description: "Unlimited use included with all subscriptions",
// 				features: [
// 					"Unlimited Property Lookups",
// 					"Unlimited Rental Comps",
// 					"Local Market & Historical Trends",
// 					"Custom-Branded PDF Reports",
// 					"Portfolio Tracking & Alerts",
// 				],
// 			},
// 		},
// 		highlighted: true,
// 		buttonText: "Included in All Plans",
// 	},
// ];

// export const marketAnalyzerPricing: Plan[] = [
// 	{
// 		id: "market-analyzer-unlimited",
// 		name: "Included with All Plans",
// 		price: {
// 			oneTime: { amount: 0, description: "", features: [] },
// 			monthly: {
// 				amount: 0,
// 				description: "Unlimited use included with all subscriptions",
// 				features: [
// 					"Unlimited Market Reports",
// 					"Detailed Market Statistics",
// 					"Full Historical Rent Trends",
// 					"Market Composition Analysis",
// 					"Custom-Branded PDF Reports",
// 				],
// 			},
// 			annual: {
// 				amount: 0,
// 				description: "Unlimited use included with all subscriptions",
// 				features: [
// 					"Unlimited Market Reports",
// 					"Detailed Market Statistics",
// 					"Full Historical Rent Trends",
// 					"Market Composition Analysis",
// 					"Custom-Branded PDF Reports",
// 				],
// 			},
// 		},
// 		highlighted: true,
// 		buttonText: "Included with Your Plan",
// 	},
// ];

// export const portfolioDashboardPricing: Plan[] = [
// 	{
// 		id: "portfolio-dashboard-included",
// 		name: "Portfolio Dashboard",
// 		price: {
// 			oneTime: { amount: 0, description: "", features: [] },
// 			monthly: {
// 				amount: 0,
// 				description: "Included with Enterprise Plan (up to 500 properties)",
// 				features: [
// 					"Track up to 500 properties",
// 					"5 User Seats",
// 					"Portfolio Dashboard & KPIs",
// 					"Proactive Rent Alerts",
// 					"Custom-Branded Reports",
// 					"Email & Chat Support",
// 				],
// 			},
// 			annual: {
// 				amount: 0,
// 				description: "Included with Enterprise Plan (up to 500 properties)",
// 				features: [
// 					"Track up to 500 properties",
// 					"5 User Seats",
// 					"Portfolio Dashboard & KPIs",
// 					"Proactive Rent Alerts",
// 					"Custom-Branded Reports",
// 					"Email & Chat Support",
// 				],
// 			},
// 		},
// 		highlighted: true,
// 		buttonText: "Included with Enterprise",
// 	},
// ];
