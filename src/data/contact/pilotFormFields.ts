import type { FieldConfig } from "@/types/contact/formFields"; // Assuming this type definition
import { z } from "zod";
import {
	featureOptions,
	painPointOptions,
	upcomingFeatureOptions,
} from "./formFields";

// --- Option Sets for Detailed Questions ---

const icpTypeOptions = [
	{ value: "growth_focused_wholesaler", label: "Growth-Focused Wholesaler" },
	{
		value: "systematizing_flipper_investor",
		label: "The Systematizing Flipper/Investor",
	},
	{ value: "savvy_cre_dealmaker", label: "The Savvy CRE Dealmaker" },
];

const teamSizeAcquisitionsOptions = [
	{ value: "1", label: "Just Me" },
	{ value: "2-3", label: "2-3 people" },
	{ value: "4-5", label: "4-5 people" },
	{ value: "6_plus", label: "6+ people" },
];

const primaryDealSourceOptions = [
	{ value: "mls_agents", label: "MLS / Real Estate Agents" },
	{ value: "wholesalers", label: "Wholesalers" },
	{ value: "direct_mail", label: "Direct Mail" },
	{ value: "cold_calling_sms", label: "Cold Calling / SMS" },
	{ value: "ppc_social_media", label: "PPC / Social Media Ads" },
	{ value: "referrals_network", label: "Referrals / Networking" },
];

const currentCrmOptions = [
	{ value: "podio", label: "Podio" },
	{ value: "salesforce", label: "Salesforce" },
	{ value: "investor_fuse", label: "InvestorFuse" },
	{ value: "batchleads", label: "BatchLeads" },
	{ value: "generic_crm", label: "A Generic CRM (e.g., HubSpot, Zoho)" },
	{ value: "spreadsheet", label: "Spreadsheet / Google Sheets" },
	{ value: "none", label: "None / Other" },
];

const urgencyNeedOptions = [
	{ value: "asap", label: "I need something ASAP" },
	{ value: "actively_exploring", label: "I'm actively exploring" },
	{ value: "curious_not_ready", label: "I'm curious but not ready" },
	{ value: "comparing_options", label: "Just comparing options" },
	{ value: "just_browsing", label: "Just browsing" },
];

const interestedFeatureOptions = [
	{
		value: "ai_virtual_agents",
		label: "AI 'Virtual Agents' to handle initial calls and texts",
	},
	{
		value: "automated_lead_nurturing",
		label: "24/7 Automated follow-up and lead nurturing",
	},
	{
		value: "automated_appointment_scheduling",
		label: "Direct-to-calendar, automated appointment booking",
	},
	{
		value: "data_rich_intelligence",
		label: "Access to 140M+ property records for targeting",
	},
	{
		value: "hot_transfers",
		label: "Live 'Hot Transfers' for sales-ready leads",
	},
	{
		value: "lead_prequalification",
		label: "AI-driven pre-qualification of leads",
	},
];

// --- Zod Schema Definition ---

export const priorityPilotFormSchema = z.object({
	// Section 1: Contact & Company Info
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z
		.string()
		.email({ message: "A valid business email is required." })
		.optional(),
	phone: z.string().optional(),
	companyName: z.string().min(2, { message: "Company name is required." }),
	companyLogo: z.instanceof(File).optional(),

	// Section 1.5: Location
	zipCode: z.string().min(5, { message: "A valid ZIP code is required." }),

	// Section 2: In-Depth Business Operations
	icpType: z.string().min(1, { message: "Please select your profile." }),
	teamSizeAcquisitions: z
		.string()
		.min(1, { message: "Please specify your acquisitions team size." }),
	avgDealsClosedPerMonth: z
		.string()
		.min(1, { message: "Please select your average deals closed per month." }),
	avgDealSize: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val || val.trim() === "") return true; // Optional field
				// Remove $ and commas, then check if it's a valid number
				const cleaned = val.replace(/[$,]/g, "");
				const num = Number.parseFloat(cleaned);
				return !Number.isNaN(num) && num >= 0;
			},
			{ message: "Please enter a valid amount in USD" },
		),
	primaryDealSources: z
		.array(z.string())
		.nonempty({ message: "Select at least one primary deal source." }),
	currentCRM: z.string().min(1, {
		message: "Please select your current CRM or lead management tool.",
	}),

	// Section 3: Strategic Goals & Needs
	primaryChallenge: z
		.array(z.string())
		.nonempty({ message: "Please select at least one follow-up frustration." }),
	urgencyNeed: z.string().min(1, {
		message: "Please select how urgent your need is.",
	}),
	uniqueLeadGeneration: z
		.string()
		.min(10, {
			message:
				"Please provide at least 10 characters describing your unique lead generation approach.",
		})
		.max(1000, {
			message: "Please keep your response under 1000 characters.",
		}),
	successMetrics: z.string().min(30, {
		message:
			"Please describe what success would look like in at least 30 characters.",
	}),

	// Section 4: Commitment & Agreement
	feedbackCommitment: z.boolean().refine((val) => val === true, {
		message: "You must agree to provide feedback.",
	}),
	paymentAgreement: z.boolean().refine((val) => val === true, {
		message: "You must acknowledge the payment step.",
	}),
	affiliateSignup: z.boolean().optional(),
});

