"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type React from "react";

interface LasersBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	/** Controls the opacity envelope of the pulsating beams. */
	intensity?: number;
	/** Controls the animation duration in seconds. */
	pulseDuration?: number;
}

const beamBaseClasses =
	"pointer-events-none absolute inset-y-[-10%] w-[45%] bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-2xl";

export function LasersBackground({
	children,
	className,
	intensity = 0.65,
	pulseDuration = 4,
	...props
}: LasersBackgroundProps) {
	const opacityStops = [
		Math.max(0.15, intensity * 0.35),
		Math.min(0.9, intensity),
		Math.max(0.2, intensity * 0.45),
	];

	return (
		<div
			className={cn(
				"relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-background/70 via-background to-background/90",
				className,
			)}
			{...props}
		>
			<motion.div
				className={cn(beamBaseClasses, "left-[-25%]")}
				animate={{
					opacity: opacityStops,
					scaleX: [0.85, 1.1, 0.9],
				}}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: pulseDuration,
					ease: "easeInOut",
				}}
			/>

			<motion.div
				className={cn(beamBaseClasses, "right-[-25%] rotate-180")}
				animate={{
					opacity: opacityStops,
					scaleX: [1, 0.85, 1.1],
				}}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: pulseDuration * 1.1,
					ease: "easeInOut",
				}}
			/>

			<motion.div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(80,120,255,0.2),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(80,120,255,0.35),transparent_65%)]"
				animate={{
					opacity: [0.35, 0.6, 0.4],
				}}
				transition={{
					repeat: Number.POSITIVE_INFINITY,
					duration: pulseDuration * 1.5,
					ease: "easeInOut",
				}}
			/>

			<div className="relative z-10 w-full">{children}</div>
		</div>
	);
}
