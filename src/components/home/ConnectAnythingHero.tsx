"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AuroraText } from "@/components/magicui/aurora-text";
import {
	AnimatedBeamNetwork,
	type AnimatedBeamNetworkNode,
} from "@/components/ui/animated-beam-network";
import { Badge } from "@/components/ui/badge";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";
import { useGpuOptimizations } from "@/hooks/useGpuOptimizations";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const ROTATION_INTERVAL_MS = 4000;

const HERO_MESSAGES = [
	"Sync your CRM with AI precision.",
	"Automate workflows across all platforms, primarily Kestra, Make, Zapier, and n8n.",
	"Keep HubSpot, Zoho, and Salesforce perfectly aligned.",
	"No switching CRMs, just scaling smarter.",
];

const BASE_LOGOS = [
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
		alt: "HubSpot logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Zoho-logo.png",
		alt: "Zoho logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg",
		alt: "Zapier logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
		alt: "Salesforce logo",
	},
	{
		src: "https://images.seeklogo.com/logo-png/46/1/make-logo-png_seeklogo-464017.png",
		alt: "Make (formerly Integromat) logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/d/d9/N8n_logo.png",
		alt: "n8n logo",
	},
	{
		src: "https://kestra.io/cdn-cgi/image/f=webp,q=80/docs/tutorial/logos/logo-light-version.png",
		alt: "Kestra logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pipedrive_Logo.svg",
		alt: "Pipedrive logo",
	},
];

const HERO_IMAGES = [...BASE_LOGOS, ...BASE_LOGOS.slice().reverse()];

const BEAM_NETWORK_NODES: AnimatedBeamNetworkNode[] = [
	{
		id: "hubspot",
		label: "HubSpot",
		icon: (
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg"
				alt=""
				loading="lazy"
				className="h-6 w-6 object-contain"
			/>
		),
	},
	{
		id: "zapier",
		label: "Zapier",
		icon: (
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg"
				alt=""
				loading="lazy"
				className="h-6 w-6 object-contain"
			/>
		),
	},
	{
		id: "make",
		label: "Make",
		icon: (
			<img
				src="https://images.seeklogo.com/logo-png/46/1/make-logo-png_seeklogo-464017.png"
				alt=""
				loading="lazy"
				className="h-6 w-6 object-contain"
			/>
		),
	},
	{
		id: "n8n",
		label: "n8n",
		icon: (
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/d/d9/N8n_logo.png"
				alt=""
				loading="lazy"
				className="h-6 w-6 object-contain"
			/>
		),
	},
	{
		id: "kestra",
		label: "Kestra",
		icon: (
			<img
				src="https://kestra.io/cdn-cgi/image/f=webp,q=80/docs/tutorial/logos/logo-light-version.png"
				alt=""
				loading="lazy"
				className="h-6 w-6 object-contain"
			/>
		),
	},
	{
		id: "salesforce",
		label: "Salesforce",
		icon: (
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg"
				alt=""
				loading="lazy"
				className="h-6 w-6 object-contain"
			/>
		),
	},
];

const HERO_METRICS = [
	{
		id: "sync",
		value: 22,
		suffix: "ms",
		decimalPlaces: 0,
		label: "Sync latency across CRMs",
	},
	{
		id: "coverage",
		value: 18,
		suffix: "+",
		decimalPlaces: 0,
		label: "Active integration bridges",
	},
	{
		id: "uptime",
		value: 99.9,
		suffix: "%",
		decimalPlaces: 1,
		label: "Automation uptime",
	},
];

/**
 * ConnectAnythingHero renders the full-screen 3D marquee hero with rotating copy.
 */
