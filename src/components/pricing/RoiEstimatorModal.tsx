"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	}, [defaultTierKey]);

	const result = useMemo(
		() => computeTierResult({ estimator, inputs, tierKey: activeTier }),
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
				<DialogHeader className="gap-4">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="space-y-1">
							<DialogTitle className="font-semibold text-2xl">
								Estimate ROI & Setup Cost
							</DialogTitle>
							<p className={cn("text-sm", "text-muted-foreground")}>
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
								"font-semibold",
								"text-xs",
								"tracking-[0.25em]",
								"uppercase",
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
					<div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)]">
						<section
							className={cn(
								"flex flex-col gap-6",
								"rounded-xl border border-border/70",
								"bg-muted/20 p-5",
								"shadow-sm",
							)}
						>
							<header className="flex items-start justify-between gap-3">
								<div>
									<p
										className={cn(
											"text-xs",
											"tracking-[0.3em]",
											"uppercase",
											"text-muted-foreground",
										)}
									>
										Input Assumptions
									</p>
									<h3
										className={cn(
											"mt-1",
											"font-semibold",
											"text-lg",
											"text-foreground",
										)}
									>
										Tune your pipeline baseline
									</h3>
								</div>
								<span
									className={cn(
										"rounded-full px-3 py-1",
										"bg-primary/10",
										"font-semibold",
										"text-xs",
										"text-primary",
										"uppercase",
									)}
								>
									Live update
								</span>
							</header>
							<RoiCalculatorInputs
								inputs={inputs}
								estimator={estimator}
								onChange={handleInputChange}
							/>
							<footer
								className={cn(
									"rounded-lg border border-border/60",
									"bg-background/70 p-4",
									"text-xs",
									"text-muted-foreground",
								)}
							>
								<span className="font-semibold text-foreground">
									How this works:
								</span>{" "}
								We bound the inputs to realistic ranges, then apply your
								industry multiplier to determine revenue lift, setup scope, and
								overtime savings.
							</footer>
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
							<div
								className={cn(
									"rounded-xl border border-border/70",
									"bg-muted/20 p-5",
									"shadow-sm",
								)}
							>
								<p
									className={cn(
										"text-xs",
										"tracking-[0.3em]",
										"uppercase",
										"text-muted-foreground",
									)}
								>
									Industry Factor
								</p>
								<div className="mt-2 flex flex-wrap items-center justify-between gap-4">
									<p
										className={cn(
											"text-3xl",
											"font-semibold",
											"text-foreground",
										)}
									>
										× {factor.toFixed(1)}
									</p>
									<p
										className={cn(
											"max-w-sm",
											"text-xs",
											"leading-relaxed",
											"text-muted-foreground",
										)}
									>
										Adjusts AI workload, workflow design, and compliance
										footprint for your vertical. Higher multipliers indicate
										deeper go-to-market orchestration.
									</p>
								</div>
							</div>
						</section>
					</div>
				) : (
					<RoiSnapshot
						estimator={estimator}
						inputs={inputs}
						tierKey={result.tierKey}
						showSetupInvestment={showSetupInvestment}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
