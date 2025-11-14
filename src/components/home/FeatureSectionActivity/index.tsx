"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ambientFlow from "@/assets/animations/processSteps.json";
import { AuroraText } from "@/components/magicui/aurora-text";
import ClientLottie from "@/components/ui/ClientLottie";
import { Badge } from "@/components/ui/badge";
import { CardStack } from "@/components/ui/card-stack";
import { GlareCard } from "@/components/ui/glare-card";
import type { ActivityEvent } from "@/data/activity/activityStream";
import { activityStream } from "@/data/activity/activityStream";
import { cn } from "@/lib/utils";

import {
	LIVE_COPY,
	PERSONA_GOAL,
	PERSONA_LABEL,
} from "@/components/home/heros/live-dynamic-hero-demo/_config";
import { DEFAULT_PERSONA_KEY, PERSONA_LABELS } from "@/data/personas/catalog";
import { usePersonaStore } from "@/stores/usePersonaStore";
import { useShallow } from "zustand/react/shallow";
import { ActivityRoller, usePrefersReducedMotion } from "./ActivityRoller";

const LEFT_COLUMN_POINTS = [
	"Sync sourcing, underwriting, and investor CRM workflows into a single live feed.",
	"Surface the most valuable seller or deal signal with motion cues and badges.",
	"Respect focus mode by pausing motion when the acquisitions desk needs deep work.",
] as const;

const FALLBACK_HEADLINE =
	"We orchestrate every deal touchpoint so your AI Sales Agents stay in deal mode.";
const FALLBACK_SUBHEAD =
	"Monitor live seller handoffs, deal alerts, and compliance tasks without leaving your workflow. Investors trust DealScale to automate deal flow outreach.";
const FALLBACK_SUPPORT = "Automate deal flow conversations in under 5 minutes.";

const CARD_STACK_OFFSET = 12;
const CARD_STACK_SCALE_FACTOR = 0.04;

const formatEventForStack = (
	event: ActivityEvent,
	index: number,
	activeIndex: number,
	setActiveIndex: (nextIndex: number) => void,
): {
	id: number;
	name: string;
	designation: string;
	content: JSX.Element;
} => ({
	id: index,
	name: event.actor,
	designation: event.label,
	content: (
		<button
			type="button"
			onFocus={() => setActiveIndex(index)}
			onMouseEnter={() => setActiveIndex(index)}
			className={cn(
				"flex h-full w-full flex-col items-start gap-4 rounded-3xl border border-border/40 bg-background/90 p-5 text-left outline-none transition-all",
				"hover:border-accent/70 hover:bg-background/95 focus-visible:ring-2 focus-visible:ring-primary/80",
				activeIndex === index &&
					"border-accent/80 bg-accent/10 shadow-[0_16px_45px_-30px_rgba(14,165,233,0.65)]",
			)}
			data-active={activeIndex === index}
			aria-current={activeIndex === index}
		>
			<div className="flex w-full items-start justify-between gap-3">
				<AuroraText className="font-semibold text-[0.7rem] text-accent uppercase tracking-[0.32em] md:text-xs">
					{event.label}
				</AuroraText>
				<span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
					{event.timeAgo}
				</span>
			</div>
			<p className="font-semibold text-foreground text-sm leading-relaxed">
				{event.actor}
			</p>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{event.action}
			</p>
			<div className="flex flex-wrap items-center gap-2 pt-1">
				<span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary text-xs">
					{event.impact}
				</span>
				{event.tags?.map((tag) => (
					<span
						key={tag}
						className="rounded-full bg-muted/60 px-2 py-1 text-[0.7rem] text-muted-foreground uppercase tracking-wide"
					>
						{tag}
					</span>
				))}
			</div>
		</button>
	),
});

