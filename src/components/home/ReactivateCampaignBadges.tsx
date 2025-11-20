"use client";

import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BadgeMetrics {
	dollarAmount: number;
	timeSavedHours: number;
	contactsActivated: number;
	hobbyTimeHours: number;
}

interface ReactivateCampaignBadgesProps {
	metrics: BadgeMetrics;
	className?: string;
}

const badgeVariants: Variants = {
	hidden: { opacity: 0, scale: 0.8, y: 10 },
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			delay: i * 0.1,
			duration: 0.4,
			ease: [0.4, 0, 0.2, 1] as const,
		},
	}),
};

export function ReactivateCampaignBadges({
	metrics,
	className,
}: ReactivateCampaignBadgesProps) {
	const badges = [
		{
			id: "dollar",
			label: `+$${metrics.dollarAmount.toLocaleString()} this month`,
			color:
				"bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
		},
		{
			id: "time",
			label: `${metrics.timeSavedHours} hours saved month`,
			color:
				"bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
		},
		{
			id: "contacts",
			label: `${metrics.contactsActivated} deals closed`,
			color:
				"bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700",
		},
		{
			id: "hobby",
			label: `+${metrics.hobbyTimeHours} hours hobby time by the week`,
			color:
				"bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-700",
		},
	];

	return (
		<div
			className={cn(
				"mt-6 flex flex-wrap items-center justify-center gap-2",
				className,
			)}
		>
			{badges.map((badge, index) => (
				<motion.div
					key={badge.id}
					custom={index}
					initial="hidden"
					animate="visible"
					variants={badgeVariants}
					className={cn(
						"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-xs transition-all",
						badge.color,
					)}
				>
					<span>{badge.label}</span>
				</motion.div>
			))}
		</div>
	);
}
