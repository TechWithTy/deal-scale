"use client";

import type { HTMLAttributes } from "react";
import { memo, useCallback, useMemo } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type BackgroundBeamsWithCollisionProps = HTMLAttributes<HTMLDivElement> & {
	perspective?: number;
	beamsPerSide?: number;
	beamSize?: number;
	beamDelayMin?: number;
	beamDelayMax?: number;
	beamDuration?: number;
	gridColor?: string;
};

type BeamConfig = {
	width: string;
	x: string;
	delay: number;
	duration: number;
};

const Beam = memo(function Beam({
	width,
	x,
	delay,
	duration,
}: BeamConfig) {
	const hue = Math.floor(Math.random() * 360);
	const ratio = Math.floor(Math.random() * 10) + 1;

	return (
		<motion.div
			style={{
				"--x": x,
				"--width": width,
				"--ratio": ratio,
				"--beam-gradient": `linear-gradient(hsl(${hue} 90% 60%), transparent)`,
			} as Record<string, string | number>}
			className="absolute left-[var(--x)] top-0 [aspect-ratio:1/var(--ratio)] [background:var(--beam-gradient)] [width:var(--width)]"
			initial={{ y: "100cqmax", x: "-50%" }}
			animate={{ y: "-100%", x: "-50%" }}
			transition={{
				duration,
				delay,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		/>
	);
});

const buildBeams = (
	count: number,
	size: number,
	delayMin: number,
	delayMax: number,
	duration: number,
) => {
	const beams: BeamConfig[] = [];
	if (count <= 0) {
		return beams;
	}

	const cellsPerSide = Math.floor(100 / size);
	const step = Math.max(1, cellsPerSide / count);

	for (let index = 0; index < count; index += 1) {
		const x = Math.floor(index * step);
		const delay = Math.random() * (delayMax - delayMin) + delayMin;
		beams.push({
			width: `${size}%`,
			x: `${x * size}%`,
			delay,
			duration,
		});
	}

	return beams;
};

export const BackgroundBeamsWithCollision = ({
	className,
	children,
	perspective = 140,
	beamsPerSide = 4,
	beamSize = 6,
	beamDelayMin = 0,
	beamDelayMax = 3.6,
	beamDuration = 4.5,
	gridColor = "hsl(142 76% 45% / 0.35)",
	...props
}: BackgroundBeamsWithCollisionProps) => {
	const getBeams = useCallback(
		() =>
			buildBeams(
				beamsPerSide,
				beamSize,
				beamDelayMin,
				Math.max(beamDelayMin + 0.1, beamDelayMax),
				beamDuration,
			),
		[beamsPerSide, beamSize, beamDelayMin, beamDelayMax, beamDuration],
	);

	const topBeams = useMemo(() => getBeams(), [getBeams]);
	const rightBeams = useMemo(() => getBeams(), [getBeams]);
	const bottomBeams = useMemo(() => getBeams(), [getBeams]);
	const leftBeams = useMemo(() => getBeams(), [getBeams]);

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-3xl border border-primary/15 bg-background",
				className,
			)}
			{...props}
		>
			<div
				style={
					{
						"--perspective": `${perspective}px`,
						"--grid-color": gridColor,
						"--beam-size": `${beamSize}%`,
						"--beam-duration": `${beamDuration}s`,
					} as Record<string, string>
				}
				className="pointer-events-none absolute inset-0 [clip-path:inset(0)] [perspective:var(--perspective)] [transform-style:preserve-3d]"
				aria-hidden="true"
			>
				<div className="absolute inset-x-0 top-0 [height:100cqmax] [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]">
					{topBeams.map((beam, index) => (
						<Beam key={`top-${beam.x}-${index.toString()}`} {...beam} />
					))}
				</div>
				<div className="absolute inset-x-0 top-full [height:100cqmax] [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]">
					{bottomBeams.map((beam, index) => (
						<Beam key={`bottom-${beam.x}-${index.toString()}`} {...beam} />
					))}
				</div>
				<div className="absolute left-0 top-0 [height:100cqmax] [width:100cqh] [transform-origin:0%_0%] [transform:rotate(90deg)_rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]">
					{leftBeams.map((beam, index) => (
						<Beam key={`left-${beam.x}-${index.toString()}`} {...beam} />
					))}
				</div>
				<div className="absolute right-0 top-0 [height:100cqmax] [width:100cqh] [transform-origin:100%_0%] [transform:rotate(-90deg)_rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]">
					{rightBeams.map((beam, index) => (
						<Beam key={`right-${beam.x}-${index.toString()}`} {...beam} />
					))}
				</div>
			</div>
			<div className="relative z-10">
				{children}
			</div>
		</div>
	);
};

