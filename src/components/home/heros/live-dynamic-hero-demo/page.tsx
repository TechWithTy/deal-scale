"use client";

import { useEffect, useMemo, useState } from "react";

import {
	HeroAurora,
	HeroHeadline,
	HeroVideoPreview,
} from "@external/dynamic-hero";

import PersonaCTA from "@/components/cta/PersonaCTA";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Separator } from "@/components/ui/separator";

import {
	LIVE_COPY,
	LIVE_MICROCOPY,
	LIVE_PRIMARY_CTA,
	LIVE_SECONDARY_CTA,
	LIVE_SOCIAL_PROOF,
	LIVE_VIDEO,
} from "./_config";
import { MetricBlock } from "./_components/metric-block";
import {
	ScrollProgressIndicator,
	type ScrollProgressSection,
} from "./_components/scroll-progress-indicator";

const SCROLL_SECTIONS: ScrollProgressSection[] = [
	{ id: "loan-officer-hero-top", label: "Hero" },
	{ id: "loan-officer-cta", label: "CTA" },
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

			<BackgroundBeamsWithCollision className="relative z-0 flex min-h-screen w-full items-center justify-center pb-20">
				<div className="container relative z-10 mx-auto flex w-full flex-col items-center gap-12 px-4 py-16 md:px-8">
					<div
						id="loan-officer-hero-top"
						className="flex w-full flex-col items-center gap-6 text-center md:max-w-3xl"
					>
						<ScrollProgressIndicator
							sections={sections}
							activeId={activeSection}
						/>
						<HeroHeadline
							copy={LIVE_COPY}
							socialProof={LIVE_SOCIAL_PROOF}
							reviews={LIVE_SOCIAL_PROOF.reviews}
							personaLabel="Loan Officer Persona"
							personaDescription="AI follow-up for mortgage teams"
						/>
					</div>

					<div
						id="loan-officer-cta"
						className="flex w-full flex-col items-center gap-8"
					>
						<p className="max-w-2xl text-center text-lg text-neutral-300">
							Automated borrower follow-up from your mortgage CRM, orchestrated
							so loan officers focus on closing conversations.
						</p>
						<PersonaCTA
							className="w-full"
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

						<div className="max-w-2xl rounded-3xl border border-border/45 bg-background/85 px-6 py-5 text-center shadow-[0_16px_55px_-35px_rgba(37,99,235,0.35)] backdrop-blur-md md:px-10">
							<p className="font-medium text-foreground text-sm">
								Start with a 90-second walkthrough of the automation control
								center.
							</p>
							<p className="mt-2 text-muted-foreground text-sm">
								Watch the demo, then review the rollout checklist below to keep
								your borrower outreach consistent across loan programs.
							</p>
						</div>

						<div
							id="live-hero-details"
							className="flex w-full flex-col gap-6 rounded-3xl border border-border/60 bg-background/70 px-6 py-6 shadow-[0_24px_80px_-40px_rgba(34,197,94,0.35)] md:flex-row md:items-center md:justify-between md:px-10 md:py-8"
						>
							<div
								className="flex items-center gap-4"
								data-beam-collider="true"
							>
								<AvatarCircles
									avatarUrls={LIVE_SOCIAL_PROOF.avatars}
									numPeople={LIVE_SOCIAL_PROOF.numPeople}
									interaction="tooltip"
									className="-space-x-3"
								/>
								<div className="text-left">
									<p className="font-semibold text-foreground text-sm">
										Close more loans with always-on borrower follow-up
									</p>
									<p className="text-muted-foreground text-xs">
										Automatically nurture borrowers from first inquiry to
										closing without adding headcount.
									</p>
								</div>
							</div>
							<Separator className="md:hidden" />
							<div className="grid grid-cols-3 gap-4 text-center font-semibold text-foreground text-sm">
								<MetricBlock
									label="Borrower Touchpoints"
									value="5 AI calls free"
								/>
								<MetricBlock
									label="Follow-Up Coverage"
									value="24/7 automation"
								/>
								<MetricBlock
									label="Pipeline Visibility"
									value="Real-time dashboards"
								/>
							</div>
						</div>
					</div>

					<section className="mt-6 max-w-4xl rounded-3xl border border-border/40 bg-muted/40 px-6 py-6 text-muted-foreground text-sm lg:px-10 lg:py-8">
						<p className="leading-relaxed">
							This live demo mirrors the updated Dynamic Hero schema (v6)
							featuring the Loan Officer persona. Rotate through
							mortgage-specific problems, solutions, and fears, launch
							borrower-oriented CTAs, and connect the hero to your mortgage CRM
							using the `@external/dynamic-hero` utilities.
						</p>
					</section>
				</div>
			</BackgroundBeamsWithCollision>
		</div>
	);
}
