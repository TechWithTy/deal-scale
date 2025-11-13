"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { ROIEstimator } from "@/types/service/plans";
import { useEffect, useMemo, useState } from "react";
import {
	coerceInputs,
	computeTierResult,
	getDefaultTierKey,
	resolveTierConfigs,
} from "@/lib/roi/calculator";
import type { RoiInputs } from "@/lib/roi/types";
import { RoiTierSelector } from "./roi/RoiTierSelector";
import { RoiCalculatorInputs } from "./roi/RoiCalculatorInputs";
import { RoiMetricsGrid } from "./roi/RoiMetricsGrid";
import { RoiResultTabs } from "./roi/RoiResultTabs";
import { RoiSnapshot } from "./roi/RoiSnapshot";

interface RoiEstimatorModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	estimator: ROIEstimator;
}

export const RoiEstimatorModal = ({
	open,
	onOpenChange,
	estimator,
}: RoiEstimatorModalProps) => {
	const tiers = useMemo(() => resolveTierConfigs(estimator), [estimator]);
	const defaultTierKey = useMemo(
		() => getDefaultTierKey(estimator),
		[estimator],
	);
	const [inputs, setInputs] = useState<RoiInputs>(() =>
		coerceInputs(estimator),
	);
	const [activeTier, setActiveTier] = useState<string>(defaultTierKey);
	const [interactiveView, setInteractiveView] = useState(true);

	useEffect(() => {
		setActiveTier(defaultTierKey);
		setInputs((prev) => coerceInputs(estimator, prev));
	}, [defaultTierKey, estimator]);

	const result = useMemo(
		() =>
			computeTierResult({
				estimator,
				inputs,
				tierKey: activeTier,
			}),
		[estimator, inputs, activeTier],
	);

	const [showSetupInvestment, setShowSetupInvestment] = useState(
		result.showSetupDefault,
	);

	useEffect(() => {
		setShowSetupInvestment(result.showSetupDefault);
	}, [result.showSetupDefault]);

	const handleInputChange = (
		field: keyof RoiInputs,
		value: number | string,
	) => {
		setInputs((prev) => ({
			...prev,
			[field]: field === "industry" ? String(value) : Number(value),
		}));
	};

	const canToggleSetup = Boolean(result.costs.setupRange);

	const factor =
		estimator.industryFactors[inputs.industry] ??
		estimator.industryFactors.Other ??
		1;

	const [inputsAccordionValue, setInputsAccordionValue] = useState("form");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
				<DialogHeader className="gap-4">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="space-y-1">
							<DialogTitle className="font-semibold text-2xl">
								Estimate ROI & Setup Cost
							</DialogTitle>
							<p className="text-muted-foreground text-sm">
								Adjust the assumptions to project new revenue, setup ranges, and
								long-term profit across deployment models.
							</p>
						</div>
						<div
							className={cn(
								"flex items-center gap-2 px-3 py-2",
								"border border-border/60",
								"bg-muted/20",
								"rounded-full",
								"font-semibold text-xs uppercase tracking-[0.25em]",
							)}
						>
							<span
								className={cn(
									"transition-colors",
									interactiveView ? "text-foreground" : "text-muted-foreground",
								)}
							>
								Interactive
							</span>
							<Switch
								checked={interactiveView}
								onCheckedChange={setInteractiveView}
								aria-label="Toggle snapshot view"
							/>
							<span
								className={cn(
									"transition-colors",
									!interactiveView
										? "text-foreground"
										: "text-muted-foreground",
								)}
							>
								Snapshot
							</span>
						</div>
					</div>
				</DialogHeader>
				{interactiveView ? (
					<div className="grid items-start gap-6 lg:grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
						<section
							className={cn(
								"flex flex-col gap-6",
								"rounded-xl border border-border/70",
								"bg-muted/20 p-5",
								"shadow-sm",
							)}
						>
							<Accordion
								type="single"
								collapsible
								value={inputsAccordionValue}
								onValueChange={(value) => setInputsAccordionValue(value ?? "")}
								className="w-full"
							>
								<AccordionItem value="form" className="border-none">
									<AccordionTrigger
										className={cn(
											"rounded-lg bg-transparent px-0 py-0 text-left font-semibold text-sm uppercase tracking-[0.25em]",
											"flex items-start justify-between gap-3",
										)}
									>
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
									</AccordionTrigger>
									<AccordionContent className="space-y-6 pt-4">
										<RoiCalculatorInputs
											inputs={inputs}
											estimator={estimator}
											onChange={handleInputChange}
										/>
										<footer className="rounded-lg border border-border/60 bg-background/70 p-4 text-muted-foreground text-xs">
											<span className="font-semibold text-foreground">
												How this works:
											</span>{" "}
											We bound the inputs to realistic ranges, then apply your
											industry multiplier to determine revenue lift, setup
											scope, and overtime savings.
										</footer>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</section>
						<section className="flex flex-col gap-6">
							<RoiTierSelector
								tiers={tiers}
								activeTier={result.tierKey}
								onTierChange={setActiveTier}
								showSetupInvestment={showSetupInvestment}
								onToggleSetup={setShowSetupInvestment}
								canToggleSetup={canToggleSetup}
							/>
							<RoiMetricsGrid
								result={result}
								showSetupInvestment={showSetupInvestment}
							/>
							<RoiResultTabs
								result={result}
								summaryPoints={estimator.summaryOutput.points}
							/>
							<div className="rounded-xl border border-border/70 bg-muted/20 p-5 shadow-sm">
								<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
									Industry Factor
								</p>
								<div className="mt-2 flex flex-wrap items-center justify-between gap-4">
									<p className="font-semibold text-3xl text-foreground">
										× {factor.toFixed(1)}
									</p>
									<p className="max-w-sm text-muted-foreground text-xs leading-relaxed">
										Adjusts AI workload, workflow design, and compliance
										footprint for your vertical. Higher multipliers indicate
										deeper go-to-market orchestration.
									</p>
								</div>
							</div>
						</section>
					</div>
				) : (
					<div className="space-y-6">
						<RoiTierSelector
							tiers={tiers}
							activeTier={result.tierKey}
							onTierChange={setActiveTier}
							showSetupInvestment={showSetupInvestment}
							onToggleSetup={setShowSetupInvestment}
							canToggleSetup={canToggleSetup}
							showSetupToggle={false}
						/>
						<RoiSnapshot
							estimator={estimator}
							inputs={inputs}
							tierKey={result.tierKey}
							showSetupInvestment={showSetupInvestment}
						/>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
