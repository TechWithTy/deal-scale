"use client";

import { motion } from "motion/react";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface LightRaysProps extends HTMLAttributes<HTMLDivElement> {
	count?: number;
	color?: string;
	blur?: number;
	speed?: number;
	length?: string;
}

type LightRay = {
	id: string;
	left: number;
	rotate: number;
	width: number;
	swing: number;
	delay: number;
	duration: number;
	intensity: number;
};

const createRays = (count: number, cycle: number): LightRay[] => {
	if (count <= 0) {
		return [];
	}

	return Array.from({ length: count }, (_, index) => {
		const left = 8 + Math.random() * 84;
		const rotate = -28 + Math.random() * 56;
		const width = 140 + Math.random() * 160;
		const swing = 0.9 + Math.random() * 1.6;
		const delay = Math.random() * cycle;
		const duration = cycle * (0.75 + Math.random() * 0.4);
		const intensity = 0.55 + Math.random() * 0.45;

		return {
			id: `${index}-${Math.round(left * 10)}`,
			left,
			rotate,
			width,
			swing,
			delay,
			duration,
			intensity,
		};
	});
};

const Ray = ({
	left,
	rotate,
	width,
	swing,
	delay,
	duration,
	intensity,
}: LightRay) => (
	<motion.div
		// biome-ignore lint/nursery/useSortedClasses: <explanation>
		className="pointer-events-none absolute -top-[12%] left-[var(--ray-left)] h-[var(--light-rays-length)] w-[var(--ray-width)] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-[color-mix(in_srgb,var(--light-rays-color)_80%,transparent)] to-transparent opacity-0 mix-blend-screen blur-[var(--light-rays-blur)]"
		style={
			{
				"--ray-left": `${left}%`,
				"--ray-width": `${width}px`,
			} as CSSProperties
		}
		initial={{ rotate }}
		animate={{
			opacity: [0, intensity, 0],
			rotate: [rotate - swing, rotate + swing, rotate - swing],
		}}
		transition={{
			duration,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
			delay,
			repeatDelay: duration * 0.12,
		}}
	/>
);

export function LightRays({
	className,
	style,
	count = 7,
	color = "rgba(180, 255, 210, 0.22)",
	blur = 32,
	speed = 14,
	length = "72vh",
	...props
}: LightRaysProps) {
	const [rays, setRays] = useState<LightRay[]>([]);
	const cycleDuration = Math.max(speed, 0.1);

	useEffect(() => {
		setRays(createRays(count, cycleDuration));
	}, [count, cycleDuration]);

	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]",
				className,
			)}
			style={
				{
					"--light-rays-color": color,
					"--light-rays-blur": `${blur}px`,
					"--light-rays-length": length,
					...style,
				} as CSSProperties
			}
			{...props}
		>
			<div className="absolute inset-0 overflow-hidden">
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-60"
					style={
						{
							background:
								"radial-gradient(circle at 18% 15%, color-mix(in srgb, var(--light-rays-color) 45%, transparent), transparent 72%)",
						} as CSSProperties
					}
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-60"
					style={
						{
							background:
								"radial-gradient(circle at 82% 10%, color-mix(in srgb, var(--light-rays-color) 35%, transparent), transparent 80%)",
						} as CSSProperties
					}
				/>
				{rays.map((ray) => (
					<Ray key={ray.id} {...ray} />
				))}
			</div>
		</div>
	);
}
