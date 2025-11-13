"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RoiInputs } from "@/lib/roi/types";
import type { ROIEstimator } from "@/types/service/plans";

interface RoiCalculatorInputsProps {
	inputs: RoiInputs;
	estimator: ROIEstimator;
	onChange: (field: keyof RoiInputs, value: number | string) => void;
}

export const RoiCalculatorInputs = ({
	inputs,
	estimator,
	onChange,
}: RoiCalculatorInputsProps) => {
	const handleNumberChange = (field: keyof RoiInputs) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onChange(field, Number(event.target.value));
		};

	return (
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
					onChange={handleNumberChange("averageDealAmount")}
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
					onChange={handleNumberChange("monthlyDealsClosed")}
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
					onChange={handleNumberChange("averageTimePerDealHours")}
					className="h-11 rounded-lg border-border/60 bg-background/60"
				/>
			</div>
			<div className="grid gap-2">
				<Label
					htmlFor="monthlyOperatingCost"
					className="font-medium text-muted-foreground text-xs uppercase"
				>
					General Monthly Operating Cost ($)
				</Label>
				<Input
					id="monthlyOperatingCost"
					type="number"
					min={0}
					step={100}
					value={inputs.monthlyOperatingCost}
					onChange={handleNumberChange("monthlyOperatingCost")}
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
					onChange={(event) => onChange("industry", event.target.value)}
					className="h-11 w-full rounded-lg border border-border/60 bg-background/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
				>
					{Object.keys(estimator.industryFactors).map((industry) => (
						<option key={industry} value={industry}>
							{industry}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
