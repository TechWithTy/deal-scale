import { z } from "zod";

export const closerFormSchema = z.object({
	firstName: z.string().min(2, { message: "First name is required." }),
	lastName: z.string().min(2, { message: "Last name is required." }),
	email: z.string().email({ message: "A valid email is required." }),
	phone: z.string().min(10, { message: "A valid phone number is required." }),
	realEstateLicense: z
		.string()
		.min(1, { message: "Real estate license number is required." }),
	licenseState: z
		.string()
		.min(2, { message: "License state is required." }),
	yearsExperience: z
		.string()
		.min(1, { message: "Please specify years of experience." }),
	dealsClosed: z
		.string()
		.min(1, { message: "Please specify number of deals closed." }),
	availability: z
		.string()
		.min(1, { message: "Please specify your availability." }),
	whyApply: z
		.string()
		.min(50, {
			message: "Please provide at least 50 characters explaining why you want to become a closer.",
		}),
	portfolioUrl: z.string().url().optional().or(z.literal("")),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and conditions.",
	}),
});

export type CloserFormValues = z.infer<typeof closerFormSchema>;

export const closerFormFields: Array<{
	name: keyof CloserFormValues;
	label: string;
	type: "text" | "email" | "tel" | "url" | "textarea" | "select" | "checkbox";
	placeholder?: string;
	options?: Array<{ value: string; label: string }>;
	required?: boolean;
}> = [
	{
		name: "firstName",
		label: "First Name",
		type: "text",
		placeholder: "John",
		required: true,
	},
	{
		name: "lastName",
		label: "Last Name",
		type: "text",
		placeholder: "Doe",
		required: true,
	},
	{
		name: "email",
		label: "Email",
		type: "email",
		placeholder: "john.doe@example.com",
		required: true,
	},
	{
		name: "phone",
		label: "Phone Number",
		type: "tel",
		placeholder: "+1 (555) 123-4567",
		required: true,
	},
	{
		name: "realEstateLicense",
		label: "Real Estate License Number",
		type: "text",
		placeholder: "RE-12345",
		required: true,
	},
	{
		name: "licenseState",
		label: "License State",
		type: "select",
		options: [
			{ value: "AL", label: "Alabama" },
			{ value: "AK", label: "Alaska" },
			{ value: "AZ", label: "Arizona" },
			{ value: "AR", label: "Arkansas" },
			{ value: "CA", label: "California" },
			{ value: "CO", label: "Colorado" },
			{ value: "CT", label: "Connecticut" },
			{ value: "DE", label: "Delaware" },
			{ value: "FL", label: "Florida" },
			{ value: "GA", label: "Georgia" },
			{ value: "HI", label: "Hawaii" },
			{ value: "ID", label: "Idaho" },
			{ value: "IL", label: "Illinois" },
			{ value: "IN", label: "Indiana" },
			{ value: "IA", label: "Iowa" },
			{ value: "KS", label: "Kansas" },
			{ value: "KY", label: "Kentucky" },
			{ value: "LA", label: "Louisiana" },
			{ value: "ME", label: "Maine" },
			{ value: "MD", label: "Maryland" },
			{ value: "MA", label: "Massachusetts" },
			{ value: "MI", label: "Michigan" },
			{ value: "MN", label: "Minnesota" },
			{ value: "MS", label: "Mississippi" },
			{ value: "MO", label: "Missouri" },
			{ value: "MT", label: "Montana" },
			{ value: "NE", label: "Nebraska" },
			{ value: "NV", label: "Nevada" },
			{ value: "NH", label: "New Hampshire" },
			{ value: "NJ", label: "New Jersey" },
			{ value: "NM", label: "New Mexico" },
			{ value: "NY", label: "New York" },
			{ value: "NC", label: "North Carolina" },
			{ value: "ND", label: "North Dakota" },
			{ value: "OH", label: "Ohio" },
			{ value: "OK", label: "Oklahoma" },
			{ value: "OR", label: "Oregon" },
			{ value: "PA", label: "Pennsylvania" },
			{ value: "RI", label: "Rhode Island" },
			{ value: "SC", label: "South Carolina" },
			{ value: "SD", label: "South Dakota" },
			{ value: "TN", label: "Tennessee" },
			{ value: "TX", label: "Texas" },
			{ value: "UT", label: "Utah" },
			{ value: "VT", label: "Vermont" },
			{ value: "VA", label: "Virginia" },
			{ value: "WA", label: "Washington" },
			{ value: "WV", label: "West Virginia" },
			{ value: "WI", label: "Wisconsin" },
			{ value: "WY", label: "Wyoming" },
		],
		required: true,
	},
	{
		name: "yearsExperience",
		label: "Years of Real Estate Experience",
		type: "select",
		options: [
			{ value: "0-1", label: "0-1 years" },
			{ value: "2-3", label: "2-3 years" },
			{ value: "4-5", label: "4-5 years" },
			{ value: "6-10", label: "6-10 years" },
			{ value: "10+", label: "10+ years" },
		],
		required: true,
	},
	{
		name: "dealsClosed",
		label: "Number of Deals Closed",
		type: "select",
		options: [
			{ value: "0-10", label: "0-10 deals" },
			{ value: "11-25", label: "11-25 deals" },
			{ value: "26-50", label: "26-50 deals" },
			{ value: "51-100", label: "51-100 deals" },
			{ value: "100+", label: "100+ deals" },
		],
		required: true,
	},
	{
		name: "availability",
		label: "Availability",
		type: "select",
		options: [
			{ value: "full-time", label: "Full-time (40+ hours/week)" },
			{ value: "part-time", label: "Part-time (20-39 hours/week)" },
			{ value: "flexible", label: "Flexible/As needed" },
		],
		required: true,
	},
	{
		name: "portfolioUrl",
		label: "Portfolio/Website URL (Optional)",
		type: "url",
		placeholder: "https://yourportfolio.com",
		required: false,
	},
	{
		name: "whyApply",
		label: "Why do you want to become a Remote Closer?",
		type: "textarea",
		placeholder:
			"Tell us about your experience, what makes you a great closer, and why you're interested in remote closing services...",
		required: true,
	},
	{
		name: "termsAccepted",
		label: "I accept the terms and conditions",
		type: "checkbox",
		required: true,
	},
];


