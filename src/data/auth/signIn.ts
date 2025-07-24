import { z } from "zod";

/**
 * Schema for user sign-in
 * Validates email and password fields
 */
export const signInSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Please enter a valid email address" })
		.max(255, { message: "Email must be less than 255 characters" })
		.transform((val) => val.toLowerCase().trim()),

	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(100, { message: "Password must be less than 100 characters" })
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]).{8,}$/,
			{
				message:
					"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
			},
		),

	// Optional remember me flag
	rememberMe: z.boolean().optional().default(false),
});

// TypeScript type for the sign-in form values
export type SignInFormValues = z.infer<typeof signInSchema>;

// Default values for the sign-in form
export const defaultSignInValues: SignInFormValues = {
	email: "",
	password: "",
	rememberMe: false,
};

// Error messages for sign-in form
export const signInErrorMessages = {
	email: {
		required: "Email is required",
		invalid: "Please enter a valid email address",
		maxLength: "Email must be less than 255 characters",
	},
	password: {
		required: "Password is required",
		minLength: "Password must be at least 8 characters",
		maxLength: "Password must be less than 100 characters",
		invalid:
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
	},
};