export function ConnectAnythingHero(): JSX.Element {
	const [activeMessageIndex, setActiveMessageIndex] = useState(0);
	const enableGpu = useGpuOptimizations();
	const gpuContainerClass = enableGpu
		? "transform-gpu will-change-transform will-change-opacity"
		: "";
	const gpuDepthClass = enableGpu
		? "transform-gpu will-change-transform will-change-opacity translate-z-0"
		: "";

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setActiveMessageIndex((index) => (index + 1) % HERO_MESSAGES.length);
		}, ROTATION_INTERVAL_MS);

		return () => window.clearInterval(intervalId);
	}, []);

    return (
        <section
        className={cn(
                "relative flex w-full flex-col items-center justify-center overflow-hidden",
                "min-h-[720px] bg-transparent py-24 pb-28 sm:min-h-[760px] sm:py-28 sm:pb-32 md:min-h-[calc(100vh-120px)] lg:py-32 lg:pb-36",
				gpuContainerClass,
            )}
            style={{ overflowClipMargin: '24px' }}
        >
            <div className={cn(
				"pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-transparent",
				gpuDepthClass,
			)} />
            <AnimatedBeamNetwork
                variant="background"
                nodes={BEAM_NETWORK_NODES}
                showLabels={false}
                showCenterLabel={false}
                centerContent={
                    <Image
                        src="/logos/DealScale%20Transparent%20Logo/Deal%20Scale%20No%20Text.png"
                        alt="DealScale core logo"
                        width={56}
                        height={56}
                        priority={false}
                        className="h-12 w-12 object-contain md:h-14 md:w-14"
                    />
                }
                className={cn(
					"absolute inset-0 -z-20 h-full w-full",
					gpuDepthClass,
				)}
            />
            <div className="relative z-20 flex w-full max-w-5xl flex-col items-center px-6 text-center">
				<motion.div
					initial={{ opacity: 0, y: -18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="mb-8"
				>
					<Badge
						variant="outline"
						className="rounded-full border-white/30 bg-white/20 px-5 py-2 text-xs font-medium uppercase tracking-[0.34em] text-slate-900 shadow-[0_8px_30px_rgba(59,130,246,0.25)] backdrop-blur-md dark:border-white/15 dark:bg-slate-900/60 dark:text-slate-100"
					>
						<span className="mr-2 inline-flex items-center justify-center rounded-full bg-sky-500/20 p-1 text-sky-600 dark:text-sky-300">
							<Sparkles className="h-3.5 w-3.5" />
						</span>
						Unified Automation Layer
					</Badge>
				</motion.div>
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-6 max-w-4xl text-balance text-center font-black text-4xl leading-tight tracking-tight sm:text-5xl sm:leading-[1.1] md:text-6xl md:leading-[1.08] lg:text-7xl lg:leading-[1.06]"
				>
					<div className="space-y-1 sm:space-y-2">
						<AuroraText
							speed={1.6}
							colors={[
								"#38bdf8",
								"#a855f7",
								"#f97316",
								"#38bdf8",
							]}
							className="block w-full bg-clip-text text-transparent drop-shadow-[0_6px_18px_rgba(59,130,246,0.35)]"
						>
							Connect Anything.
						</AuroraText>
						<AuroraText
							speed={1.4}
							colors={[
								"#38bdf8",
								"#a855f7",
								"#f97316",
								"#38bdf8",
							]}
							className="block w-full bg-clip-text text-transparent drop-shadow-[0_6px_18px_rgba(249,115,22,0.3)]"
						>
							Automate Everything.
						</AuroraText>
					</div>
				</motion.h1>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeMessageIndex}
						initial={{ opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" }}
						animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
						exit={{ opacity: 0, y: -12, clipPath: "inset(0 0 100% 0)" }}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className="max-w-2xl text-center min-h-[3.5rem]"
					>
						<AnimatedGradientText
							speed={2.4}
							colorFrom="#22d3ee"
							colorTo="#f472b6"
							className="font-semibold text-lg text-slate-900 tracking-tight drop-shadow-[0_4px_18px_rgba(14,116,144,0.25)] dark:text-slate-100 md:text-xl"
						>
							{HERO_MESSAGES[activeMessageIndex]}
						</AnimatedGradientText>
					</motion.div>
				</AnimatePresence>
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
					className="mt-5 max-w-3xl text-sm text-slate-900 drop-shadow-[0_6px_14px_rgba(15,23,42,0.2)] dark:text-slate-100/85 md:text-base"
				>
					DealScale keeps your existing CRM stack in sync, enriches every touchpoint, and orchestrates automations across all platforms, with primary integrations for Kestra, Make, Zapier, and n8n.
				</motion.p>
				<motion.ul
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
					}}
					className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
				>
					{HERO_METRICS.map((metric) => (
						<motion.li
							key={metric.id}
							variants={{
								hidden: { opacity: 0, y: 14 },
								visible: { opacity: 1, y: 0 },
							}}
							className="rounded-3xl border border-slate-200/60 bg-white/80 px-6 py-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50"
						>
							<div className="flex items-baseline justify-center gap-1">
								<NumberTicker
									value={metric.value}
									decimalPlaces={metric.decimalPlaces ?? 0}
									className="text-3xl font-semibold text-slate-900 dark:text-white"
								/>
								{metric.suffix ? (
									<span className="text-lg font-semibold uppercase tracking-wide text-slate-800 dark:text-white/90">
										{metric.suffix}
									</span>
								) : null}
							</div>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-200/90">
								{metric.label}
							</p>
						</motion.li>
					))}
				</motion.ul>
			</div>
			<div className="absolute inset-0 z-10 pointer-events-none">
				<ThreeDMarquee
					variant="hero"
					images={HERO_IMAGES}
					className="opacity-40"
					itemClassName="bg-white/80 p-5 dark:bg-slate-900/65"
				/>
			</div>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-transparent dark:from-black" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-transparent dark:from-black" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent dark:from-slate-950/95" />
		</section>
	);
}
