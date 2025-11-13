"use client";

import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { PixelatedVoiceOverlay } from "@/components/ui/pixelated-voice-overlay";
import {
	TextRevealCard,
	TextRevealCardDescription,
	TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";
import { cn } from "@/lib/utils";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type Tilt = {
	x: number;
	y: number;
};

const DEFAULT_IMAGE = "https://assets.aceternity.com/manu-red.png";

const MAX_TILT_DEGREES = 12;

const DEFAULT_BEFORE_AUDIO = "/calls/example-call-yt.mp3";
const DEFAULT_AFTER_AUDIO = "/calls/example-call-yt.mp3";

const BEFORE_AUDIO_CAPTIONS_SRC = `data:text/vtt;charset=utf-8,${encodeURIComponent(
	"WEBVTT\n\n00:00.000 --> 00:04.000\nOriginal seller script with monotone delivery.\n",
)}`;

const AFTER_AUDIO_CAPTIONS_SRC = `data:text/vtt;charset=utf-8,${encodeURIComponent(
	"WEBVTT\n\n00:00.000 --> 00:04.000\nEnhanced expressive clone demonstrating improved tone and pacing.\n",
)}`;

const CANVAS_CONFIG = {
	width: 960,
	height: 560,
	cellSize: 3,
	dotScale: 0.9,
	backgroundColor: "#000000",
	dropoutStrength: 0.35,
	distortionStrength: 3,
	distortionRadius: 80,
	followSpeed: 0.2,
	jitterStrength: 4,
	jitterSpeed: 4,
	tintColor: "#FFFFFF",
	tintStrength: 0.2,
};

export type PixelatedVoiceCloneCardProps = {
	className?: string;
	imageSrc?: string;
	beforeAudioSrc?: string;
	afterAudioSrc?: string;
};

const PixelatedVoiceCloneCardComponent = ({
	className,
	imageSrc = DEFAULT_IMAGE,
	beforeAudioSrc = DEFAULT_BEFORE_AUDIO,
	afterAudioSrc = DEFAULT_AFTER_AUDIO,
}: PixelatedVoiceCloneCardProps) => {
	const [isInteractive, setIsInteractive] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoadingAudio, setIsLoadingAudio] = useState(false);
	const [isInView, setIsInView] = useState(false);
	const [hasLoadedCanvas, setHasLoadedCanvas] = useState(false);
	const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
	const [imageUploadError, setImageUploadError] = useState<string | null>(null);
	const cardRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const rafRef = useRef<number>();
	const beforeAudioRef = useRef<HTMLAudioElement | null>(null);
	const afterAudioRef = useRef<HTMLAudioElement | null>(null);
	const audioInteractiveRef = useRef(false);
	const renderCountRef = useRef(0);
	const prevSnapshotRef = useRef<{
		isInteractive: boolean;
		isPlaying: boolean;
		isLoadingAudio: boolean;
		isInView: boolean;
		hasLoadedCanvas: boolean;
		customImageLoaded: boolean;
		imageUploadError: string | null;
	} | null>(null);
	const tiltRef = useRef<Tilt>({ x: 0, y: 0 });
	const [activeTrack, setActiveTrack] = useState<"before" | "after" | null>(
		null,
	);
	const isPlayingRef = useRef(false);

	const applyTilt = useCallback((nextTilt: Tilt) => {
		tiltRef.current = nextTilt;
		if (cardRef.current) {
			cardRef.current.style.transform = `perspective(1200px) rotateX(${nextTilt.x}deg) rotateY(${nextTilt.y}deg)`;
		}
	}, []);

	const scheduleTiltUpdate = useCallback(
		(nextTilt: Tilt) => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(() => {
				applyTilt(nextTilt);
			});
		},
		[applyTilt],
	);

	const handlePointerMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (!cardRef.current || !isInView) return;

			const rect = cardRef.current.getBoundingClientRect();
			const relativeX = event.clientX - rect.left;
			const relativeY = event.clientY - rect.top;

			const normalizedX = relativeX / rect.width - 0.5;
			const normalizedY = relativeY / rect.height - 0.5;

			scheduleTiltUpdate({
				x: -(normalizedY * 2 * MAX_TILT_DEGREES),
				y: normalizedX * 2 * MAX_TILT_DEGREES,
			});
		},
		[isInView, scheduleTiltUpdate],
	);

	const resetTilt = useCallback(() => {
		scheduleTiltUpdate({ x: 0, y: 0 });
	}, [scheduleTiltUpdate]);

	useEffect(() => {
		applyTilt(tiltRef.current);
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [applyTilt]);

	useEffect(() => {
		if (hasLoadedCanvas) {
			setIsInView(true);
			return;
		}

		const node = containerRef.current;
		if (!node) return;
		if (typeof IntersectionObserver === "undefined") {
			setIsInView(true);
			setHasLoadedCanvas(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				if (entry.isIntersecting || entry.intersectionRatio > 0) {
					setIsInView(true);
					setHasLoadedCanvas(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px 0px", threshold: [0, 0.1, 0.2, 0.3] },
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, [hasLoadedCanvas]);

	const stopPlayback = useCallback(() => {
		const before = beforeAudioRef.current;
		const after = afterAudioRef.current;
		const beforeActive =
			before &&
			!before.paused &&
			!Number.isNaN(before.currentTime) &&
			before.currentTime > 0.05;
		const afterActive =
			after &&
			!after.paused &&
			!Number.isNaN(after.currentTime) &&
			after.currentTime > 0.05;

		if (!beforeActive && !afterActive && !isPlayingRef.current) {
			return;
		}

		if (process.env.NODE_ENV !== "production") {
			console.debug(
				"[PixelatedVoiceCloneCard] stopping before audio",
				before?.src,
			);
			console.debug(
				"[PixelatedVoiceCloneCard] stopping after audio",
				after?.src,
			);
		}

		before?.pause();
		after?.pause();
		if (before) before.currentTime = 0;
		if (after) after.currentTime = 0;

		isPlayingRef.current = false;
		setIsPlaying(false);
		setIsLoadingAudio(false);
		setActiveTrack(null);
		if (audioInteractiveRef.current) {
			audioInteractiveRef.current = false;
			setIsInteractive(false);
		}

		if (process.env.NODE_ENV !== "production") {
			console.debug("[PixelatedVoiceCloneCard] stopPlayback", {
				beforeCurrent: before?.currentTime ?? null,
				afterCurrent: after?.currentTime ?? null,
			});
		}
	}, []);

	useEffect(() => {
		const before = beforeAudioRef.current;
		const after = afterAudioRef.current;

		if (!before || !after) {
			return;
		}

		const handleBeforeEnded = async () => {
			if (!isPlayingRef.current) {
				return;
			}

			if (process.env.NODE_ENV !== "production") {
				console.debug(
					"[PixelatedVoiceCloneCard] before track ended, starting after track",
				);
			}

			try {
				setActiveTrack("after");
				after.currentTime = 0;
				if (after.preload !== "auto") after.load();
				await after.play();
			} catch (error) {
				console.error("Failed to transition to after audio", error, {
					afterSrc: after.src,
				});
				stopPlayback();
			}
		};

		const handleAfterEnded = () => {
			if (!isPlayingRef.current) {
				return;
			}

			if (process.env.NODE_ENV !== "production") {
				console.debug("[PixelatedVoiceCloneCard] after track ended");
			}
			stopPlayback();
		};

		before.addEventListener("ended", handleBeforeEnded);
		after.addEventListener("ended", handleAfterEnded);

		return () => {
			before.removeEventListener("ended", handleBeforeEnded);
			after.removeEventListener("ended", handleAfterEnded);
		};
	}, [stopPlayback]);

	const handlePlayComparison = useCallback(async () => {
		const before = beforeAudioRef.current;
		const after = afterAudioRef.current;
		if (!before || !after) {
			console.warn("[PixelatedVoiceCloneCard] audio elements missing", {
				before: !!before,
				after: !!after,
			});
			return;
		}

		before.crossOrigin = "anonymous";
		after.crossOrigin = "anonymous";

		try {
			setIsLoadingAudio(true);
			audioInteractiveRef.current = true;
			setIsInteractive(true);
			setActiveTrack("before");
			if (process.env.NODE_ENV !== "production") {
				console.debug("[PixelatedVoiceCloneCard] attempting playback", {
					beforeSrc: before.src,
					afterSrc: after.src,
				});
			}
			before.currentTime = 0;
			after.currentTime = 0;
			if (before.preload !== "auto") before.load();
			if (after.preload !== "auto") after.load();
			after.pause();
			await before.play();
			if (process.env.NODE_ENV !== "production") {
				console.debug(
					"[PixelatedVoiceCloneCard] before track playback started",
				);
			}
			isPlayingRef.current = true;
			setIsPlaying(true);
		} catch (error) {
			console.error("Failed to play comparison audio", error, {
				beforeSrc: before.src,
				afterSrc: after.src,
			});
			isPlayingRef.current = false;
			setIsPlaying(false);
			if (audioInteractiveRef.current) {
				audioInteractiveRef.current = false;
				setIsInteractive(false);
			}
			setActiveTrack(null);
		} finally {
			setIsLoadingAudio(false);
		}
	}, []);

	const enableInteractiveView = useCallback(() => {
		stopPlayback();
		audioInteractiveRef.current = false;
		setIsInteractive(true);
	}, [stopPlayback]);

	const disableInteractiveView = useCallback(() => {
		audioInteractiveRef.current = false;
		setIsInteractive(false);
	}, []);

	useEffect(() => {
		return () => {
			stopPlayback();
		};
	}, [stopPlayback]);

	const handleFileChange = useCallback((file: File) => {
		if (!file.type.includes("png")) {
			setImageUploadError("Please upload a PNG image (alpha supported).");
			return;
		}
		setImageUploadError(null);
		const reader = new FileReader();
		reader.onload = (event) => {
			const result = event.target?.result;
			if (typeof result === "string") {
				setCustomImageSrc(result);
				setIsInteractive(true);
				if (process.env.NODE_ENV !== "production") {
					console.debug("[PixelatedVoiceCloneCard] custom image uploaded", {
						size: file.size,
						name: file.name,
					});
				}
			}
		};
		reader.onerror = (error) => {
			console.error("Failed to read uploaded image", error);
			setImageUploadError("Unable to read that file. Please try another PNG.");
		};
		reader.readAsDataURL(file);
	}, []);

	useEffect(() => {
		if (process.env.NODE_ENV !== "production") {
			renderCountRef.current += 1;
			if (renderCountRef.current < 5 || renderCountRef.current % 25 === 0) {
				console.debug("[PixelatedVoiceCloneCard] render", {
					renderCount: renderCountRef.current,
					isInteractive,
					isPlaying,
					isLoadingAudio,
					isInView,
					hasLoadedCanvas,
					customImageLoaded: Boolean(customImageSrc),
					imageUploadError,
				});
			}

			const snapshot = {
				isInteractive,
				isPlaying,
				isLoadingAudio,
				isInView,
				hasLoadedCanvas,
				customImageLoaded: Boolean(customImageSrc),
				imageUploadError,
			};
			const prev = prevSnapshotRef.current;
			if (prev) {
				const changed = Object.entries(snapshot).filter(
					([key, value]) => prev[key as keyof typeof prev] !== value,
				);
				if (changed.length > 0) {
					console.debug(
						"[PixelatedVoiceCloneCard] state changes",
						Object.fromEntries(changed),
					);
				}
			} else {
				console.debug("[PixelatedVoiceCloneCard] initial snapshot", snapshot);
			}
			prevSnapshotRef.current = snapshot;
		}
	});

	const handleResetImage = useCallback(() => {
		setCustomImageSrc(null);
		setImageUploadError(null);
		audioInteractiveRef.current = false;
		setIsInteractive(false);
		setActiveTrack(null);
	}, []);

	const resolvedImageSrc = customImageSrc ?? imageSrc;

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8",
				className,
			)}
		>
			<div className="-z-10 absolute inset-0 rounded-[44px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_60%)]" />
			<div
				ref={cardRef}
				onPointerLeave={resetTilt}
				onPointerUp={resetTilt}
				onPointerCancel={resetTilt}
				onPointerMove={handlePointerMove}
				className={cn(
					"group relative w-full cursor-pointer rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-100 to-slate-200/60 p-[2px] shadow-xl backdrop-blur transition-transform duration-200 ease-out dark:border-white/10 dark:from-slate-900/50 dark:via-indigo-900/40 dark:to-slate-950/60",
					isInteractive && "border-sky-400/60 dark:border-sky-400/60",
				)}
				style={{
					transform: "perspective(1200px) rotateX(0deg) rotateY(0deg)",
					willChange: "transform",
				}}
			>
				<div className="relative overflow-hidden rounded-[26px]">
					{hasLoadedCanvas ? (
						<PixelatedCanvas
							src={resolvedImageSrc}
							width={CANVAS_CONFIG.width}
							height={CANVAS_CONFIG.height}
							cellSize={CANVAS_CONFIG.cellSize}
							dotScale={CANVAS_CONFIG.dotScale}
							shape="square"
							backgroundColor={CANVAS_CONFIG.backgroundColor}
							dropoutStrength={CANVAS_CONFIG.dropoutStrength}
							interactive={isInteractive}
							distortionStrength={CANVAS_CONFIG.distortionStrength}
							distortionRadius={CANVAS_CONFIG.distortionRadius}
							distortionMode="swirl"
							followSpeed={CANVAS_CONFIG.followSpeed}
							jitterStrength={CANVAS_CONFIG.jitterStrength}
							jitterSpeed={CANVAS_CONFIG.jitterSpeed}
							sampleAverage
							tintColor={CANVAS_CONFIG.tintColor}
							tintStrength={CANVAS_CONFIG.tintStrength}
							className="h-full w-full rounded-3xl object-cover"
						/>
					) : (
						<div className="h-full w-full rounded-3xl bg-gradient-to-br from-slate-100 via-slate-50 to-transparent dark:from-slate-900/60 dark:via-slate-900/30 dark:to-transparent" />
					)}

					<PixelatedVoiceOverlay
						isInteractive={isInteractive}
						isPlaying={isPlaying}
						activeTrack={isPlaying ? activeTrack : null}
						isLoadingAudio={isLoadingAudio}
						onPlay={handlePlayComparison}
						onStop={stopPlayback}
						onEnableInteractive={enableInteractiveView}
						onDisableInteractive={disableInteractiveView}
						title="Your AI Clone: Authentic, Expressive, Unmistakably You"
						subtitle="DealScale’s neural voice stack emulates your tone, pacing, and emotion so every conversation still sounds like you."
						onImageSelect={handleFileChange}
						onImageReset={handleResetImage}
						hasCustomImage={Boolean(customImageSrc)}
						imageUploadError={imageUploadError}
					/>
					<audio
						ref={beforeAudioRef}
						src={beforeAudioSrc}
						preload="none"
						crossOrigin="anonymous"
						onError={() => {
							if (process.env.NODE_ENV !== "production") {
								console.warn(
									"[PixelatedVoiceCloneCard] failed to load before audio",
									beforeAudioSrc,
								);
							}
						}}
					>
						<track
							kind="captions"
							srcLang="en"
							label="Before voice sample transcript"
							src={BEFORE_AUDIO_CAPTIONS_SRC}
							default
						/>
					</audio>
					<audio
						ref={afterAudioRef}
						src={afterAudioSrc}
						preload="none"
						crossOrigin="anonymous"
						onError={() => {
							if (process.env.NODE_ENV !== "production") {
								console.warn(
									"[PixelatedVoiceCloneCard] failed to load after audio",
									afterAudioSrc,
								);
							}
						}}
					>
						<track
							kind="captions"
							srcLang="en"
							label="After voice sample transcript"
							src={AFTER_AUDIO_CAPTIONS_SRC}
							default
						/>
					</audio>
				</div>
			</div>

			<TextRevealCard
				text="Clone your voice in minutes"
				revealText="Sound unmistakably like you."
				className="mx-auto max-w-3xl border-slate-200/70 bg-white/90 text-slate-900 dark:border-neutral-800/60 dark:bg-[#101014] dark:text-white"
			>
				<TextRevealCardTitle>
					Hover to see how we build authenticity at scale.
				</TextRevealCardTitle>
				<TextRevealCardDescription>
					Track the shift from robotic to expressive delivery in real time.
				</TextRevealCardDescription>
			</TextRevealCard>
		</div>
	);
};

export const PixelatedVoiceCloneCard = memo(PixelatedVoiceCloneCardComponent);
PixelatedVoiceCloneCard.displayName = "PixelatedVoiceCloneCard";
