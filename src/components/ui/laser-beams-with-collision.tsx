"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type LaserBeamsWithCollisionProps = {
	children: React.ReactNode;
	className?: string;
	beamCount?: number;
	beamHeight?: number;
	beamWidth?: number;
	durationRange?: [number, number];
	delayRange?: [number, number];
	gridColor?: string;
};

type BeamDefinition = {
	initialX: string;
	translateX: string;
	delay: number;
	duration: number;
	height: number;
};

const seededRandom = (seed: number) => {
	const x = Math.sin(seed) * 10_000;
	return x - Math.floor(x);
};

export function LaserBeamsWithCollision({
	children,
	className,
	beamCount = 6,
	beamHeight = 1600,
	beamWidth = 3,
	durationRange = [6.5, 10.5],
	delayRange = [0.6, 2.4],
	gridColor = "rgba(59,130,246,0.06)",
}: LaserBeamsWithCollisionProps): JSX.Element {
	const containerRef = useRef<HTMLDivElement>(null);
	const parentRef = useRef<HTMLDivElement>(null);

	const clampedCount = Math.max(1, Math.round(beamCount));

	const beams = useMemo<BeamDefinition[]>(() => {
		const [minDuration, maxDuration] = durationRange;
		const [minDelay, maxDelay] = delayRange;

		return Array.from({ length: clampedCount }, (_, index) => {
			const position = (index + 0.5) / clampedCount;
			const percent = position * 100;

			const centerIndex = (clampedCount - 1) / 2;
			const distance = Math.abs(index - centerIndex);
			const height = beamHeight + Math.max(0, 140 - distance * 48);

			const seed = index + 1;
			const duration =
				minDuration + (maxDuration - minDuration) * seededRandom(seed * 5.73);
			const delay =
				minDelay + (maxDelay - minDelay) * seededRandom(seed * 11.37);

			return {
				initialX: `calc(${percent}% - ${beamWidth / 2}px)`,
				translateX: `calc(${percent}% - ${beamWidth / 2}px)`,
				delay,
				duration,
				height,
			};
		});
	}, [
		beamCount,
		beamHeight,
		beamWidth,
		clampedCount,
		delayRange,
		durationRange,
	]);

	return (
		<div
			ref={parentRef}
			className={cn(
				"relative flex min-h-[720px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background",
				className,
			)}
		>
			<div
				className="pointer-events-none absolute inset-0 z-0 opacity-60 mix-blend-screen"
				style={{
					background: `linear-gradient(${gridColor} 0 1px, transparent 1px 100%) 50% 0/28px 28px, linear-gradient(90deg, ${gridColor} 0 1px, transparent 1px 100%) 0 50%/28px 28px`,
				}}
				aria-hidden="true"
			/>

			{beams.map((beam, index) => (
				<CollisionMechanism
					// eslint-disable-next-line react/no-array-index-key
					key={`${beam.initialX}-${beam.delay}-${beam.duration}`}
					beamOptions={beam}
					containerRef={containerRef}
					parentRef={parentRef}
					defaultBeamHeight={beamHeight}
					defaultBeamWidth={beamWidth}
					durationRange={durationRange}
					delayRange={delayRange}
					seed={index + 1}
				/>
			))}

			<div className="relative z-10 w-full">{children}</div>

			<div
				ref={containerRef}
				className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-sky-500/12 to-sky-500/32"
				style={{
					boxShadow:
						"0 0 26px rgba(36, 99, 235, 0.24), 0 1px 1px rgba(14, 116, 144, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.22), 0 0 4px rgba(37, 99, 235, 0.26)",
				}}
			/>
		</div>
	);
}

const CollisionMechanism = React.forwardRef<
	HTMLDivElement,
	{
		containerRef: React.RefObject<HTMLDivElement>;
		parentRef: React.RefObject<HTMLDivElement>;
		defaultBeamHeight: number;
		defaultBeamWidth: number;
		durationRange: [number, number];
		delayRange: [number, number];
		seed: number;
		beamOptions?: BeamDefinition;
	}
