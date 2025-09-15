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

export const dealsClosedOptions: ContactFormOption[] = [
	{ value: "0_5", label: "0-5" },
	{ value: "6_10", label: "6-10" },
	{ value: "11_20", label: "11-20" },
	{ value: "21_50", label: "21-50" },
	{ value: "51_plus", label: "51+" },
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
		label: "High lead generation / marketing costs",
	},
	{
		value: "missing_off_market_deals",
		label: "Missing out on off-market deals",
	},
];

export const betaTesterFormSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: "First name must be at least 2 characters" }),
	lastName: z
		.string()
		.min(2, { message: "Last name must be at least 2 characters" }),
	companyName: z
		.string()
		.min(2, { message: "Company name must be at least 2 characters" }),
	companyLogo: z.instanceof(File).optional(),
	email: z.string().email({ message: "Please enter a valid email address" }),
	phone: z.string().min(10, { message: "A valid phone number is required." }),
	zipCode: z.string().min(5, { message: "A valid ZIP code is required." }),
	icpType: z.string().min(1, { message: "Please select your profile type" }),
	employeeCount: z
		.string()
		.min(1, { message: "Please select the number of employees" }),
	dealsClosedLastYear: z
		.string()
		.min(1, { message: "Please select the number of deals closed" }),
	wantedFeatures: z.array(z.string()).nonempty({
		message: "Please select at least one feature you're interested in.",
	}),
	painPoints: z
		.array(z.string())
		.nonempty({ message: "Please select at least one pain point." }),
	dealDocuments: z.array(z.instanceof(File)).optional(),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and conditions",
	}),
});

export type BetaTesterFormValues = z.infer<typeof betaTesterFormSchema>;

export const betaTesterFormFields: FieldConfig[] = [
	{
		name: "firstName",
		label: "First Name",
		type: "text",
		placeholder: "John",
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "lastName",
		label: "Last Name",
		type: "text",
		placeholder: "Doe",
		value: "",
		onChange: (value: string) => {},
	},
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
		name: "email",
		label: "Business Email",
		type: "email",
		placeholder: "john@acme-re.com",
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "phone",
		label: "Phone Number",
		type: "tel",
		placeholder: "+1 (234) 567-890",
		pattern: "^\\+?1?\\s?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}$",
		value: "",
		onChange: (value: string) => {},
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
		name: "dealsClosedLastYear",
		label: "Deals Closed Last Year",
		type: "select",
		placeholder: "Select number of deals",
		options: dealsClosedOptions,
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "painPoints",
		label: "What are your biggest pain points? (Select all that apply)",
		type: "multiselect", // Assuming a component that handles multi-select
		placeholder: "Select your biggest challenges",
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
		name: "dealDocuments",
		label: "Optional: Upload proof of your last 3 deals (HUDs, etc.)",
		type: "file",
		accept: ".pdf,.docx,",
		multiple: true,
		value: [],
		onChange: (value: File[]) => {},
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
