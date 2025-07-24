export interface PayloadItem {
	name: string;
	value: number;
	fill: string;
}

export interface FlowChartNode {
	stepNumber: number; // Added
	title: string; // Added
	description: string; // Added
	label: string;
	positionLabel: string;
	payload: PayloadItem[];
	indicator?: "line" | "dot" | "dashed";
	hideLabel?: boolean;
	hideIndicator?: boolean;
	className?: string;
	svgPath?: React.ReactNode;
}

export interface FlowChartProps {
	nodes: FlowChartNode[];
}
