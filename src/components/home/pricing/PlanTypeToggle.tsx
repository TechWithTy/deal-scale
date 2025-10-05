"use client";

import type { PlanType } from "@/types/service/plans";

export interface AnnualDiscountSummary {
        percent?: number;
        amount?: number;
}

interface PlanTypeToggleProps {
        planType: PlanType;
        availableTypes: PlanType[];
        annualDiscountSummary?: AnnualDiscountSummary;
        onChange: (type: PlanType) => void;
}

const PLAN_TYPE_ORDER: PlanType[] = ["monthly", "annual", "oneTime"];

const PLAN_TYPE_LABEL: Record<PlanType, string> = {
        monthly: "Monthly",
        annual: "Annual",
        oneTime: "One-Time",
};

function formatCurrency(amount: number) {
        return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
        }).format(amount);
}

function AnnualDiscountBadge({ summary }: { summary?: AnnualDiscountSummary }) {
        if (!summary) {
                return null;
        }

        if (summary.percent && summary.percent > 0) {
                return (
                        <span className="-top-7 -translate-x-1/2 absolute left-1/2 animate-pulse whitespace-nowrap rounded border border-green-300 bg-green-100 px-2 py-1 font-bold text-green-700 text-xs">
                                Save {summary.percent}%
                        </span>
                );
        }

        if (summary.amount && summary.amount > 0) {
                return (
                        <span className="-top-5 -translate-x-1/2 absolute left-1/2 animate-pulse whitespace-nowrap rounded border border-blue-300 bg-blue-100 px-2 py-0.5 font-bold text-blue-700 text-xs">
                                Save {formatCurrency(summary.amount)}
                        </span>
                );
        }

        return null;
}

export function PlanTypeToggle({
        planType,
        availableTypes,
        annualDiscountSummary,
        onChange,
}: PlanTypeToggleProps) {
        const orderedTypes = PLAN_TYPE_ORDER.filter((type) => availableTypes.includes(type));

        if (orderedTypes.length === 0) {
                return null;
        }

        return (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                        {orderedTypes.map((type) => (
                                <div key={type} className="relative">
                                        {type === "annual" ? (
                                                <AnnualDiscountBadge summary={annualDiscountSummary} />
                                        ) : null}

                                        <button
                                                type="button"
                                                className={`rounded-lg px-4 py-2 transition-all ${
                                                        planType === type
                                                                ? "bg-gradient-to-r from-primary/20 to-focus/20 text-black dark:text-white"
                                                                : "text-black hover:text-black dark:text-white dark:text-white/60"
                                                }`}
                                                onClick={() => onChange(type)}
                                        >
                                                {PLAN_TYPE_LABEL[type]}
                                        </button>
                                </div>
                        ))}
                </div>
        );
}

