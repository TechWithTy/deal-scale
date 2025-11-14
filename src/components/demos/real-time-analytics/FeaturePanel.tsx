"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { cn } from "@/lib/utils";

import type { RealTimeFeature } from "./feature-config";

const FeatureChart = dynamic(() => import("./FeatureChart"), {
	ssr: false,
	loading: () => <ChartSkeleton />,
});

const iconClasses =
	"inline-flex min-h-[2.25rem] items-center justify-center whitespace-nowrap rounded-xl border px-3 text-xs font-semibold tracking-wide transition-colors";

type FeaturePanelProps = {
	feature: RealTimeFeature;
	panelId: string;
	tabId: string;
	activeFeatureId: string;
};

type NumericValueParts = {
	value: number;
	suffix: string;
	decimalPlaces: number;
};

function extractNumericValueParts(input: string): NumericValueParts | null {
	const trimmed = input.trim();
	const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(.*)$/);

	if (!match) {
		return null;
	}

	const numberPart = match[1];
	const suffix = match[2] ?? "";
	const numericValue = Number.parseFloat(numberPart);

	if (Number.isNaN(numericValue)) {
		return null;
	}

	const decimalPlaces = numberPart.includes(".")
		? numberPart.split(".")[1].length
		: 0;

	return {
		value: numericValue,
		suffix,
		decimalPlaces,
	};
}

export function FeaturePanel({
	feature,
	panelId,
	tabId,
	activeFeatureId,
}: FeaturePanelProps): JSX.Element {
	const chartContainerRef = useRef<HTMLDivElement | null>(null);
	const [chartVisible, setChartVisible] = useState(false);
	const hasChart = Boolean(feature.chart);

	useEffect(() => {
		if (!hasChart) {
			setChartVisible(false);
			return;
		}

		setChartVisible(false);
	}, [feature.id, hasChart]);

	useEffect(() => {
		if (!hasChart || chartVisible) {
			return;
		}

		const node = chartContainerRef.current;

		if (!node) {
			return;
		}

		if (typeof IntersectionObserver === "undefined") {
			setChartVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setChartVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, [chartVisible, hasChart]);

	return (
		<motion.div
			id={panelId}
			role="tabpanel"
			aria-labelledby={tabId}
			className="flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-border/60 bg-background/70 p-6 text-left shadow-[0_28px_100px_-50px_rgba(34,197,94,0.35)] sm:p-8"
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -24 }}
			transition={{ duration: 0.45, ease: "easeOut" }}
		>
			{feature.chart ? (
				<div
					ref={chartContainerRef}
					className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background/75 p-4 shadow-[0_18px_60px_-40px_rgba(59,130,246,0.45)] sm:p-6"
				>
					{chartVisible ? (
						<FeatureChart chart={feature.chart} />
					) : (
						<ChartSkeleton />
					)}
				</div>
			) : null}

			<div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
				{feature.highlights.map((highlight) => (
					<div
						key={highlight.title}
						className="overflow-hidden rounded-2xl border border-border/40 bg-background/60"
					>
						{highlight.visual ? (
							<div className="relative h-40 w-full border-b border-border/40 bg-background/50">
								<Image
									src={highlight.visual}
									alt={`${highlight.title} visualization`}
									fill
									className="object-cover"
									sizes="(min-width: 768px) 220px, 100vw"
									loading="lazy"
								/>
							</div>
						) : null}
						<div className="flex flex-col gap-3 p-4">
							<div className="flex items-start justify-between gap-3">
							<h3 className="font-semibold text-base text-foreground">
								{highlight.title}
							</h3>
							{highlight.metric ? (
								<span
									className={cn(
										iconClasses,
										"border-blue-500/25 bg-blue-500/10 text-blue-700 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-100",
									)}
								>
									{(() => {
										const parts = extractNumericValueParts(
											highlight.metric?.value ?? "",
										);

										if (!parts) {
											return highlight.metric?.value;
										}

										const tickerKey = `${feature.id}-${highlight.title}-${highlight.metric?.value}-${activeFeatureId}`;

										return (
											<span className="inline-flex items-baseline gap-1">
												<NumberTicker
													key={tickerKey}
													value={parts.value}
													decimalPlaces={parts.decimalPlaces}
												/>
												{parts.suffix ? (
													<span>{parts.suffix.trimStart()}</span>
												) : null}
											</span>
										);
									})()}
								</span>
							) : null}
							</div>
							<p className="text-muted-foreground text-sm">
								{highlight.description}
							</p>
							{highlight.metric ? (
								<span className="text-muted-foreground/80 text-xs uppercase tracking-wide">
									{highlight.metric.label}
								</span>
							) : null}
						</div>
					</div>
				))}
			</div>

			{feature.metrics.length > 0 ? (
				<div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
					{feature.metrics.map((metric) => (
						<div
							key={`${feature.id}-${metric.label}`}
							className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border/40 bg-background/50 p-4 text-center"
						>
							<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
								{metric.label}
							</span>
							<span className="font-semibold text-2xl text-foreground sm:text-xl">
								{(() => {
									const parts = extractNumericValueParts(metric.value);

									if (!parts) {
										return metric.value;
									}

								const tickerKey = `${feature.id}-${metric.label}-${metric.value}-${activeFeatureId}`;

									return (
										<span className="inline-flex items-baseline gap-1">
											<NumberTicker
												key={tickerKey}
												value={parts.value}
												decimalPlaces={parts.decimalPlaces}
											/>
											{parts.suffix ? (
												<span>{parts.suffix.trimStart()}</span>
											) : null}
										</span>
									);
								})()}
							</span>
						</div>
					))}
				</div>
			) : null}
		</motion.div>
	);
}

function ChartSkeleton(): JSX.Element {
	return (
		<div className="h-[260px] w-full animate-pulse rounded-2xl bg-gradient-to-br from-border/60 via-border/20 to-transparent" />
	);
}

export default FeaturePanel;
