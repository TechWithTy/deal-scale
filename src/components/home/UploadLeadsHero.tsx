"use client";

import { motion } from "framer-motion";
import { AtSign, Bookmark, Hash, Play, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGpuOptimizations } from "@/hooks/useGpuOptimizations";
import { cn } from "@/lib/utils";

const BADGE_ROTATION_INTERVAL_MS = 3000;

const ACTION_BADGES = [
	{
		id: "enrich",
		label: "Enrich Leads",
		icon: Bookmark,
		color:
			"bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
	},
	{
		id: "outreach",
		label: "Send Outreach",
		icon: AtSign,
		color:
			"bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700",
	},
	{
		id: "followup",
		label: "Schedule Follow-ups",
		icon: Hash,
		color:
			"bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
	},
	{
		id: "crm",
		label: "Update CRM",
		icon: Bookmark,
		color:
			"bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-700",
	},
	{
		id: "track",
		label: "Track Performance",
		icon: Hash,
		color:
			"bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-100 dark:border-pink-700",
	},
];

/**
 * UploadLeadsHero renders an upload/action input with animated badge sequencing.
 */
export function UploadLeadsHero(): JSX.Element {
	const [activeBadgeIndex, setActiveBadgeIndex] = useState(0);
	const [inputValue, setInputValue] = useState("");
	const enableGpu = useGpuOptimizations();
	const gpuContainerClass = enableGpu
		? "transform-gpu will-change-transform will-change-opacity"
		: "";

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setActiveBadgeIndex((index) => (index + 1) % ACTION_BADGES.length);
		}, BADGE_ROTATION_INTERVAL_MS);

		return () => window.clearInterval(intervalId);
	}, []);

	const handleAction = () => {
		// Handle upload/action logic here
		console.log("Action triggered with value:", inputValue);
	};

	return (
		<section
			className={cn(
				"relative flex w-full flex-col items-center justify-center overflow-hidden",
				"min-h-[400px] bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:min-h-[450px] sm:py-20 md:min-h-[500px] lg:py-24",
				gpuContainerClass,
			)}
		>
			<div className="relative z-20 flex w-full max-w-4xl flex-col items-center px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="w-full"
				>
					{/* Search/Upload Bar Container */}
					<div className="relative flex w-full items-center gap-3 rounded-2xl border border-sky-400/50 bg-white/80 px-4 py-4 shadow-[0_8px_30px_rgba(59,130,246,0.15)] backdrop-blur-xl transition-all duration-300 focus-within:border-sky-500 focus-within:shadow-[0_8px_30px_rgba(59,130,246,0.3)] dark:border-sky-500/40 dark:bg-slate-800/30 dark:focus-within:border-sky-500 dark:focus-within:shadow-[0_8px_30px_rgba(59,130,246,0.3)]">
						{/* Input Field */}
						<Input
							type="text"
							placeholder="Upload Leads & Perform Actions"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleAction();
								}
							}}
							className="flex-1 border-0 bg-transparent text-base text-slate-900 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-slate-400"
						/>

						{/* Action Button */}
						<Button
							type="button"
							onClick={handleAction}
							className="h-10 w-10 rounded-full bg-sky-500 p-0 text-white shadow-lg transition-all hover:bg-sky-600 hover:shadow-xl active:scale-95"
							aria-label="Perform action"
						>
							<Play className="h-5 w-5" fill="currentColor" />
						</Button>
					</div>

					{/* Animated Badge Sequence */}
					<div className="mt-6 flex flex-wrap items-center justify-center gap-2">
						{ACTION_BADGES.map((badge, index) => {
							const isActive = index === activeBadgeIndex;
							const Icon = badge.icon;

							return (
								<motion.div
									key={badge.id}
									initial={{ opacity: 0, scale: 0.8, y: 10 }}
									animate={{
										opacity: isActive ? 1 : 0.5,
										scale: isActive ? 1.05 : 0.95,
										y: 0,
									}}
									transition={{
										duration: 0.4,
										ease: "easeInOut",
									}}
									className={cn(
										"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium text-xs transition-all",
										badge.color,
										isActive &&
											"shadow-lg ring-2 ring-sky-500 ring-offset-2 ring-offset-white dark:ring-sky-500 dark:ring-offset-slate-900",
									)}
								>
									<Icon className="h-3.5 w-3.5" />
									<span>{badge.label}</span>
								</motion.div>
							);
						})}
					</div>
				</motion.div>

				{/* Description Text */}
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
					className="mt-8 max-w-2xl text-center text-slate-600 text-sm dark:text-slate-300 md:text-base"
				>
					Upload your lead lists, enrich data, automate outreach, and sync
					everything back to your CRM—all in one seamless workflow.
				</motion.p>
			</div>
		</section>
	);
}
