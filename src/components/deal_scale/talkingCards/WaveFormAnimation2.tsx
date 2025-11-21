"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface WaveForm2Props extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Whether the waveform is active/animating
	 * @default true
	 */
	isActive?: boolean;

	/**
	 * Position of the waveform
	 * @default 'bottom'
	 */
	position?: "top" | "bottom";

	/**
	 * Height of the waveform container
	 * @default 'h-12'
	 */
	height?: string;

	/**
	 * Bar width
	 * @default 'w-2'
	 */
	barWidth?: string;

	/**
	 * Bar gap
	 * @default 'gap-x-2'
	 */
	gap?: string;

	/**
	 * Bar colors
	 * @default ['bg-primary/60', 'bg-focus/60', 'bg-accent/60']
	 */
	colors?: string[];

	/**
	 * Animation speed in seconds
	 * @default 1
	 */
	speed?: number;
}

const WaveFormAnimation2 = ({
	className,
	isActive = true,
	position = "bottom",
	height = "h-12",
	barWidth = "w-2",
	gap = "gap-x-2",
	colors = ["bg-primary/60", "bg-focus/60", "bg-accent/60"],
	speed = 1,
	...props
}: WaveForm2Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const animationFrame = useRef<number>();
	const startTime = useRef<number>(0);

	// Bar heights (as percentages of container height)
	const barHeights = [20, 40, 60, 80, 100, 80, 60, 40, 20];

	// Animation loop
	useEffect(() => {
		if (!isActive || !containerRef.current) return;

		const container = containerRef.current;
		const bars = container.querySelectorAll<HTMLDivElement>(
			"[data-waveform-bar]",
		);

		if (bars.length === 0) return;

		const animate = (time: number) => {
			if (!startTime.current) startTime.current = time;

			const elapsed = (time - startTime.current) / 1000; // Convert to seconds

			for (let i = 0; i < bars.length; i++) {
				const bar = bars[i];
				const delay = Number.parseFloat(
					bar.style.getPropertyValue("--i") || "0",
				);
				const t = (elapsed / speed + delay) % 1;

				// Scale animation (0 -> 1 -> 0)
				let scale = 0;
				if (t < 0.5) {
					scale = t * 2; // 0 to 1
				} else {
					scale = 2 - t * 2; // 1 to 0
				}

				bar.style.transform = `scaleY(${scale})`;
			}

			animationFrame.current = requestAnimationFrame(animate);
		};

		animationFrame.current = requestAnimationFrame(animate);

		return () => {
			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current);
			}
		};
	}, [isActive, speed]);

	// Set initial styles when inactive
	useEffect(() => {
		if (!isActive && containerRef.current) {
			const bars = containerRef.current.querySelectorAll<HTMLDivElement>(
				"[data-waveform-bar]",
			);
			for (const bar of bars) {
				bar.style.transform = "scaleY(0)";
			}
		}
	}, [isActive]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"flex h-full w-full items-end justify-center overflow-visible pb-1",
				height,
				gap,
				className,
			)}
			aria-hidden="true"
			{...props}
		>
			{barHeights.map((height, index) => {
				const colorIndex = index % colors.length;
				const delay = (index * 0.1) % 1; // Stagger the animation
				const barId = `waveform-bar-${index}`;

				return (
					<div
						key={barId}
						data-waveform-bar
						className={cn(
							"rounded-full transition-transform duration-300 ease-in-out will-change-transform",
							barWidth,
							colors[colorIndex],
							{
								"-translate-y-0.5 origin-bottom": position === "bottom",
								"origin-top translate-y-0.5": position === "top",
							},
						)}
						style={
							{
								"--i": delay,
								height: `${height}%`,
								"--tw-scale-y": "0",
							} as React.CSSProperties
						}
					/>
				);
			})}
		</div>
	);
};

export { WaveFormAnimation2 };
