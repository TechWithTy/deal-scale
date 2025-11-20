"use client";

import type { RoiTierResult } from "@/lib/roi/types";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const formatHours = (hours: number) =>
	`${Math.round(hours).toLocaleString()} hrs`;
const formatWorkdays = (hours: number) => `${(hours / 8).toFixed(1)} workdays`;

interface RoiMetricsGridProps {
	result: RoiTierResult;
	showSetupInvestment: boolean;
}

export const RoiMetricsGrid = ({
	result,
	showSetupInvestment,
}: RoiMetricsGridProps) => {
	const setupRange = result.costs.setupRange;
	const hasSetup = Boolean(
		showSetupInvestment && setupRange && setupRange.high > 0,
	);
	const hasCosts = Boolean(
		result.costs.monthlyCost ||
			result.costs.annualCost ||
			result.costs.oneTimeCost,
	);

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-primary/10 p-6 text-center shadow-sm sm:text-left">
				<p className="font-semibold text-primary/80 text-xs uppercase tracking-[0.35em]">
					Net Monthly Uplift
				</p>
				<p className="font-semibold text-3xl">
					{currency.format(result.gainLow)}
					<span className="text-base text-muted-foreground"> to </span>
					{currency.format(result.gainHigh)}
				</p>
				<p className="text-muted-foreground text-sm">
					After plan fees & operating costs • Gross potential{" "}
					{currency.format(result.grossGainLow)}–
					{currency.format(result.grossGainHigh)}
				</p>
			</div>
			<div className="flex flex-col gap-3 rounded-2xl border border-sky-400/40 bg-sky-500/10 p-6 text-center shadow-sm sm:text-left">
				<p className="font-semibold text-sky-300 text-xs uppercase tracking-[0.35em]">
					Time Reclaimed
				</p>
				<p className="font-semibold text-3xl text-sky-200">
					{formatHours(result.timeSavedMonthly)}
				</p>
				<div className="space-y-1 text-sky-100/80 text-sm">
					<p>≈ {formatWorkdays(result.timeSavedMonthly)} each month</p>
					<p>{formatHours(result.timeSavedAnnual)} annually saved</p>
					<p>
						{Math.round(result.automationReductionPercent)}% manual follow-up
						removed
					</p>
				</div>
			</div>
			{hasSetup ? (
				<div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center shadow-sm sm:text-left">
					<p className="font-semibold text-emerald-300 text-xs uppercase tracking-[0.35em]">
						Setup Investment
					</p>
					<p className="font-semibold text-3xl text-emerald-100">
						{currency.format(setupRange!.low)}
						<span className="text-base text-emerald-200/80"> to </span>
						{currency.format(setupRange!.high)}
					</p>
					<p className="text-emerald-100/90 text-sm">
						Payback in {result.paybackMonths.toFixed(1)} months at projected
						gains
					</p>
				</div>
			) : null}
			{hasCosts ? (
				<div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-6 text-center shadow-sm sm:text-left">
					<p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.35em]">
						Tier Costs
					</p>
					<ul className="space-y-1 text-muted-foreground text-sm">
						<li>
							<strong>Net monthly benefit:</strong>{" "}
							{currency.format(result.monthlyNetBenefit)}
						</li>
						{result.monthlyOperatingCost ? (
							<li>
								<strong>Your monthly cost:</strong>{" "}
								{currency.format(result.monthlyOperatingCost)}
							</li>
						) : null}
						{result.costs.monthlyCost ? (
							<li>
								<strong>Plan monthly fee:</strong>{" "}
								{currency.format(result.costs.monthlyCost)}
							</li>
						) : null}
						{result.costs.annualCost ? (
							<li>
								<strong>Plan annual fee:</strong>{" "}
								{currency.format(result.costs.annualCost)}
							</li>
						) : null}
						{result.costs.oneTimeCost ? (
							<li>
								<strong>One-time:</strong>{" "}
								{currency.format(result.costs.oneTimeCost)}
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
