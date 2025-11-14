"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type ScrollDistanceIndicatorProps = {
	className?: string;
	height?: number;
	springConfig?: {
		damping?: number;
		stiffness?: number;
		mass?: number;
	};
};

export function ScrollDistanceIndicator({
	className,
	height = 3,
	springConfig,
}: ScrollDistanceIndicatorProps) {
	const progress = useMotionValue(0);
	const animatedProgress = useSpring(progress, {
		damping: springConfig?.damping ?? 25,
		stiffness: springConfig?.stiffness ?? 200,
		mass: springConfig?.mass ?? 0.4,
	});
	const frameRef = useRef<number>();

	const handleScroll = useCallback(() => {
		const { scrollY } = window;
		const doc = document.documentElement;
		const scrollHeight = doc.scrollHeight - window.innerHeight;
		const ratio = scrollHeight > 0 ? scrollY / scrollHeight : 0;
		progress.set(Math.min(Math.max(ratio, 0), 1));
	}, [progress]);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;

		const onScroll = () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
			frameRef.current = window.requestAnimationFrame(handleScroll);
		};

		handleScroll();
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
			window.removeEventListener("scroll", onScroll);
		};
	}, [handleScroll]);

	useEffect(
		() => () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
		},
		[],
	);

	const width = useTransform(animatedProgress, (latest) => {
		const clamped = Math.min(Math.max(latest, 0), 1);
		return `${(clamped * 100).toFixed(2)}%`;
	});

	return (
		<div
			className={cn(
				"pointer-events-none fixed inset-x-0 top-0 z-[65] flex h-0 justify-center",
				className,
			)}
			aria-hidden="true"
		>
			<div
				className="pointer-events-auto relative w-full max-w-7xl px-3"
				style={{ height }}
			>
				<div className="absolute inset-0 rounded-full bg-border/40 backdrop-blur-[1px]" />
				<motion.div
					className="absolute inset-y-0 left-0 rounded-full bg-primary shadow-[0_0_12px_rgba(99,102,241,0.45)]"
					style={{ width }}
				/>
			</div>
		</div>
	);
}
