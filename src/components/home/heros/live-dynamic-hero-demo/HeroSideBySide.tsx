"use client";

import { useCallback } from "react";

import dynamic from "next/dynamic";

import PersonaCTA from "@/components/cta/PersonaCTA";
import { useHeroTrialCheckout } from "@/components/home/heros/useHeroTrialCheckout";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

import {
	LIVE_COPY,
	LIVE_MICROCOPY,
	LIVE_PRIMARY_CTA,
	LIVE_SECONDARY_CTA,
	LIVE_SOCIAL_PROOF,
	PERSONA_LABEL,
} from "./_config";

const HeroAuroraDynamic = dynamic(
	() => import("@external/dynamic-hero").then((mod) => mod.HeroAurora),
	{ ssr: false, loading: () => null },
);

const PricingCheckoutDialog = dynamic(
	() => import("@/components/home/pricing/PricingCheckoutDialog"),
	{ ssr: false, loading: () => null },
);

export default function HeroSideBySide(): JSX.Element {
	const { isTrialLoading, checkoutState, startTrial, closeCheckout } =
		useHeroTrialCheckout();

	const handlePreviewDemo = useCallback(() => {
		// Scroll to video section (handled by CallDemoShowcase component)
		const videoSection = document.getElementById("call-demo");
		if (videoSection && typeof videoSection.scrollIntoView === "function") {
			videoSection.scrollIntoView({ behavior: "smooth", block: "center" });
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

			<section className="relative z-0 w-full overflow-hidden">
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

