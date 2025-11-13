"use client";

import { ArrowDown } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";

import {
	DEFAULT_HERO_SOCIAL_PROOF,
	HeroAurora,
	HeroHeadline,
	type HeroVideoConfig,
	HeroVideoPreview,
	type HeroVideoPreviewHandle,
	PersonaCTA,
	resolveHeroCopy,
} from "@external/dynamic-hero";

import PricingCheckoutDialog from "@/components/home/pricing/PricingCheckoutDialog";
import { HeroMetricGrid } from "@/components/home/heros/HeroMetricGrid";
import {
	CTA_MICROCOPY,
	HERO_COPY_FALLBACK,
	HERO_COPY_INPUT,
	PRIMARY_CTA,
	SECONDARY_CTA,
} from "@/components/home/heros/heroConfig";
import { useHeroTrialCheckout } from "@/components/home/heros/useHeroTrialCheckout";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { LasersBackground } from "@/components/ui/lasers-background";
import { LightRays } from "@/components/ui/light-rays";
import { Pointer } from "@/components/ui/pointer";

const MOCK_VIDEO: HeroVideoConfig = {
	src: "https://www.youtube.com/embed/qh3NGpYRG3I?rel=0&controls=1&modestbranding=1",
	poster:
		"https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop",
	provider: "youtube",
};

interface TrialCheckoutState {
	clientSecret: string;
	plan: Plan;
	planType: "monthly";
	mode: "setup";
	context: "trial";
	postTrialAmount?: number;
}

export default function DynamicHeroDemoPage(): JSX.Element {
	const socialProof = DEFAULT_HERO_SOCIAL_PROOF;
	const heroCopy = useMemo(
		() => resolveHeroCopy(HERO_COPY_INPUT, HERO_COPY_FALLBACK),
		[],
	);
	const { isTrialLoading, checkoutState, startTrial, closeCheckout } =
		useHeroTrialCheckout();
	const videoPreviewRef = useRef<HeroVideoPreviewHandle>(null);
	const videoSectionRef = useRef<HTMLDivElement>(null);

	const handleScrollToDetails = useCallback(() => {
		const section = document.getElementById("dynamic-hero-details");
		if (section) {
			section.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

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

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-background/95 text-foreground">
			<LightRays className="pointer-events-none absolute inset-0 opacity-70" />
			<HeroAurora className="z-0" />

			<LasersBackground className="relative z-0 flex min-h-screen w-full items-center justify-center pb-20">
				<div className="container relative z-10 mx-auto flex w-full flex-col items-center gap-12 px-4 py-16 md:px-8">
					<div className="flex w-full flex-col items-center gap-4 text-center md:max-w-3xl">
						<div className="flex flex-wrap items-center justify-center gap-3 text-primary text-xs uppercase tracking-[0.35em]">
							<span className="rounded-full border border-foreground/15 bg-foreground/10 px-4 py-1 font-semibold text-foreground/70">
								Test External Module
							</span>
						</div>

						<div className="relative inline-flex items-center justify-center">
							<button
								type="button"
								onClick={handleScrollToDetails}
								className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-semibold text-primary text-xs uppercase tracking-[0.35em] transition hover:bg-primary/15"
							>
								<ArrowDown className="h-3.5 w-3.5 transition group-hover:translate-y-0.5" />
								Next
							</button>
							<Pointer className="text-primary">
								<div className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/30 text-primary backdrop-blur-md">
									<ArrowDown className="h-4 w-4" />
								</div>
							</Pointer>
						</div>

						<HeroHeadline
							copy={heroCopy}
							socialProof={socialProof}
							reviews={socialProof.reviews}
							personaLabel="Shared UI Library"
							personaDescription="Persona tuned for DealScale hero builders"
						/>
					</div>

					<div className="flex w-full flex-col items-center gap-8">
						<PersonaCTA
							className="w-full"
							displayMode="both"
							orientation="horizontal"
							primary={PRIMARY_CTA}
							secondary={SECONDARY_CTA}
							microcopy={CTA_MICROCOPY}
							onPrimaryClick={startTrial}
							onSecondaryClick={handlePreviewDemo}
							primaryLoading={isTrialLoading}
						/>
						<p className="max-w-xl text-center text-muted-foreground text-sm">
							Trusted by builders rolling out Quick Start experiences across the
							DealScale platform.
						</p>

						<div
							ref={videoSectionRef}
							className="w-full max-w-5xl"
							data-beam-collider="true"
						>
							<HeroVideoPreview
								ref={videoPreviewRef}
								video={MOCK_VIDEO}
								thumbnailAlt="Dynamic hero module mock preview"
							/>
						</div>

						<div id="dynamic-hero-details" className="w-full space-y-6">
							<div
								className="flex flex-col items-start gap-4 rounded-3xl border border-border/60 bg-background/70 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-8"
								data-beam-collider="true"
							>
								<AvatarCircles
									avatarUrls={socialProof.avatars}
									numPeople={socialProof.numPeople}
									interaction="tooltip"
									className="-space-x-3"
								/>
								<div className="text-left">
									<p className="font-semibold text-foreground text-sm">
										{socialProof.caption}
									</p>
									<p className="text-muted-foreground text-xs">
										Reusable modules, theme-aware tokens, guided demos out of
										the box.
									</p>
								</div>
							</div>
							<HeroMetricGrid />
						</div>
					</div>

					<section className="mt-6 max-w-4xl rounded-3xl border border-border/40 bg-muted/40 px-6 py-6 text-muted-foreground text-sm lg:px-10 lg:py-8">
						<p className="leading-relaxed">
							This showcase renders the hero entirely through{" "}
							<code className="rounded bg-muted px-2 py-[3px] text-foreground text-xs">
								@external/dynamic-hero
							</code>{" "}
							utility exports and supporting UI primitives. Clone the layout,
							swap the copy, and plug in your own video to replicate the Quick
							Start hero in any Next.js surface.
						</p>
					</section>
				</div>
			</LasersBackground>
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
