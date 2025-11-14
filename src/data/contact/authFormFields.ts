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

export const signUpSchema = z
	.object({
		email: z.string().email({ message: "Please enter a valid email." }),
		first_name: z.string().min(1, { message: "First name is required." }),
		last_name: z.string().min(1, { message: "Last name is required." }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters." }),
		confirm_password: z.string(),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match.",
		path: ["confirm_password"],
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
		name: "first_name",
		label: "First Name",
		type: "text",
		placeholder: "John",
	},
	{
		name: "last_name",
		label: "Last Name",
		type: "text",
		placeholder: "Doe",
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "••••••••",
	},
	{
		name: "confirm_password",
		label: "Confirm Password",
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

// * =====================================================================================
// * Confirm Credentials Form
// * =====================================================================================

export const confirmCredentialsSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters." }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

export type ConfirmCredentialsFormValues = z.infer<
	typeof confirmCredentialsSchema
>;

export const confirmCredentialsFormFields: FieldConfig[] = [
	{
		name: "password",
		label: "New Password",
		type: "password",
		placeholder: "••••••••",
	},
	{
		name: "confirmPassword",
		label: "Confirm New Password",
		type: "password",
		placeholder: "••••••••",
	},
];

// * =====================================================================================
// * Phone Login Form
// * =====================================================================================

export const phoneLoginSchema = z.object({
	phone_number: z.string().min(1, { message: "Phone number is required." }),
});

export type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;

export const phoneLoginFormFields: FieldConfig[] = [
	{
		name: "phone_number",
		label: "Phone Number",
		type: "tel",
		placeholder: "+1 (555) 000-0000",
	},
];

// * =====================================================================================
// * Phone OTP Verification Form
// * =====================================================================================

export const phoneOtpSchema = z.object({
	phone_number: z.string().min(1, { message: "Phone number is required." }),
	otp_code: z.string().min(1, { message: "OTP code is required." }),
});

export type PhoneOtpFormValues = z.infer<typeof phoneOtpSchema>;

export const phoneOtpFormFields: FieldConfig[] = [
	{
		name: "otp_code",
		label: "OTP Code",
		type: "text",
		placeholder: "123456",
	},
];
