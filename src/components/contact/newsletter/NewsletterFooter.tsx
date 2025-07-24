"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHasMounted } from "@/hooks/useHasMounted";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export const NewsletterFooter = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const hasMounted = useHasMounted();

	useEffect(() => {
		if (!hasMounted) return;
		const match = document.cookie.match(/userSubscribedNewsletter=([^;]+)/);
		if (match && match[1] === "true") {
			setIsSubscribed(true);
		}
	}, [hasMounted]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
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
				return;
			}
			toast.success("Thank you for subscribing to our newsletter!");
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

	if (!hasMounted) return null;

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-white/5 p-5">
				{isSubscribed ? (
					<div className="flex w-full flex-col items-center justify-center">
						<p className="mb-2 font-semibold text-lg text-primary">
							You're subscribed! 🎉
						</p>
						<p className="mb-4 text-gray-400 text-sm">
							Thanks for joining our newsletter.
						</p>
					</div>
				) : (
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex w-full flex-col gap-3"
					>
						<div className="flex w-full flex-col gap-3">
							<div className="flex items-center gap-2">
								<span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/20">
									<Mail className="h-5 w-5 text-primary" />
								</span>
								<Input
									type="email"
									placeholder="Your email address"
									{...register("email")}
									className="h-10 min-w-0 flex-1 rounded-md border border-gray-700 bg-white/80 px-3 py-2 text-dark focus:outline-none focus:ring-2 focus:ring-primary"
									disabled={isSubmitting}
									aria-invalid={!!errors.email}
									aria-describedby="newsletter-email-error"
								/>
							</div>
							<Button
								type="submit"
								className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary to-focus font-semibold text-black shadow-lg transition-opacity hover:opacity-90 hover:shadow-primary/20 dark:text-white"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Subscribing..." : "Subscribe"}
								<ArrowRight className="ml-1 h-4 w-4" />
							</Button>
						</div>
						{error && (
							<p
								className="mt-2 text-center text-red-500 text-xs"
								id="newsletter-email-error"
							>
								{error}
							</p>
						)}
						{errors.email && (
							<p
								className="mt-2 text-center text-red-500 text-xs"
								id="newsletter-email-error"
							>
								{errors.email.message}
							</p>
						)}
					</form>
				)}
				<p className="mt-2 w-full text-center text-gray-400 text-xs">
					By subscribing you agree to our{" "}
					<Link href="/privacy" className="underline hover:text-primary">
						Privacy Policy
					</Link>{" "}
					and{" "}
					<Link href="/tos" className="underline hover:text-primary">
						Terms of Service
					</Link>
					.
				</p>
			</div>
		</div>
	);
};
