"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type TextFlipHighlightVariant = "primary" | "destructive" | "warning";

interface TextFlipHighlightProps {
	readonly words: readonly string[];
	readonly activeIndex?: number;
	readonly variant?: TextFlipHighlightVariant;
	readonly animationDuration?: number;
	readonly className?: string;
	readonly textClassName?: string;
}

const VARIANT_THEME: Record<
	TextFlipHighlightVariant,
	{ container: string; glow: string; text: string }
> = {
	primary: {
		container:
			"border border-primary/35 bg-primary/12 text-primary shadow-[0_22px_58px_-28px_rgba(37,99,235,0.55)]",
		glow: "bg-primary/18",
		text: "text-primary",
	},
	destructive: {
		container:
			"border border-destructive/30 bg-destructive/12 text-destructive shadow-[0_22px_52px_-26px_rgba(239,68,68,0.55)]",
		glow: "bg-destructive/18",
		text: "text-destructive",
	},
	warning: {
		container:
			"border border-amber-400/30 bg-amber-200/20 text-amber-500 shadow-[0_22px_52px_-26px_rgba(245,158,11,0.45)] dark:bg-amber-200/12 dark:text-amber-200",
		glow: "bg-amber-300/20",
		text: "text-amber-500 dark:text-amber-200",
	},
};

export function TextFlipHighlight({
	words,
	activeIndex,
	variant = "primary",
	animationDuration = 700,
	className,
	textClassName,
}: TextFlipHighlightProps): JSX.Element {
	const normalizedWords = useMemo(() => {
		const trimmed = words.map((word) => (word ?? "").trim());
		const fallback = trimmed.find((word) => word.length > 0) ?? "";
		if (fallback.length === 0) {
			return [""];
		}
		return trimmed.map((word) => (word.length > 0 ? word : fallback));
	}, [words]);
	const [internalIndex, setInternalIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);

	const boundedIndex = useMemo(() => {
		const index = activeIndex ?? internalIndex;
		if (normalizedWords.length === 0) {
			return 0;
		}
		return (
			((index % normalizedWords.length) + normalizedWords.length) %
			normalizedWords.length
		);
	}, [activeIndex, internalIndex, normalizedWords.length]);

	const activeWord = normalizedWords[boundedIndex] ?? "";

	useEffect(() => {
		if (typeof activeIndex === "number") {
			return;
		}

		if (normalizedWords.length <= 1) {
			return;
		}

		const interval = window.setInterval(() => {
			setInternalIndex(
				(current) => (current + 1) % Math.max(normalizedWords.length, 1),
			);
		}, animationDuration + 2200);

		return () => window.clearInterval(interval);
	}, [activeIndex, animationDuration, normalizedWords.length]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: boundedIndex expresses the latest rotation frame and is sufficient to retrigger the glow animation
	useEffect(() => {
		if (normalizedWords.length <= 1) {
			return;
		}

		setIsAnimating(true);
		const timeout = window.setTimeout(
			() => setIsAnimating(false),
			animationDuration,
		);
		return () => window.clearTimeout(timeout);
	}, [boundedIndex, animationDuration, normalizedWords.length]);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const theme = VARIANT_THEME[variant];

	const baseInitialState = hasMounted
		? { opacity: 0, y: 16, rotateX: -35 }
		: { opacity: 1, y: 0, rotateX: 0 };

	return (
		<span className="relative inline-flex min-w-[8ch] justify-start align-baseline">
			<motion.span
				aria-hidden
				animate={{
					scale: isAnimating ? [1, 1.05, 1] : 1,
					opacity: isAnimating ? [0.7, 1, 0.7] : 0.7,
				}}
				transition={{ duration: animationDuration / 1000, ease: "easeInOut" }}
				className={cn("absolute inset-0 rounded-2xl blur-xl", theme.glow)}
			/>
			<motion.span
				layout
				animate={{ scale: isAnimating ? [1, 0.97, 1] : 1 }}
				transition={{
					duration: animationDuration / 1000,
					ease: "easeInOut",
					layout: { duration: 0.28 },
				}}
				className={cn(
					"relative inline-flex min-w-[8ch] items-center justify-start overflow-hidden rounded-2xl px-4 py-2 text-left backdrop-blur-lg",
					theme.container,
					className,
				)}
			>
				<AnimatePresence mode="sync" initial={false}>
					<motion.span
						key={`${boundedIndex}-${activeWord}`}
						initial={baseInitialState}
						animate={{ opacity: 1, y: 0, rotateX: 0 }}
						exit={{ opacity: 0, y: -12, rotateX: 26 }}
						transition={{
							duration: animationDuration / 1000,
							ease: [0.25, 0.25, 0, 1],
							rotateX: { duration: animationDuration / 1100, ease: "easeOut" },
						}}
						className={cn(
							"text-balance font-semibold text-base md:text-lg whitespace-nowrap",
							theme.text,
							textClassName,
						)}
					>
						{activeWord}
					</motion.span>
				</AnimatePresence>
			</motion.span>
		</span>
	);
}
