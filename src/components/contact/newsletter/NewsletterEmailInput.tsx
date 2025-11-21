"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

type NewsletterEmailInputProps = {
	layout?: "default" | "stacked";
};

/**
 * Minimal newsletter email input for embedding in Hero or other CTAs.
 * Handles validation, submission, and user feedback.
 */
export function NewsletterEmailInput({
	layout = "default",
}: NewsletterEmailInputProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const hasMounted = useHasMounted();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			const response = await fetch("/api/beehiiv/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: data.email }),
			});
			const result = await response.json();
			if (!response.ok) {
				setError(result.message || "Subscription failed");
				toast.error(result.message || "Subscription failed");
				setIsSubmitting(false);
				return;
			}
			toast.success("Thank you for subscribing!");
			reset();
			setIsSubscribed(true);
			if (hasMounted) {
				document.cookie =
					"userSubscribedNewsletter=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
			}
		} catch (err) {
			setError("An unexpected error occurred");
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!hasMounted) {
		return (
			<div className="h-12 w-full max-w-md rounded-md border border-border/40 bg-background/40" />
		);
	}

	if (isSubscribed) {
		return (
			<div className="rounded-md border border-green-500 bg-green-50 px-4 py-3 text-center text-green-800">
				Thank you for subscribing!
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn(
				"flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center",
				layout === "stacked" && "md:flex-col md:items-stretch",
			)}
			autoComplete="off"
		>
			<Input
				type="email"
				placeholder="Your email address"
				{...register("email")}
				className="flex-1"
				disabled={isSubmitting}
				aria-invalid={!!errors.email}
				aria-describedby="newsletter-email-error"
				required
			/>
			<Button
				type="submit"
				className={cn(
					"h-12 min-w-[120px] bg-primary text-black dark:text-white",
					layout === "stacked" && "w-full md:w-full",
				)}
				disabled={isSubmitting}
			>
				{isSubmitting ? "Subscribing..." : "Subscribe"}
			</Button>
			{errors.email && (
				<span id="newsletter-email-error" className="mt-1 text-red-500 text-xs">
					{errors.email.message}
				</span>
			)}
			{error && !errors.email && (
				<span className="mt-1 text-red-500 text-xs">{error}</span>
			)}
		</form>
	);
}
