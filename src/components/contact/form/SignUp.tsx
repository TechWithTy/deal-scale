"use client";

import { useAuthModal } from "@/components/auth/use-auth-store";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	type SignUpFormValues,
	signUpFormFields,
	signUpSchema,
} from "@/data/contact/authFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { fetchUserDisplayName } from "@/lib/auth/user-display-name";
import { createFieldProps, renderFormField } from "./formFieldHelpers";

/**
 * SignUpForm component for user registration.
 * @param callbackUrl Optional URL to redirect to after successful registration/login.
 */
export function SignUpForm({ callbackUrl }: { callbackUrl?: string }) {
	const { onSuccess, close } = useAuthModal();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			first_name: "",
			last_name: "",
			password: "",
			confirm_password: "",
		},
	});

	async function onSubmit(values: SignUpFormValues) {
		setIsLoading(true);
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				const errorData = await res.json();
				const errorMessage =
					errorData?.message ||
					errorData?.detail ||
					"Failed to create account.";

				// Parse field-specific validation errors from DealScale API
				if (errorData?.detail && Array.isArray(errorData.detail)) {
					for (const err of errorData.detail) {
						const fieldPath = err.loc?.join(".") || "";
						const errorMsg = err.msg || err.message || "";

						// Map API field names to form field names
						const fieldMapping: Record<string, keyof SignUpFormValues> = {
							"body.email": "email",
							"body.password": "password",
							"body.confirm_password": "confirm_password",
							"body.first_name": "first_name",
							"body.last_name": "last_name",
						};

						const formField = fieldMapping[fieldPath];
						if (formField) {
							form.setError(formField, {
								type: "server",
								message: errorMsg,
							});
						}
					}
				} else {
					// Show general error as toast
					toast.error(errorMessage);
				}

				throw new Error(errorMessage);
			}

			// Automatically sign in the user after successful registration
			const signInResult = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false,
				...(callbackUrl ? { callbackUrl } : {}),
			});

			if (signInResult?.ok) {
				const fullName = await fetchUserDisplayName();
				toast.success(
					fullName
						? `Welcome ${fullName}! Please check your email & SMS for next steps.`
						: "Account created! Please check your email & SMS for next steps.",
				);
				if (callbackUrl) {
					// Redirect to the callback URL if provided
					window.location.href = callbackUrl;
					return;
				}
				if (onSuccess) {
					onSuccess();
				}
				close();
			} else {
				throw new Error(
					signInResult?.error || "Sign-in failed after registration.",
				);
			}
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			toast.error(errorMessage);
			console.error("Sign-up submission error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{signUpFormFields.map((fieldConfig) => (
					<FormField
						key={fieldConfig.name}
						control={form.control}
						name={fieldConfig.name as keyof SignUpFormValues}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{fieldConfig.label}</FormLabel>
								<FormControl>
									{renderFormField(createFieldProps(fieldConfig, field))}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Creating Account..." : "Sign Up"}
				</Button>
			</form>
		</Form>
	);
}
