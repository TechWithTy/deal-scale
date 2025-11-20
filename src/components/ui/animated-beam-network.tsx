"use client";

import { Cloud, Globe, Layers, MessageCircle, Server, Zap } from "lucide-react";
import { motion } from "motion/react";
import { createRef, forwardRef, useMemo, useRef } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { AnimatedBeam } from "./animated-beam";
import { BackgroundBeamsWithCollision } from "./background-beams-with-collision";
import { LightRays } from "./light-rays";

export interface AnimatedBeamNetworkNode {
	id: string;
	label: string;
	icon: ReactNode;
	className?: string;
}

export interface AnimatedBeamNetworkProps {
	className?: string;
	title?: string;
	description?: string;
	centerLabel?: string;
	nodes?: AnimatedBeamNetworkNode[];
	variant?: "full" | "background";
	showLabels?: boolean;
	showCenterLabel?: boolean;
	centerContent?: ReactNode;
}

const DEFAULT_TITLE = "Integrations on Autopilot";
const DEFAULT_DESCRIPTION =
	"Visualize how DealScale orchestrates data through your stack. Each beam represents real-time sync between the platforms your team already trusts.";
const DEFAULT_CENTER_LABEL = "DealScale Core";

const DEFAULT_NODES: AnimatedBeamNetworkNode[] = [
	{
		id: "cloud-sync",
		label: "Cloud Storage",
		icon: <Cloud className="h-5 w-5 text-sky-500" />,
	},
	{
		id: "automation",
		label: "Automation",
		icon: <Zap className="h-5 w-5 text-amber-400" />,
	},
	{
		id: "messaging",
		label: "Messaging",
		icon: <MessageCircle className="h-5 w-5 text-rose-400" />,
	},
	{
		id: "workflow",
		label: "Workflow",
		icon: <Layers className="h-5 w-5 text-emerald-400" />,
	},
	{
		id: "api",
		label: "API Hub",
		icon: <Server className="h-5 w-5 text-indigo-400" />,
	},
	{
		id: "global",
		label: "Global Ops",
		icon: <Globe className="h-5 w-5 text-purple-400" />,
	},
];

const layoutSlots = [
	[0, 1],
	[2, 3],
	[4, 5],
];

const beamSettings = [
	{ curvature: -70, endYOffset: -12 },
	{ curvature: -32, endYOffset: -6 },
	{ curvature: 24, endYOffset: 0 },
	{ curvature: -24, endYOffset: 0, reverse: true as const },
	{ curvature: 40, endYOffset: 6, reverse: true as const },
	{ curvature: 80, endYOffset: 12, reverse: true as const },
];

interface NodeCircleProps {
	icon: ReactNode;
	label: string;
	className?: string;
	showLabel?: boolean;
}

const NodeCircle = forwardRef<HTMLDivElement, NodeCircleProps>(
	({ icon, label, className, showLabel = true }, ref) => (
		<div
			className={cn(
				"flex flex-col items-center gap-3 text-center text-muted-foreground text-xs sm:text-sm",
				!showLabel && "gap-0",
			)}
		>
			<div
				ref={ref}
				role="img"
				aria-label={label}
				className={cn(
					"flex size-12 items-center justify-center rounded-full border border-white/50 bg-white/90 shadow-[0_0_35px_rgba(59,130,246,0.2)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/80",
					className,
				)}
			>
				<span className="sr-only">{label}</span>
				{icon}
			</div>
			{showLabel ? (
				<span className="font-medium text-foreground/80 dark:text-foreground/70">
					{label}
				</span>
			) : null}
		</div>
	),
);

NodeCircle.displayName = "NodeCircle";

