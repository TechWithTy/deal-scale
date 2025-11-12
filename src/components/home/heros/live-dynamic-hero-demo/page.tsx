"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
	HeroAurora,
	HeroHeadline,
	HeroVideoPreview,
} from "@external/dynamic-hero";
import { useInView } from "motion/react";

import PersonaCTA from "@/components/cta/PersonaCTA";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { Separator } from "@/components/ui/separator";

import { MetricBlock } from "./_components/metric-block";
import {
	ScrollProgressIndicator,
	type ScrollProgressSection,
} from "./_components/scroll-progress-indicator";
import {
	LIVE_COPY,
	LIVE_MICROCOPY,
	LIVE_PRIMARY_CTA,
	LIVE_SECONDARY_CTA,
	LIVE_SOCIAL_PROOF,
	LIVE_VIDEO,
	PERSONA_LABEL,
	PERSONA_GOAL,
} from "./_config";

const SCROLL_SECTIONS: ScrollProgressSection[] = [
	{ id: "investor-hero-top", label: "Hero" },
	{ id: "investor-cta", label: "CTA" },
	{ id: "live-hero-details", label: "Metrics" },
];

export default function LiveDynamicHeroDemoPage(): JSX.Element {
	const handleScrollToDetails = () => {
		const section = document.getElementById("live-hero-details");
		if (section) {
			section.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const sections = useMemo(() => SCROLL_SECTIONS, []);
	const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
	const heroRef = useRef<HTMLDivElement | null>(null);
	const isHeroInView = useInView(heroRef, {
		amount: 0.35,
		margin: "0px 0px -20% 0px",
	});
	const [isHeroAnimating, setIsHeroAnimating] = useState(true);

	useEffect(() => {
		setIsHeroAnimating(isHeroInView ?? true);
	}, [isHeroInView]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				const current = visible[0];
				if (current?.target?.id) {
					setActiveSection(current.target.id);
				}
			},
			{ threshold: 0.42 },
		);

		for (const section of sections) {
			const element = document.getElementById(section.id);
			if (element) {
				observer.observe(element);
			}
		}

		return () => observer.disconnect();
	}, [sections]);

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-muted/40 to-background text-foreground">
			<HeroAurora className="z-0 opacity-80 dark:opacity-90" />

			<div className="relative z-0 flex w-full items-center justify-center overflow-hidden pt-10 pb-20 md:pb-24">
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

				<div className="container relative z-10 mx-auto flex w-full flex-col items-center gap-14 px-6 py-16 md:px-10 lg:px-12">
					<div
						id="investor-hero-top"
						ref={heroRef}
						className="flex w-full flex-col items-center gap-8 text-center md:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
						data-beam-collider="true"
					>
						{/*
							Commenting out the scroll progress badges (Hero / CTA / Metrics)
							per request.
						*/}
						{/* <ScrollProgressIndicator sections={sections} activeId={activeSection} /> */}
						<HeroHeadline
							copy={LIVE_COPY}
							socialProof={LIVE_SOCIAL_PROOF}
							reviews={LIVE_SOCIAL_PROOF.reviews}
							personaLabel={PERSONA_LABEL}
							personaDescription={PERSONA_LABEL}
							isAnimating={isHeroAnimating}
						/>
					</div>

					<div
						id="investor-cta"
						className="flex w-full flex-col items-center gap-10"
						data-beam-collider="true"
					>
						<p className="max-w-3xl text-center text-base text-muted-foreground sm:text-lg md:text-xl dark:text-neutral-300">
							Automated investor deal flow from your CRM and market data, so you
							can focus on evaluating profitable opportunities.
						</p>
						<PersonaCTA
							className="w-full max-w-5xl"
							displayMode="both"
							orientation="horizontal"
							primary={LIVE_PRIMARY_CTA}
							secondary={LIVE_SECONDARY_CTA}
							microcopy={LIVE_MICROCOPY}
							onPrimaryClick={handleScrollToDetails}
							onSecondaryClick={handleScrollToDetails}
						/>
						<div className="w-full max-w-5xl" data-beam-collider="true">
							<HeroVideoPreview
								video={LIVE_VIDEO}
								thumbnailAlt="Live dynamic hero video preview"
							/>
						</div>

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
		</div>
	);
}
