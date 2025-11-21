"use client";

import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/useHasMounted";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export const NewsletterSidebar = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const hasMounted = useHasMounted();

	useEffect(() => {
		if (!hasMounted) return;
		if (typeof document !== "undefined") {
			const match = document.cookie.match(/userSubscribedNewsletter=([^;]+)/);
			if (match && match[1] === "true") {
				setIsSubscribed(true);
			}
		}
	}, [hasMounted]);

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
		try {
			const response = await fetch("/api/beehiiv/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: data.email }),
			});
			if (!response.ok) {
				throw new Error("Subscription failed");
			}
			toast.success("Thank you for subscribing to our newsletter!");
			reset();
			setIsSubscribed(true);
			if (hasMounted) {
				document.cookie =
					"userSubscribedNewsletter=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
			}
		} catch (err) {
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="glass-card rounded-xl p-6 text-center"
		>
			{isSubscribed ? (
				<div className="flex flex-col items-center justify-center py-10">
					<h3 className="mb-4 bg-gradient-to-r from-primary to-focus bg-clip-text font-semibold text-transparent text-xl">
						Thank you for subscribing!
					</h3>
					<p className="mb-4 text-black text-sm dark:text-white/70">
						You are already subscribed to our newsletter.
					</p>
					<Button
						className="bg-primary text-black text-xs underline transition-colors hover:text-focus dark:text-white"
						onClick={() => {
							setIsSubscribed(false);
							if (hasMounted) {
								document.cookie =
									"userSubscribedNewsletter=false; expires=Fri, 31 Dec 9999 23:59:59 GMT";
							}
						}}
						type="button"
					>
						Resubscribe
					</Button>
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
					<div className="relative flex-grow">
						<input
							type="email"
							placeholder="Enter your email"
							required
							className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-black placeholder:text-black focus:border-primary focus:outline-none dark:text-white dark:text-white/40"
							{...register("email")}
						/>
						{errors.email && (
							<p className="mb-3 text-red-500 text-xs">
								{errors.email.message}
							</p>
						)}
					</div>
					<Button
						type="submit"
						className="w-full bg-gradient-to-r from-primary to-focus hover:opacity-90"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Subscribing..." : "Subscribe"}
					</Button>
				</form>
			)}
		</motion.div>
	);
};

export default NewsletterSidebar;
