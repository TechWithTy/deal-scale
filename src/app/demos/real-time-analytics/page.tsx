import { Fragment } from "react";

import type { Metadata } from "next";

import { FeatureShowcase } from "@/components/demos/real-time-analytics/FeatureShowcase";
import { REAL_TIME_FEATURES } from "@/components/demos/real-time-analytics/feature-config";
import {
	SchemaInjector,
	buildServiceSchema,
	type SchemaPayload,
} from "@/utils/seo/schema";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";

const REAL_TIME_ANALYTICS_PATH = "/demos/real-time-analytics";
const REAL_TIME_ANALYTICS_SEO = getStaticSeo(REAL_TIME_ANALYTICS_PATH);
const REAL_TIME_ANALYTICS_CANONICAL =
	REAL_TIME_ANALYTICS_SEO.canonical ??
	`https://dealscale.io${REAL_TIME_ANALYTICS_PATH}`;

const FEATURE_KEYWORDS = Array.from(
	new Set(
		REAL_TIME_FEATURES.flatMap((feature) => [
			feature.label,
			feature.eyebrow,
			feature.description,
			...feature.highlights.map((highlight) => highlight.title),
			...feature.metrics.map((metric) => metric.label),
		]),
	),
);

const PRIMARY_SERVICE_SCHEMA = buildServiceSchema({
	name: "Deal Scale Real-Time Analytics Demo",
	description:
		REAL_TIME_ANALYTICS_SEO.description ??
		"Explore Deal Scale’s real-time analytics workspace to see live dashboards, experimentation workflows, and collaboration tools.",
	url: REAL_TIME_ANALYTICS_CANONICAL,
	category: "Analytics Software Demo",
	serviceType: "Interactive Real-Time Analytics Demo",
	areaServed: ["United States"],
	offers: {
		price: "0",
		priceCurrency: "USD",
		url: `${REAL_TIME_ANALYTICS_CANONICAL}?cta=request-access`,
	},
});

const FEATURE_SERVICE_SCHEMAS = REAL_TIME_FEATURES.map((feature) =>
	buildServiceSchema({
		name: feature.label,
		description: `${feature.description} Highlights: ${feature.highlights
			.map((highlight) => highlight.title)
			.join(", ")}`,
		url: `${REAL_TIME_ANALYTICS_CANONICAL}#${feature.id}`,
		serviceType: feature.eyebrow,
		category: "Real-Time Analytics Feature",
		areaServed: ["United States"],
		offers: {
			price: "0",
			priceCurrency: "USD",
			url: `${REAL_TIME_ANALYTICS_CANONICAL}?feature=${feature.id}`,
		},
	}),
);

const REAL_TIME_ANALYTICS_SCHEMAS: SchemaPayload = [
	PRIMARY_SERVICE_SCHEMA,
	...FEATURE_SERVICE_SCHEMAS,
];

export async function generateMetadata(): Promise<Metadata> {
	const keywords = Array.from(
		new Set([
			...(REAL_TIME_ANALYTICS_SEO.keywords ?? []),
			...FEATURE_KEYWORDS,
		]),
	).slice(0, 32);

	return mapSeoMetaToMetadata({
		...REAL_TIME_ANALYTICS_SEO,
		title:
			REAL_TIME_ANALYTICS_SEO.title ??
			"Real-Time Analytics Demo | Deal Scale",
		description:
			REAL_TIME_ANALYTICS_SEO.description ??
			"Explore Deal Scale’s real-time analytics workspace. Toggle between dashboards, experimentation, and collaboration demos inside an interactive MacBook showcase.",
		canonical: REAL_TIME_ANALYTICS_CANONICAL,
		keywords,
	});
}

const HIGHLIGHT_COLUMNS = [
	{
		title: "Unified telemetry",
		description:
			"Suck live product, marketing, and revenue data into a stateful workspace that every teammate can trust.",
	},
	{
		title: "Collaboration native",
		description:
			"Invite operators, analysts, and executives with role-aware guardrails so feedback loops stay tight.",
	},
	{
		title: "Decisions shipped",
		description:
			"Pair AI-generated readouts with calculators and playbooks so every experiment or forecast ends in action.",
	},
] as const;

export default function RealTimeAnalyticsDemoPage(): JSX.Element {
	return (
		<>
			<SchemaInjector schema={REAL_TIME_ANALYTICS_SCHEMAS} />
			<div className="relative overflow-hidden bg-gradient-to-b from-background via-[rgba(15,23,42,0.75)] to-background">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),transparent_60%)]" />
				<div className="container relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:px-10 lg:px-16">
					<header className="flex flex-col gap-6 text-center md:gap-8">
						<span className="mx-auto inline-flex w-fit items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
							Interactive product tour
						</span>
						<h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
							See your analytics, experiments, and team rituals in one Macbook
							command center
						</h1>
						<p className="mx-auto max-w-3xl text-pretty text-base text-muted-foreground sm:text-lg">
							Swap between dashboards, experimentation, and team collaboration
							demos. Each scenario streams real Deal Scale UI captures rendered
							inside an interactive Macbook so stakeholders can align quickly.
						</p>
					</header>

					<FeatureShowcase features={REAL_TIME_FEATURES} />

					<section className="grid gap-4 rounded-4xl border border-border/50 bg-background/60 p-8 shadow-[0_28px_120px_-80px_rgba(59,130,246,0.45)] backdrop-blur-xl md:grid-cols-3 md:gap-6">
						{HIGHLIGHT_COLUMNS.map((highlight) => (
							<Fragment key={highlight.title}>
								<div className="flex flex-col gap-3 rounded-3xl border border-border/40 bg-background/70 p-5">
									<h3 className="text-lg font-semibold text-foreground">
										{highlight.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{highlight.description}
									</p>
								</div>
							</Fragment>
						))}
					</section>
				</div>
			</div>
		</>
	);
}

