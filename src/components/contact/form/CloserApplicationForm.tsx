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

	useEffect(() => {
		if (prefill) {
			form.reset({ ...form.getValues(), ...prefill });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(prefill)]);

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
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{closerFormFields.map((field) => {
							const fieldProps = createFieldProps(field, form);
							const renderProps: RenderFieldProps = {
								...fieldProps,
								field: form.control._formValues[
									field.name
								] as ControllerRenderProps<
									CloserFormValues,
									keyof CloserFormValues
								>,
							};

							if (field.type === "checkbox") {
								return (
									<FormField
										key={field.name}
										control={form.control}
										name={field.name as keyof CloserFormValues}
										render={({ field: formField }) => (
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
										)}
									/>
								);
							}

							if (field.type === "select") {
								return (
									<FormField
										key={field.name}
										control={form.control}
										name={field.name as keyof CloserFormValues}
										render={({ field: formField }) => (
											<FormItem>
												<FormLabel>
													{field.label}
													{field.required && (
														<span className="ml-1 text-red-500">*</span>
													)}
												</FormLabel>
												<Select
													onValueChange={formField.onChange}
													defaultValue={formField.value as string}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder={field.placeholder} />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{field.options?.map((option) => (
															<SelectItem key={option.value} value={option.value}>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								);
							}

							if (field.type === "textarea") {
								return (
									<FormField
										key={field.name}
										control={form.control}
										name={field.name as keyof CloserFormValues}
										render={({ field: formField }) => (
											<FormItem>
												<FormLabel>
													{field.label}
													{field.required && (
														<span className="ml-1 text-red-500">*</span>
													)}
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder={field.placeholder}
														{...formField}
														value={formField.value as string}
														rows={5}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								);
							}

							return (
								<FormField
									key={field.name}
									control={form.control}
									name={field.name as keyof CloserFormValues}
									render={({ field: formField }) => (
										<FormItem>
											<FormLabel>
												{field.label}
												{field.required && (
													<span className="ml-1 text-red-500">*</span>
												)}
											</FormLabel>
											<FormControl>
												<Input
													type={field.type}
													placeholder={field.placeholder}
													{...formField}
													value={formField.value as string}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							);
						})}

						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting}
						>
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

