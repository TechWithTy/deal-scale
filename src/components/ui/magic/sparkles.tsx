"use client";

import { Sparkles as LucideSparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SparklesProps
	extends React.ComponentPropsWithoutRef<typeof LucideSparkles> {}

/**
 * Lightweight wrapper around lucide sparkles icon with optional glow styling.
 */
export function Sparkles({ className, ...props }: SparklesProps) {
	return (
		<LucideSparkles
			aria-hidden="true"
			className={cn(
				"text-primary drop-shadow-[0_0_6px_rgba(56,189,248,0.6)] dark:text-emerald-200",
				className,
			)}
			{...props}
		/>
	);
}



