"use client";

import { cn } from "@/lib/utils";
import type { RoiTierResult } from "@/lib/roi/types";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const formatHours = (hours: number) => `${Math.round(hours).toLocaleString()} hrs`;
const formatWorkdays = (hours: number) => `${(hours / 8).toFixed(1)} workdays`;

interface RoiMetricsGridProps {
	result: RoiTierResult;
	showSetupInvestment: boolean;
}

export const RoiMetricsGrid = ({ result, showSetupInvestment }: RoiMetricsGridProps) => {
	const setupRange = result.costs.setupRange;
	const hasSetup = Boolean(showSetupInvestment && setupRange && setupRange.high > 0);
	const hasCosts = Boolean(
		result.costs.monthlyCost || result.costs.annualCost || result.costs.oneTimeCost,
	);

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-primary/10 p-6 text-center shadow-sm sm:text-left">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
					Net Monthly Uplift
				</p>
				<p className="text-3xl font-semibold">
					{currency.format(result.gainLow)}
					<span className="text-base text-muted-foreground"> to </span>
					{currency.format(result.gainHigh)}
				</p>
				<p className="text-sm text-muted-foreground">
					After plan fees & operating costs • Gross potential {currency.format(result.grossGainLow)}–{currency.format(result.grossGainHigh)}
				</p>
			</div>
			<div className="flex flex-col gap-3 rounded-2xl border border-sky-400/40 bg-sky-500/10 p-6 text-center shadow-sm sm:text-left">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
					Time Reclaimed
				</p>
				<p className="text-3xl font-semibold text-sky-200">
					{formatHours(result.timeSavedMonthly)}
				</p>
				<div className="space-y-1 text-sm text-sky-100/80">
					<p>≈ {formatWorkdays(result.timeSavedMonthly)} each month</p>
					<p>{formatHours(result.timeSavedAnnual)} annually saved</p>
					<p>{Math.round(result.automationReductionPercent)}% manual follow-up removed</p>
				</div>
			</div>
			{hasSetup ? (
				<div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center shadow-sm sm:text-left">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
						Setup Investment
					</p>
					<p className="text-3xl font-semibold text-emerald-100">
						{currency.format(setupRange!.low)}
						<span className="text-base text-emerald-200/80"> to </span>
						{currency.format(setupRange!.high)}
					</p>
					<p className="text-sm text-emerald-100/90">
						Payback in {result.paybackMonths.toFixed(1)} months at projected gains
					</p>
				</div>
			) : null}
			{hasCosts ? (
				<div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-6 text-center shadow-sm sm:text-left">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
						Tier Costs
					</p>
					<ul className="space-y-1 text-sm text-muted-foreground">
						<li>
							<strong>Net monthly benefit:</strong> {currency.format(result.monthlyNetBenefit)}
						</li>
						{result.monthlyOperatingCost ? (
							<li>
								<strong>Your monthly cost:</strong> {currency.format(result.monthlyOperatingCost)}
							</li>
						) : null}
						{result.costs.monthlyCost ? (
							<li>
								<strong>Plan monthly fee:</strong> {currency.format(result.costs.monthlyCost)}
							</li>
						) : null}
						{result.costs.annualCost ? (
							<li>
								<strong>Plan annual fee:</strong> {currency.format(result.costs.annualCost)}
							</li>
						) : null}
						{result.costs.oneTimeCost ? (
							<li>
								<strong>One-time:</strong> {currency.format(result.costs.oneTimeCost)}
							</li>
						) : null}
						{!hasSetup && setupRange ? (
							<li>
								<strong>Setup:</strong> {currency.format(setupRange.low)}
								<span className="text-muted-foreground/70"> to </span>
								{currency.format(setupRange.high)}
							</li>
						) : null}
					</ul>
				</div>
			) : null}
		</div>
	);
};
