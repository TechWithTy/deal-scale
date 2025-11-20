// src/components/services/ServiceCard.tsx (or wherever it is)

"use client";
import { v4 as uuidv4 } from "uuid";

import { cn } from "@/lib/utils";
import type {
	IconName,
	ServiceItemData,
	ServiceSlugDetails,
} from "@/types/service/services";
import { motion, useReducedMotion } from "framer-motion";
import {
	Bolt,
	Brain,
	ChartBar,
	Check,
	Cloud,
	Code,
	Database,
	Globe,
	Lightbulb,
	Mail,
	MailCheck,
	Network,
	Palette,
	Pencil,
	Phone,
	Puzzle,
	RefreshCw,
	Rocket,
	Search,
	Share,
	Smartphone,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

interface ServiceCardProps extends Omit<ServiceItemData, "slugDetails"> {
	className?: string;
	showBanner?: boolean;
	bannerText?: string;
	bannerColor?: string;
	price?: number | string;
	onSale?: boolean;
	slugDetails?: Pick<ServiceSlugDetails, "slug">;
	ctaLabel?: string; // * CTA button label for dynamic routing
}

import { ShieldCheck } from "lucide-react";

// * Allow a subset of icons to be defined. Any missing icon will fall back to ShieldCheck
const iconMap: Partial<Record<IconName, React.ElementType>> = {
	ChartBar,
	Zap,
	Bolt,
	Rocket,
	Brain,
	Smartphone,
	Users,
	Database,
	Globe,
	Search,
	Pencil,
	Code,
	Cloud,
	Palette,
	RocketLaunch: Rocket,
	Lightbulb,
	RefreshCw,
	Puzzle,
	Network,
	ShieldCheck,
	Share,
	Mail,
	MailCheck,
	Phone,
};

const validateServiceProps = (
	props: Omit<ServiceCardProps, "className">,
): boolean => {
	const validCoreProps = !!(
		props?.iconName &&
		typeof props.iconName === "string" &&
		props.title &&
		typeof props.title === "string" &&
		props.description &&
		typeof props.description === "string" &&
		props.features &&
		Array.isArray(props.features)
	);
	const validSlug =
		!props.slugDetails ||
		(props.slugDetails.slug && typeof props.slugDetails.slug === "string");
	return validCoreProps && validSlug;
};

// * Format price value. Numbers -> currency string, percentage strings remain untouched
const formatPrice = (value: number | string): string => {
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return ""; // Handle NaN/Infinity
		return `$${value.toLocaleString()}`;
	}
	const trimmed = value.trim();
	return trimmed.endsWith("%") ? trimmed : value;
};

const ServiceCard = (props: ServiceCardProps) => {
	const shouldReduceMotion = useReducedMotion();

	if (!validateServiceProps(props)) {
		console.error("Invalid ServiceCard core props:", props);
		return (
			<div
				className={cn(
					"rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-400",
					props.className,
				)}
			>
				Unable to display service information. Please refresh the page or
				contact support.
			</div>
		);
	}

	const {
		iconName,
		title,
		description,
		features,
		className,
		showBanner = false,
		bannerText = "Featured",
		bannerColor = "bg-gradient-to-r from-primary to-focus",
		price,
		onSale = false,
		slugDetails,
	} = props;

	const IconComponent = iconMap[iconName] || Rocket;

	return (
		<motion.div
			layout
			className={cn(
				"glass-card h-full",
				"relative overflow-hidden rounded-2xl border-2 border-primary/70 bg-background-dark-alt/60 p-6 text-center shadow-glow-md backdrop-blur-lg transition-all duration-200 sm:text-left dark:border-focus/80",
				"focus-within:border-accent hover:border-accent hover:shadow-[0_0_0_4px_rgba(139,92,246,0.6)]",
				"flex flex-col",
				className,
			)}
			whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			{showBanner && (
				<div className="pointer-events-none absolute top-0 right-0 h-16 w-16 overflow-visible">
					<div
						className={cn(
							"absolute top-[32px] right-[-35px] w-[170px] rotate-45 transform py-1 text-center font-semibold text-white text-xs",
							bannerColor,
						)}
					>
						{/* ! Limit banner to first 4 words for clarity */}
						{bannerText.split(" ").slice(0, 3).join(" ")}
					</div>
				</div>
			)}

			<div className="mb-4 flex flex-col items-center gap-4 sm:items-start">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-accent bg-background-dark p-3 shadow-glow-xs transition-colors dark:border-focus">
					<IconComponent className="h-6 w-6 text-accent dark:text-focus" />
				</div>
				<h3 className="font-bold text-black text-xl dark:text-white">
					{title}
				</h3>
				{price !== undefined && (
					<div>
						<span
							className={cn(
								"font-bold text-lg",
								onSale ? "text-focus" : "text-primary",
							)}
						>
							{formatPrice(price)}
						</span>
						{onSale && typeof price === "number" && (
							<span className="ml-2 text-black text-sm line-through dark:text-white/60">
								{`$${(price * 1.3).toLocaleString(undefined, {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								})}`}
							</span>
						)}
					</div>
				)}
				<p className="text-black text-sm dark:text-white/70">{description}</p>
			</div>

			{features && features.length > 0 && (
				<div
					className="flex-1 overflow-y-auto border-white/10 border-t pt-4"
					style={{
						maxHeight: "calc(4 * (1.5rem + 0.5rem))",
						minHeight: "calc(4 * (1.5rem + 0.5rem))",
						scrollbarWidth: "thin",
					}}
				>
					<ul className="space-y-2">
						{features.map((feature, index) => (
							<li
								key={uuidv4()}
								className="flex items-start justify-center sm:justify-start"
							>
								<Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-primary" />
								<span className="text-black text-sm dark:text-white/80">
									{feature}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* --- CTA Button Logic --- */}
			{props.ctaLabel &&
				(() => {
					let ctaHref = "";
					if (/beta/i.test(props.ctaLabel)) {
						ctaHref = "/contact";
					} else if (/pilot/i.test(props.ctaLabel)) {
						ctaHref = "/contact-pilot";
					}
					return ctaHref ? (
						<Link
							href={ctaHref}
							className="mt-4 mb-2 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 font-semibold text-white shadow transition-colors hover:bg-focus focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
						>
							{props.ctaLabel}
						</Link>
					) : null;
				})()}

			{slugDetails && (
				<Link
					href={`/features/${slugDetails.slug}`}
					className="mt-4 inline-flex items-center justify-center font-medium text-primary text-sm transition-colors hover:text-focus sm:justify-start"
				>
					Read more
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="ml-1 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-label="Read more"
					>
						<title>Read more</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</Link>
			)}
		</motion.div>
	);
};

export default ServiceCard;
