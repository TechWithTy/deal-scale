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
	type ResetPasswordFormValues,
	resetPasswordFormFields,
	resetPasswordSchema,
} from "@/data/contact/authFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createFieldProps, renderFormField } from "./formFieldHelpers";

/**
 * ForgotPasswordForm component for password reset requests.
 * @param callbackUrl Optional URL to redirect to after successful password reset request.
 */
export function ForgotPasswordForm({ callbackUrl }: { callbackUrl?: string }) {
	const { onSuccess, close } = useAuthModal();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: ResetPasswordFormValues) {
		setIsLoading(true);
		try {
			// todo: Create the /api/auth/reset-password endpoint
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...values,
					...(callbackUrl ? { callbackUrl } : {}),
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Failed to send reset link.");
			}

			toast.success("Password reset link sent!");
			if (callbackUrl) {
				// Redirect to the callback URL if provided
				window.location.href = callbackUrl;
				return;
			}
			if (onSuccess) {
				onSuccess();
			}
			close();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			toast.error(errorMessage);
			console.error("Password reset error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{resetPasswordFormFields.map((fieldConfig) => (
					<FormField
						key={fieldConfig.name}
						control={form.control}
						name={fieldConfig.name as keyof ResetPasswordFormValues}
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
					{isLoading ? "Sending Link..." : "Send Reset Link"}
				</Button>
			</form>
		</Form>
	);
}
