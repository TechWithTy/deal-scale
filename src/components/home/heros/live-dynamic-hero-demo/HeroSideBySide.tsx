"use client";

import {
	type HeroVideoPreviewHandle,
	resolveHeroThumbnailSrc,
	useHeroVideoConfig,
} from "@external/dynamic-hero";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

import PersonaCTA from "@/components/cta/PersonaCTA";
import { useHeroTrialCheckout } from "@/components/home/heros/useHeroTrialCheckout";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { ReactivateCampaignInput } from "@/components/home/ReactivateCampaignInput";
import type { BadgeMetrics } from "@/components/home/ReactivateCampaignBadges";
import { Particles } from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

import {
	LIVE_COPY,
	LIVE_MICROCOPY,
	LIVE_PRIMARY_CTA,
	LIVE_SECONDARY_CTA,
	LIVE_SOCIAL_PROOF,
	LIVE_VIDEO,
	PERSONA_LABEL,
} from "./_config";

const HERO_POSTER_FALLBACK = resolveHeroThumbnailSrc(
	LIVE_VIDEO,
	LIVE_VIDEO.poster,
);

const HeroAuroraDynamic = dynamic(
	() => import("@external/dynamic-hero").then((mod) => mod.HeroAurora),
	{ ssr: false, loading: () => null },
);

const HeroVideoPreviewDynamic = dynamic(
	() => import("@external/dynamic-hero").then((mod) => mod.HeroVideoPreview),
	{
		ssr: false,
		loading: () => (
			<HeroVideoPreviewSkeleton
				posterSrc={HERO_POSTER_FALLBACK}
				alt="Product demo preview"
			/>
		),
	},
);

const PricingCheckoutDialog = dynamic(
	() => import("@/components/home/pricing/PricingCheckoutDialog"),
	{ ssr: false, loading: () => null },
);

function HeroVideoPreviewSkeleton({
	posterSrc,
	alt,
}: {
	posterSrc: string;
	alt: string;
}) {
	return (
		<div className="relative w-full overflow-hidden rounded-[32px] border border-border/40 bg-background/80 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)] ring-1 ring-border/30 backdrop-blur-lg">
			<div className="relative w-full overflow-hidden rounded-[28px] border border-border/30 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)]">
				<div className="relative aspect-video w-full">
					<Image
						src={posterSrc}
						alt={alt}
						fill
						className="object-cover"
						priority
						sizes="(min-width: 1280px) 1024px, (min-width: 768px) 768px, 100vw"
					/>
				</div>
			</div>
		</div>
	);
}

