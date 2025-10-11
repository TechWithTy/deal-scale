import { cn } from "@/lib/utils";
import type { ProductSummaryProps } from "./types";

const copyFields = ["pain_point", "solution"] as const;

type CopyField = (typeof copyFields)[number];

const extractCopyField = (field: CopyField, abTest?: ProductSummaryProps["abTest"]) => {
        if (!abTest) return undefined;

        for (const variant of abTest.variants ?? []) {
                const value = variant.copy?.[field];
                if (typeof value === "string" && value.trim().length > 0) {
                        return value.trim();
                }
        }

        return undefined;
};

const pillStyles: Record<CopyField, { container: string; label: string; text: string; labelText: string }> = {
        pain_point: {
                container:
                        "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200",
                label: "text-red-800 dark:text-red-100",
                text: "text-red-700 dark:text-red-200",
                labelText: "Problem",
        },
        solution: {
                container:
                        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200",
                label: "text-emerald-800 dark:text-emerald-100",
                text: "text-emerald-700 dark:text-emerald-200",
                labelText: "Solution",
        },
};

const ProductSummary = ({ description, abTest }: ProductSummaryProps) => {
        const painPoint = extractCopyField("pain_point", abTest);
        const solution = extractCopyField("solution", abTest);
        const shouldShowPills = painPoint || solution;

        if (!description && !shouldShowPills) {
                return null;
        }

        return (
                <div className="mt-4 flex flex-col gap-3 text-left">
                        {description && (
                                <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                        )}
                        {shouldShowPills && (
                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                        {copyFields.map((field) => {
                                                const content = field === "pain_point" ? painPoint : solution;

                                                if (!content) return null;

                                                const { container, label, text, labelText } = pillStyles[field];
                                                return (
                                                        <div
                                                                key={field}
                                                                className={cn(
                                                                        "flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-xs sm:w-auto",
                                                                        container,
                                                                )}
                                                        >
                                                                <span
                                                                        className={cn(
                                                                                "whitespace-nowrap font-semibold uppercase tracking-wide",
                                                                                label,
                                                                        )}
                                                                >
                                                                        {labelText}
                                                                </span>
                                                                <span
                                                                        className={cn(
                                                                                "line-clamp-2 max-w-xs text-left font-medium sm:max-w-[16rem]",
                                                                                text,
                                                                        )}
                                                                >
                                                                        {content}
                                                                </span>
                                                        </div>
                                                );
                                        })}
                                </div>
                        )}
                </div>
        );
};

export default ProductSummary;
