"use client";

import demoTranscript from "@/data/transcripts";
import { cn } from "@/lib/utils";
import type { Transcript } from "@/types/transcript";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import type { StaticImageData } from "next/image";

const DemoTabs = dynamic(
	() => import("@/components/deal_scale/demo/tabs/DemoTabs"),
	{
		loading: () => <HeroDemoSkeleton />,
		ssr: false,
	},
);

// Define words to highlight with their corresponding gradient colors
const HIGHLIGHT_WORDS = [
	{ word: "real-time", gradient: "from-primary to-focus" },
	{ word: "insights", gradient: "from-blue-500 to-cyan-400" },
	{ word: "analytics", gradient: "from-purple-500 to-pink-500" },
	{ word: "monitor", gradient: "from-emerald-500 to-teal-400" },
];

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
	const shouldReduceMotion = useReducedMotion();

	const animateIn = (delay = 0.1) =>
		shouldReduceMotion
			? {
					initial: { opacity: 1, y: 0 },
					animate: { opacity: 1, y: 0 },
				}
			: {
					initial: { opacity: 0, y: 20 },
					animate: { opacity: 1, y: 0 },
					transition: { duration: 0.4, delay },
				};

	return (
		<section
			className={cn(
				"mx-auto mt-16 mb-8 grid w-full max-w-[90rem] items-center gap-6 px-4 sm:mt-24 sm:mb-16 sm:px-6 lg:my-16 lg:grid-cols-2 lg:gap-8 lg:px-8",
				"min-h-[640px] lg:min-h-[720px]",
				className,
			)}
			aria-labelledby="hero-heading"
		>
			{/* Text Content */}
			<div className="flex h-full flex-col justify-center text-center sm:text-left md:mt-2">
				{badge && (
					<motion.span
						{...animateIn(0.1)}
						className="mx-auto mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm"
					>
						{badge}
					</motion.span>
				)}
				<h1
					id="hero-heading"
					className="mx-auto font-bold text-3xl text-glow sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
				>
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
						{...animateIn(0.4)}
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
			<div className="relative flex w-full max-w-4xl items-stretch justify-center">
				<div className="relative flex w-full max-w-4xl items-stretch">
					<div className="flex min-h-[420px] w-full items-center justify-center rounded-3xl border border-white/10 bg-black/20 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.25)] backdrop-blur lg:min-h-[480px] dark:border-white/5">
						<DemoTabs />
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSessionMonitor;

function HeroDemoSkeleton() {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-4">
			<div className="h-12 w-full max-w-lg animate-pulse rounded-full bg-white/5" />
			<div className="flex w-full max-w-3xl flex-col gap-3">
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder content
						key={index}
						className="h-10 animate-pulse rounded-lg bg-white/5"
					/>
				))}
			</div>
			<div className="h-64 w-full max-w-3xl animate-pulse rounded-2xl bg-white/5" />
		</div>
	);
}
