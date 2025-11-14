import { z } from "zod";

/**
 * Schema for requesting a password reset
 * Validates email for sending reset link
 */
export const requestPasswordResetSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Please enter a valid email address" })
		.max(255, { message: "Email must be less than 255 characters" })
		.transform((val) => val.toLowerCase().trim()),
});

/**
 * Schema for resetting password with token
 * Validates token and new password
 */
export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, { message: "Reset token is required" }),
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
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// TypeScript types
export type RequestPasswordResetValues = z.infer<
	typeof requestPasswordResetSchema
>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// Default values
export const defaultRequestPasswordResetValues: RequestPasswordResetValues = {
	email: "",
};

export const defaultResetPasswordValues: ResetPasswordValues = {
	token: "",
	password: "",
	confirmPassword: "",
};

// Error messages
export const resetPasswordErrorMessages = {
	email: {
		required: "Email is required",
		invalid: "Please enter a valid email address",
		maxLength: "Email must be less than 255 characters",
	},
	token: {
		required: "Reset token is required",
	},
	password: {
		required: "Password is required",
		minLength: "Password must be at least 8 characters",
		maxLength: "Password must be less than 100 characters",
		invalid:
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
	},
	confirmPassword: {
		required: "Please confirm your new password",
		mismatch: "Passwords do not match",
	},
};

// Token validation schema
export const tokenValidationSchema = z.object({
	token: z.string().min(1, { message: "Token is required" }),
	email: z.string().email().min(1, { message: "Email is required" }),
});

export type TokenValidationValues = z.infer<typeof tokenValidationSchema>;
