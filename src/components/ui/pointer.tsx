"use client";

import type { HTMLMotionProps } from "motion/react";
import {
	AnimatePresence,
	motion,
	useMotionValue,
} from "motion/react";
import {
	useEffect,
	useRef,
	useState,
} from "react";

import { cn } from "@/lib/utils";

type PointerProps = HTMLMotionProps<"span"> & {
	enabled?: boolean;
};

export function Pointer({
	className,
	style,
	children,
	enabled = true,
	...props
}: PointerProps) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const [isActive, setIsActive] = useState(false);
	const containerRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!enabled || typeof window === "undefined") {
			return;
		}

		const parentElement = containerRef.current?.parentElement;
		if (!parentElement) {
			return;
		}

		const handleMouseMove = (event: MouseEvent) => {
			x.set(event.clientX);
			y.set(event.clientY);
		};

		const handleMouseEnter = (event: MouseEvent) => {
			x.set(event.clientX);
			y.set(event.clientY);
			setIsActive(true);
		};

		const handleMouseLeave = () => {
			setIsActive(false);
		};

		const originalCursor = parentElement.style.cursor;
		parentElement.style.cursor = "none";

		parentElement.addEventListener("mousemove", handleMouseMove);
		parentElement.addEventListener("mouseenter", handleMouseEnter);
		parentElement.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			parentElement.style.cursor = originalCursor;
			parentElement.removeEventListener("mousemove", handleMouseMove);
			parentElement.removeEventListener("mouseenter", handleMouseEnter);
			parentElement.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [enabled, x, y]);

	return (
		<>
			<span ref={containerRef} />
			<AnimatePresence>
				{enabled && isActive ? (
					<motion.span
						className="pointer-events-none fixed z-50 translate-x-[-50%] translate-y-[-50%]"
						style={{
							top: y,
							left: x,
							...style,
						}}
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						{...props}
					>
						{children ?? (
							<span
								className={cn(
									"flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 bg-primary/30 text-primary shadow-lg backdrop-blur",
									className,
								)}
							>
								<svg
									stroke="currentColor"
									fill="currentColor"
									strokeWidth="1"
									viewBox="0 0 16 16"
									height="18"
									width="18"
									xmlns="http://www.w3.org/2000/svg"
									className="-rotate-45"
									aria-hidden="true"
								>
									<path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
								</svg>
							</span>
						)}
					</motion.span>
				) : null}
			</AnimatePresence>
		</>
	);
}

