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

export interface RoiInputs {
	averageDealAmount: number;
	monthlyDealsClosed: number;
	averageTimePerDealHours: number;
	industry: IndustryKey;
}

export interface RoiComputedResults {
	gainLow: number;
	gainHigh: number;
	setupLow: number;
	setupHigh: number;
	year1Profit: number;
	year5Profit: number;
	year10Profit: number;
	buyoutSetup: number;
	buyoutMaintenance: number;
	paybackMonths: number;
	timeSavedMonthly: number;
	timeSavedAnnual: number;
	manualHoursMonthly: number;
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

export const computeRoiResults = (
	inputs: RoiInputs,
	factor: number,
): RoiComputedResults => {
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
};

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

	const results = useMemo(
		() => computeRoiResults(inputs, factor),
		[inputs, factor],
	);

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
			<DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
				<DialogHeader className="gap-3">
					<DialogTitle className="font-semibold text-2xl">
						Estimate ROI & Setup Cost
					</DialogTitle>
					<p className="text-muted-foreground text-sm">
						Adjust the assumptions to project new revenue, setup ranges, and
						long-term profit across deployment models.
					</p>
				</DialogHeader>
				<div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)]">
					<section className="flex flex-col gap-5 rounded-xl border border-border/70 bg-muted/20 p-5 shadow-sm">
						<header className="flex items-start justify-between gap-3">
							<div>
								<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
									Input Assumptions
								</p>
								<h3 className="mt-1 font-semibold text-foreground text-lg">
									Tune your pipeline baseline
								</h3>
							</div>
							<span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs uppercase">
								Live update
							</span>
						</header>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label
									htmlFor="averageDealAmount"
									className="font-medium text-muted-foreground text-xs uppercase"
								>
									Average Deal Amount ($)
								</Label>
								<Input
									id="averageDealAmount"
									type="number"
									min={1000}
									step={500}
									value={inputs.averageDealAmount}
									onChange={handleChange("averageDealAmount")}
									className="h-11 rounded-lg border-border/60 bg-background/60"
								/>
							</div>
							<div className="grid gap-2">
								<Label
									htmlFor="monthlyDealsClosed"
									className="font-medium text-muted-foreground text-xs uppercase"
								>
									Deals Closed per Month
								</Label>
								<Input
									id="monthlyDealsClosed"
									type="number"
									min={1}
									step={1}
									value={inputs.monthlyDealsClosed}
									onChange={handleChange("monthlyDealsClosed")}
									className="h-11 rounded-lg border-border/60 bg-background/60"
								/>
							</div>
							<div className="grid gap-2">
								<Label
									htmlFor="averageTimePerDealHours"
									className="font-medium text-muted-foreground text-xs uppercase"
								>
									Average Time per Deal (hours)
								</Label>
								<Input
									id="averageTimePerDealHours"
									type="number"
									min={1}
									step={1}
									value={inputs.averageTimePerDealHours}
									onChange={handleChange("averageTimePerDealHours")}
									className="h-11 rounded-lg border-border/60 bg-background/60"
								/>
							</div>
							<div className="grid gap-2">
								<Label
									htmlFor="industry"
									className="font-medium text-muted-foreground text-xs uppercase"
								>
									Industry / Vertical
								</Label>
								<select
									id="industry"
									value={inputs.industry}
									onChange={handleChange("industry")}
									className="h-11 w-full rounded-lg border border-border/60 bg-background/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
								>
									{Object.keys(estimator.industryFactors).map((name) => (
										<option key={name} value={name}>
											{name}
										</option>
									))}
								</select>
							</div>
						</div>
						<footer className="rounded-lg border border-border/60 bg-background/70 p-4 text-muted-foreground text-xs">
							<span className="font-semibold text-foreground">
								How this works:
							</span>{" "}
							We bound the inputs to realistic ranges, then apply your industry
							multiplier to determine revenue lift, setup scope, and overtime
							savings.
						</footer>
					</section>
					<section className="flex flex-col gap-6">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-5 shadow-sm">
								<p className="font-semibold text-primary/80 text-xs uppercase tracking-[0.35em]">
									Monthly New Revenue
								</p>
								<p className="font-semibold text-3xl text-foreground">
									{currency.format(results.gainLow)}{" "}
									<span className="text-base text-muted-foreground">to</span>{" "}
									{currency.format(results.gainHigh)}
								</p>
								<p className="text-muted-foreground text-xs leading-relaxed">
									{percent(0.15)}–{percent(0.3)} uplift vs current production in{" "}
									{inputs.industry}
								</p>
							</div>
							<div className="flex flex-col gap-2 rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-5 shadow-sm">
								<p className="font-semibold text-emerald-500 text-xs uppercase tracking-[0.35em]">
									Setup Investment
								</p>
								<p className="font-semibold text-3xl text-emerald-200">
									{currency.format(results.setupLow)}{" "}
									<span className="text-base text-muted-foreground">to</span>{" "}
									{currency.format(results.setupHigh)}
								</p>
								<p className="text-emerald-100/80 text-xs leading-relaxed">
									≈5–10% of Year-1 ROI • Payback in{" "}
									{results.paybackMonths.toFixed(1)} months
								</p>
							</div>
							<div className="flex flex-col gap-2 rounded-xl border border-sky-400/40 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-sky-500/10 p-5 shadow-sm">
								<p className="font-semibold text-sky-300 text-xs uppercase tracking-[0.35em]">
									Time Reclaimed
								</p>
								<p className="font-semibold text-3xl text-sky-200">
									{formatHours(results.timeSavedMonthly)}
								</p>
								<div className="text-sky-100/80 text-xs leading-relaxed">
									<p>≈ {formatWorkdays(results.timeSavedMonthly)} per month</p>
									<p>
										{formatHours(results.timeSavedAnnual)} annually (
										{Math.round(
											(results.timeSavedMonthly / results.manualHoursMonthly) *
												100,
										)}
										% of manual follow-up removed)
									</p>
								</div>
							</div>
						</div>
						<Tabs defaultValue="profit" className="space-y-4">
							<TabsList className="grid w-full grid-cols-3 rounded-lg border border-border/60 bg-muted/40 p-1">
								<TabsTrigger
									value="profit"
									className="rounded-md font-semibold text-xs uppercase tracking-[0.25em]"
								>
									Profit Horizon
								</TabsTrigger>
								<TabsTrigger
									value="buyout"
									className="rounded-md font-semibold text-xs uppercase tracking-[0.25em]"
								>
									Buyout Scenario
								</TabsTrigger>
								<TabsTrigger
									value="notes"
									className="rounded-md font-semibold text-xs uppercase tracking-[0.25em]"
								>
									Key Insights
								</TabsTrigger>
							</TabsList>
							<TabsContent
								value="profit"
								className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-5 shadow-sm"
							>
								<header className="flex items-center justify-between">
									<div>
										<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
											ROI Projection
										</p>
										<h4 className="mt-1 font-semibold text-foreground text-lg">
											Compounding returns outlook
										</h4>
									</div>
								</header>
								<ul className="space-y-2 text-foreground text-sm leading-relaxed">
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
								className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-5 shadow-sm"
							>
								<header>
									<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
										Full Buyout Model
									</p>
									<h4 className="mt-1 font-semibold text-foreground text-lg">
										Cost to own the automation outright
									</h4>
								</header>
								<ul className="space-y-2 text-foreground text-sm leading-relaxed">
									<li>
										<strong>Setup investment:</strong>{" "}
										{currency.format(results.buyoutSetup)} (≈12% of 5-year ROI)
									</li>
									<li>
										<strong>Annual maintenance:</strong>{" "}
										{currency.format(results.buyoutMaintenance)} (compliance +
										model refresh)
									</li>
									<li>
										<strong>Ownership:</strong> Perpetual control of agents,
										models, and data after revenue-share sunset.
									</li>
								</ul>
							</TabsContent>
							<TabsContent
								value="notes"
								className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-5 shadow-sm"
							>
								<header>
									<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
										Key Insights
									</p>
									<h4 className="mt-1 font-semibold text-foreground text-lg">
										What teams see in the first 90 days
									</h4>
								</header>
								<ul className="space-y-2 text-foreground text-sm leading-relaxed">
									{estimator.summaryOutput.points.map((point) => (
										<li key={point}>{point}</li>
									))}
								</ul>
							</TabsContent>
						</Tabs>
						<div className="rounded-xl border border-border/70 bg-muted/20 p-5 shadow-sm">
							<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
								Industry Factor
							</p>
							<div className="mt-2 flex flex-wrap items-center justify-between gap-4">
								<p className="font-semibold text-3xl text-foreground">
									× {factor.toFixed(1)}
								</p>
								<div className="max-w-sm text-muted-foreground text-xs leading-relaxed">
									Adjusts AI workload, workflow design, and compliance footprint
									for your vertical. Higher multipliers mean heavier automation
									and a wider services scope.
								</div>
							</div>
						</div>
					</section>
				</div>
			</DialogContent>
		</Dialog>
	);
};
