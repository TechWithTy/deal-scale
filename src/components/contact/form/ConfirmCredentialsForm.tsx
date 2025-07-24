"use client";

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
	type ConfirmCredentialsFormValues,
	confirmCredentialsFormFields,
	confirmCredentialsSchema,
} from "@/data/contact/authFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createFieldProps, renderFormField } from "./formFieldHelpers";

interface ConfirmCredentialsFormProps {
	token: string;
}

export function ConfirmCredentialsForm({ token }: ConfirmCredentialsFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ConfirmCredentialsFormValues>({
		resolver: zodResolver(confirmCredentialsSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: ConfirmCredentialsFormValues) {
		setIsLoading(true);
		try {
			// todo: Create the /api/auth/confirm-reset endpoint
			const res = await fetch("/api/auth/confirm-reset", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...values, token }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Failed to reset password.");
			}

			toast.success("Password has been reset successfully!");
			router.push("/signIn"); // Redirect to sign-in page
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			toast.error(errorMessage);
			console.error("Confirm credentials error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{confirmCredentialsFormFields.map((fieldConfig) => (
					<FormField
						key={fieldConfig.name}
						control={form.control}
						name={fieldConfig.name as keyof ConfirmCredentialsFormValues}
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
					{isLoading ? "Resetting Password..." : "Reset Password"}
				</Button>
			</form>
		</Form>
	);
}
