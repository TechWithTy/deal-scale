"use client";

import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GlobeProps = HTMLAttributes<HTMLDivElement> & {
	readonly gradientStops?: readonly string[];
};

const DEFAULT_STOPS = [
	"rgba(59, 130, 246, 0.25)",
	"rgba(14, 165, 233, 0.15)",
	"rgba(16, 185, 129, 0.18)",
	"rgba(59, 130, 246, 0)",
] as const;

export function Globe({
	className,
	style,
	gradientStops = DEFAULT_STOPS,
	...props
}: GlobeProps): JSX.Element {
	const background = `radial-gradient(circle at 50% 50%, ${gradientStops.join(
		", ",
	)})`;

	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none relative aspect-square w-full min-w-[320px] max-w-none rounded-full blur-3xl",
				"bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.25),rgba(14,165,233,0.1),rgba(16,185,129,0.18),rgba(59,130,246,0))]",
				className,
			)}
			style={{
				...style,
				background,
			}}
			{...props}
		/>
	);
}




