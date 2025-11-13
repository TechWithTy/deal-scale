"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type LoadingAnimationProps = {
	ariaLive?: "assertive" | "polite" | "off";
	className?: string;
	label?: string;
	spinnerClassName?: string;
	spinnerSize?: "sm" | "md" | "lg";
};

export default function LoadingAnimation({
	ariaLive = "assertive",
	className,
	label = "Loading",
	spinnerClassName,
	spinnerSize = "lg",
}: LoadingAnimationProps = {}) {
	return (
		<div
			aria-live={ariaLive}
			className={cn(
				"flex w-full items-center justify-center py-20",
				className,
			)}
			data-testid="loading-animation"
		>
			<Spinner
				size={spinnerSize}
				className={cn("text-primary", spinnerClassName)}
				aria-label={label}
			/>
		</div>
	);
}
