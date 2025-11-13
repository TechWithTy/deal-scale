"use client";

import { AuroraText } from "@/components/magicui/aurora-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { SparklesText } from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { memo, useEffect, useId, useRef, useState } from "react";

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
		description: "Expressive, human tone that builds trust instantly.",
		className:
			"border border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-200/80 text-emerald-900 dark:border-emerald-300/35 dark:from-emerald-600/20 dark:via-emerald-500/15 dark:to-emerald-900/30 dark:text-emerald-50/90",
		labelClassName: "text-emerald-600 dark:text-emerald-100/90",
	},
] as const;

type PixelatedVoiceOverlayProps = {
	isInteractive: boolean;
	isPlaying: boolean;
	activeTrack?: "before" | "after" | null;
	isLoadingAudio: boolean;
	onPlay: () => void;
	onStop: () => void;
	onEnableInteractive: () => void;
	onDisableInteractive: () => void;
	title?: string;
	subtitle?: string;
	onImageSelect?: (file: File) => void;
	onImageReset?: () => void;
	hasCustomImage?: boolean;
	imageUploadError?: string | null;
};

const PixelatedVoiceOverlayComponent = ({
	isInteractive,
	isPlaying,
	activeTrack = null,
	isLoadingAudio,
	onPlay,
	onStop,
	onEnableInteractive,
	onDisableInteractive,
	title = "Your AI Clone: Authentic, Expressive, Unmistakably You",
	subtitle = "DealScale’s neural voice stack emulates your tone, pacing, and emotion so every conversation still sounds like you.",
	onImageSelect,
	onImageReset,
	hasCustomImage = false,
	imageUploadError = null,
}: PixelatedVoiceOverlayProps) => {
	const uploadInputId = useId();
	const [cardOffset, setCardOffset] = useState({ x: 0, y: 48 });
	const renderCountRef = useRef(0);
	const prevSnapshotRef = useRef<{
		isInteractive: boolean;
		isPlaying: boolean;
		isLoadingAudio: boolean;
		hasCustomImage: boolean;
		imageUploadError: string | null;
	} | null>(null);

	const hasActiveTrack = Boolean(activeTrack && isPlaying);
	const shouldHideOverlay = isInteractive && !hasActiveTrack;
	const overlayOpacityClass = hasActiveTrack
		? "pointer-events-auto opacity-95 sm:opacity-90"
		: shouldHideOverlay
			? "pointer-events-none opacity-0"
			: "pointer-events-auto opacity-100";

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		if (typeof window.matchMedia !== "function") {
			return;
		}
		const mediaQuery = window.matchMedia("(min-width: 1024px)");
		const updateOffset = (matches: boolean) => {
			setCardOffset(matches ? { x: 96, y: 0 } : { x: 0, y: 48 });
		};

		updateOffset(mediaQuery.matches);
		const handler = (event: MediaQueryListEvent) => updateOffset(event.matches);
		mediaQuery.addEventListener("change", handler);

		return () => {
			mediaQuery.removeEventListener("change", handler);
		};
	}, []);

	useEffect(() => {
		if (process.env.NODE_ENV !== "production") {
			renderCountRef.current += 1;
			if (renderCountRef.current < 5 || renderCountRef.current % 25 === 0) {
				console.debug("[PixelatedVoiceOverlay] render", {
					renderCount: renderCountRef.current,
					isInteractive,
					isPlaying,
					hasCustomImage,
				});
			}

			const snapshot = {
				isInteractive,
				isPlaying,
				isLoadingAudio,
				hasCustomImage,
				imageUploadError,
			};
			const prev = prevSnapshotRef.current;
			if (prev) {
				const changedEntries = Object.entries(snapshot).filter(
					([key, value]) => prev[key as keyof typeof prev] !== value,
				);
				if (changedEntries.length > 0) {
					console.debug(
						"[PixelatedVoiceOverlay] prop changes",
						Object.fromEntries(changedEntries),
					);
				}
			} else {
				console.debug(
					"[PixelatedVoiceOverlay] initial props snapshot",
					snapshot,
				);
			}
			prevSnapshotRef.current = snapshot;
		}
	});

	return (
		<>
			{/* Background overlay - hidden during comparison mode to allow interaction */}
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-t from-white via-white/85 to-slate-100/70 backdrop-blur-sm transition-opacity duration-500 dark:from-[#05070f]/95 dark:via-[#060814]/80 dark:to-[#0a0e1d]/40",
					(hasActiveTrack || shouldHideOverlay) &&
						"pointer-events-none opacity-0",
				)}
			/>
			{/* Decorative motion divs - hidden during comparison mode */}
			<motion.div
				aria-hidden="true"
				initial={{ opacity: 0.35, y: -12 }}
				animate={
					hasActiveTrack || shouldHideOverlay
						? {
								opacity: 0,
								scale: 1.08,
								y: -18,
								transition: { duration: 0.4, ease: "easeOut" },
							}
						: {
								opacity: 0.45,
								scale: 1,
								y: -12,
								transition: { duration: 0.6, ease: "easeOut" },
							}
				}
				className="pointer-events-none absolute inset-6 z-10 rounded-[32px] border border-white/30 bg-gradient-to-br from-white/35 via-white/12 to-transparent shadow-[0_24px_70px_rgba(59,130,246,0.12)] blur-[1.5px] dark:border-white/10 dark:from-white/10 dark:via-white/3 dark:to-transparent"
			/>
			<motion.div
				aria-hidden="true"
				initial={{ opacity: 0.2, y: -24, rotate: -2 }}
				animate={
					hasActiveTrack || shouldHideOverlay
						? {
								opacity: 0,
								y: -32,
								rotate: 1,
								transition: { duration: 0.5, ease: "easeOut" },
							}
						: {
								opacity: 0.26,
								y: -24,
								rotate: -2,
								transition: {
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "mirror",
									duration: 6,
									ease: "easeInOut",
								},
							}
				}
				className="pointer-events-none absolute inset-0 z-0 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_62%)]"
			/>
			{/* Show Labels button - visible during comparison mode */}
			{(hasActiveTrack || shouldHideOverlay) && (
				<button
					type="button"
					onClick={onDisableInteractive}
					className="absolute top-5 left-5 z-40 rounded-full bg-black/70 px-4 py-2 font-medium text-white text-xs uppercase tracking-[0.22em] backdrop-blur hover:bg-black/60"
				>
					Show Labels
				</button>
			)}
			{/* Main overlay content */}
			<div
				className={cn(
					"absolute inset-0 flex flex-col justify-between p-8 transition-opacity duration-500 sm:p-12",
					overlayOpacityClass,
					hasActiveTrack && "pointer-events-none",
				)}
			>
				{/* Header - hidden during comparison mode */}
				{!hasActiveTrack && (
					<div className="flex flex-col gap-2 text-center text-slate-800 dark:text-white">
						<SparklesText className="font-semibold text-slate-500 text-xs uppercase tracking-[0.42em] dark:text-white/70">
							Voice Cloning Showcase
						</SparklesText>
						<h2 className="font-bold text-[1.5rem] leading-tight sm:text-[2.0625rem]">
							<AuroraText
								className="block"
								colors={["#2563eb", "#1d4ed8", "#a855f7", "#f472b6"]}
								blur={16}
							>
								{title}
							</AuroraText>
						</h2>
						<p className="mx-auto max-w-xl text-[0.75rem] text-slate-700 text-opacity-90 sm:text-[0.9375rem] dark:text-white/75">
							{subtitle}
						</p>
					</div>
				)}
				{/* Comparison cards - always visible, positioned absolutely during comparison mode */}
				<div
					className={cn(
						"space-y-6 text-slate-900 dark:text-white",
						hasActiveTrack &&
							"absolute inset-0 flex items-center justify-center",
					)}
				>
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
						{(() => {
							const [beforeCard, afterCard] = FEATURE_CARDS;
							const beforeActive = activeTrack === "before" && isPlaying;
							const afterActive = activeTrack === "after" && isPlaying;
							const inactiveCardClasses = hasActiveTrack
								? "opacity-45"
								: "opacity-80";
							return (
								<>
									<div
										key={beforeCard.key}
										className={cn(
											"relative w-full max-w-xs rounded-2xl p-4 backdrop-blur-md transition-all duration-300 sm:max-w-sm",
											beforeCard.className,
											beforeActive
												? "ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
												: inactiveCardClasses,
										)}
									>
										{beforeActive ? (
											<span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 font-semibold text-[0.625rem] text-red-600 uppercase tracking-[0.28em] shadow-sm backdrop-blur dark:bg-red-400/15 dark:text-red-200">
												<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 dark:bg-red-200" />
												Live
											</span>
										) : null}
										<p
											className={cn(
												"font-semibold text-xs uppercase tracking-[0.28em]",
												beforeCard.labelClassName,
												beforeActive && "text-red-500 dark:text-red-200",
											)}
										>
											{beforeCard.title}
										</p>
										<p className="mt-3 text-slate-700 text-sm leading-relaxed sm:text-base dark:text-white/90">
											{beforeCard.description}
										</p>
									</div>
									<span
										aria-hidden="true"
										className={cn(
											"relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-lg backdrop-blur transition-colors dark:border-white/20 dark:bg-white/5 dark:text-white/70",
											isPlaying &&
												"border-sky-400/60 text-sky-500 dark:border-sky-500/50 dark:text-sky-300",
										)}
									>
										<svg
											className="h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											role="presentation"
											focusable="false"
										>
											<title>Before and after comparison arrows</title>
											<path d="M8 3L3 8l5 5" />
											<path d="M16 3l5 5-5 5" />
											<line x1="3" y1="8" x2="21" y2="8" />
											<line x1="3" y1="13" x2="21" y2="13" />
										</svg>
										{isPlaying ? (
											<span className="-bottom-1 absolute rounded-full bg-sky-400 px-2 py-0.5 font-semibold text-[0.625rem] text-white uppercase tracking-[0.32em] shadow-sm">
												{afterActive ? "After" : "Before"}
											</span>
										) : null}
									</span>
									<div
										key={afterCard.key}
										className={cn(
											"relative w-full max-w-xs rounded-2xl p-4 backdrop-blur-md transition-all duration-300 sm:max-w-sm",
											afterCard.className,
											afterActive
												? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
												: inactiveCardClasses,
										)}
									>
										{afterActive ? (
											<span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 font-semibold text-[0.625rem] text-emerald-500 uppercase tracking-[0.28em] shadow-sm backdrop-blur dark:bg-emerald-400/15 dark:text-emerald-100">
												<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-100" />
												Live
											</span>
										) : hasActiveTrack ? (
											<span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 font-semibold text-[0.625rem] text-slate-600 uppercase tracking-[0.28em] shadow-sm backdrop-blur dark:bg-white/10 dark:text-white/70">
												Next
											</span>
										) : null}
										<p
											className={cn(
												"font-semibold text-xs uppercase tracking-[0.28em]",
												afterCard.labelClassName,
												afterActive && "text-emerald-300",
											)}
										>
											{afterCard.title}
										</p>
										<p className="mt-3 text-slate-700 text-sm leading-relaxed sm:text-base dark:text-white/90">
											{afterCard.description}
										</p>
									</div>
								</>
							);
						})()}
					</div>
					{!hasActiveTrack ? (
						<div className="flex flex-col gap-4 text-left text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:text-white/70">
							<div className="flex flex-col gap-2">
								<span className="text-slate-500 text-xs uppercase tracking-[0.28em] dark:text-white/50">
									Audio Comparison
								</span>
								<p className="max-w-md text-slate-600 text-sm dark:text-white/70">
									Play both versions in sync to hear how DealScale preserves
									timbre, pacing, and emotion.
								</p>
							</div>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
								<button
									type="button"
									onClick={isPlaying ? onStop : onPlay}
									disabled={isLoadingAudio}
									className={cn(
										"inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white/80 dark:focus-visible:ring-offset-black",
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
									className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 font-medium text-slate-700 text-sm transition hover:border-slate-400 hover:bg-slate-100 dark:border-white/30 dark:text-white dark:hover:border-white/60 dark:hover:bg-white/10"
								>
									Interact with Clone
								</button>
							</div>
						</div>
					) : null}
				</div>
				{!hasActiveTrack ? (
					<MagicCard className="group mt-6 overflow-hidden rounded-[28px] sm:mt-8">
						<motion.div
							initial={cardOffset}
							whileHover={{ x: 0, y: 0, opacity: 1 }}
							animate={{ x: cardOffset.x, y: cardOffset.y, opacity: 0.95 }}
							transition={{ type: "spring", stiffness: 140, damping: 22 }}
							className="relative flex flex-col gap-4 overflow-hidden rounded-[26px] border border-slate-200/60 bg-white/85 px-5 py-6 text-left text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.22)] backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-7 dark:border-white/20 dark:bg-white/5 dark:text-white/80"
						>
							<BorderBeam
								size={140}
								colorFrom="#38bdf8"
								colorTo="#a855f7"
								className="opacity-90"
								duration={9}
								initialOffset={24}
							/>
							<div className="flex flex-col gap-2">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<span className="font-semibold text-slate-500 text-xs uppercase tracking-[0.28em] dark:text-white/60">
										Clone Yourself
									</span>
									<span className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 font-medium text-sky-600 text-xs shadow-sm backdrop-blur-sm dark:border-sky-300/40 dark:bg-sky-300/10 dark:text-sky-200">
										<span className="h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-200" />
										Photo-to-video avatar tooling coming soon
									</span>
								</div>
								<p className="text-slate-600 text-sm leading-relaxed dark:text-white/75">
									Upload a PNG to drop your own portrait into the pixelated
									clone. Works best with transparent backgrounds and crisp
									lighting.
								</p>
								<p className="max-w-sm text-slate-500 text-xs leading-relaxed dark:text-white/60">
									Repurpose brand portraits into social media videos, sales
									touchpoints, and creator-style content without leaving
									DealScale.
								</p>
								{imageUploadError ? (
									<p className="text-red-600 text-xs dark:text-red-400">
										{imageUploadError}
									</p>
								) : null}
							</div>
							<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-1">
								<div className="flex w-full flex-wrap items-center gap-3 sm:flex-nowrap">
									<div className="relative inline-flex w-full rounded-full sm:w-auto">
										<BorderBeam
											size={84}
											colorFrom="#38bdf8"
											colorTo="#a855f7"
											className="opacity-75"
											duration={6}
											initialOffset={12}
										/>
										<label
											htmlFor={uploadInputId}
											aria-label="Upload a PNG of your portrait"
											className="relative inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-slate-300 px-5 py-2 font-medium text-slate-700 text-sm transition hover:border-slate-400 hover:bg-slate-100 sm:w-auto sm:px-6 sm:py-2.5 dark:border-white/40 dark:text-white dark:hover:border-white/60 dark:hover:bg-white/10"
										>
											{hasCustomImage
												? "Generate Staging Video"
												: "Generate Follow-Up Video"}
										</label>
									</div>
									<input
										id={uploadInputId}
										type="file"
										accept="image/png"
										className="hidden"
										onChange={(event) => {
											const file = event.target.files?.[0];
											if (file && onImageSelect) {
												onImageSelect(file);
											}
											event.target.value = "";
										}}
									/>
									{hasCustomImage ? (
										<button
											type="button"
											onClick={onImageReset}
											className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-slate-200 px-4 py-2 font-medium text-slate-700 text-sm transition hover:bg-slate-300 sm:flex-auto sm:self-start sm:px-5 sm:py-2.5 dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
										>
											Reset
										</button>
									) : null}
								</div>
								<div className="flex flex-wrap items-center gap-2 sm:items-center sm:gap-3">
									<span className="text-[0.62rem] text-slate-500 uppercase tracking-[0.32em] dark:text-white/50">
										Real Estate Investor Cuts
									</span>
									<div className="flex flex-wrap gap-2 sm:gap-2.5">
										<button
											type="button"
											className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 font-medium text-slate-600 text-xs transition hover:border-slate-400 hover:bg-slate-100 dark:border-white/30 dark:text-white/80 dark:hover:border-white/50 dark:hover:bg-white/10"
										>
											Acquisition Pitch
										</button>
										<button
											type="button"
											className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 font-medium text-slate-600 text-xs transition hover:border-slate-400 hover:bg-slate-100 dark:border-white/30 dark:text-white/80 dark:hover:border-white/50 dark:hover:bg-white/10"
										>
											LP Update
										</button>
										<button
											type="button"
											className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 font-medium text-slate-600 text-xs transition hover:border-slate-400 hover:bg-slate-100 dark:border-white/30 dark:text-white/80 dark:hover:border-white/50 dark:hover:bg-white/10"
										>
											Deal Teaser
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</MagicCard>
				) : null}
			</div>
			{hasActiveTrack ? (
				<button
					type="button"
					onClick={onStop}
					className="-translate-x-1/2 absolute bottom-6 left-1/2 z-40 font-semibold text-slate-800 text-xs uppercase tracking-[0.32em] transition hover:text-slate-600 dark:text-white/80 dark:hover:text-white"
				>
					Cancel comparison
				</button>
			) : null}
		</>
	);
};

export const PixelatedVoiceOverlay = memo(PixelatedVoiceOverlayComponent);
PixelatedVoiceOverlay.displayName = "PixelatedVoiceOverlay";
