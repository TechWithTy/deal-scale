"use client";

import { useId, useMemo, useState } from "react";

import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { cn } from "@/lib/utils";

import type { RealTimeFeature } from "./feature-config";

export type FeatureShowcaseProps = {
	features: RealTimeFeature[];
};

/**
 * FeatureShowcase renders the Macbook demo with contextual copy and metrics.
 */
export function FeatureShowcase({
	features,
}: FeatureShowcaseProps): JSX.Element | null {
	const stableFeatures = useMemo(
		() => features.filter(Boolean),
		[features],
	);

	if (stableFeatures.length === 0) {
		return null;
	}

	const fallbackId = stableFeatures[0]?.id ?? "";
	const generatedId = useId();
	const [activeId, setActiveId] = useState(fallbackId);

	const activeFeature =
		stableFeatures.find((feature) => feature.id === activeId) ??
		stableFeatures[0];

	const tablistId = `${generatedId}-tablist`;
	const activeTabId = `${generatedId}-tab-${activeFeature.id}`;
	const activePanelId = `${generatedId}-panel-${activeFeature.id}`;

	return (
		<section
			className="relative isolate flex flex-col items-center gap-10 rounded-4xl border border-border/50 bg-background/80 px-6 py-12 text-foreground shadow-[0_30px_120px_-60px_rgba(59,130,246,0.45)] backdrop-blur-xl sm:gap-12 md:px-12 md:py-16"
			data-testid="real-time-analytics-demo"
		>
			<span className="sr-only">{activeFeature.label}</span>
			<div className="relative mx-auto flex w-full max-w-3xl items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),transparent_55%)] px-2 py-8 sm:px-4">
				<MacbookScroll
					src={activeFeature.media.src}
					title={activeFeature.media.alt}
					showGradient
					variant="embedded"
					className="max-w-full"
					badge={
						<span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-900 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-100">
							Live demo
						</span>
					}
				/>
			</div>

			<div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center">
				<p className="sr-only">{activeFeature.eyebrow}</p>
				<p className="sr-only">{activeFeature.description}</p>

				<div
					id={tablistId}
					role="tablist"
					aria-label="Real-time analytics feature toggles"
					className="flex flex-wrap justify-center gap-2"
				>
					{stableFeatures.map((feature) => {
						const tabId = `${generatedId}-tab-${feature.id}`;
						const panelId = `${generatedId}-panel-${feature.id}`;
						const isSelected = feature.id === activeFeature.id;
						return (
							<button
								key={feature.id}
								id={tabId}
								type="button"
								role="tab"
								aria-selected={isSelected}
								aria-controls={panelId}
								data-selected={isSelected}
								className={cn(
									"group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
									isSelected
										? "border-blue-500 bg-blue-500/10 text-blue-900 shadow-[0_8px_24px_-16px_rgba(59,130,246,0.75)] dark:text-blue-100"
										: "border-border/70 bg-background/50 text-muted-foreground hover:border-blue-400/70 hover:bg-blue-500/10 hover:text-blue-900 dark:hover:text-blue-100 dark:hover:border-blue-400/60",
								)}
								onClick={() => {
									setActiveId(feature.id);
								}}
							>
								<span className="inline-block h-2 w-2 rounded-full bg-current opacity-70 group-data-[selected=true]:scale-125 group-data-[selected=true]:opacity-100" />
								<span className="text-xs font-semibold uppercase tracking-wide sm:text-sm">
									{feature.label}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<FeaturePanel
				feature={activeFeature}
				panelId={activePanelId}
				tabId={activeTabId}
			/>
		</section>
	);
}

type FeaturePanelProps = {
	feature: RealTimeFeature;
	panelId: string;
	tabId: string;
};

const iconClasses =
	"inline-flex min-h-[2.25rem] items-center justify-center whitespace-nowrap rounded-xl border px-3 text-xs font-semibold tracking-wide transition-colors";

function FeaturePanel({
	feature,
	panelId,
	tabId,
}: FeaturePanelProps): JSX.Element {
	return (
		<div
			id={panelId}
			role="tabpanel"
			aria-labelledby={tabId}
			className="flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-border/60 bg-background/70 p-6 text-left shadow-[0_28px_100px_-50px_rgba(34,197,94,0.35)] sm:p-8"
		>
			<div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
				{feature.highlights.map((highlight) => (
					<div
						key={highlight.title}
						className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-background/60 p-4"
					>
						<div className="flex items-start justify-between gap-3">
							<h3 className="text-base font-semibold text-foreground">
								{highlight.title}
							</h3>
							{highlight.metric ? (
								<span
									className={cn(
										iconClasses,
										"border-blue-500/25 bg-blue-500/10 text-blue-700 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-100",
									)}
								>
									{highlight.metric.value}
								</span>
							) : null}
						</div>
						<p className="text-sm text-muted-foreground">
							{highlight.description}
						</p>
						{highlight.metric ? (
							<span className="text-xs uppercase tracking-wide text-muted-foreground/80">
								{highlight.metric.label}
							</span>
						) : null}
					</div>
				))}
			</div>

			{feature.metrics.length > 0 ? (
				<div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
					{feature.metrics.map((metric) => (
						<div
							key={`${feature.id}-${metric.label}`}
							className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border/40 bg-background/50 p-4 text-center sm:items-start sm:text-left"
						>
							<span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								{metric.label}
							</span>
							<span className="text-2xl font-semibold text-foreground sm:text-xl">
								{metric.value}
							</span>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}

