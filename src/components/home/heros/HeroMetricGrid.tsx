import { useId } from "react";

import { cn } from "@/lib/utils";

type MetricHighlight = {
	title: string;
	description: string;
	accent?: string;
};

const METRIC_HIGHLIGHTS: MetricHighlight[] = [
	{
		title: "Implementation Speed",
		description: "Spin up persona-specific hero experiences in minutes.",
		accent: "+68% faster rollouts",
	},
	{
		title: "Content Variants",
		description: "Map persona copy, CTAs, and motion presets in one module.",
		accent: "12 dynamic personas",
	},
	{
		title: "Video Engagement",
		description: "Embed demo loops with guided microcopy and CTA sync.",
		accent: "+38% click-through",
	},
	{
		title: "Team Confidence",
		description: "Shared module reduces QA loops across design and dev teams.",
		accent: "Stakeholder-ready",
	},
];

type HeroMetricGridProps = {
	className?: string;
};

export function HeroMetricGrid({ className }: HeroMetricGridProps) {
	return (
		<section
			className={cn(
				"grid gap-4 rounded-3xl border border-border/50 bg-background/80 p-6 shadow-[0_24px_80px_-40px_rgba(34,197,94,0.35)] md:grid-cols-2",
				className,
			)}
		>
			{METRIC_HIGHLIGHTS.map((metric) => (
				<MetricCard key={metric.title} metric={metric} />
			))}
		</section>
	);
}

const MetricCard = ({ metric }: { metric: MetricHighlight }) => (
	<div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-background/90 via-background/70 to-background/80 p-5">
		<GridOverlay />
		<div className="relative z-10 flex flex-col gap-3">
			<span className="font-semibold text-primary/80 text-xs uppercase tracking-[0.32em]">
				{metric.accent}
			</span>
			<h3 className="font-semibold text-foreground text-lg">{metric.title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{metric.description}
			</p>
		</div>
	</div>
);

const GridOverlay = () => {
	const patternId = useId();

	return (
		<svg
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 opacity-[0.65]"
		>
			<defs>
				<pattern
					id={patternId}
					width={24}
					height={24}
					patternUnits="userSpaceOnUse"
					x={-12}
					y={6}
				>
					<path
						d="M.5 24V.5H24"
						fill="none"
						stroke="hsl(142 76% 45% / 0.2)"
						strokeWidth="1"
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${patternId})`} />
		</svg>
	);
};

