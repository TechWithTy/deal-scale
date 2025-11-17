"use client";

import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ProgressiveBlurPosition = "top" | "bottom" | "left" | "right";

type ProgressiveBlurProps = HTMLAttributes<HTMLDivElement> & {
	readonly position?: ProgressiveBlurPosition;
	readonly height?: string;
	readonly width?: string;
	readonly blurLevels?: readonly number[];
};

const POSITION_CLASS: Record<ProgressiveBlurPosition, string> = {
	top: "inset-x-0 top-0",
	bottom: "inset-x-0 bottom-0",
	left: "left-0 inset-y-0",
	right: "right-0 inset-y-0",
};

export function ProgressiveBlur({
	className,
	position = "bottom",
	height,
	width,
	blurLevels,
	style,
	...props
}: ProgressiveBlurProps): JSX.Element {
	const sizeStyle: Record<string, string | number | undefined> = {};
	if (typeof height === "string") {
		sizeStyle.height = height;
	}
	if (typeof width === "string") {
		sizeStyle.width = width;
	}

	const shadowBlur =
		blurLevels && blurLevels.length > 0
			? `blur(${blurLevels[blurLevels.length - 1] ?? 12}px)`
			: "blur(24px)";

	const gradientDirection =
		position === "top"
			? "to bottom"
			: position === "bottom"
				? "to top"
				: position === "left"
					? "to right"
					: "to left";

	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute mx-auto w-full max-w-full overflow-hidden",
				POSITION_CLASS[position],
				className,
			)}
			style={{
				...sizeStyle,
				...style,
				filter: shadowBlur,
				background: `linear-gradient(${gradientDirection}, var(--progressive-blur-gradient, rgba(15, 23, 42, 0.75)), transparent)`,
			}}
			{...props}
		/>
	);
}