export function AnimatedBeamNetwork({
	className,
	title = DEFAULT_TITLE,
	description = DEFAULT_DESCRIPTION,
	centerLabel = DEFAULT_CENTER_LABEL,
	nodes,
	variant = "full",
	showLabels,
	showCenterLabel,
	centerContent,
}: AnimatedBeamNetworkProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const centerRef = useRef<HTMLDivElement>(null);
	const isBackground = variant === "background";

	const resolvedNodes = useMemo(() => {
		if (!nodes || nodes.length === 0) {
			return DEFAULT_NODES;
		}

		const merged = [...nodes, ...DEFAULT_NODES];
		return merged.slice(0, DEFAULT_NODES.length);
	}, [nodes]);

	const shouldShowLabels = showLabels ?? !isBackground;
	const shouldShowCenterLabel = showCenterLabel ?? !isBackground;

	const nodeRefs = useMemo(
		() => resolvedNodes.map(() => createRef<HTMLDivElement>()),
		[resolvedNodes],
	);

	const beamPathWidth = isBackground ? 2.6 : 1.8;
	const beamPathOpacity = isBackground ? 0.22 : 0.15;

	return (
		<section
			className={cn(
				"relative w-full overflow-hidden rounded-3xl border border-border/50 bg-background/70 shadow-2xl backdrop-blur-xl",
				isBackground &&
					"pointer-events-none border-transparent bg-transparent shadow-none backdrop-blur-none",
				className,
			)}
			data-testid="animated-beam-network"
		>
			<BackgroundBeamsWithCollision
				className={cn(
					"min-h-[32rem] rounded-[inherit] bg-gradient-to-b from-background via-background/60 to-background/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
					isBackground && "min-h-full",
				)}
			>
				<LightRays className="opacity-80" length="120%" blur={38} />
				{isBackground ? (
					<div className="pointer-events-none absolute inset-0">
						<motion.div
							className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.38)_0%,rgba(15,23,42,0)_68%)] blur-[90px]"
							animate={{ scale: [1, 1.08, 1], opacity: [0.7, 0.95, 0.7] }}
							transition={{
								duration: 6.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: [0.25, 0.1, 0.25, 1],
							}}
						/>
						<motion.div
							className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.35)_0%,rgba(15,23,42,0)_70%)] blur-[80px]"
							animate={{ scale: [0.95, 1.12, 0.95], opacity: [0.6, 0.9, 0.6] }}
							transition={{
								duration: 5.2,
								repeat: Number.POSITIVE_INFINITY,
								ease: [0.45, 0, 0.55, 1],
							}}
						/>
						<div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/35 dark:from-slate-950/45 dark:via-transparent dark:to-slate-950/55" />
					</div>
				) : null}

				<div
					className={cn(
						"relative z-10 flex h-full w-full flex-col items-center gap-10 px-6 py-12 sm:px-10 md:gap-12 md:py-16",
						isBackground && "px-0 py-0 md:py-0",
					)}
				>
					{isBackground ? null : (
						<div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
							<span className="font-semibold text-primary/70 text-xs uppercase tracking-[0.38em]">
								Real-Time Sync
							</span>
							<h2 className="text-balance font-semibold text-3xl text-foreground md:text-4xl">
								{title}
							</h2>
							<p className="text-balance text-muted-foreground text-sm md:text-base">
								{description}
							</p>
						</div>
					)}

					<div
						ref={containerRef}
						className={cn(
							"relative flex w-full max-w-3xl flex-col gap-12",
							isBackground && "max-w-none px-6 py-12 sm:px-12",
						)}
					>
						{resolvedNodes.map((_, index) => (
							<AnimatedBeam
								// eslint-disable-next-line react/no-array-index-key -- position stable for <=6 nodes
								key={`beam-${index}`}
								containerRef={containerRef}
								fromRef={nodeRefs[index]}
								toRef={centerRef}
								curvature={beamSettings[index]?.curvature ?? 0}
								endYOffset={beamSettings[index]?.endYOffset ?? 0}
								reverse={beamSettings[index]?.reverse ?? false}
								duration={5 + index * 0.35}
								delay={index * 0.45}
								pathOpacity={beamPathOpacity}
								pathWidth={beamPathWidth}
								gradientStartColor="rgba(59,130,246,0.6)"
								gradientStopColor="rgba(236,72,153,0.65)"
							/>
						))}

						<div className="flex flex-col gap-10">
							{layoutSlots.map((slotRow, rowIndex) => (
								<div
									key={slotRow.join("-")}
									className={cn(
										"flex items-center justify-between gap-6",
										rowIndex === 1 && "relative",
									)}
								>
									{slotRow.map((slotIndex) => {
										const node = resolvedNodes[slotIndex];
										const nodeRef = nodeRefs[slotIndex];

										if (!node || !nodeRef) {
											return (
												<div
													key={`placeholder-${slotIndex}`}
													className="flex-1"
												/>
											);
										}

										return (
											<NodeCircle
												key={node.id}
												ref={nodeRef}
												icon={node.icon}
												label={node.label}
												className={node.className}
												showLabel={shouldShowLabels}
											/>
										);
									})}

									{rowIndex === 1 ? (
										<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
											{shouldShowCenterLabel ? (
												<div
													ref={centerRef}
													className="relative flex size-[4.25rem] items-center justify-center rounded-full border border-white/40 bg-white/90 text-center font-semibold text-foreground text-xs uppercase tracking-[0.3em] shadow-[0_0_90px_rgba(236,72,153,0.25)] backdrop-blur-md sm:size-20 sm:text-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-foreground/80"
												>
													{centerLabel}
												</div>
											) : centerContent ? (
												<div
													ref={centerRef}
													className="relative flex size-[4.75rem] items-center justify-center rounded-full border border-white/25 bg-white/25 shadow-[0_0_80px_rgba(59,130,246,0.28)] backdrop-blur-md sm:size-[5.25rem] dark:border-white/10 dark:bg-slate-950/40"
												>
													{centerContent}
												</div>
											) : (
												<div
													ref={centerRef}
													className="relative size-[4.25rem] rounded-full border border-white/20 bg-white/15 shadow-[0_0_80px_rgba(59,130,246,0.2)] backdrop-blur-md sm:size-[4.75rem] dark:border-white/10 dark:bg-slate-950/40"
												/>
											)}
										</div>
									) : null}
								</div>
							))}
						</div>
					</div>
				</div>
			</BackgroundBeamsWithCollision>
		</section>
	);
}
