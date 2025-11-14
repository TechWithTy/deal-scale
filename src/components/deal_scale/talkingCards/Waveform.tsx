"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef } from "react";

type WaveformVariant = "sine" | "square" | "sawtooth" | "triangle";

interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
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
	 * Number of bars in the waveform
	 * @default 21
	 */
	barCount?: number;

	/**
	 * Animation variant
	 * @default 'sine'
	 */
	variant?: WaveformVariant;

	/**
	 * Animation speed in seconds
	 * @default 1.5
	 */
	speed?: number;

	/**
	 * Color of the waveform bars
	 * @default 'hsl(var(--primary))'
	 */
	color?: string;

	/**
	 * Opacity of the waveform bars when inactive
	 * @default 0.15
	 */
	inactiveOpacity?: number;

	/**
	 * Opacity of the waveform bars when active
	 * @default 0.8
	 */
	activeOpacity?: number;
}

// Predefined animation curves for different waveform types
const WAVEFORM_CURVES: Record<WaveformVariant, (t: number) => number> = {
	sine: (t) => Math.abs(Math.sin(t * Math.PI * 2)),
	square: (t) => (t % 1 < 0.5 ? 1 : 0.2),
	sawtooth: (t) => (t % 1) * 0.8 + 0.2,
	triangle: (t) => 1 - Math.abs(((t * 2 + 0.5) % 2) - 1) * 0.8,
};

const Waveform = ({
	className,
	isActive = true,
	position = "bottom",
	barCount = 21,
	variant = "sine",
	speed = 1.5,
	color = "hsl(var(--primary))",
	inactiveOpacity = 0.15,
	activeOpacity = 0.8,
	style,
	...props
}: WaveformProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const animationFrame = useRef<number>();
	const startTime = useRef<number>(0);

	// Generate stable keys for the bars
	const barKeys = useMemo(
		() => Array.from({ length: barCount }, (_, i) => `waveform-bar-${i}`),
		[barCount],
	);

	// Get the animation curve based on variant
	const getAnimationValue = useMemo(
		() => WAVEFORM_CURVES[variant] || WAVEFORM_CURVES.sine,
		[variant],
	);

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

			bars.forEach((bar, index) => {
				const position = index / (bars.length - 1);
				const timeOffset = position * 0.5; // Stagger the animation
				const t = (elapsed / speed + timeOffset) % 1;

				// Calculate height based on waveform type and time
				const height = getAnimationValue(t);

				// Apply the height with smooth transition
				bar.style.height = `${height * 100}%`;
				bar.style.opacity = `${inactiveOpacity + (activeOpacity - inactiveOpacity) * height}`;
			});

			animationFrame.current = requestAnimationFrame(animate);
		};

		animationFrame.current = requestAnimationFrame(animate);

		return () => {
			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current);
			}
		};
	}, [isActive, speed, getAnimationValue, inactiveOpacity, activeOpacity]);

	// Reset animation when variant changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		startTime.current = 0;
	}, [variant]);

	// Set initial styles when inactive
	useEffect(() => {
		if (!isActive && containerRef.current) {
			const bars = containerRef.current.querySelectorAll<HTMLDivElement>(
				"[data-waveform-bar]",
			);
			for (const bar of bars) {
				bar.style.height = "15%";
				bar.style.opacity = inactiveOpacity.toString();
			}
		}
	}, [isActive, inactiveOpacity]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"flex h-12 items-end gap-0.5",
				position === "top" && "flex-col-reverse",
				"transition-opacity duration-300",
				!isActive && "opacity-70",
				className,
			)}
			aria-hidden="true"
			style={
				{
					"--waveform-color": color,
					...style,
				} as React.CSSProperties
			}
			{...props}
		>
			{barKeys.map((key, index) => (
				<div
					key={key}
					data-waveform-bar
					className={cn(
						"w-0.5 min-w-[2px] rounded-full bg-[var(--waveform-color)]",
						"transition-all duration-300 ease-in-out",
						"hover:scale-x-150 hover:bg-accent hover:opacity-100",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						"motion-reduce:transition-none motion-reduce:hover:scale-100",
						"opacity will-change-transform,",
					)}
					style={
						{
							height: isActive ? "15%" : "15%",
							opacity: isActive ? inactiveOpacity : inactiveOpacity,
							transition: isActive
								? "height 0.3s ease-in-out, opacity 0.3s ease-in-out, transform 0.2s ease-in-out"
								: "height 0.5s ease-in-out, opacity 0.5s ease-in-out, transform 0.2s ease-in-out",
							transformOrigin:
								position === "top" ? "bottom center" : "top center",
							"--tw-ring-offset-shadow": "0 0 #0000",
							"--tw-ring-shadow": "0 0 #0000",
						} as React.CSSProperties
					}
				/>
			))}
		</div>
	);
};

export { Waveform };
export type { WaveformProps, WaveformVariant };
