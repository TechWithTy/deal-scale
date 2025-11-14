import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface SectionHeadingProps {
	title: string;
	description?: string;
	centered?: boolean;
	className?: string;
	size?: "xs" | "small" | "default" | "large";
}

export function SectionHeading({
	title,
	description,
	centered = false,
	className,
	size = "default",
}: SectionHeadingProps) {
	const titleSizes = {
		xs: "text-2xl md:text-3xl",
		small: "text-3xl md:text-4xl",
		default: "text-4xl md:text-5xl",
		large: "text-5xl md:text-6xl",
	};

	const descriptionSizes = {
		xs: "text-xs",
		small: "text-sm",
		default: "text-base",
		large: "text-lg",
	};

	return (
		<div
			className={cn(
				"mx-auto mb-10 max-w-4xl",
				centered && "text-center",
				className,
			)}
		>
			<motion.h2
				className={cn(
					"mb-2 break-words font-bold text-3xl text-primary leading-tight sm:text-4xl md:text-5xl",
				)}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				{title}
			</motion.h2>
			{description && (
				<motion.p
					className="mx-auto max-w-2xl text-base text-black leading-normal sm:text-lg md:text-xl dark:text-white/80"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					{description}
				</motion.p>
			)}
		</div>
	);
}
