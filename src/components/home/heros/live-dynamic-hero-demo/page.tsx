"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { useDeferredLoad } from "@/components/providers/useDeferredLoad";

import {
	LIVE_COPY,
	LIVE_PRIMARY_CTA,
	LIVE_SECONDARY_CTA,
	PERSONA_LABEL,
} from "./_config";

// Keep for potential future use
// const LiveDynamicHeroClient = dynamic(
// 	() => import("./LiveDynamicHeroClient"),
// 	{
// 		ssr: false,
// 		loading: () => <HeroStaticFallback variant="loading" />,
// 	},
// );

const HeroSideBySide = dynamic(() => import("./HeroSideBySide"), {
	ssr: false,
	loading: () => <HeroStaticFallback />,
});

function HeroStaticFallback() {
	const {
		problem: problemPhrase = "losing track of off-market leads",
		solution: solutionPhrase = "AI real estate deal automation",
	} = LIVE_COPY?.values ?? {};
	const description =
		typeof LIVE_COPY?.subtitle === "string"
			? LIVE_COPY.subtitle
			: "Deal Scale keeps motivated sellers warm with AI sales assistants so you can focus on closing.";

	return (
		<section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-gradient-to-b from-background via-muted/40 to-background text-foreground">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22)_0%,rgba(15,23,42,0)_62%)] opacity-80" />
				<div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.15),rgba(59,130,246,0.08),rgba(34,197,94,0.08))]" />
			</div>

			<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center sm:px-10">
				<span className="inline-flex items-center justify-center rounded-full border border-border/40 bg-background/70 px-5 py-1.5 font-semibold text-foreground/80 text-xs uppercase tracking-[0.4em]">
					{PERSONA_LABEL}
				</span>
				<h1 className="font-bold text-4xl text-foreground leading-tight sm:text-5xl md:text-6xl">
					Stop {problemPhrase}, start {solutionPhrase}
				</h1>
				<p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
					{description}
				</p>
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
					<Link
						href="/contact"
						className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-base text-primary-foreground shadow-lg shadow-primary/30 transition hover:translate-y-0.5 hover:bg-primary/90"
					>
						{LIVE_PRIMARY_CTA.label}
					</Link>
					<Link
						href="#live-hero-details"
						className="inline-flex min-w-[12rem] items-center justify-center rounded-full border border-foreground/20 px-6 py-3 font-semibold text-base text-foreground transition hover:border-foreground/40 hover:text-foreground/80"
					>
						{LIVE_SECONDARY_CTA.label}
					</Link>
				</div>
				<div id="live-hero-details" aria-hidden="true" className="sr-only" />
			</div>
		</section>
	);
}

export default function LiveDynamicHeroDemoPage(): JSX.Element {
	const shouldHydrate = useDeferredLoad({
		timeout: 1000,
		idleTimeout: 300,
	});

	// Always render static fallback immediately for above-the-fold LCP
	// Upgrade to interactive version when browser is ready (fast timeout for better UX)
	return shouldHydrate ? (
		<HeroSideBySide />
	) : (
		<HeroStaticFallback />
	);
}
