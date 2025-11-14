"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

type MetallicHoverCardProps = {
	children: ReactNode;
	className?: string;
	innerClassName?: string;
	intensity?: number;
	disableTilt?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const DEFAULT_INTENSITY = 10;

export function MetallicHoverCard({
	children,
	className,
	innerClassName,
	intensity = DEFAULT_INTENSITY,
	disableTilt = false,
	...props
}: MetallicHoverCardProps) {
	const cardRef = useRef<HTMLDivElement | null>(null);
	const frameRef = useRef<number>();

	const applyTilt = useCallback((x: number, y: number) => {
		if (!cardRef.current) return;
		cardRef.current.style.transform = `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg)`;
	}, []);

	const scheduleTilt = useCallback(
		(x: number, y: number) => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}

			frameRef.current = requestAnimationFrame(() => {
				applyTilt(x, y);
			});
		},
		[applyTilt],
	);

	const handlePointerMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (disableTilt) {
				return;
			}
			const node = cardRef.current;
			if (!node) return;

			const rect = node.getBoundingClientRect();
			const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
			const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

			const rotateX = -(normalizedY * 2 * intensity);
			const rotateY = normalizedX * 2 * intensity;

			scheduleTilt(rotateX, rotateY);
		},
		[disableTilt, intensity, scheduleTilt],
	);

	const resetTilt = useCallback(() => {
		if (disableTilt) {
			return;
		}
		scheduleTilt(0, 0);
	}, [disableTilt, scheduleTilt]);

	useEffect(() => {
		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={cardRef}
			className={cn(
				"group metallic-hover-card relative h-full cursor-pointer rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white via-slate-100 to-slate-200/60 p-[2px] shadow-xl transition-transform duration-200 ease-out will-change-transform dark:border-white/10 dark:from-slate-900/50 dark:via-indigo-900/40 dark:to-slate-950/60",
				className,
			)}
			style={
				disableTilt
					? undefined
					: { transform: "perspective(1200px) rotateX(0deg) rotateY(0deg)" }
			}
			onPointerMove={!disableTilt ? handlePointerMove : undefined}
			onPointerLeave={!disableTilt ? resetTilt : undefined}
			onPointerUp={!disableTilt ? resetTilt : undefined}
			onPointerCancel={!disableTilt ? resetTilt : undefined}
			{...props}
		>
			<div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_70%)]" />
			<div
				className={cn(
					"relative h-full rounded-[calc(1.5rem-4px)] border border-white/20 bg-white/85 text-foreground backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70",
					innerClassName,
				)}
			>
				{children}
			</div>
		</div>
	);
}
