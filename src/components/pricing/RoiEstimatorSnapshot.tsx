import { computeRoiResults, type RoiInputs } from "@/components/pricing/RoiEstimatorModal";
import type { ROIEstimator } from "@/types/service/plans";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const formatHours = (hours: number) =>
	`${Math.round(hours).toLocaleString()} hrs`;

const formatWorkdays = (hours: number) =>
	`${(hours / 8).toFixed(1)} workdays`;

interface RoiEstimatorSnapshotProps {
	estimator: ROIEstimator;
	inputs?: Partial<RoiInputs>;
	className?: string;
}

export const RoiEstimatorSnapshot = ({
	estimator,
	inputs,
	className,
}: RoiEstimatorSnapshotProps) => {
	const baseInputs: RoiInputs = {
		averageDealAmount: inputs?.averageDealAmount ?? estimator.exampleInput.averageDealAmount,
		monthlyDealsClosed: inputs?.monthlyDealsClosed ?? estimator.exampleInput.monthlyDealsClosed,
		averageTimePerDealHours: inputs?.averageTimePerDealHours ?? estimator.exampleInput.averageTimePerDealHours,
		industry: (inputs?.industry ?? estimator.exampleInput.industry) as keyof ROIEstimator["industryFactors"],
	};

	const factor =
		estimator.industryFactors[baseInputs.industry] ??
		estimator.industryFactors.Other;
	const results = computeRoiResults(baseInputs, factor);
	const automationReduction = Math.round(
		(results.timeSavedMonthly / results.manualHoursMonthly) * 100,
	);

	return (
		<section
			className={cn(
				"space-y-6 rounded-2xl border border-border/60 bg-muted/10 p-6 shadow-sm",
				className,
			)}
			aria-labelledby="roi-snapshot-title"
		>
			<header className="space-y-2">
				<h2
					id="roi-snapshot-title"
					className="text-2xl font-semibold text-foreground"
				>
					Estimate ROI &amp; Setup Cost
				</h2>
				<p className="text-muted-foreground text-sm">
					Adjust the assumptions to project new revenue, setup ranges, and
					long-term profit across deployment models.
				</p>
			</header>
			<div className="grid gap-4 lg:grid-cols-3">
				<article className="flex flex-col gap-2 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
						Monthly New Revenue
					</p>
					<p className="text-3xl font-semibold text-foreground">
						{currency.format(results.gainLow)}{" "}
						<span className="text-muted-foreground text-base">to</span>{" "}
						{currency.format(results.gainHigh)}
					</p>
					<p className="text-muted-foreground text-xs">
						15%–30% of current production in {baseInputs.industry}
					</p>
				</article>
				<article className="flex flex-col gap-2 rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
						Setup Investment
					</p>
					<p className="text-3xl font-semibold text-emerald-200">
						{currency.format(results.setupLow)}{" "}
						<span className="text-muted-foreground text-base">to</span>{" "}
						{currency.format(results.setupHigh)}
					</p>
					<p className="text-emerald-100/80 text-xs">
						≈5–10% of Year-1 projected ROI • Payback in{" "}
						{results.paybackMonths.toFixed(1)} months
					</p>
				</article>
				<article className="flex flex-col gap-2 rounded-xl border border-sky-400/40 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-sky-500/10 p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
						Time Reclaimed
					</p>
					<p className="text-3xl font-semibold text-sky-200">
						{formatHours(results.timeSavedMonthly)} / month
					</p>
					<div className="text-xs leading-relaxed text-sky-100/80">
						<p>≈ {formatWorkdays(results.timeSavedMonthly)} each month</p>
						<p>
							{formatHours(results.timeSavedAnnual)} per year (AI removes{" "}
							{automationReduction}% of manual follow-up time)
						</p>
					</div>
				</article>
			</div>
			<div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
				<article className="rounded-xl border border-border/70 bg-background/70 p-5 shadow-sm">
					<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
						ROI Projection
					</p>
					<ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-foreground">
						<li>
							<strong>Year 1:</strong> {currency.format(results.year1Profit)} net uplift
						</li>
						<li>
							<strong>Year 5:</strong> {currency.format(results.year5Profit)} cumulative profit
						</li>
						<li>
							<strong>Year 10:</strong> {currency.format(results.year10Profit)} cumulative profit
						</li>
					</ul>
				</article>
				<article className="rounded-xl border border-border/70 bg-muted/20 p-5 shadow-sm">
					<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
						Industry Factor
					</p>
					<p className="mt-2 text-3xl font-semibold text-foreground">
						× {factor.toFixed(1)}
					</p>
					<p className="mt-3 text-xs text-muted-foreground">
						Adjusts AI workload and automation scope for your vertical. Higher
						multipliers indicate deeper go-to-market orchestration.
					</p>
				</article>
			</div>
		</section>
	);
};

