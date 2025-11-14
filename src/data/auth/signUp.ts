import { z } from "zod";

// Common validation patterns
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
const nameRegex = /^[a-zA-Z\s'-]+$/; // Allows letters, spaces, hyphens, and apostrophes

/**
 * Schema for user sign-up
 * Validates email, password, and additional user details
 */
export const signUpSchema = z
	.object({
		firstName: z
			.string()
			.min(2, { message: "First name must be at least 2 characters" })
			.max(50, { message: "First name must be less than 50 characters" })
			.regex(nameRegex, {
				message:
					"First name can only contain letters, spaces, hyphens, and apostrophes",
			})
			.transform((val) => val.trim()),

		lastName: z
			.string()
			.min(2, { message: "Last name must be at least 2 characters" })
			.max(50, { message: "Last name must be less than 50 characters" })
			.regex(nameRegex, {
				message:
					"Last name can only contain letters, spaces, hyphens, and apostrophes",
			})
			.transform((val) => val.trim()),

		email: z
			.string()
			.min(1, { message: "Email is required" })
			.email({ message: "Please enter a valid email address" })
			.max(255, { message: "Email must be less than 255 characters" })
			.transform((val) => val.toLowerCase().trim()),

		phone: z
			.string()
			.min(1, { message: "Phone number is required" })
			.regex(phoneRegex, {
				message:
					"Please enter a valid phone number with country code (e.g., +1234567890)",
			})
			.transform((val) => {
				// Ensure phone number starts with + and has country code
				if (!val.startsWith("+")) {
					return `+1${val.replace(/\D/g, "")}`; // Default to +1 if no country code
				}
				return val;
			}),

		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.max(100, { message: "Password must be less than 100 characters" })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/,
				{
					message:
						"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				},
			),

		confirmPassword: z.string(),

		termsAccepted: z.boolean().refine((val) => val === true, {
			message: "You must accept the terms and conditions",
		}),

		marketingEmails: z.boolean().optional().default(false),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// TypeScript type for the sign-up form values
export type SignUpFormValues = z.infer<typeof signUpSchema>;

// Default values for the sign-up form
export const defaultSignUpValues: SignUpFormValues = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	password: "",
	confirmPassword: "",
	termsAccepted: false,
	marketingEmails: false,
};

// Error messages for sign-up form
export const signUpErrorMessages = {
	firstName: {
		required: "First name is required",
		minLength: "First name must be at least 2 characters",
		maxLength: "First name must be less than 50 characters",
		invalid:
			"First name can only contain letters, spaces, hyphens, and apostrophes",
	},
	lastName: {
		required: "Last name is required",
		minLength: "Last name must be at least 2 characters",
		maxLength: "Last name must be less than 50 characters",
		invalid:
			"Last name can only contain letters, spaces, hyphens, and apostrophes",
	},
	email: {
		required: "Email is required",
		invalid: "Please enter a valid email address",
		maxLength: "Email must be less than 255 characters",
	},
	phone: {
		required: "Phone number is required",
		invalid:
			"Please enter a valid phone number with country code (e.g., +1234567890)",
	},
	password: {
		required: "Password is required",
		minLength: "Password must be at least 8 characters",
		maxLength: "Password must be less than 100 characters",
		invalid:
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
	},
	confirmPassword: {
		required: "Please confirm your password",
		mismatch: "Passwords do not match",
	},
	termsAccepted: {
		required: "You must accept the terms and conditions",
	},
};
