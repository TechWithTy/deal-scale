"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useNavigationRouter } from "@/hooks/useNavigationRouter";

interface StatusPageProps {
	type: "success" | "error";
	className?: string;
}

export function StatusPage({ type, className = "" }: StatusPageProps) {
	const router = useNavigationRouter();
	const searchParams = useSearchParams();

	const isSuccess = type === "success";
	const Icon = isSuccess ? CheckCircle : XCircle;
	const iconColor = isSuccess ? "text-green-500" : "text-red-500";

	const title =
		searchParams.get("title") ||
		(isSuccess ? "Payment Successful" : "Payment Failed");
	const subtitle =
		searchParams.get("subtitle") ||
		(isSuccess
			? "Your order has been confirmed."
			: "There was an issue with your payment.");
	const ctaText =
		searchParams.get("ctaText") || (isSuccess ? "View Orders" : "Try Again");
	const ctaHref =
		searchParams.get("ctaHref") || (isSuccess ? "/orders" : "/products");

	const handleCtaClick = () => {
		if (ctaHref) {
			router.push(ctaHref);
		}
	};

	return (
		<div
			className={`flex min-h-screen flex-col items-center justify-center bg-background p-6 ${className}`}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md text-center"
			>
				<div className="mb-6 flex justify-center">
					<div
						className={`rounded-full bg-opacity-20 p-4 ${isSuccess ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
					>
						<Icon className={`h-16 w-16 ${iconColor}`} />
					</div>
				</div>

				<h1 className="mb-6 font-bold text-4xl text-foreground tracking-tight sm:text-5xl">
					{title}
				</h1>

				<p className="mb-8 text-muted-foreground">{subtitle}</p>

				<Button
					onClick={handleCtaClick}
					className="group gap-2 transition-all"
					size="lg"
				>
					{ctaText}
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</motion.div>
		</div>
	);
}
