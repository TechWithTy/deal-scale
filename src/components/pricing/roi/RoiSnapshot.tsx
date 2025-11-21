"use client";

import {
	coerceInputs,
	computeTierResult,
	getDefaultTierKey,
	resolveTierConfigs,
} from "@/lib/roi/calculator";
import type { RoiInputs } from "@/lib/roi/types";
import { cn } from "@/lib/utils";
import type { ROIEstimator } from "@/types/service/plans";
import { RoiMetricsGrid } from "./RoiMetricsGrid";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

interface RoiSnapshotProps {
	estimator: ROIEstimator;
	inputs?: Partial<RoiInputs>;
	tierKey?: string;
	showSetupInvestment?: boolean;
	className?: string;
	showHeading?: boolean;
}

export const RoiSnapshot = ({
	estimator,
	inputs,
	tierKey,
	showSetupInvestment = true,
	className,
	showHeading = true,
}: RoiSnapshotProps) => {
	const tiers = resolveTierConfigs(estimator);
	const defaultTier = getDefaultTierKey(estimator);
	const selectedTierKey = tierKey ?? defaultTier;
	const normalizedInputs = coerceInputs(estimator, inputs);
	const result = computeTierResult({
		estimator,
		inputs: normalizedInputs,
		tierKey: selectedTierKey,
	});
	const factor =
		estimator.industryFactors[normalizedInputs.industry] ??
		estimator.industryFactors.Other ??
		1;

	const headingId = showHeading ? "roi-snapshot-title" : undefined;

	return (
		<section
			className={cn(
				"space-y-6 rounded-2xl border border-border/60 bg-muted/10 p-6 shadow-sm",
				className,
			)}
			aria-labelledby={headingId}
		>
			{showHeading ? (
				<header className="space-y-2 text-center md:text-left">
					<h2 id={headingId} className="font-semibold text-2xl text-foreground">
						Estimate ROI &amp; Setup Cost
					</h2>
					<p className="text-muted-foreground text-sm">
						Instant summary of projected revenue, costs, and time savings for
						your selected DealScale tier.
					</p>
				</header>
			) : null}
			<RoiMetricsGrid
				result={result}
				showSetupInvestment={
					showSetupInvestment && result.costs.setupRange !== null
				}
			/>
			<div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
				<article className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center shadow-sm md:text-left">
					<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
						ROI Projection
					</p>
					<ul className="mt-3 space-y-1.5 text-foreground text-sm leading-relaxed">
						<li>
							<strong>Year 1:</strong> {currency.format(result.year1Profit)} net
							uplift
						</li>
						<li>
							<strong>Year 5:</strong> {currency.format(result.year5Profit)}{" "}
							cumulative profit
						</li>
						<li>
							<strong>Year 10:</strong> {currency.format(result.year10Profit)}{" "}
							cumulative profit
						</li>
					</ul>
				</article>
				<article className="rounded-2xl border border-border/70 bg-muted/20 p-6 text-center shadow-sm md:text-left">
					<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
						Industry Factor
					</p>
					<p className="mt-2 font-semibold text-3xl text-foreground">
						× {factor.toFixed(1)}
					</p>
					<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
						Multipliers adjust for AI workload and compliance scope across
						different verticals.
					</p>
				</article>
			</div>
		</section>
	);
};
