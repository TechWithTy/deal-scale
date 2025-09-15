"use client";

//! Beta Tester Contact Form
// * This component renders a contact form bound to `betaTesterFormSchema` & `betaTesterFormFields`.
// * Validation powered by Zod + react-hook-form.
// * UI components are reused from the existing design system.
// * Multiselect fields are rendered as checkbox groups for now.
// todo Integrate real submission endpoint once available.

import {
	createFieldProps,
	renderFormField,
} from "@/components/contact/form/formFieldHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { FileIcon, Loader2 } from "lucide-react";
import Image from "next/image";

import Header from "@/components/common/Header";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import {
	type BetaTesterFormValues,
	betaTesterFormFields,
	betaTesterFormSchema,
} from "@/data/contact/formFields";
import type { FieldConfig, RenderFieldProps } from "@/types/contact/formFields";

export default function ContactForm({
	prefill,
}: {
	prefill?: Partial<BetaTesterFormValues>;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const baseDefaults: Partial<BetaTesterFormValues> = {
		firstName: "",
		lastName: "",
		companyName: "",
		email: "",
		phone: "",
		icpType: "",
		employeeCount: "",
		dealsClosedLastYear: "",
		dealDocuments: [],
		termsAccepted: false,
	};

	// Merge defaults with prefill and remove empty arrays for non-empty tuple fields
	const computeMergedDefaults = (
		seed?: Partial<BetaTesterFormValues>,
	): BetaTesterFormValues => {
		const merged: Partial<BetaTesterFormValues> = {
			...baseDefaults,
			...(seed ?? {}),
		};
		if (
			Array.isArray(merged.wantedFeatures) &&
			merged.wantedFeatures.length === 0
		) {
			delete merged.wantedFeatures;
		}
		if (Array.isArray(merged.painPoints) && merged.painPoints.length === 0) {
			delete merged.painPoints;
		}
		return merged as BetaTesterFormValues;
	};

	const form = useForm<BetaTesterFormValues>({
		resolver: zodResolver(betaTesterFormSchema),
		defaultValues: computeMergedDefaults(prefill),
	});

	// Ensure URL-based prefill applies after hydration
	useEffect(() => {
		if (prefill && Object.keys(prefill).length > 0) {
			form.reset(computeMergedDefaults(prefill));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(prefill)]);

	const onSubmit = async (data: BetaTesterFormValues) => {
		setIsSubmitting(true);
		try {
			// * Send form data to the new contact endpoint for SendGrid integration
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...data, beta_tester: true }),
			});

			if (!response.ok) {
				// ? Even if SendGrid fails, we proceed with Beehiiv, but log the error
				console.error(
					"Failed to add contact to SendGrid",
					await response.json(),
				);
			}

			// Subscribe to Beehiiv
			const beehiivResponse = await fetch("/api/beehiiv/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: data.email, send_welcome_email: true }),
			});

			if (beehiivResponse.ok) {
				toast.success(
					"Thanks for applying! You've also been subscribed to our newsletter.",
				);
			} else {
				const errorData = await beehiivResponse.json();
				if (
					errorData.message &&
					/is already subscribed/i.test(errorData.message)
				) {
					toast.info(
						"Thanks for applying! You are already subscribed to our newsletter.",
					);
				} else {
					toast.warning(
						"Your application was submitted, but we couldn't subscribe you to the newsletter.",
					);
				}
			}

			form.reset();
		} catch (err) {
			console.error("Submission failed:", err);
			toast.error("Submission failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative mx-auto max-w-2xl rounded-2xl border border-primary/40 bg-gradient-to-br from-white via-background to-primary-50 p-6 shadow-xl ring-1 ring-primary/10 transition-all sm:p-10 dark:bg-gradient-to-br dark:from-background dark:via-background-dark dark:to-primary/10">
			<div className="-z-10 absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-focus/10 opacity-60 blur-lg dark:from-primary/30 dark:to-focus/20" />
			<Header
				title="Beta Tester Application"
				subtitle="Apply to become a beta tester and get early access, 5 Ai Credits and Vote for the next features"
				size="md"
				className="mb-12 md:mb-16"
			/>

			<FormProvider {...form}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Dynamically render all fields */}
						{betaTesterFormFields.map((field) => (
							<FormField
								key={field.name}
								control={form.control}
								name={field.name as keyof BetaTesterFormValues}
								render={({ field: formField }) => (
									<FormItem className="space-y-1">
										{field.type !== "checkbox" && (
											<FormLabel className="text-black dark:text-white/70">
												{field.label}
											</FormLabel>
										)}
										<FormControl>
											{renderFormField(
												createFieldProps<FieldConfig>(field, formField),
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-gradient-to-r from-primary to-focus"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" /> Sending...
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
