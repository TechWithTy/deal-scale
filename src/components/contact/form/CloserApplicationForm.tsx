"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
	type ControllerRenderProps,
	FormProvider,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";

import {
	type CloserFormValues,
	closerFormFields,
	closerFormSchema,
} from "@/data/contact/closer";
import type { FieldConfig, RenderFieldProps } from "@/types/contact/formFields";

import Header from "@/components/common/Header";
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

type CloserApplicationFormProps = {
	onSuccess?: () => void;
	prefill?: Partial<CloserFormValues>;
};

export default function CloserApplicationForm({
	onSuccess,
	prefill,
}: CloserApplicationFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<CloserFormValues>({
		resolver: zodResolver(closerFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			realEstateLicense: "",
			licenseState: "",
			yearsExperience: "",
			dealsClosed: "",
			availability: "",
			portfolioUrl: "",
			whyApply: "",
			termsAccepted: false,
			...prefill,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (prefill) {
			form.reset({ ...form.getValues(), ...prefill });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prefill]);

	const onSubmit = async (data: CloserFormValues) => {
		console.log("[CloserApplicationForm] onSubmit called", data);
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/closers/apply", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error || "Failed to submit your closer application.",
				);
			}

			toast.success(
				"Application submitted successfully! We'll review your application and get back to you soon.",
			);
			form.reset();
			if (onSuccess) {
				onSuccess();
			}
		} catch (err) {
			console.error("[CloserApplicationForm] Error in onSubmit", err);
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
				title="Remote Closer Application"
				subtitle="Apply to become a Remote Closer and help real estate investors close deals remotely. Join our marketplace of professional closers."
				size="sm"
				className="mb-12 md:mb-16"
			/>

			<FormProvider {...form}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{closerFormFields.map((field) => (
							<FormField
								key={field.name}
								control={form.control}
								name={field.name as keyof CloserFormValues}
								render={({ field: formField }) => {
									if (field.type === "checkbox") {
										return (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
												<FormControl>
													<Checkbox
														checked={formField.value as boolean}
														onCheckedChange={formField.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel className="cursor-pointer">
														{field.label}
														{field.required && (
															<span className="ml-1 text-red-500">*</span>
														)}
													</FormLabel>
													<FormMessage />
												</div>
											</FormItem>
										);
									}

									return (
										<FormItem className="space-y-1">
											<FormLabel className="text-black dark:text-white/70">
												{field.label}
												{field.required && (
													<span className="ml-1 text-red-500">*</span>
												)}
											</FormLabel>
											<FormControl>
												{renderFormField(
													createFieldProps(
														{
															name: field.name,
															type: field.type,
															label: field.label,
															placeholder: field.placeholder,
															required: field.required,
															options:
																field.type === "select"
																	? field.options
																	: undefined,
														} as FieldConfig,
														formField,
													),
												)}
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						))}

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Submitting...
								</>
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