export default function FeatureSectionActivity(): JSX.Element {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [inView, setInView] = useState(false);
	const prefersReducedMotion = usePrefersReducedMotion();
	const { persona, goal } = usePersonaStore(
		useShallow((state) => ({
			persona: state.persona,
			goal: state.goal,
		})),
	);
	const personaLabel =
		PERSONA_LABELS[persona] ??
		PERSONA_LABEL ??
		PERSONA_LABELS[DEFAULT_PERSONA_KEY] ??
		"AI Sales Agents";
	const personaAudience =
		personaLabel.endsWith("s") || personaLabel.endsWith("S")
			? personaLabel
			: `${personaLabel} Team`;
	const personaVerb =
		personaAudience.endsWith("s") || personaAudience.endsWith("S")
			? "stay"
			: "stays";
	const headline = `We orchestrate every deal touchpoint so your ${personaAudience} ${personaVerb} in deal mode.`;
	const resolvedBenefit =
		goal ??
		LIVE_COPY?.values?.benefit ??
		PERSONA_GOAL ??
		"Automate deal flow conversations";
	const subheadline =
		`${resolvedBenefit} ${LIVE_COPY?.values?.socialProof ?? ""}`.trim() ||
		FALLBACK_SUBHEAD;
	const supportCopy = LIVE_COPY?.subtitle?.length
		? LIVE_COPY.subtitle
		: LIVE_COPY?.values?.socialProof?.length
			? `${LIVE_COPY.values.socialProof} ${resolvedBenefit}`.trim()
			: FALLBACK_SUPPORT;

	// Observe visibility to pause animations when offscreen
	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") {
			setInView(true);
			return;
		}

		const node = sectionRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.target === node) {
						setInView(e.isIntersecting);
					}
				}
			},
			{ root: null, rootMargin: "0px", threshold: 0.25 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background/80 to-background transform-gpu will-change-transform will-change-opacity"
            style={{ overflowClipMargin: "24px" }}
        >
            <div className="pointer-events-none absolute inset-0 opacity-70 transform-gpu will-change-transform will-change-opacity translate-z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
                <div className="-right-40 sm:-right-32 lg:-right-20 absolute top-10 h-[28rem] w-[28rem] blur-[80px] sm:top-20 sm:h-[34rem] sm:w-[34rem] lg:top-12 lg:h-[38rem] lg:w-[38rem] transform-gpu will-change-transform will-change-opacity translate-z-0">
                    <ClientLottie
                        animationData={ambientFlow}
                        loop={inView && !prefersReducedMotion}
                        autoPlay={inView && !prefersReducedMotion}
                        className="h-full w-full opacity-70 mix-blend-screen"
                    />
                </div>
            </div>

			<div className="relative grid gap-14 px-6 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-12 xl:px-16">
				<div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left lg:gap-8">
					<span className="hidden items-center gap-2 self-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs uppercase tracking-widest sm:inline-flex md:self-start">
						<span className="block h-2 w-2 animate-pulse rounded-full bg-accent" />
						{personaLabel} • Live Activity Stream
					</span>
					<h2 className="text-balance font-semibold text-3xl text-foreground leading-tight sm:text-4xl lg:text-5xl">
						{headline}
					</h2>
					<p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
						{subheadline}
					</p>
					<p className="max-w-2xl text-muted-foreground/90 text-sm leading-relaxed">
						{supportCopy}
					</p>
					<ul className="space-y-3 text-muted-foreground text-sm leading-relaxed md:list-disc md:pl-5">
						{LEFT_COLUMN_POINTS.map((point) => (
							<li
								key={point}
								className="flex items-start gap-3 md:list-item md:gap-0 md:text-left"
							>
								<span className="mt-1.5 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-accent md:hidden" />
								<span className="md:ml-1">{point}</span>
							</li>
						))}
					</ul>
				</div>

				<ActivityRoller events={activityStream} active={inView}>
					{({
						activeEvent,
						activeIndex,
						events,
						prefersReducedMotion,
						setActiveIndex,
					}) => {
						const items = useMemo(
							() =>
								events.map((event, index) =>
									formatEventForStack(
										event,
										index,
										activeIndex,
										setActiveIndex,
									),
								),
							[events, activeIndex, setActiveIndex],
						);

						return (
							<div className="relative flex flex-col gap-6">
								<GlareCard className="mx-auto w-full max-w-[26rem] rounded-3xl border border-border/40 bg-background/85 p-6 shadow-[0_24px_90px_-45px_rgba(59,130,246,0.65)] backdrop-blur md:max-w-none md:p-8">
									<div className="flex flex-col gap-3">
										<div className="flex w-full items-start justify-between gap-3">
											<AuroraText className="font-semibold text-[0.8rem] text-accent uppercase tracking-[0.32em] md:text-xs">
												{activeEvent?.label ?? "Activity"}
											</AuroraText>
											<span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
												{activeEvent?.timeAgo ?? "Now"}
											</span>
										</div>
										<div
											data-testid="activity-highlight"
											className="text-left text-foreground text-sm leading-relaxed md:text-base"
											aria-live="polite"
										>
											{activeEvent ? (
												<>
													<span className="font-semibold text-accent">
														{activeEvent.actor}
													</span>{" "}
													{activeEvent.action}
												</>
											) : (
												"Stay tuned. New automation events roll in every minute."
											)}
										</div>
										<p className="text-muted-foreground text-xs uppercase tracking-wide md:text-sm">
											{activeEvent?.impact ??
												"Automation keeps operators aligned."}
										</p>
									</div>
									{prefersReducedMotion ? (
										<p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-muted-foreground text-xs">
											Motion paused to honor reduced motion preferences. Use the
											card stack items to explore details at your pace.
										</p>
									) : null}
								</GlareCard>

								<div className="relative flex flex-col items-center gap-4 overflow-visible rounded-3xl border border-border/40 bg-background/80 p-6 pt-16 shadow-[0_28px_110px_-60px_rgba(14,165,233,0.65)] backdrop-blur">
									<span className="absolute top-6 left-6 z-[100] inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-semibold text-accent text-xs uppercase tracking-widest shadow-lg">
										Notifications
									</span>
									<div
										className="relative z-10 w-full"
										data-card-stack-container
									>
										<CardStack
											items={items}
											offset={CARD_STACK_OFFSET}
											scaleFactor={CARD_STACK_SCALE_FACTOR}
											className="w-[min(18rem,90vw)] md:w-[20rem]"
										/>
									</div>
								</div>
							</div>
						);
					}}
				</ActivityRoller>
			</div>
		</section>
	);
}
