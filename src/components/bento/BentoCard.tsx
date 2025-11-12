"use client";
import { cn } from "@/lib/utils";
import Lottie, { type LottieComponentProps } from "lottie-react";
import type React from "react";
import { useState } from "react";

interface BentoCardProps {
	title: string;
	description?: string;
	animation?: LottieComponentProps["animationData"];
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
	bgColor?: string;
	icon?: React.ReactNode;
	accentColor?: string;
	renderContent?: () => React.ReactNode;
	children?: React.ReactNode;
}

const BentoCard: React.FC<BentoCardProps> = ({
	title,
	description,
	animation,
	className,
	size = "sm",
	bgColor = "bg-background-dark/80",
	icon,
	accentColor,
	renderContent,
	children,
}) => {
	const [isPaused, setIsPaused] = useState<boolean>(false);

	const sizeClasses: Record<string, string> = {
		sm: "col-span-full md:col-span-3",
		md: "col-span-full md:col-span-6",
		lg: "col-span-full md:col-span-8",
		xl: "col-span-full md:col-span-12",
	};

	const content = children ? (
		children
	) : renderContent ? (
		renderContent()
	) : (
		<div className="p-4 text-accent">Content not available</div> // Already theme-compliant
	);

	return (
		<div
			className={cn(
				"w-full",
				// Replace 'cyber-card' with theme-compliant classes
				"group w-full overflow-hidden rounded-3xl border border-border/60 bg-background-dark/70 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:shadow-[0_24px_60px_-38px_rgba(59,130,246,0.45)]",
				sizeClasses[size],
				bgColor,
				className,
			)}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{content}
		</div>
	);
};

export default BentoCard;
