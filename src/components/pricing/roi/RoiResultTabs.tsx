"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RoiTierResult } from "@/lib/roi/types";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

interface RoiResultTabsProps {
	result: RoiTierResult;
	summaryPoints: string[];
}

export const RoiResultTabs = ({
	result,
	summaryPoints,
}: RoiResultTabsProps) => {
	const isSelfHosted = result.tier.kind === "selfHosted";
	const costs = result.costs;

	const costItems = [
		result.monthlyOperatingCost
			? {
					label: "Your monthly cost",
					value: currency.format(result.monthlyOperatingCost),
				}
			: null,
		costs.monthlyCost !== undefined
			? { label: "Plan monthly", value: currency.format(costs.monthlyCost) }
			: null,
		costs.annualCost !== undefined
			? { label: "Plan annual", value: currency.format(costs.annualCost) }
			: null,
		costs.oneTimeCost !== undefined
			? { label: "One-time", value: currency.format(costs.oneTimeCost) }
			: null,
		costs.setupRange
			? {
					label: "Setup",
					value: `${currency.format(costs.setupRange.low)} – ${currency.format(costs.setupRange.high)}`,
				}
			: null,
	].filter(Boolean) as Array<{ label: string; value: string }>;

	return (
		<Tabs defaultValue="profit" className="space-y-4">
			<TabsList className="!grid !h-auto !max-w-none grid-cols-1 justify-items-center gap-2 rounded-full border border-border/60 bg-muted/30 p-2 font-semibold text-[0.7rem] uppercase tracking-[0.18em] sm:grid-cols-3">
				<TabsTrigger
					value="profit"
					className="flex w-full items-center justify-center rounded-full border border-transparent px-4 py-2 text-center text-muted-foreground transition data-[state=active]:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
				>
					{isSelfHosted ? "Profit Horizon" : "Profit Outlook"}
				</TabsTrigger>
				<TabsTrigger
					value="middle"
					className="flex w-full items-center justify-center rounded-full border border-transparent px-4 py-2 text-center text-muted-foreground transition data-[state=active]:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
				>
					{isSelfHosted ? "Buyout Scenario" : "Cost Summary"}
				</TabsTrigger>
				<TabsTrigger
					value="insights"
					className="flex w-full items-center justify-center rounded-full border border-transparent px-4 py-2 text-center text-muted-foreground transition data-[state=active]:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
				>
					Key Insights
				</TabsTrigger>
			</TabsList>
			<TabsContent
				value="profit"
				className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-5 shadow-sm"
			>
				<header>
					<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
						ROI Projection
					</p>
					<h4 className="mt-1 font-semibold text-foreground text-lg">
						{isSelfHosted
							? "Compounding returns outlook"
							: "Projected net impact"}
					</h4>
				</header>
				<ul className="space-y-2 text-foreground text-sm leading-relaxed">
					<li>
						<strong>Net monthly benefit:</strong>{" "}
						{currency.format(result.monthlyNetBenefit)}
					</li>
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
			</TabsContent>
			<TabsContent
				value="middle"
				className="space-y-3 rounded-xl border border-border/70 bg-background/70 p-5 shadow-sm"
			>
				{isSelfHosted ? (
					<header className="space-y-2">
						<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
							Full Buyout Model
						</p>
						<h4 className="font-semibold text-foreground text-lg">
							Cost to own the automation outright
						</h4>
					</header>
				) : (
					<header className="space-y-2">
						<p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
							Tier Cost Overview
						</p>
						<h4 className="font-semibold text-foreground text-lg">
							Baseline pricing for {result.tier.label}
						</h4>
					</header>
				)}
				<ul className="space-y-2 text-foreground text-sm leading-relaxed">
					{isSelfHosted ? (
						<>
							<li>
								<strong>Setup investment:</strong>{" "}
								{currency.format(result.buyoutSetup)}
							</li>
							<li>
								<strong>Annual maintenance:</strong>{" "}
								{currency.format(result.buyoutMaintenance)}
							</li>
							<li>
								<strong>Ownership:</strong> Perpetual platform and model control
								after revenue-share sunset
							</li>
						</>
					) : costItems.length ? (
						costItems.map((item) => (
							<li key={item.label}>
								<strong>{item.label}:</strong> {item.value}
							</li>
						))
					) : (
						<li>No additional platform fees for this tier.</li>
					)}
				</ul>
			</TabsContent>
			<TabsContent
				value="insights"
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
					{summaryPoints.map((point) => (
						<li key={point}>{point}</li>
					))}
				</ul>
			</TabsContent>
		</Tabs>
	);
};
