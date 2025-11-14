import type { FieldConfig } from "@/types/contact/formFields";
import { z } from "zod";

// * =====================================================================================
// * Sign In Form
// * =====================================================================================

export const signInSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email." }),
	password: z.string().min(1, { message: "Password is required." }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signInFormFields: FieldConfig[] = [
	{
		name: "email",
		label: "Email",
		type: "email",
		placeholder: "name@example.com",
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "••••••••",
	},
];

// * =====================================================================================
// * Sign Up Form
// * =====================================================================================

export const signUpSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email." }),
	phone: z.string().optional(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." }),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const signUpFormFields: FieldConfig[] = [
	{
		name: "email",
		label: "Email",
		type: "email",
		placeholder: "name@example.com",
	},
	{
		name: "phone",
		label: "Phone (Optional)",
		type: "tel",
		placeholder: "+1 (555) 000-0000",
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "••••••••",
	},
];

// * =====================================================================================
// * Reset Password Form
// * =====================================================================================

export const resetPasswordSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email." }),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const resetPasswordFormFields: FieldConfig[] = [
	{
		name: "email",
		label: "Email",
		type: "email",
		placeholder: "name@example.com",
	},
];
