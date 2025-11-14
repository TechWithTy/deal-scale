import type { FieldConfig } from "@/types/contact/formFields";
import { z } from "zod";

// --- Option Sets for Selects ---
const accountTypeOptions = [
	{ value: "checking", label: "Checking" },
	{ value: "savings", label: "Savings" },
];

// --- Zod Schema Definition ---
// ! Sensitive fields: Routing and Account Number must be handled securely on backend (never log, encrypt at rest)
export const affiliateFormSchema = z.object({
	// Section 1: Contact Info (pulled from user account)

	// * Network size question added for affiliate reach
	// * Network size as single select for optimal ranges
	networkSize: z.enum(
		["1-100", "101-1,000", "1,001-10,000", "10,001-100,000", "100,001+"],
		{
			required_error: "Please select your network size.",
		},
	),

	// Section 2: Social Handles
	social: z.string().min(2, { message: "Social handle is required." }),

	website: z.string().optional(),

	// Section 3: Direct Deposit (Sensitive)
	bankName: z.string().min(2, { message: "Bank name is required." }),
	routingNumber: z
		.string()
		.min(9, { message: "Routing number must be 9 digits." })
		.regex(/^\d{9}$/, { message: "Routing number must be 9 digits." }),
	accountNumber: z
		.string()
		.min(4, { message: "Account number is required." })
		.max(17, { message: "Account number too long." }),
	accountType: z.enum(["checking", "savings"], {
		required_error: "Please select account type.",
	}),
	w9: z.any().optional(), // File upload, validate on backend

	// Section 4: Agreement & Consent
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "You must accept the Affiliate Terms.",
	}),
	infoAccurate: z.boolean().refine((val) => val === true, {
		message: "You must confirm your information is accurate.",
	}),

	// Section 5: Newsletter/Beta Signup
	newsletterBeta: z.boolean().optional(),

	// Section 6: Real Estate Experience
	hasRealEstateExperience: z.enum(["yes", "no", "indirect"], {
		required_error: "Please indicate your real estate experience.",
	}),
});

export type AffiliateFormValues = z.infer<typeof affiliateFormSchema>;

// --- Form Field Configuration ---
export const affiliateFormFields: FieldConfig[] = [
	// --- Section 1: Contact Info (pulled from user account) ---

	// --- Section 6: Real Estate Experience ---
	{
		name: "hasRealEstateExperience",
		label: "Do you have direct real estate experience?",
		type: "select",
		options: [
			{ value: "yes", label: "Yes" },
			{ value: "no", label: "No" },
			{ value: "indirect", label: "Indirect (e.g. tech, finance, marketing)" },
		],
		value: "",
		onChange: (value: string) => {},
	},
	// * Network size field for affiliate reach
	// * Network size single select for optimal ranges
	{
		name: "networkSize",
		label: "What is the approximate size of your network?",
		type: "select",
		options: [
			{ value: "1-100", label: "1-100" },
			{ value: "101-1,000", label: "101-1,000" },
			{ value: "1,001-10,000", label: "1,001-10,000" },
			{ value: "10,001-100,000", label: "10,001-100,000" },
			{ value: "100,001+", label: "100,001+" },
		],
		value: "",
		onChange: (value: string) => {},
	},
	// --- Section 2: Social Handles ---
	{
		name: "social",
		label: "Social Handle or URL (required)",
		type: "text",
		placeholder: "@yourhandle or https://social.com/yourprofile",
		value: "",

		onChange: (value: string) => {},
	},
	{
		name: "website",
		label: "Website (optional)",
		type: "url",
		placeholder: "https://yourwebsite.com",
		value: "",
		onChange: (value: string) => {},
	},
	// --- Section 3: Direct Deposit ---
	{
		name: "bankName",
		label: "Bank Name",
		type: "text",
		placeholder: "Bank of America",
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "routingNumber",
		label: "Routing Number",
		type: "text",
		placeholder: "XXXXXXXXX",
		sensitive: true,
		value: "",
		onChange: (value: string) => {},
		// ! Mask input on frontend, never display full value after entry
	},
	{
		name: "accountNumber",
		label: "Account Number",
		type: "text",
		placeholder: "**********",
		sensitive: true,
		value: "",
		onChange: (value: string) => {},
		// ! Mask input on frontend, never display full value after entry
	},
	{
		name: "accountType",
		label: "Account Type",
		type: "select",
		options: accountTypeOptions,
		value: "",
		onChange: (value: string) => {},
	},
	{
		name: "w9",
		label: "W-9 Form (PDF) - Higher Likelyhood of Approval",
		type: "file",
		accept: ".pdf",
		multiple: false,
		value: [],
		onChange: (value: File[]) => {},
	},
	// --- Section 4: Agreement & Consent ---
	{
		name: "termsAccepted",
		label:
			"I agree to the Affiliate Terms & authorize Deal Scale to process payments to this account.",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
	{
		name: "infoAccurate",
		label: "I confirm the information provided is accurate.",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
	// --- Section 5: Newsletter/Beta Signup ---
	{
		name: "newsletterBeta",
		label: "Sign me up for the Deal Scale newsletter and beta testing program.",
		type: "checkbox",
		value: false,
		onChange: (checked: boolean) => {},
	},
];