export type PriorityPilotFormValues = z.infer<typeof priorityPilotFormSchema>;

// --- Form Field Configuration ---

export const priorityPilotFormFields: FieldConfig[] = [
	// --- Section 1: Your Information ---
	{
		name: "companyName",
		label: "Company Name",
		type: "text",
		placeholder: "Apex Real Estate Investors",
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "companyLogo",
		label: "Company Logo (for beta tester slider)",
		type: "file",
		accept: ".png,.jpg,.jpeg,.svg",
		multiple: false,
		value: [],
		onChange: (value: File[]) => {},
	},
	{
		name: "zipCode",
		label: "Zip Code",
		type: "text",
		placeholder: "12345",
		value: "",
		onChange: (value: string) => {},
	},

	// --- Section 2: Your Business Operations ---
	{
		name: "icpType",
		label: "Which Profile Best Describes Your Operation?",
		type: "select",
		placeholder: "Select your profile",
		options: icpTypeOptions,
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "teamSizeAcquisitions",
		label: "How many people on your team focus on acquisitions?",
		type: "select",
		placeholder: "Select team size",
		options: teamSizeAcquisitionsOptions,
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "avgDealsClosedPerMonth",
		label: "Avg Deals Closed Per Month",
		type: "select",
		placeholder: "Select average deals per month",
		options: [
			{ value: "0-1", label: "0-1" },
			{ value: "2-3", label: "2-3" },
			{ value: "4-5", label: "4-5" },
			{ value: "6-10", label: "6-10" },
			{ value: "11+", label: "11+" },
		],
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "avgDealSize",
		label: "Average Deal Size (USD)",
		type: "number",
		placeholder: "$50,000",
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "primaryDealSources",
		label:
			"What are your current primary sources for deals? (Select all that apply)",
		type: "multiselect",
		placeholder: "Select sources",
		options: primaryDealSourceOptions,
		value: [],
		onChange: (value: string[]) => {},
	},
	{
		name: "currentCRM",
		label: "What do you currently use to manage leads and follow-ups?",
		type: "select",
		placeholder: "Select your CRM",
		options: currentCrmOptions,
		value: "",
		onChange: (value: string) => {},
	},

	// --- Section 3: Your Strategic Goals ---
	{
		name: "primaryChallenge",
		label:
			"What frustrates you the most about follow-up? (Select all that apply)",
		type: "multiselect", // Now matches schema
		placeholder: "Select what frustrates you most",
		options: painPointOptions,
		value: [],
		onChange: (value: string[]) => {},
	},
	{
		name: "wantedFeatures",
		label: "Which features are you most interested in? (Select all that apply)",
		type: "multiselect", // Assuming a component that handles multi-select
		placeholder: "Select features",
		options: featureOptions,
		value: [],
		onChange: (value: string[]) => {},
	},

	{
		name: "featureVotes",
		label:
			"Vote On Upcoming Features on upcoming features (Select all that excite you)",
		type: "multiselect", // * Custom multi-select for feature voting
		options: upcomingFeatureOptions,
		value: [], // * Initial value required by MultiselectField type
		// description: "Help us prioritize what to build next!", // ! Removed due to type error
		onChange(value: string[]) {
			// * Handle feature vote selection
		},
	},
	{
		name: "urgencyNeed",
		label: "How urgent is your need for a system like this?",
		type: "select",
		placeholder: "Select your urgency level",
		options: urgencyNeedOptions,
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "uniqueLeadGeneration",
		label:
			"Is there anything unique about how you generate or contact leads that we should know to support you properly?",
		type: "textarea",
		placeholder:
			"Please describe your unique lead generation or contact methods...",
		value: "",
		onChange: (value: string) => {},
		minLength: 10,
		maxLength: 1000,
	},
	{
		name: "successMetrics",
		label:
			"What would a 'huge win' look like after 3 months of using Deal Scale?",
		type: "textarea",
		placeholder:
			"e.g., 'If we could get 5-10 qualified appointments scheduled on our calendar each month automatically, that would be a game-changer.'",
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "dealDocuments",
		label:
			"Priority Access: Optional: Upload proof of your last 3 deals (HUDs, etc.)",
		type: "file",
		accept: ".pdf,.docx",
		multiple: true,
		value: [],
		onChange: (value: File[]) => {},
	},

	// --- Section 4: Pilot Program Agreement ---
	{
		name: "feedbackCommitment",
		label:
			"I agree to participate in brief weekly feedback sessions and 1-2 interviews during the pilot program.",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
	{
		name: "paymentAgreement",
		label: "I understand I'll pay $50 to reserve my pilot spot.",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
	{
		name: "newsletter",
		label: "I would like to receive updates and news from Deal Scale.",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
	{
		name: "affiliateSignup",
		label:
			"I'm interested in the affiliate program - Make up to $50,000 per referral",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
	{
		name: "termsAccepted",
		label:
			"I agree to the Terms and Conditions and to participate in the beta testing program.",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
];
