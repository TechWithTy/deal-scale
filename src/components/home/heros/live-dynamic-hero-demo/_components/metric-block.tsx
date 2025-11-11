import { memo } from "react";

interface MetricBlockProps {
	readonly label: string;
	readonly value: string;
}

/**
 * Compact metric tile used inside the live dynamic hero demo.
 */
function MetricBlockComponent({ label, value }: MetricBlockProps): JSX.Element {
	return (
		<div className="flex flex-col items-center gap-2 rounded-2xl border border-border/40 bg-background/80 px-4 py-4 shadow-[0_20px_60px_-30px_rgba(34,197,94,0.45)] backdrop-blur-md">
			<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
				{label}
			</span>
			<span className="text-lg font-semibold text-foreground">{value}</span>
		</div>
	);
}

export const MetricBlock = memo(MetricBlockComponent);
