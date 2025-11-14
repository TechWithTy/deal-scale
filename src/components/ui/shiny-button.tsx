"use client";

import { type MotionProps, motion } from "motion/react";
import {
	type ButtonHTMLAttributes,
	type CSSProperties,
	type ReactNode,
	forwardRef,
} from "react";

import { cn } from "@/lib/utils";

const animationProps: MotionProps = {
	initial: { "--x": "100%", scale: 0.8 },
	animate: { "--x": "-100%", scale: 1 },
	whileTap: { scale: 0.95 },
	transition: {
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "loop",
		repeatDelay: 1,
		type: "spring",
		stiffness: 20,
		damping: 15,
		mass: 2,
		scale: {
			type: "spring",
			stiffness: 200,
			damping: 5,
			mass: 0.5,
		},
	},
};

export interface ShinyButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>,
		MotionProps {
	className?: string;
	primaryColor?: string;
	children?: ReactNode;
}

export const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(
	({ children, className, primaryColor = "#2563eb", style, ...props }, ref) => {
		const mergedStyle = {
			"--primary": primaryColor,
			...style,
		} as CSSProperties;

		return (
			<motion.button
				ref={ref}
				className={cn(
					"relative cursor-pointer rounded-full border px-6 py-2 font-medium uppercase tracking-wide backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-lg",
					"text-[rgb(0,0,0,0.75)] dark:text-[rgb(255,255,255,0.92)]",
					"bg-[radial-gradient(circle_at_50%_0%,var(--primary)/18%_0%,rgba(37,99,235,0.04)_70%)]",
					"border-blue-500/40 dark:border-blue-400/50",
					className,
				)}
				style={mergedStyle}
				{...animationProps}
				{...props}
			>
				<span
					className="relative block size-full text-sm"
					style={{
						maskImage:
							"linear-gradient(-75deg,var(--primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--primary) calc(var(--x) + 100%))",
					}}
				>
					{children}
				</span>
				<span
					style={{
						mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
						WebkitMask:
							"linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
						backgroundImage:
							"linear-gradient(-75deg,var(--primary)/10% calc(var(--x)+20%),var(--primary)/50% calc(var(--x)+25%),var(--primary)/10% calc(var(--x)+100%))",
					}}
					className="absolute inset-0 z-10 block rounded-[inherit] p-px"
				/>
			</motion.button>
		);
	},
);

ShinyButton.displayName = "ShinyButton";

export default ShinyButton;
