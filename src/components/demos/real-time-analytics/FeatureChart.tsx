"use client";

import { memo, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { RealTimeFeature } from "./feature-config";

type FeatureChartProps = {
	chart: NonNullable<RealTimeFeature["chart"]>;
};

const palette = {
	current: "hsl(217 91% 60%)",
	previous: "hsl(142 72% 45%)",
	target: "hsl(38 92% 55%)",
} as const;

const formatMetric = (value: number): string => {
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)}m`;
	}

	if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1)}k`;
	}

	return value.toString();
};

function FeatureChartComponent({ chart }: FeatureChartProps): JSX.Element {
	const chartConfig = useMemo<ChartConfig>(() => {
		const config: ChartConfig = {
			current: {
				label: chart.currentLabel,
				color: palette.current,
			},
		};

		if (chart.previousLabel) {
			config.previous = {
				label: chart.previousLabel,
				color: palette.previous,
			};
		}

		const hasTargetSeries = chart.data.some(
			(point) => point.target !== undefined,
		);

		if (chart.targetLabel && hasTargetSeries) {
			config.target = {
				label: chart.targetLabel,
				color: palette.target,
			};
		}

		return config;
	}, [chart.currentLabel, chart.data, chart.previousLabel, chart.targetLabel]);

	const hasPrevious = Boolean(chart.previousLabel);
	const hasTarget = Boolean(chartConfig.target);

	return (
		<ChartContainer
			config={chartConfig}
			className="h-[260px] w-full"
			style={{ minHeight: 260 }}
			data-testid="realtime-analytics-chart"
		>
			<LineChart
				data={chart.data}
				margin={{ top: 10, right: 24, bottom: 10, left: 0 }}
			>
				<CartesianGrid vertical={false} strokeDasharray="6 6" />
				<XAxis
					dataKey="period"
					stroke="var(--border)"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="var(--border)"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					width={48}
					tickFormatter={formatMetric}
				/>
				<ChartTooltip
					cursor={{ strokeDasharray: "4 4" }}
					content={
						<ChartTooltipContent
							indicator="line"
							hideIndicator
							labelFormatter={(value) => value}
						/>
					}
				/>
				<ChartLegend
					verticalAlign="top"
					content={<ChartLegendContent className="pt-2" />}
				/>
				<Line
					type="monotone"
					dataKey="current"
					stroke="var(--color-current)"
					strokeWidth={3}
					dot={false}
					activeDot={{ r: 6 }}
				/>
				{hasPrevious ? (
					<Line
						type="monotone"
						dataKey="previous"
						stroke="var(--color-previous)"
						strokeWidth={2}
						dot={false}
						strokeDasharray="6 4"
					/>
				) : null}
				{hasTarget ? (
					<Line
						type="monotone"
						dataKey="target"
						stroke="var(--color-target)"
						strokeWidth={2}
						dot={false}
						strokeDasharray="4 4"
					/>
				) : null}
			</LineChart>
		</ChartContainer>
	);
}

export const FeatureChart = memo(FeatureChartComponent);

export default FeatureChart;
