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

export const NewsletterSignupCard = () => {
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
		<section className="mt-8">
			<h2 className="mb-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
				Newsletter
			</h2>
			<div className="rounded-xl border bg-card p-6 text-card-foreground">
				{isSubscribed ? (
					<div className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<Mail className="h-6 w-6 text-green-600" />
						</div>
						<p className="mb-2 font-medium text-green-600 text-lg">
							You're subscribed! 🎉
						</p>
						<p className="text-muted-foreground text-sm">
							Thanks for joining our newsletter.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						<div className="text-center">
							<h3 className="mb-2 font-semibold text-lg">
								Subscribe to our newsletter
							</h3>
							<p className="text-muted-foreground text-sm">
								Get the latest updates and insights delivered to your inbox.
							</p>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
							<div className="flex gap-2">
								<Input
									type="email"
									placeholder="Your email address"
									{...register("email")}
									className="flex-1"
									disabled={isSubmitting}
									aria-invalid={!!errors.email}
								/>
								<Button type="submit" disabled={isSubmitting} className="px-4">
									{isSubmitting ? (
										"..."
									) : (
										<>
											Subscribe
											<ArrowRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</div>

							{errors.email && (
								<p className="text-red-500 text-sm">{errors.email.message}</p>
							)}

							{error && <p className="text-red-500 text-sm">{error}</p>}

							<p className="text-muted-foreground text-xs">
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
						</form>
					</div>
				)}
			</div>
		</section>
	);
};
