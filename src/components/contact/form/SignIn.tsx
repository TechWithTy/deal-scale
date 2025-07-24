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
	type SignInFormValues,
	signInFormFields,
	signInSchema,
} from "@/data/contact/authFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createFieldProps, renderFormField } from "./formFieldHelpers";

/**
 * SignInForm component for user authentication.
 * @param callbackUrl Optional URL to redirect to after successful authentication (for cross-domain auth).
 */
export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
	const { onSuccess, close } = useAuthModal();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: SignInFormValues) {
		setIsLoading(true);
		try {
			const result = await signIn("credentials", {
				...values,
				redirect: false,
				...(callbackUrl ? { callbackUrl } : {}),
			});

			if (result?.ok) {
				toast.success("Logged in successfully!");
				if (callbackUrl) {
					// Securely redirect to callbackUrl
					window.location.href = callbackUrl;
					return;
				}
				if (onSuccess) {
					onSuccess();
				}
				close();
			} else {
				toast.error(result?.error || "An unknown error occurred.");
			}
		} catch (error) {
			toast.error("An unexpected error occurred.");
			console.error("Sign-in submission error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{signInFormFields.map((fieldConfig) => (
					<FormField
						key={fieldConfig.name}
						control={form.control}
						name={fieldConfig.name as keyof SignInFormValues}
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
					{isLoading ? "Signing In..." : "Sign In"}
				</Button>
			</form>
		</Form>
	);
}