>(
	(
		{
			parentRef,
			containerRef,
			defaultBeamHeight,
			defaultBeamWidth,
			durationRange,
			delayRange,
			seed,
			beamOptions,
		},
		ref,
	) => {
		const beamRef = useRef<HTMLDivElement>(null);
		const [collision, setCollision] = useState<{
			detected: boolean;
			coordinates: { x: number; y: number } | null;
		}>({ detected: false, coordinates: null });
		const [beamKey, setBeamKey] = useState(0);
		const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

		useEffect(() => {
			const checkCollision = () => {
				if (
					beamRef.current &&
					containerRef.current &&
					parentRef.current &&
					!cycleCollisionDetected
				) {
					const beamRect = beamRef.current.getBoundingClientRect();
					const containerRect = containerRef.current.getBoundingClientRect();
					const parentRect = parentRef.current.getBoundingClientRect();

					if (beamRect.bottom >= containerRect.top) {
						const relativeX =
							beamRect.left - parentRect.left + beamRect.width / 2;
						const relativeY = beamRect.bottom - parentRect.top;
						setCollision({
							detected: true,
							coordinates: { x: relativeX, y: relativeY },
						});
						setCycleCollisionDetected(true);
					}
				}
			};

			const animationInterval = setInterval(checkCollision, 60);
			return () => clearInterval(animationInterval);
		}, [cycleCollisionDetected, containerRef, parentRef]);

		useEffect(() => {
			if (collision.detected && collision.coordinates) {
				const resetTimeout = setTimeout(() => {
					setCollision({ detected: false, coordinates: null });
					setCycleCollisionDetected(false);
				}, 1800);

				const beamTimeout = setTimeout(() => {
					setBeamKey((prev) => prev + 1);
				}, 1800);

				return () => {
					clearTimeout(resetTimeout);
					clearTimeout(beamTimeout);
				};
			}
			return undefined;
		}, [collision]);

		const [minDuration, maxDuration] = durationRange;
		const [minDelay, maxDelay] = delayRange;

		const duration =
			beamOptions?.duration ??
			minDuration +
				(maxDuration - minDuration) * seededRandom(seed * 2.97 + beamKey);
		const repeatDelay =
			minDelay + (maxDelay - minDelay) * seededRandom(seed * 3.61 + beamKey);

		return (
			<>
				<motion.div
					key={beamKey}
					ref={beamRef}
					animate="animate"
					initial={{
						translateY: "-200px",
						translateX: beamOptions?.initialX ?? "0px",
					}}
					variants={{
						animate: {
							translateY: "1800px",
							translateX: beamOptions?.translateX ?? "0px",
						},
					}}
					transition={{
						duration,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "loop",
						ease: "linear",
						delay: beamOptions?.delay ?? 0,
						repeatDelay,
					}}
					className="absolute top-0 left-0 z-10 m-auto rounded-full bg-[linear-gradient(180deg,rgba(191,219,254,0)_0%,rgba(59,130,246,0.38)_40%,rgba(59,130,246,0.95)_60%,rgba(37,99,235,0)_100%)] mix-blend-screen blur-[1px]"
					style={{
						height: beamOptions?.height ?? defaultBeamHeight,
						width: defaultBeamWidth,
					}}
				/>

				<AnimatePresence>
					{collision.detected && collision.coordinates ? (
						<Explosion
							key={`${collision.coordinates.x}-${collision.coordinates.y}-${beamKey}`}
							style={{
								left: `${collision.coordinates.x}px`,
								top: `${collision.coordinates.y}px`,
								transform: "translate(-50%, -50%)",
							}}
						/>
					) : null}
				</AnimatePresence>
			</>
		);
	},
);

CollisionMechanism.displayName = "LaserCollisionMechanism";

const Explosion = ({
	...props
}: React.HTMLProps<HTMLDivElement>): JSX.Element => {
	const spans = useMemo(
		() =>
			Array.from({ length: 22 }, (_, index) => ({
				id: index,
				x: seededRandom(index + 1) * 90 - 45,
				y: -Math.abs(seededRandom(index + 3) * 60 + 20),
				duration: 0.6 + seededRandom(index + 5) * 0.7,
			})),
		[],
	);

	return (
		<div {...props} className={cn("absolute z-20 h-2 w-2", props.className)}>
			<motion.div
				initial={{ opacity: 0.4, scale: 0.8 }}
				animate={{ opacity: 0, scale: 1.8 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 1.1, ease: "easeOut" }}
				className="-inset-x-10 absolute top-0 m-auto h-2 w-14 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.72)_0%,rgba(37,99,235,0)_70%)] blur-[6px]"
			/>
			{spans.map((span) => (
				<motion.span
					key={span.id}
					initial={{ x: 0, y: 0, opacity: 1 }}
					animate={{ x: span.x, y: span.y, opacity: 0 }}
					transition={{ duration: span.duration, ease: "easeOut" }}
					className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-sky-400 to-indigo-500"
				/>
			))}
		</div>
	);
};
