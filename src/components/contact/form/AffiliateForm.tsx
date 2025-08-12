"use client";

// Affiliate Contact Form
// This component renders a contact form bound to `affiliateFormSchema` & `affiliateFormFields`.
// Validation powered by Zod + react-hook-form.
// UI components are reused from the existing design system.
// Multiselect fields use MultiSelectDropdown.
// todo Integrate real submission endpoint once available.

import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
	type ControllerRenderProps,
	FormProvider,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";

import {
	type AffiliateFormValues,
	affiliateFormFields,
	affiliateFormSchema,
} from "@/data/contact/affiliate";
import type { FieldConfig, RenderFieldProps } from "@/types/contact/formFields";

import Header from "@/components/common/Header";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
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
import { createFieldProps, renderFormField } from "./formFieldHelpers";

type AffiliateFormProps = {
	onSuccess?: (affiliateId: string, social: string) => void;
	prefill?: Partial<AffiliateFormValues>;
};

export default function AffiliateForm({ onSuccess, prefill }: AffiliateFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Base defaults derived from field config values
	const baseDefaults = useMemo(() => {
		return Object.fromEntries(
			affiliateFormFields.map((f) => [f.name, f.value]),
		) as Partial<AffiliateFormValues>;
	}, []);

	// Merge defaults with prefill and remove empty arrays for multiselect fields
	const computeMergedDefaults = (
		seed?: Partial<AffiliateFormValues>,
	): AffiliateFormValues => {
		const merged: Partial<AffiliateFormValues> = {
			...baseDefaults,
			...(seed ?? {}),
		};
		for (const field of affiliateFormFields) {
			if (field.type === "multiselect") {
				const name = field.name as keyof AffiliateFormValues;
				const val = merged[name] as unknown;
				if (Array.isArray(val) && val.length === 0) {
					delete merged[name];
				}
			}
		}
		return merged as AffiliateFormValues;
	};

	const form = useForm<AffiliateFormValues>({
		resolver: zodResolver(affiliateFormSchema),
		defaultValues: computeMergedDefaults(prefill),
	});

	// Ensure URL-based prefill applies after hydration
	useEffect(() => {
		if (prefill && Object.keys(prefill).length > 0) {
			form.reset(computeMergedDefaults(prefill));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(prefill)]);

	const onSubmit = async (data: AffiliateFormValues) => {
		console.log("[AffiliateForm] onSubmit called", data);
		setIsSubmitting(true);
		try {
			// todo: Replace with real API endpoint
			await new Promise((resolve) => setTimeout(resolve, 1200));
			toast.success("Affiliate application submitted!");
			form.reset();
			if (onSuccess) {
				// Pass both affiliateId and social handle
				onSuccess("AFFILIATE-12345", data.social); // todo: Replace with real affiliateId from backend
			}
		} catch (err) {
			console.error("[AffiliateForm] Error in onSubmit", err);
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
							console.log("[AffiliateForm] handleSubmit called", data);
							onSubmit(data);
						})}
						className="space-y-4"
					>
						{affiliateFormFields.map((fieldConfig) => (
							<FormField
								key={fieldConfig.name}
								control={form.control}
								name={fieldConfig.name as keyof AffiliateFormValues}
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
