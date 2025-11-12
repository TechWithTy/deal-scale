"use client";

import { cn } from "@/lib/utils";
import { GitBranch } from "lucide-react";
import { AuroraText } from "@/components/magicui/aurora-text";
import { SparklesText } from "@/components/ui/sparkles-text";

const FEATURE_CARDS = [
	{
		key: "before",
		title: "Before",
		description: "Flat, robotic delivery that breaks connection.",
		className:
			"border border-red-200 bg-gradient-to-br from-red-100 via-red-50 to-red-200/80 text-red-900 dark:border-red-500/30 dark:from-red-700/25 dark:via-red-600/20 dark:to-red-900/35 dark:text-red-50/90",
		labelClassName: "text-red-600 dark:text-red-200/90",
	},
	{
		key: "after",
		title: "After",
		description:
			"Expressive, human tone that builds trust instantly.",
		className:
			"border border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-200/80 text-emerald-900 dark:border-emerald-300/35 dark:from-emerald-600/20 dark:via-emerald-500/15 dark:to-emerald-900/30 dark:text-emerald-50/90",
		labelClassName: "text-emerald-600 dark:text-emerald-100/90",
	},
] as const;

type PixelatedVoiceOverlayProps = {
	isInteractive: boolean;
	isPlaying: boolean;
	isLoadingAudio: boolean;
	onPlay: () => void;
	onStop: () => void;
	onEnableInteractive: () => void;
	onDisableInteractive: () => void;
	title?: string;
	subtitle?: string;
};

export function PixelatedVoiceOverlay({
	isInteractive,
	isPlaying,
	isLoadingAudio,
	onPlay,
	onStop,
	onEnableInteractive,
	onDisableInteractive,
	title = "Your AI Clone: Authentic, Expressive, Unmistakably You",
	subtitle = "DealScale’s neural voice stack emulates your tone, pacing, and emotion so every conversation still sounds like you.",
}: PixelatedVoiceOverlayProps) {
	return (
		<>
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-t from-white via-white/85 to-slate-100/70 transition-opacity duration-500 backdrop-blur-sm dark:from-[#05070f]/95 dark:via-[#060814]/80 dark:to-[#0a0e1d]/40",
					isInteractive && "pointer-events-none opacity-0",
				)}
			/>
			{isInteractive && (
				<button
					type="button"
					onClick={onDisableInteractive}
					className="absolute left-5 top-5 z-40 rounded-full bg-black/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur hover:bg-black/60"
				>
					Show Labels
				</button>
			)}
			<div
				className={cn(
					"absolute inset-0 flex flex-col justify-between p-8 sm:p-12 transition-opacity duration-500",
					isInteractive
						? "pointer-events-none opacity-0"
						: "pointer-events-auto opacity-100",
				)}
			>
				<div className="flex flex-col gap-3 text-center text-slate-800 dark:text-white">
					<SparklesText className="text-xs font-semibold uppercase tracking-[0.42em] text-slate-500 dark:text-white/70">
						Voice Cloning Showcase
					</SparklesText>
					<h2 className="text-2xl font-bold leading-tight sm:text-[2.75rem]">
						<AuroraText
							className="block"
							colors={["#2563eb", "#1d4ed8", "#a855f7", "#f472b6"]}
							blur={16}
						>
							{title}
						</AuroraText>
					</h2>
					<p className="mx-auto max-w-xl text-sm text-slate-700 text-opacity-90 sm:text-base dark:text-white/75">
						DealScale’s neural voice stack emulates your tone, pacing, and emotion so every conversation still sounds like you.
					</p>
				</div>
				<div className="space-y-6 text-slate-900 dark:text-white">
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
						{(() => {
							const [beforeCard, afterCard] = FEATURE_CARDS;
							return (
								<>
									<div
										key={beforeCard.key}
										className={cn(
											"w-full max-w-xs rounded-2xl p-4 backdrop-blur-md sm:max-w-sm",
											beforeCard.className,
										)}
									>
										<p className={cn("text-xs font-semibold uppercase tracking-[0.28em]", beforeCard.labelClassName)}>
											{beforeCard.title}
										</p>
										<p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base dark:text-white/90">
											{beforeCard.description}
										</p>
									</div>
									<span
										aria-hidden="true"
										className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-lg backdrop-blur dark:border-white/20 dark:bg-white/5 dark:text-white/70"
									>
										<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M8 3L3 8l5 5" />
											<path d="M16 3l5 5-5 5" />
											<line x1="3" y1="8" x2="21" y2="8" />
											<line x1="3" y1="13" x2="21" y2="13" />
										</svg>
									</span>
									<div
										key={afterCard.key}
										className={cn(
											"w-full max-w-xs rounded-2xl p-4 backdrop-blur-md sm:max-w-sm",
											afterCard.className,
										)}
									>
										<p className={cn("text-xs font-semibold uppercase tracking-[0.28em]", afterCard.labelClassName)}>
											{afterCard.title}
										</p>
										<p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base dark:text-white/90">
											{afterCard.description}
										</p>
									</div>
								</>
							);
						})()}
					</div>
					<div className="flex flex-col gap-4 text-left text-slate-600 dark:text-white/70 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col gap-2">
							<span className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/50">
								Audio Comparison
							</span>
							<p className="max-w-md text-sm text-slate-600 dark:text-white/70">
								Play both versions in sync to hear how DealScale preserves timbre, pacing, and emotion.
							</p>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							<button
								type="button"
								onClick={isPlaying ? onStop : onPlay}
								disabled={isLoadingAudio}
								className={cn(
									"inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white/80 dark:focus-visible:ring-offset-black",
									isPlaying
										? "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-white/15 dark:text-white dark:hover:bg-white/20"
										: "bg-sky-500 text-white hover:bg-sky-400 dark:bg-sky-400/90 dark:text-slate-900 dark:hover:bg-sky-300",
									isLoadingAudio && "cursor-wait opacity-70",
								)}
							>
								{isPlaying ? "Stop Audio Comparison" : "Play Before & After"}
							</button>
							<button
								type="button"
								onClick={onEnableInteractive}
								className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-white/30 dark:text-white dark:hover:border-white/60 dark:hover:bg-white/10"
							>
								Interact with Clone
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}


