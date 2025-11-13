"use client";

import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { RoiTierConfig } from "@/lib/roi/types";
import { useMemo } from "react";

interface RoiTierSelectorProps {
	tiers: RoiTierConfig[];
	activeTier: string;
	onTierChange: (tierKey: string) => void;
	showSetupInvestment: boolean;
	onToggleSetup: (value: boolean) => void;
	canToggleSetup: boolean;
	showSetupToggle?: boolean;
}

interface TierGroup {
	key: string;
	label: string;
	items: Array<{ key: string; label: string }>;
	defaultKey: string;
}

export const RoiTierSelector = ({
	tiers,
	activeTier,
	onTierChange,
	showSetupInvestment,
	onToggleSetup,
	canToggleSetup,
	showSetupToggle = true,
}: RoiTierSelectorProps) => {
	const groups = useMemo<TierGroup[]>(() => {
		const map = new Map<string, TierGroup>();

		tiers.forEach(({ key, tier, group, groupLabel, isGroupDefault }) => {
			const existing = map.get(group);
			const nextItem = { key, label: tier.label };

			if (existing) {
				const defaultKey =
					isGroupDefault || !existing.defaultKey ? key : existing.defaultKey;
				existing.items.push(nextItem);
				existing.defaultKey = defaultKey;
			} else {
				map.set(group, {
					key: group,
					label: groupLabel,
					items: [nextItem],
					defaultKey: isGroupDefault ? key : key,
				});
			}
		});

		return Array.from(map.values()).map((group) => ({
			...group,
			defaultKey: group.defaultKey ?? group.items[0]?.key ?? "",
		}));
	}, [tiers]);

	const activeGroup = useMemo(() => {
		return (
			groups.find((group) => group.items.some((item) => item.key === activeTier)) ??
			groups[0]
		);
	}, [groups, activeTier]);

	const handleGroupSelect = (groupKey: string) => {
		const group = groups.find((item) => item.key === groupKey);
		if (!group) return;

		const isActiveGroup = group.items.some((item) => item.key === activeTier);
		if (isActiveGroup) {
			onTierChange(activeTier);
			return;
		}

		onTierChange(group.defaultKey || group.items[0]?.key || activeTier);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				{groups.map((group) => {
					const isActive = group.key === activeGroup?.key;
					return (
						<button
							key={group.key}
							type="button"
							onClick={() => handleGroupSelect(group.key)}
							className={cn(
								"rounded-full border px-4 py-2 text-sm font-semibold transition",
								isActive
									? "border-primary/60 bg-primary/10 text-primary"
									: "border-border/60 bg-muted/20 text-muted-foreground hover:border-border",
							)}
						>
							{group.label}
						</button>
					);
				})}
			</div>
			{activeGroup && activeGroup.items.length > 1 ? (
				<div className="w-full max-w-sm">
					<Select
						value={activeTier}
						onValueChange={(value) => onTierChange(value)}
					>
						<SelectTrigger className="h-11 w-full rounded-lg border border-border/60 bg-background/60">
							<SelectValue placeholder="Choose tier" />
						</SelectTrigger>
						<SelectContent>
							{activeGroup.items.map((item) => (
								<SelectItem key={item.key} value={item.key}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			) : null}
			{showSetupToggle ? (
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
			) : null}
		</div>
	);
};
