"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { RoiTierConfig } from "@/lib/roi/types";

interface RoiTierSelectorProps {
	tiers: RoiTierConfig[];
	activeTier: string;
	onTierChange: (tierKey: string) => void;
	showSetupInvestment: boolean;
	onToggleSetup: (value: boolean) => void;
	canToggleSetup: boolean;
}

export const RoiTierSelector = ({
	tiers,
	activeTier,
	onTierChange,
	showSetupInvestment,
	onToggleSetup,
	canToggleSetup,
}: RoiTierSelectorProps) => {
	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				{tiers.map(({ key, tier }) => {
					const isActive = key === activeTier;
					return (
						<button
							key={key}
							type="button"
							onClick={() => onTierChange(key)}
							className={cn(
								"rounded-full border px-4 py-2 text-sm font-semibold transition",
								isActive
									? "border-primary/60 bg-primary/10 text-primary"
									: "border-border/60 bg-muted/20 text-muted-foreground hover:border-border",
							)}
						>
							{tier.label}
						</button>
					);
				})}
			</div>
			<div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
				<span className="font-semibold">Display Options</span>
				<div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-2">
					<Switch
						checked={showSetupInvestment}
						onCheckedChange={onToggleSetup}
						disabled={!canToggleSetup}
					/>
					<span className={cn("font-semibold", !canToggleSetup && "opacity-60")}>Setup Investment</span>
				</div>
			</div>
		</div>
	);
};
