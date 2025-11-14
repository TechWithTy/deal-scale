"use client";

import type React from "react";
import { memo } from "react";

export interface AuroraTextProps {
	children: React.ReactNode;
	className?: string;
	colors?: string[];
	speed?: number;
	blur?: number;
	glowOpacity?: number;
}

export const AuroraText = memo(
	({
		children,
		className = "",
		colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
		speed = 1,
		blur = 0,
		glowOpacity = 0.65,
	}: AuroraTextProps) => {
		const gradientStyle: React.CSSProperties = {
			backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
				colors[0]
			})`,
			WebkitBackgroundClip: "text",
			WebkitTextFillColor: "transparent",
			animationDuration: `${10 / speed}s`,
		};

		const blurStyle: React.CSSProperties | undefined =
			blur > 0
				? {
					...gradientStyle,
					filter: `blur(${blur}px)`,
					opacity: glowOpacity,
				}
				: undefined;

		return (
			<span className={`relative inline-block ${className}`}>
				<span className="sr-only">{children}</span>
				{blurStyle ? (
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 select-none animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent"
						style={blurStyle}
					>
						{children}
					</span>
				) : null}
				<span
					className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent"
					style={gradientStyle}
					aria-hidden="true"
				>
					{children}
				</span>
			</span>
		);
	},
);

AuroraText.displayName = "AuroraText";