export default function HeroSideBySide(): JSX.Element {
	const videoSectionRef = useRef<HTMLDivElement | null>(null);
	const videoPreviewRef = useRef<HeroVideoPreviewHandle>(null);
	const { isTrialLoading, checkoutState, startTrial, closeCheckout } =
		useHeroTrialCheckout();
	const { resolvedTheme } = useTheme();
	const isMobile = useIsMobile();
	const [particleColor, setParticleColor] = useState("#ffffff");

	// Update particle color based on theme
	useEffect(() => {
		setParticleColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	// Performance: Reduce particle count on mobile for better performance
	const particleQuantity = isMobile ? 40 : 80;

	const heroVideo = useHeroVideoConfig(LIVE_VIDEO);

	const handlePreviewDemo = useCallback(() => {
		const node = videoSectionRef.current;
		if (node && typeof node.scrollIntoView === "function") {
			node.scrollIntoView({ behavior: "smooth", block: "center" });
		}

		const playVideo = () => {
			videoPreviewRef.current?.play();
		};

		if (
			typeof window !== "undefined" &&
			typeof window.requestAnimationFrame === "function"
		) {
			window.requestAnimationFrame(playVideo);
		} else {
			playVideo();
		}
	}, []);

	// Extract problem and solution from LIVE_COPY
	const problem = LIVE_COPY?.values?.problem ?? "Losing Deals";
	const solution =
		LIVE_COPY?.values?.solution ??
		"Automating Your Entire Real Estate Deal Flow";
	const description =
		typeof LIVE_COPY?.subtitle === "string"
			? LIVE_COPY.subtitle
			: "AI follow-up, sequencing, and CRM automation — every lead worked automatically.";

	// Single combined statement
	const combinedStatement = `Stop ${problem}. Start ${solution}`;

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-muted/40 to-background text-foreground">
			<HeroAuroraDynamic className="z-0 opacity-80 dark:opacity-90" />

			<section className="relative z-0 w-full overflow-hidden">
				<div className="pointer-events-none absolute inset-0">
					{/* Particles Background - Performance Optimized */}
					<Particles
						className="absolute inset-0 z-[1]"
						quantity={particleQuantity}
						ease={80}
						staticity={50}
						size={1.2}
						color={particleColor}
						vx={0}
						vy={0}
					/>
					<InteractiveGridPattern
						width={72}
						height={72}
						className="z-[2] opacity-20 md:opacity-25"
						squares={[20, 20]}
						squaresClassName="stroke-border/25"
					/>
					<div className="absolute inset-0 z-[3] bg-gradient-to-b from-background/20 via-background/50 to-background" />

					<InteractiveGridPattern
						width={48}
						height={48}
						className="z-[4] opacity-[0.35]"
						squares={[34, 34]}
						squaresClassName="stroke-border/20"
					/>

					<div className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24)_0%,rgba(15,23,42,0)_55%)] opacity-35" />
				</div>

				<div className="container relative z-10 mx-auto w-full px-6 py-12 md:px-10 md:py-16 lg:px-12 lg:py-20">
					{/* Centered text content */}
					<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center md:gap-8">
						{/* Persona Badge */}
						<span className="inline-flex items-center justify-center rounded-full border border-border/40 bg-background/70 px-5 py-1.5 font-semibold text-foreground/80 text-xs uppercase tracking-[0.4em]">
							{PERSONA_LABEL}
						</span>

						{/* Single Combined Statement */}
						<h1 className="font-bold text-4xl text-foreground leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
							{combinedStatement}
						</h1>

						{/* Description */}
						<p className="max-w-3xl text-base text-muted-foreground leading-relaxed sm:text-lg md:text-xl dark:text-neutral-300">
							{description}
						</p>

						{/* Reactivate Campaign Search Input */}
						<div className="mt-4 w-full max-w-4xl">
							<ReactivateCampaignInput
								onActivationComplete={(metrics: BadgeMetrics) => {
									console.log("Activation complete with metrics:", metrics);
								}}
							/>
						</div>

						{/* CTAs */}
						<div className="mt-2 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<PersonaCTA
								className="w-full sm:w-auto"
								displayMode="both"
								orientation="horizontal"
								primary={LIVE_PRIMARY_CTA}
								secondary={LIVE_SECONDARY_CTA}
								microcopy={LIVE_MICROCOPY}
								onPrimaryClick={startTrial}
								onSecondaryClick={handlePreviewDemo}
								primaryLoading={isTrialLoading}
							/>
						</div>

						{/* Social Proof */}
						<div className="mt-2 flex flex-col items-center gap-3">
							<AvatarCircles
								avatarUrls={LIVE_SOCIAL_PROOF.avatars}
								numPeople={LIVE_SOCIAL_PROOF.numPeople}
								interaction="tooltip"
								className="-space-x-3"
							/>
							<p className="text-muted-foreground text-sm">
								{LIVE_SOCIAL_PROOF.caption ??
									"Trusted by real estate investors nationwide"}
							</p>
						</div>
					</div>
				</div>

				{/* Video Section - Directly below hero text */}
				<div
					ref={videoSectionRef}
					id="hero-video-section"
					className="container relative z-10 mx-auto w-full px-6 pb-12 md:px-10 md:pb-16 lg:px-12 lg:pb-20"
				>
					<div className="mx-auto w-full max-w-5xl">
						<div className="flex w-full items-center justify-center">
							<div className="w-full">
								<HeroVideoPreviewDynamic
									ref={videoPreviewRef}
									video={heroVideo}
									thumbnailAlt="Live dynamic hero video preview"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{checkoutState ? (
				<PricingCheckoutDialog
					clientSecret={checkoutState.clientSecret}
					plan={checkoutState.plan}
					planType={checkoutState.planType}
					mode={checkoutState.mode}
					context={checkoutState.context}
					postTrialAmount={checkoutState.postTrialAmount}
					onClose={closeCheckout}
				/>
			) : null}
		</div>
	);
}
