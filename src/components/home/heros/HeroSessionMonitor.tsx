"use client";

import DemoTabs from "@/components/deal_scale/demo/tabs/DemoTabs";
import demoTranscript from "@/data/transcripts";
import { cn } from "@/lib/utils";
import type { Transcript } from "@/types/transcript";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import type { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

// Define words to highlight with their corresponding gradient colors
const HIGHLIGHT_WORDS = [
	{ word: "real-time", gradient: "from-primary to-focus" },
	{ word: "insights", gradient: "from-blue-500 to-cyan-400" },
	{ word: "analytics", gradient: "from-purple-500 to-pink-500" },
	{ word: "monitor", gradient: "from-emerald-500 to-teal-400" },
];

const animateIn = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

export interface HeroSessionMonitorProps {
	transcript?: Transcript;
	className?: string;
	headline: string;
	subheadline: string;
	highlight?: string;
	highlightWords?: Array<{ word: string; gradient: string }>;
	ctaLabel?: string;
	ctaLabel2?: string;
	onCtaClick?: () => void;
	onCtaClick2?: () => void;
	onTransfer?: () => void;
	onCallEnd?: () => void;
	onSessionReset?: (resetFn: () => void) => void;
	badge?: string;
	isMobile?: boolean;
	backgroundImage?: string | StaticImageData;
}

// Helper component to render text with highlighted words
const HighlightedText: React.FC<{
	text: string;
	highlightWords: Array<{ word: string; gradient: string }>;
}> = ({ text, highlightWords }) => {
	// Split text into parts and apply highlights
	const parts: (string | JSX.Element)[] = [text];

	for (const { word, gradient } of highlightWords) {
		const regex = new RegExp(`\\b${word}\\b`, "gi");
		const newParts: (string | JSX.Element)[] = [];

		for (const part of parts) {
			if (typeof part !== "string") {
				newParts.push(part);
				continue;
			}

			let lastIndex = 0;
			let match: RegExpExecArray | null = null;

			// biome-ignore lint/suspicious/noAssignInExpressions: Required for regex iteration
			while ((match = regex.exec(part)) !== null) {
				// Add text before the match
				if (match.index > lastIndex) {
					newParts.push(part.substring(lastIndex, match.index));
				}

				// Add the highlighted word
				newParts.push(
					<span
						key={`${word}-${match.index}`}
						className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
					>
						{match[0]}
					</span>,
				);

				lastIndex = match.index + match[0].length;
			}

			// Add remaining text
			if (lastIndex < part.length) {
				newParts.push(part.substring(lastIndex));
			}
		}

		parts.length = 0;
		parts.push(...newParts);
	}

	return <>{parts.length > 0 ? parts : text}</>;
};

const HeroSessionMonitor: React.FC<HeroSessionMonitorProps> = ({
	transcript = demoTranscript,
	className,
	headline,
	subheadline,
	highlight = "Appointments Delivered",
	highlightWords = HIGHLIGHT_WORDS,
	ctaLabel = "Get Started",
	ctaLabel2 = "Get Started",

	onCtaClick,
	onCtaClick2,
	onCallEnd,
	onTransfer,
	onSessionReset,
	badge,
	isMobile = false,
	backgroundImage,
}) => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Only render on client to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className={cn("relative overflow-hidden", className)}>
				<div className="h-[500px] w-full animate-pulse bg-muted/20" />
			</div>
		);
	}
	return (
		<div
			className={cn(
				"mx-auto mt-16 mb-8 grid w-full max-w-[90rem] items-center gap-6 px-4 sm:mt-24 sm:mb-16 sm:px-6 lg:my-16 lg:grid-cols-2 lg:gap-8 lg:px-8",
				className,
			)}
		>
			{/* Text Content */}
			<div className="text-center sm:text-left md:mt-2">
				{badge && (
					<motion.span
						variants={animateIn}
						initial="hidden"
						animate="visible"
						transition={{ duration: 0.4, delay: 0.1 }}
						className="mx-auto mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm"
					>
						{badge}
					</motion.span>
				)}
				<h1 className="mx-auto animate-fade-in font-bold text-3xl text-glow sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
					{headline}
				</h1>
				<span className="mx-auto my-2 block bg-gradient-to-r from-primary to-focus bg-clip-text py-2 font-bold text-3xl text-transparent sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
					{highlight}
				</span>

				<p className="mx-auto mb-6 max-w-md text-base text-black sm:mb-10 sm:text-lg lg:max-w-xl lg:text-xl xl:max-w-2xl dark:text-white/70">
					<HighlightedText text={subheadline} highlightWords={highlightWords} />
				</p>
				{(onCtaClick || onCtaClick2) && (
					<motion.div
						variants={animateIn}
						initial="hidden"
						animate="visible"
						transition={{ duration: 0.4, delay: 0.4 }}
						className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:justify-start"
					>
						{onCtaClick && (
							<button
								onClick={onCtaClick}
								type="button"
								className="rounded-md bg-primary px-3.5 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
							>
								{ctaLabel}
							</button>
						)}
						{onCtaClick2 && (
							<button
								onClick={onCtaClick2}
								type="button"
								className={cn(
									"animate-pulse rounded-md px-3.5 py-2.5 font-semibold text-sm shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 focus-visible:outline-offset-2",
									"bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white hover:from-pink-600 hover:via-red-600 hover:to-yellow-500",
									"dark:bg-gradient-to-r dark:from-pink-700 dark:via-red-700 dark:to-yellow-600 dark:text-black",
								)}
								style={{
									boxShadow:
										"0 4px 24px 0 rgba(255, 128, 0, 0.17), 0 2px 4px 0 rgba(255, 0, 128, 0.13)",
								}}
							>
								{ctaLabel2}
							</button>
						)}
					</motion.div>
				)}
			</div>

			{/* Session Monitor Carousel */}
			<div className="relative w-full max-w-4xl">
				<DemoTabs />
			</div>
		</div>
	);
};

export default HeroSessionMonitor;
