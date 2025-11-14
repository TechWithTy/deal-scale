"use client";

import { motion } from "motion/react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const LAYERS = [
	{
		id: "aurora-blue",
		size: 720,
		top: "-20%",
		left: "-10%",
		duration: 28,
		background:
			"radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), rgba(16,185,129,0))",
	},
	{
		id: "aurora-violet",
		size: 680,
		top: "45%",
		left: "55%",
		duration: 34,
		background:
			"radial-gradient(circle at 80% 20%, rgba(168,85,247,0.28), rgba(14,165,233,0))",
	},
	{
		id: "aurora-rose",
		size: 760,
		top: "10%",
		left: "55%",
		duration: 38,
		background:
			"radial-gradient(circle at 50% 80%, rgba(244,114,182,0.22), rgba(14,116,144,0))",
	},
];

export interface HeroAuroraProps extends HTMLAttributes<HTMLDivElement> {}

export function HeroAurora({
	className,
	children,
	...props
}: HeroAuroraProps): JSX.Element {
	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 overflow-hidden blur-3xl",
				className,
			)}
			{...props}
		>
			{LAYERS.map((layer) => (
				<motion.div
					key={layer.id}
					className="absolute rounded-full opacity-70 mix-blend-screen"
					style={{
						width: layer.size,
						height: layer.size,
						top: layer.top,
						left: layer.left,
						background: layer.background,
						filter: "blur(80px)",
					}}
					animate={{
						rotate: [0, 18, -8, 0],
						scale: [1, 1.04, 0.98, 1],
					}}
					transition={{
						duration: layer.duration,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
			))}
			{children}
		</div>
	);
}
