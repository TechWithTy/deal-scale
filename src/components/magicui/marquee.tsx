import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
	/**
	 * Optional CSS class name to apply custom styles
	 */
	className?: string;
	/**
	 * Whether to reverse the animation direction
	 * @default false
	 */
	reverse?: boolean;
	/**
	 * Whether to pause the animation on hover
	 * @default false
	 */
	pauseOnHover?: boolean;
	/**
	 * Content to be displayed in the marquee
	 */
	children: React.ReactNode;
	/**
	 * Whether to animate vertically instead of horizontally
	 * @default false
	 */
	vertical?: boolean;
	/**
	 * Number of times to repeat the content
	 * @default 4
	 */
	repeat?: number;
	/**
	 * Animation duration in seconds (e.g. "20s").
	 * @default "40s"
	 */
	duration?: string;
	/**
	 * Gap between items in the marquee
	 * @default "1rem"
	 */
	gap?: string;
}

export function Marquee({
	className,
	reverse = false,
	pauseOnHover = false,
	children,
	vertical = false,
	repeat = 4,
	duration = "40s",
	gap = "1rem",
	...props
}: MarqueeProps) {
	return (
		<div
			{...props}
			className={cn(
				"group flex overflow-hidden p-2",
				{
					"flex-row": !vertical,
					"flex-col": vertical,
				},
				className,
			)}
			style={
				{
					"--gap": gap,
					gap: "var(--gap)",
				} as React.CSSProperties
			}
		>
			{Array.from({ length: repeat }, (_, i) => (
				<div
					key={`marquee-item-${i}`}
					className={cn("flex shrink-0 justify-around", {
						"animate-marquee flex-row": !vertical,
						"animate-marquee-vertical flex-col": vertical,
						"group-hover:[animation-play-state:paused]": pauseOnHover,
						"[animation-direction:reverse]": reverse,
					})}
					style={
						{
							"--duration": duration,
							gap: "var(--gap)",
						} as React.CSSProperties
					}
				>
					{children}
				</div>
			))}
		</div>
	);
}
