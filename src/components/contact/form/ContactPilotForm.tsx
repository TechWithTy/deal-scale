"use client";

// Priority Pilot Contact Form
// This component renders a contact form bound to `priorityPilotFormSchema` & `priorityPilotFormFields`.
// Validation powered by Zod + react-hook-form.
// UI components are reused from the existing design system.
// Multiselect fields use MultiSelectDropdown.
// todo Integrate real submission endpoint once available.

import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useMemo, useState } from "react";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(stripeKey);
import { zodResolver } from "@hookform/resolvers/zod";
import { Elements } from "@stripe/react-stripe-js";
import { FileIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import {
	type ControllerRenderProps,
	FormProvider,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";

import {
	type PriorityPilotFormValues,
	priorityPilotFormFields,
	priorityPilotFormSchema,
} from "@/data/contact/pilotFormFields";
import type { FieldConfig, RenderFieldProps } from "@/types/contact/formFields";

import Header from "@/components/common/Header";
import { AuroraText } from "@/components/magicui/aurora-text";
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
import { useTheme } from "next-themes";
import ContactPilotPaymentForm from "./ContactPilotPaymentForm";

import {
	createFieldProps,
	renderFormField,
} from "@/components/contact/form/formFieldHelpers";
import { mapPilotTesterApplication } from "./testerApplicationMappers";

export default function ContactPilotForm({
	prefill,
}: {
	prefill?: Partial<PriorityPilotFormValues>;
}) {
	const [formStep, setFormStep] = useState<"form" | "payment">("form");
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [formData, setFormData] = useState<PriorityPilotFormValues | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { theme, resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark" || theme === "dark";

	// Base defaults derived from field config values
	const baseDefaults = useMemo(() => {
		return Object.fromEntries(
			priorityPilotFormFields.map((f) => [f.name, f.value]),
		) as Partial<PriorityPilotFormValues>;
	}, []);

	// Merge defaults with prefill and remove empty arrays for multiselect fields
	const computeMergedDefaults = useCallback(
		(seed?: Partial<PriorityPilotFormValues>): PriorityPilotFormValues => {
			const merged: Partial<PriorityPilotFormValues> = {
				...baseDefaults,
				...(seed ?? {}),
			};
			for (const field of priorityPilotFormFields) {
				if (field.type === "multiselect") {
					const name = field.name as keyof PriorityPilotFormValues;
					const val = merged[name] as unknown;
					if (Array.isArray(val) && val.length === 0) {
						delete merged[name];
					}
				}
			}
			return merged as PriorityPilotFormValues;
		},
		[baseDefaults],
	);

	const form = useForm<PriorityPilotFormValues>({
		resolver: zodResolver(priorityPilotFormSchema),
		defaultValues: computeMergedDefaults(prefill),
	});

	// Ensure URL-based prefill applies after hydration
	useEffect(() => {
		if (prefill && Object.keys(prefill).length > 0) {
			form.reset(computeMergedDefaults(prefill));
		}
	}, [prefill, form, computeMergedDefaults]);

	// Step 1: Collect user info, then fetch clientSecret and go to payment
	const onSubmit = async (data: PriorityPilotFormValues) => {
		console.log("[ContactPilotForm] onSubmit called", data);
		setIsSubmitting(true);
		try {
			const pilotExtras = data as unknown as {
				wantedFeatures?: string[];
				featureVotes?: string[];
				termsAccepted?: boolean;
			};
			const testerPayload = mapPilotTesterApplication(data, {
				wantedFeatures: pilotExtras.wantedFeatures,
				featureVotes: pilotExtras.featureVotes,
				termsAccepted: pilotExtras.termsAccepted,
			});
			const testerResponse = await fetch("/api/testers/apply", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(testerPayload),
			});

			if (!testerResponse.ok) {
				let testerMessage = "Failed to submit your pilot application.";
				try {
					const responseBody = await testerResponse.json();
					testerMessage = responseBody?.error ?? testerMessage;
				} catch (error) {
					console.error(
						"[ContactPilotForm] Failed to parse tester error",
						error,
					);
				}
				toast.error(testerMessage);
				return;
			}

			console.log("[ContactPilotForm] Fetching /api/stripe", {
				price: 5000,
				description: "Priority Pilot Program Deposit",
				metadata: {
					email: data.email,
					name: `${data.firstName} ${data.lastName}`,
				},
			});
			const res = await fetch("/api/stripe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					price: 5000, // Price in cents for $50.00
					description: "Priority Pilot Program Deposit",
					metadata: {
						email: data.email,
						name: `${data.firstName} ${data.lastName}`,
					},
				}),
			});
			console.log("[ContactPilotForm] Fetch complete", res.status);
			const payment = await res.json();
			console.log("[ContactPilotForm] Payment JSON", payment);
			if (!res.ok || !payment?.clientSecret) {
				throw new Error(payment?.error || "Failed to create payment intent.");
			}
			console.log(
				"[ContactPilotForm] Setting clientSecret",
				payment.clientSecret,
			);
			setClientSecret(payment.clientSecret);
			console.log("[ContactPilotForm] Setting formData", data);
			setFormData(data);
			console.log("[ContactPilotForm] Setting formStep to payment");
			setFormStep("payment");
			console.log("[ContactPilotForm] Payment step triggered", {
				clientSecret: payment.clientSecret,
				formStep: "payment",
				formData: data,
			});
		} catch (err) {
			console.error("[ContactPilotForm] Error in onSubmit", err);
			const message =
				err instanceof Error ? err.message : "An unknown error occurred.";
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Step 2: Render payment form after clientSecret is fetched
	if (formStep === "payment" && clientSecret && formData) {
		if (!stripePromise) {
			console.error(
				"Stripe.js has not loaded. Make sure you have included the Stripe script.",
			);
			return (
				<div className="text-center text-red-500">
					Payment services are currently unavailable. Please refresh the page.
				</div>
			);
		}

		return (
			<Elements stripe={stripePromise} options={{ clientSecret }}>
				<ContactPilotPaymentForm
					formData={formData}
					clientSecret={clientSecret}
					onSuccess={async () => {
						try {
							// * Add contact to SendGrid with pilot_member segment
							const sendgridResponse = await fetch("/api/contact", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ ...formData, pilot_member: true }),
							});

							if (!sendgridResponse.ok) {
								console.error(
									"Failed to add contact to SendGrid",
									await sendgridResponse.json(),
								);
							}

							const beehiivResponse = await fetch("/api/beehiiv/subscribe", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									email: formData.email,
									send_welcome_email: true,
								}),
							});

							if (beehiivResponse.ok) {
								toast.success(
									"Payment successful! You've also been subscribed to our newsletter.",
								);
							} else {
								const errorData = await beehiivResponse.json();
								if (
									errorData.message &&
									/is already subscribed/i.test(errorData.message)
								) {
									toast.info("Payment successful! You are already subscribed.");
								} else {
									toast.warning(
										"Payment successful, but we couldn't subscribe you to the newsletter.",
									);
								}
							}
						} catch (err) {
							console.error("Beehiiv subscription failed:", err);
							toast.warning(
								"Payment successful, but we couldn't subscribe you to the newsletter.",
							);
						} finally {
							setFormStep("form");
							setClientSecret(null);
							setFormData(null);
						}
					}}
				/>
			</Elements>
		);
	}

	// Step 1: Render the initial form
	return (
		<div className="relative mx-auto max-w-2xl rounded-2xl border border-primary/40 bg-gradient-to-br from-white via-background to-primary-50 p-6 shadow-xl ring-1 ring-primary/10 transition-all sm:p-10 dark:from-background dark:via-background-dark dark:to-primary/10">
			<div className="-z-10 absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-focus/10 opacity-60 blur-lg dark:from-primary/30 dark:to-focus/20" />
			<Header
				title="Priority Pilot Application"
				subtitle="Apply for priority access and get 15 AI Credits, priority onboarding, support, locked-in pricing for 2 years, and help shape the future of deal-making!"
				size="sm"
				className="mb-12 md:mb-16"
			/>

			<FormProvider {...form}>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => {
							console.log("[ContactPilotForm] handleSubmit called", data);
							onSubmit(data);
						})}
						className="space-y-4"
					>
						{priorityPilotFormFields.map((fieldConfig) => (
							<FormField
								key={fieldConfig.name}
								control={form.control}
								name={fieldConfig.name as keyof PriorityPilotFormValues}
								render={({ field: formField }) => (
									<FormItem className="space-y-1">
										{fieldConfig.type !== "checkbox" && (
											<FormLabel className="text-black dark:text-white/70">
												{fieldConfig.name === "dealDocuments" ? (
													<>
														<AuroraText
															colors={
																isDark
																	? ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"]
																	: ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"]
															}
															className="font-semibold"
														>
															Priority Access:
														</AuroraText>{" "}
														{fieldConfig.label.replace("Priority Access: ", "")}
													</>
												) : (
													fieldConfig.label
												)}
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
									<Loader2 className="h-4 w-4 animate-spin" /> Proceeding...
								</span>
							) : (
								"Pay Deposit $50"
							)}
						</Button>
					</form>
				</Form>
			</FormProvider>
		</div>
	);
}
