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
	type PhoneLoginFormValues,
	type PhoneOtpFormValues,
	phoneLoginFormFields,
	phoneLoginSchema,
	phoneOtpFormFields,
	phoneOtpSchema,
} from "@/data/contact/authFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { fetchUserDisplayName } from "@/lib/auth/user-display-name";
import { createFieldProps, renderFormField } from "./formFieldHelpers";

/**
 * PhoneLoginForm component for phone number authentication with OTP.
 * @param callbackUrl Optional URL to redirect to after successful authentication.
 */
export function PhoneLoginForm({ callbackUrl }: { callbackUrl?: string }) {
	const { onSuccess, close } = useAuthModal();
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState<"phone" | "otp">("phone");
	const [phoneNumber, setPhoneNumber] = useState("");

	const phoneForm = useForm<PhoneLoginFormValues>({
		resolver: zodResolver(phoneLoginSchema),
		defaultValues: {
			phone_number: "",
		},
	});

	const otpForm = useForm<PhoneOtpFormValues>({
		resolver: zodResolver(phoneOtpSchema),
		defaultValues: {
			phone_number: "",
			otp_code: "",
		},
	});

	async function onSendOtp(values: PhoneLoginFormValues) {
		setIsLoading(true);
		try {
			const res = await fetch("/api/auth/phone/send-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				const errorData = await res.json();
				const errorMessage = errorData.message || "Failed to send OTP.";

				// Handle phone number specific errors
				if (errorMessage.includes("phone") || errorMessage.includes("Phone")) {
					phoneForm.setError("phone_number", {
						type: "server",
						message: errorMessage,
					});
				} else {
					toast.error(errorMessage);
				}

				throw new Error(errorMessage);
			}

			setPhoneNumber(values.phone_number);
			otpForm.setValue("phone_number", values.phone_number);
			setStep("otp");
			toast.success("OTP sent to your phone!");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			toast.error(errorMessage);
			console.error("Send OTP error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function onVerifyOtp(values: PhoneOtpFormValues) {
		setIsLoading(true);
		try {
			const res = await fetch("/api/auth/phone/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				const errorData = await res.json();
				const errorMessage = errorData.message || "Invalid OTP code.";

				// Handle OTP-specific errors
				if (
					errorMessage.includes("Invalid OTP") ||
					errorMessage.includes("OTP")
				) {
					otpForm.setError("otp_code", {
						type: "server",
						message: errorMessage,
					});
				} else {
					toast.error(errorMessage);
				}

				throw new Error(errorMessage);
			}

			const data = await res.json();

			// Use NextAuth to create session with the auth data
			const result = await signIn("credentials", {
				email: `phone:${values.phone_number}`, // Special identifier for phone auth
				password: JSON.stringify(data.authData), // Pass the entire auth response
				redirect: false,
				...(callbackUrl ? { callbackUrl } : {}),
			});

			if (result?.ok) {
				const fullName = await fetchUserDisplayName();
				toast.success(
					fullName ? `Welcome ${fullName}!` : "Phone login successful!",
				);
				if (callbackUrl) {
					window.location.href = callbackUrl;
					return;
				}
				if (onSuccess) {
					onSuccess();
				}
				close();
			} else {
				throw new Error(
					result?.error || "Sign-in failed after OTP verification.",
				);
			}
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			toast.error(errorMessage);
			console.error("Verify OTP error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	function goBackToPhone() {
		setStep("phone");
		setPhoneNumber("");
		otpForm.reset();
	}

	if (step === "otp") {
		return (
			<div className="space-y-4">
				<div className="text-center">
					<h3 className="font-medium">Enter OTP Code</h3>
					<p className="text-muted-foreground text-sm">
						We sent a code to {phoneNumber}
					</p>
				</div>
				<Form {...otpForm}>
					<form
						onSubmit={otpForm.handleSubmit(onVerifyOtp)}
						className="space-y-4"
					>
						{phoneOtpFormFields.map((fieldConfig) => (
							<FormField
								key={fieldConfig.name}
								control={otpForm.control}
								name={fieldConfig.name as keyof PhoneOtpFormValues}
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
						<div className="grid gap-2">
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Verifying..." : "Verify OTP"}
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={goBackToPhone}
								disabled={isLoading}
							>
								Back to Phone Number
							</Button>
						</div>
					</form>
				</Form>
			</div>
		);
	}

	return (
		<Form {...phoneForm}>
			<form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-4">
				{phoneLoginFormFields.map((fieldConfig) => (
					<FormField
						key={fieldConfig.name}
						control={phoneForm.control}
						name={fieldConfig.name as keyof PhoneLoginFormValues}
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
					{isLoading ? "Sending OTP..." : "Send OTP"}
				</Button>
			</form>
		</Form>
	);
}
