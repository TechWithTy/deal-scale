import mockFeatures from "@/data/features"; // * Import upcoming features for voting
import { getAllServices } from "@/data/service/services";
import type { FieldConfig } from "@/types/contact/formFields";
import { z } from "zod";

export type ContactFormOption = {
	value: string;
	label: string;
	description?: string;
	link?: string;
};

// Options based on the Deal Scale pitch deck and common real estate investor needs
export const icpTypeOptions: ContactFormOption[] = [
	{ value: "growth_focused_wholesaler", label: "Growth-Focused Wholesaler" },
	{
		value: "systematizing_flipper_investor",
		label: "The Systematizing Flipper/Investor",
	},
	{
		value: "savvy_cre_dealmaker",
		label: "The Savvy CRE Dealmaker (Future Target)",
	},
	{
		value: "scaling_real_estate_agent",
		label: "Scaling Real Estate Agent",
	},
];

export const employeeCountOptions: ContactFormOption[] = [
	{ value: "1", label: "Just Me" },
	{ value: "2_5", label: "2-5" },
	{ value: "6_10", label: "6-10" },
	{ value: "11_25", label: "11-25" },
	{ value: "26_50", label: "26-50" },
	{ value: "51_plus", label: "51+" },
];

export const avgDealsClosedPerMonthOptions: ContactFormOption[] = [
	{ value: "0_1", label: "0-1" },
	{ value: "2_3", label: "2-3" },
	{ value: "4_5", label: "4-5" },
	{ value: "6_10", label: "6-10" },
	{ value: "11_plus", label: "11+" },
];

export const featureOptions: ContactFormOption[] = getAllServices().map(
	(svc) => ({
		value: svc.slugDetails.slug,
		label: svc.title,
		description: svc.description,
		link: `/services/${svc.slugDetails.slug}`,
	}),
);

// * Upcoming features for voting (generated from mockFeatures)
export const upcomingFeatureOptions: ContactFormOption[] = mockFeatures.map(
	(f) => ({
		value: f.id,
		label: f.title,
		description: f.description,
	}),
);

export const painPointOptions: ContactFormOption[] = [
	{
		value: "inconsistent_deal_flow",
		label: "Inconsistent or unreliable deal flow",
	},
	{
		value: "too_much_time_prospecting",
		label: "Spending too much time on manual prospecting",
	},
	{ value: "leads_go_cold", label: "Leads go cold due to slow follow-up" },
	{
		value: "low_conversion_rate",
		label: "Low conversion rate from lead to appointment",
	},
	{
		value: "difficulty_scaling",
		label: "Difficulty scaling my business operations",
	},
	{
		value: "high_lead_generation_costs",
		label:
			"High lookalike audience expansion (relationship-first marketing) costs",
	},
	{
		value: "missing_off_market_deals",
		label: "Missing out on lookalike off-market deals and similarity features",
	},
];

export const urgencyNeedOptions: ContactFormOption[] = [
	{ value: "asap", label: "I need something ASAP" },
	{ value: "actively_exploring", label: "I'm actively exploring" },
	{ value: "curious_not_ready", label: "I'm curious but not ready" },
	{ value: "comparing_options", label: "Just comparing options" },
	{ value: "just_browsing", label: "Just browsing" },
];

export const betaTesterFormSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z
		.string()
		.email({ message: "Please enter a valid email address" })
		.optional(),
	phone: z.string().optional(),
	companyName: z
		.string()
		.min(2, { message: "Company name must be at least 2 characters" }),
	companyLogo: z.instanceof(File).optional(),
	zipCode: z.string().min(5, { message: "A valid ZIP code is required." }),
	icpType: z.string().min(1, { message: "Please select your profile type" }),
	employeeCount: z
		.string()
		.min(1, { message: "Please select the number of employees" }),
	avgDealsClosedPerMonth: z
		.string()
		.min(1, { message: "Please select your average deals closed per month" }),
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
	wantedFeatures: z.array(z.string()).nonempty({
		message: "Please select at least one feature you're interested in.",
	}),
	painPoints: z
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
	dealDocuments: z.array(z.instanceof(File)).optional(),
	newsletterSignup: z.boolean().optional(),
	affiliateSignup: z.boolean().optional(),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and conditions",
	}),
});

export type BetaTesterFormValues = z.infer<typeof betaTesterFormSchema>;

export const betaTesterFormFields: FieldConfig[] = [
	{
		name: "companyName",
		label: "Company Name",
		type: "text",
		placeholder: "Acme Real Estate Inc.",
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
		pattern: "^\\d{5}$",
		minLength: 5,
		maxLength: 5,
	},
	{
		name: "icpType",
		label: "What best describes you?",
		type: "select",
		placeholder: "Select your profile",
		options: icpTypeOptions,
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "employeeCount",
		label: "Team Size",
		type: "select",
		placeholder: "Select your team size",
		options: employeeCountOptions,
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "avgDealsClosedPerMonth",
		label: "Avg Deals Closed Per Month",
		type: "select",
		placeholder: "Select average deals per month",
		options: avgDealsClosedPerMonthOptions,
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
		name: "painPoints",
		label:
			"What frustrates you the most about follow-up? (Select all that apply)",
		type: "multiselect", // Assuming a component that handles multi-select
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
		label: "Vote On Upcoming on upcoming features (Select all that excite you)",
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
		name: "dealDocuments",
		label:
			"Priority Access: Optional: Upload proof of your last 3 deals (HUDs, etc.)",
		type: "file",
		accept: ".pdf,.docx,",
		multiple: true,
		value: [],
		onChange: (value: File[]) => {},
	},
	{
		name: "newsletterSignup",
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
