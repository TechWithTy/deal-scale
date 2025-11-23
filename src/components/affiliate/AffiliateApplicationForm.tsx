"use client";

// Affiliate Application Form (Step 1 - Qualification Only)
// This component renders the first step of the affiliate onboarding process.
// Users submit qualification information and wait for approval before proceeding to payment setup.

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	type ControllerRenderProps,
	FormProvider,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";

import {
	type AffiliateApplicationValues,
	affiliateApplicationFields,
	affiliateApplicationSchema,
} from "@/data/contact/affiliate";
import type { FieldConfig, RenderFieldProps } from "@/types/contact/formFields";

import Header from "@/components/common/Header";
import {
	createFieldProps,
	renderFormField,
} from "@/components/contact/form/formFieldHelpers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type AffiliateApplicationFormProps = {
	onSuccess?: () => void;
	prefill?: Partial<AffiliateApplicationValues>;
};

export default function AffiliateApplicationForm({
	onSuccess,
	prefill,
}: AffiliateApplicationFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Base defaults derived from field config values
	const baseDefaults = useMemo(() => {
		return Object.fromEntries(
			affiliateApplicationFields.map((f) => [f.name, f.value]),
		) as Partial<AffiliateApplicationValues>;
	}, []);

	// Merge defaults with prefill
	const computeMergedDefaults = useCallback(
		(
			seed?: Partial<AffiliateApplicationValues>,
		): AffiliateApplicationValues => {
			const merged: Partial<AffiliateApplicationValues> = {
				...baseDefaults,
				...(seed ?? {}),
			};
			return merged as AffiliateApplicationValues;
		},
		[baseDefaults],
	);

	const form = useForm<AffiliateApplicationValues>({
		resolver: zodResolver(affiliateApplicationSchema),
		defaultValues: computeMergedDefaults(prefill),
	});

	// Ensure URL-based prefill applies after hydration
	useEffect(() => {
		if (prefill && Object.keys(prefill).length > 0) {
			form.reset(computeMergedDefaults(prefill));
		}
	}, [prefill, computeMergedDefaults, form]);

	const onSubmit = async (data: AffiliateApplicationValues) => {
		console.log("[AffiliateApplicationForm] onSubmit called", data);
		setIsSubmitting(true);
		try {
			// Submit application (Step 1 only)
			const response = await fetch("/api/affiliates/apply", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData?.error || "Failed to submit affiliate application",
				);
			}

			toast.success(
				"Application submitted! We'll review your application and get back to you soon.",
			);
			form.reset();
			if (onSuccess) {
				onSuccess();
			}
		} catch (err) {
			console.error("[AffiliateApplicationForm] Error in onSubmit", err);
			const message =
				err instanceof Error ? err.message : "An unknown error occurred.";
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative mx-auto max-w-2xl rounded-2xl border border-primary/40 bg-gradient-to-br from-white via-background to-primary-50 p-6 shadow-xl ring-1 ring-primary/10 transition-all sm:p-10 dark:from-background dark:via-background-dark dark:to-primary/10">
			<div className="-z-10 absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-focus/10 opacity-60 blur-lg dark:from-primary/30 dark:to-focus/20" />
			<Header
				title="Affiliate Program Application"
				subtitle="Apply to become a Deal Scale affiliate and earn up to $4,500 per sale!"
				size="sm"
				className="mb-12 md:mb-16"
			/>

			<FormProvider {...form}>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => {
							console.log(
								"[AffiliateApplicationForm] handleSubmit called",
								data,
							);
							onSubmit(data);
						})}
						className="space-y-4"
					>
						{affiliateApplicationFields.map((fieldConfig) => (
							<FormField
								key={fieldConfig.name}
								control={form.control}
								name={fieldConfig.name as keyof AffiliateApplicationValues}
								render={({ field: formField }) => (
									<FormItem className="space-y-1">
										{fieldConfig.type !== "checkbox" && (
											<FormLabel className="text-black dark:text-white/70">
												{fieldConfig.label}
											</FormLabel>
										)}
										<FormControl>
											{renderFormField(
												createFieldProps(fieldConfig, formField),
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						{process.env.STAGING_ENVIRONMENT === "DEV" && (
							<pre className="mb-2 max-h-40 overflow-auto rounded bg-white/80 p-2 text-red-600 text-xs">
								{JSON.stringify(form.formState.errors, null, 2)}
							</pre>
						)}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-primary to-focus"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" /> Submitting...
								</span>
							) : (
								"Submit Application"
							)}
						</Button>
					</form>
				</Form>
			</FormProvider>
		</div>
	);
}
