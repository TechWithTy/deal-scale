"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { PixelatedVoiceOverlay } from "@/components/ui/pixelated-voice-overlay";
import {
	TextRevealCard,
	TextRevealCardDescription,
	TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";
import { cn } from "@/lib/utils";

type Tilt = {
	x: number;
	y: number;
};

const DEFAULT_IMAGE =
	"https://assets.aceternity.com/manu-red.png";

const MAX_TILT_DEGREES = 12;

const DEFAULT_BEFORE_AUDIO =
	"https://assets.mixkit.co/voice-over/mixkit-robotic-synthetic-voice-saying-hello-1467.mp3";
const DEFAULT_AFTER_AUDIO =
	"https://assets.mixkit.co/voice-over/mixkit-friendly-affirmative-male-voice-85.mp3";

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
	const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });
	const [isInteractive, setIsInteractive] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoadingAudio, setIsLoadingAudio] = useState(false);
	const [isInView, setIsInView] = useState(false);
	const [hasLoadedCanvas, setHasLoadedCanvas] = useState(false);
	const cardRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const rafRef = useRef<number>();
	const beforeAudioRef = useRef<HTMLAudioElement | null>(null);
	const afterAudioRef = useRef<HTMLAudioElement | null>(null);

	const scheduleTiltUpdate = useCallback(
		(nextTilt: Tilt) => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(() => {
				setTilt(nextTilt);
			});
		},
		[],
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

	useEffect(() => {
		const handleEnded = () => {
			if (process.env.NODE_ENV !== "production") {
				console.debug("[PixelatedVoiceCloneCard] playback ended");
			}
			setIsPlaying(false);
			setIsLoadingAudio(false);
		};

		const before = beforeAudioRef.current;
		const after = afterAudioRef.current;

		before?.addEventListener("ended", handleEnded);
		after?.addEventListener("ended", handleEnded);

		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
			before?.removeEventListener("ended", handleEnded);
			after?.removeEventListener("ended", handleEnded);
		};
	}, []);

	const stopPlayback = useCallback(() => {
		const before = beforeAudioRef.current;
		const after = afterAudioRef.current;
		if (before) console.debug("[PixelatedVoiceCloneCard] stopping before audio", before.src);
		if (after) console.debug("[PixelatedVoiceCloneCard] stopping after audio", after.src);
		before?.pause();
		after?.pause();
		if (before) before.currentTime = 0;
		if (after) after.currentTime = 0;
		if (process.env.NODE_ENV !== "production") {
			console.debug("[PixelatedVoiceCloneCard] stopPlayback", {
				beforeCurrent: before?.currentTime ?? null,
				afterCurrent: after?.currentTime ?? null,
			});
		}
		setIsPlaying(false);
		setIsLoadingAudio(false);
	}, []);

	const handlePlayComparison = useCallback(async () => {
		const before = beforeAudioRef.current;
		const after = afterAudioRef.current;
		if (!before || !after) {
			console.warn("[PixelatedVoiceCloneCard] audio elements missing", { before: !!before, after: !!after });
			return;
		}

		try {
			setIsLoadingAudio(true);
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
			await Promise.all([before.play(), after.play()]);
			if (process.env.NODE_ENV !== "production") {
				console.debug("[PixelatedVoiceCloneCard] playback started");
			}
			setIsPlaying(true);
			console.debug("[PixelatedVoiceCloneCard] playback started successfully");
		} catch (error) {
			console.error("[PixelatedVoiceCloneCard] failed to play comparison audio", error);
			setIsPlaying(false);
		} finally {
			setIsLoadingAudio(false);
		}
	}, []);

	const enableInteractiveView = useCallback(() => {
		stopPlayback();
		setIsInteractive(true);
	}, [stopPlayback]);

	const disableInteractiveView = useCallback(() => {
		setIsInteractive(false);
	}, []);

	useEffect(() => {
		return () => {
			stopPlayback();
		};
	}, [stopPlayback]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8",
				className,
			)}
		>
			<div className="absolute inset-0 -z-10 rounded-[44px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_60%)]" />
			<div
				ref={cardRef}
				onPointerLeave={resetTilt}
				onPointerUp={resetTilt}
				onPointerCancel={resetTilt}
				onPointerMove={handlePointerMove}
				className={cn(
					"group relative w-full cursor-pointer rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-100 to-slate-200/60 p-[2px] shadow-xl transition-transform duration-200 ease-out backdrop-blur dark:border-white/10 dark:from-slate-900/50 dark:via-indigo-900/40 dark:to-slate-950/60",
					isInteractive && "border-sky-400/60 dark:border-sky-400/60",
				)}
				style={{
					transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
				}}
			>
				<div className="relative overflow-hidden rounded-[26px]">
					{hasLoadedCanvas ? (
						<PixelatedCanvas
							src={imageSrc}
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
						isLoadingAudio={isLoadingAudio}
						onPlay={handlePlayComparison}
						onStop={stopPlayback}
						onEnableInteractive={enableInteractiveView}
						onDisableInteractive={disableInteractiveView}
						title="Your AI Clone: Authentic, Expressive, Unmistakably You"
						subtitle="DealScale’s neural voice stack doesn’t imitate; it emulates. Our real-time sampling engine preserves your tone, pacing, and emotion for conversations that feel alive."
					/>
					<audio ref={beforeAudioRef} src={beforeAudioSrc} preload="none" />
					<audio ref={afterAudioRef} src={afterAudioSrc} preload="none" />
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
