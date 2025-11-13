"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ROIEstimator } from "@/types/service/plans";
import { useMemo, useState } from "react";

interface RoiEstimatorModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	estimator: ROIEstimator;
}

type IndustryKey = keyof ROIEstimator["industryFactors"];

interface RoiInputs {
	averageDealAmount: number;
	monthlyDealsClosed: number;
	averageTimePerDealHours: number;
	industry: IndustryKey;
}

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const percent = (value: number) =>
	new Intl.NumberFormat("en-US", {
		style: "percent",
		maximumFractionDigits: 0,
	}).format(value);

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const formatHours = (hours: number) =>
	`${Math.round(hours).toLocaleString()} hrs`;

const formatWorkdays = (hours: number) => `${(hours / 8).toFixed(1)} workdays`;

export const RoiEstimatorModal = ({
	open,
	onOpenChange,
	estimator,
}: RoiEstimatorModalProps) => {
	const initial = estimator.exampleInput;
	const [inputs, setInputs] = useState<RoiInputs>({
		averageDealAmount: initial.averageDealAmount,
		monthlyDealsClosed: initial.monthlyDealsClosed,
		averageTimePerDealHours: initial.averageTimePerDealHours,
		industry: initial.industry as IndustryKey,
	});

	const factor =
		estimator.industryFactors[inputs.industry] ??
		estimator.industryFactors.Other;

	const results = useMemo(() => {
		const monthlyBase =
			clamp(inputs.averageDealAmount, 1000, 250000) *
			clamp(inputs.monthlyDealsClosed, 1, 200);
		const efficiency = 0.5;
		const gainLow = monthlyBase * factor * 0.15;
		const gainHigh = monthlyBase * factor * 0.3;

		const setupLow = gainHigh * 12 * 0.05;
		const setupHigh = gainHigh * 12 * 0.1;

		const manualHoursMonthly =
			clamp(inputs.averageTimePerDealHours, 1, 40) *
			clamp(inputs.monthlyDealsClosed, 1, 200);
		const automationReduction = clamp(0.35 * factor, 0.25, 0.7);
		const timeSavedMonthly = manualHoursMonthly * automationReduction;
		const timeSavedAnnual = timeSavedMonthly * 12;

		const year1Profit = gainHigh * 12 * efficiency;
		const year5Profit = year1Profit * 5 * 0.55;
		const year10Profit = year1Profit * 10 * 0.55 * 1.1;

		const buyoutSetup = year5Profit * 0.12;
		const buyoutMaintenance = 4500;
		const paybackMonths = gainHigh > 0 ? setupHigh / gainHigh : 0;

		return {
			gainLow,
			gainHigh,
			setupLow,
			setupHigh,
			year1Profit,
			year5Profit,
			year10Profit,
			buyoutSetup,
			buyoutMaintenance,
			paybackMonths,
			timeSavedMonthly,
			timeSavedAnnual,
			manualHoursMonthly,
		};
	}, [inputs, factor]);

	const handleChange =
		(field: keyof RoiInputs) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const value =
				field === "industry"
					? (event.target.value as IndustryKey)
					: Number(event.target.value);
			setInputs((prev) => ({ ...prev, [field]: value }));
		};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Estimate ROI & Setup Cost</DialogTitle>
					<p className="text-muted-foreground text-sm">
						Adjust the assumptions to project new revenue, setup ranges, and
						long-term profit across deployment models.
					</p>
				</DialogHeader>
				<div className="grid gap-6 md:grid-cols-[1fr,1.25fr]">
					<section className="space-y-4">
						<div>
							<Label htmlFor="averageDealAmount">Average Deal Amount ($)</Label>
							<Input
								id="averageDealAmount"
								type="number"
								min={1000}
								step={500}
								value={inputs.averageDealAmount}
								onChange={handleChange("averageDealAmount")}
							/>
						</div>
						<div>
							<Label htmlFor="monthlyDealsClosed">Deals Closed per Month</Label>
							<Input
								id="monthlyDealsClosed"
								type="number"
								min={1}
								step={1}
								value={inputs.monthlyDealsClosed}
								onChange={handleChange("monthlyDealsClosed")}
							/>
						</div>
						<div>
							<Label htmlFor="averageTimePerDealHours">
								Average Time per Deal (hours)
							</Label>
							<Input
								id="averageTimePerDealHours"
								type="number"
								min={1}
								step={1}
								value={inputs.averageTimePerDealHours}
								onChange={handleChange("averageTimePerDealHours")}
							/>
						</div>
						<div>
							<Label htmlFor="industry">Industry / Vertical</Label>
							<select
								id="industry"
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								value={inputs.industry}
								onChange={handleChange("industry")}
							>
								{Object.keys(estimator.industryFactors).map((name) => (
									<option key={name} value={name}>
										{name}
									</option>
								))}
							</select>
						</div>
					</section>
					<section className="space-y-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="rounded-lg border border-border bg-muted/30 p-4">
								<p className="text-muted-foreground text-xs uppercase">
									Monthly New Revenue
								</p>
								<p className="mt-1 font-semibold text-2xl">
									{currency.format(results.gainLow)} -{" "}
									{currency.format(results.gainHigh)}
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									{percent(0.15)}–{percent(0.3)} of current production at{" "}
									{inputs.industry}
								</p>
							</div>
							<div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
								<p className="text-primary/80 text-xs uppercase">
									Setup Investment
								</p>
								<p className="mt-1 font-semibold text-2xl text-primary">
									{currency.format(results.setupLow)} -{" "}
									{currency.format(results.setupHigh)}
								</p>
								<p className="mt-1 text-primary/80 text-xs">
									≈5–10% of Year-1 projected ROI • Payback in{" "}
									{results.paybackMonths.toFixed(1)} months
								</p>
							</div>
							<div className="rounded-lg border border-blue-200/30 bg-blue-500/5 p-4">
								<p className="text-blue-500 text-xs uppercase">
									Time Reclaimed
								</p>
								<p className="mt-1 font-semibold text-2xl text-blue-400">
									{formatHours(results.timeSavedMonthly)} / month
								</p>
								<p className="text-muted-foreground text-sm">
									≈ {formatWorkdays(results.timeSavedMonthly)} each month
								</p>
								<p className="mt-2 text-blue-300 text-xs">
									{formatHours(results.timeSavedAnnual)} per year (AI removes{" "}
									{Math.round(
										(results.timeSavedMonthly / results.manualHoursMonthly) *
											100,
									)}
									% of manual follow-up time)
								</p>
							</div>
						</div>
						<Tabs defaultValue="profit">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="profit">Profit Horizon</TabsTrigger>
								<TabsTrigger value="buyout">Buyout Scenario</TabsTrigger>
								<TabsTrigger value="notes">Key Insights</TabsTrigger>
							</TabsList>
							<TabsContent
								value="profit"
								className="space-y-3 rounded-lg border border-border p-4"
							>
								<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									ROI Projection
								</h4>
								<ul className="space-y-1 text-foreground text-sm">
									<li>
										<strong>Year 1:</strong>{" "}
										{currency.format(results.year1Profit)} net uplift
									</li>
									<li>
										<strong>Year 5:</strong>{" "}
										{currency.format(results.year5Profit)} cumulative profit
									</li>
									<li>
										<strong>Year 10:</strong>{" "}
										{currency.format(results.year10Profit)} cumulative profit
									</li>
								</ul>
							</TabsContent>
							<TabsContent
								value="buyout"
								className="space-y-3 rounded-lg border border-border p-4"
							>
								<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									Full Buyout Model
								</h4>
								<ul className="space-y-1 text-foreground text-sm">
									<li>
										<strong>Setup Investment:</strong>{" "}
										{currency.format(results.buyoutSetup)} (10–15% of projected
										5-year ROI)
									</li>
									<li>
										<strong>Annual Maintenance:</strong>{" "}
										{currency.format(results.buyoutMaintenance)} (optional
										compliance renewal)
									</li>
									<li>
										<strong>Ownership:</strong> Perpetual control of agents,
										models, and data after revenue-share sunset
									</li>
								</ul>
							</TabsContent>
							<TabsContent
								value="notes"
								className="space-y-2 rounded-lg border border-border p-4"
							>
								<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									Summary
								</h4>
								<ul className="space-y-1 text-foreground text-sm">
									{estimator.summaryOutput.points.map((point) => (
										<li key={point}>{point}</li>
									))}
								</ul>
							</TabsContent>
						</Tabs>
						<div className="rounded-lg border border-border/60 bg-muted/20 p-4">
							<p className="text-muted-foreground text-xs uppercase">
								Industry Factor
							</p>
							<p className="font-semibold text-lg">
								× {factor.toFixed(1)} complexity multiplier
							</p>
							<p className="mt-1 text-muted-foreground text-xs">
								Adjusts AI workload and automation scope for your vertical.
							</p>
						</div>
					</section>
				</div>
			</DialogContent>
		</Dialog>
	);
};
