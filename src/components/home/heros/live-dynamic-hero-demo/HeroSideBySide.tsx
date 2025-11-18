"use client";

import {
	type HeroVideoPreviewHandle,
	resolveHeroThumbnailSrc,
	useHeroVideoConfig,
} from "@external/dynamic-hero";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useRef } from "react";

import PersonaCTA from "@/components/cta/PersonaCTA";
import { useHeroTrialCheckout } from "@/components/home/heros/useHeroTrialCheckout";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { Separator } from "@/components/ui/separator";

import { MetricBlock } from "./_components/metric-block";
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
	const problem = LIVE_COPY?.values?.problem ?? "losing track of off-market leads";
	const solution = LIVE_COPY?.values?.solution ?? "AI real estate deal flow automation";
	const description =
		typeof LIVE_COPY?.subtitle === "string"
			? LIVE_COPY.subtitle
			: "Deal Scale keeps motivated sellers warm with AI sales assistants so you can focus on closing.";

	// Single combined statement
	const combinedStatement = `Stop ${problem}, start ${solution}`;

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-muted/40 to-background text-foreground">
			<HeroAuroraDynamic className="z-0 opacity-80 dark:opacity-90" />

			<div className="relative z-0 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden">
				<div className="pointer-events-none absolute inset-0">
					<InteractiveGridPattern
						width={72}
						height={72}
						className="opacity-20 md:opacity-25"
						squares={[20, 20]}
						squaresClassName="stroke-border/25"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

					<InteractiveGridPattern
						width={48}
						height={48}
						className="opacity-[0.35]"
						squares={[34, 34]}
						squaresClassName="stroke-border/20"
					/>

					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24)_0%,rgba(15,23,42,0)_55%)] opacity-35" />
				</div>

				<div className="container relative z-10 mx-auto w-full px-6 py-12 md:px-10 md:py-16 lg:px-12 lg:py-20">
					{/* Side-by-side layout: Text left, Video right */}
					<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
						{/* Left Column: Text Content */}
						<div className="flex flex-col gap-6 text-left md:gap-8">
							{/* Persona Badge */}
							<span className="inline-flex w-fit items-center justify-center rounded-full border border-border/40 bg-background/70 px-5 py-1.5 font-semibold text-foreground/80 text-xs uppercase tracking-[0.4em]">
								{PERSONA_LABEL}
							</span>

							{/* Single Combined Statement */}
							<h1 className="font-bold text-4xl text-foreground leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
								{combinedStatement}
							</h1>

							{/* Description */}
							<p className="max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg md:text-xl dark:text-neutral-300">
								{description}
							</p>

							{/* CTAs */}
							<div className="mt-2">
								<PersonaCTA
									className="w-full"
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
							<div className="mt-2 flex flex-col items-start gap-3">
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

						{/* Right Column: Video */}
						<div
							ref={videoSectionRef}
							className="flex w-full items-center justify-center"
							data-beam-collider="true"
						>
							<div className="w-full max-w-full">
								<HeroVideoPreviewDynamic
									ref={videoPreviewRef}
									video={heroVideo}
									thumbnailAlt="Live dynamic hero video preview"
								/>
							</div>
						</div>
					</div>

					{/* Additional Content Below */}
					<div className="mx-auto mt-16 flex w-full max-w-7xl flex-col gap-10">
						<div className="w-full max-w-2xl rounded-3xl border border-border/45 bg-background/85 px-5 py-5 text-center shadow-[0_16px_55px_-35px_rgba(37,99,235,0.35)] backdrop-blur-md sm:px-6 md:px-10">
							<p className="font-medium text-foreground text-sm sm:text-base">
								Start with a 90-second walkthrough of the investor pipeline
								control center.
							</p>
							<p className="mt-2 text-muted-foreground text-sm sm:text-base">
								Watch the demo, then review the rollout checklist below to keep
								your deal sourcing consistent across acquisitions.
							</p>
						</div>

						<div
							id="live-hero-details"
							className="flex w-full flex-col gap-6 rounded-3xl border border-border/60 bg-background/70 px-6 py-6 shadow-[0_24px_80px_-40px_rgba(34,197,94,0.35)] md:flex-row md:items-center md:justify-between md:px-10 md:py-8"
							data-beam-collider="true"
						>
							<div
								className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left"
								data-beam-collider="true"
							>
								<AvatarCircles
									avatarUrls={LIVE_SOCIAL_PROOF.avatars}
									numPeople={LIVE_SOCIAL_PROOF.numPeople}
									interaction="tooltip"
									className="-space-x-3"
								/>
								<div className="text-center md:text-left">
									<p className="font-semibold text-foreground text-sm sm:text-base">
										Keep motivated sellers warm with always-on deal follow-up
									</p>
									<p className="text-muted-foreground text-xs sm:text-sm">
										Automatically nurture leads from first interest to signed
										contract without burning time.
									</p>
								</div>
							</div>
							<Separator className="md:hidden" />
							<div className="grid w-full grid-cols-1 gap-4 text-center font-semibold text-foreground text-sm sm:grid-cols-3 sm:text-base">
								<MetricBlock
									label="Seller Touchpoints"
									value="Daily AI outreach"
								/>
								<MetricBlock label="Deal Screening" value="24/7 automation" />
								<MetricBlock
									label="Pipeline Visibility"
									value="Real-time dashboards"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
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

