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

const LiveDynamicHeroClient = dynamic(() => import("./LiveDynamicHeroClient"), {
	ssr: false,
	loading: () => null,
});

function HeroStaticFallback() {
	const headline =
		typeof LIVE_COPY?.title === "string"
			? LIVE_COPY.title
			: "Automate real estate deal flow with AI-driven outreach.";
	const description =
		typeof LIVE_COPY?.subtitle === "string"
			? LIVE_COPY.subtitle
			: "Deal Scale keeps motivated sellers warm with AI sales agents so you can focus on closing.";

	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/40 to-background py-24 text-foreground">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18)_0%,rgba(15,23,42,0)_60%)] opacity-70" />
			<div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center sm:px-8">
				<span className="inline-flex items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1 font-medium text-foreground/80 text-sm uppercase tracking-wide">
					{PERSONA_LABEL}
				</span>
				<h1 className="text-balance font-semibold text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
					{headline}
				</h1>
				<p className="max-w-3xl text-balance text-base text-foreground/70 sm:text-lg">
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
		requireInteraction: true,
		timeout: 60000,
		idleTimeout: 1500,
	});

	if (!shouldHydrate) {
		return <HeroStaticFallback />;
	}

	return <LiveDynamicHeroClient />;
}
