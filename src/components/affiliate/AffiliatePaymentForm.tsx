"use client";

// Affiliate Payment Setup Form (Step 2 - Banking Info After Approval)
// This component renders the second step of the affiliate onboarding process.
// Users complete payment setup only after their application has been approved.

import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Loader2, Shield } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
	type ControllerRenderProps,
	FormProvider,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";

import {
	type AffiliatePaymentValues,
	affiliatePaymentFields,
	affiliatePaymentSchema,
} from "@/data/contact/affiliate";
import type { FieldConfig, RenderFieldProps } from "@/types/contact/formFields";
import type { DiscountCode } from "@/types/discount/discountCode";
import { v4 as uuidv4 } from "uuid";

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
import { useAffiliateStatus } from "@/hooks/useAffiliateStatus";
import AffiliatePendingApproval from "./AffiliatePendingApproval";

type AffiliatePaymentFormProps = {
	onSuccess?: (affiliateId: string, discountCode: DiscountCode) => void;
};

export default function AffiliatePaymentForm({
	onSuccess,
}: AffiliatePaymentFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { status, isLoading: statusLoading, refetch } = useAffiliateStatus();

	// Base defaults derived from field config values
	const baseDefaults = useMemo(() => {
		return Object.fromEntries(
			affiliatePaymentFields.map((f) => [f.name, f.value]),
		) as Partial<AffiliatePaymentValues>;
	}, []);

	const form = useForm<AffiliatePaymentValues>({
		resolver: zodResolver(affiliatePaymentSchema),
		defaultValues: baseDefaults as AffiliatePaymentValues,
	});

	// Show pending approval if not approved
	if (statusLoading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (status !== "approved" && status !== "active") {
		return <AffiliatePendingApproval status={status} onRefetch={refetch} />;
	}

	const onSubmit = async (data: AffiliatePaymentValues) => {
		console.log("[AffiliatePaymentForm] onSubmit called", data);
		setIsSubmitting(true);
		try {
			// Submit payment setup (Step 2)
			const response = await fetch("/api/affiliates/payment-setup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData?.error || "Failed to submit payment information",
				);
			}

			const result = (await response.json()) as {
				affiliateId: string;
				social?: string;
			};

			// Generate discount code on frontend (matching the pattern from AffiliateApplication)
			const codeId = uuidv4();
			const socialHandle = result.social || "affiliate";
			let handle = socialHandle.trim();
			if (handle.startsWith("@")) {
				handle = handle.slice(1);
			} else if (handle.startsWith("http")) {
				try {
					const url = new URL(handle);
					const path = url.pathname.split("/").filter(Boolean);
					if (path.length > 0) handle = path[path.length - 1];
				} catch {
					// fallback to original
				}
			}
			handle = handle.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
			const shortId = `${handle}-${codeId.slice(0, 6).toUpperCase()}`;
			const discountCode: DiscountCode = {
				id: shortId,
				code: shortId,
				expires: new Date("2025-12-31T23:59:59Z"),
				affiliateId: shortId,
				created: new Date(),
				maxUses: 100,
				usedCount: 0,
				discountPercent: 10,
				isActive: true,
				description: `10% off for Deal Scale affiliate referrals via ${socialHandle}`,
			};

			toast.success(
				"Payment setup complete! Your affiliate account is now active.",
			);
			form.reset();
			if (onSuccess) {
				onSuccess(result.affiliateId, discountCode);
			}
		} catch (err) {
			console.error("[AffiliatePaymentForm] Error in onSubmit", err);
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
				title="Complete Payment Setup"
				subtitle="Set up your payment information to start earning commissions"
				size="sm"
				className="mb-12 md:mb-16"
			/>

			{/* PCI-style Security Disclaimer */}
			<div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
				<Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
				<div className="flex-1">
					<p className="font-semibold text-primary text-sm">
						Secure Payment Information
					</p>
					<p className="text-muted-foreground text-xs">
						Your banking information is encrypted and stored securely. We use
						industry-standard security measures to protect your data. This
						information is only used for commission payouts.
					</p>
				</div>
			</div>

			<FormProvider {...form}>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => {
							console.log("[AffiliatePaymentForm] handleSubmit called", data);
							onSubmit(data);
						})}
						className="space-y-4"
					>
						{affiliatePaymentFields.map((fieldConfig) => (
							<FormField
								key={fieldConfig.name}
								control={form.control}
								name={fieldConfig.name as keyof AffiliatePaymentValues}
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
								"Complete Payment Setup"
							)}
						</Button>
					</form>
				</Form>
			</FormProvider>
		</div>
	);
}
