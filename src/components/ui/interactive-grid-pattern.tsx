import type React from "react";
import { memo, useMemo } from "react";

import { cn } from "@/lib/utils";

/**
 * InteractiveGridPattern is a component that renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid. The first element is the number of horizontal squares, and the second element is the number of vertical squares.
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
	width?: number;
	height?: number;
	squares?: [number, number]; // [horizontal, vertical]
	className?: string;
	squaresClassName?: string;
}

/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
const InteractiveGridPatternComponent = ({
	width = 40,
	height = 40,
	squares = [24, 24],
	className,
	squaresClassName,
	...props
}: InteractiveGridPatternProps): JSX.Element => {
	const [horizontal, vertical] = squares;
	const svgWidth = width * horizontal;
	const svgHeight = height * vertical;

	const rects = useMemo(() => {
		const total = horizontal * vertical;
		return Array.from({ length: total }, (_, index) => ({
			index,
			x: (index % horizontal) * width,
			y: Math.floor(index / horizontal) * height,
		}));
	}, [horizontal, vertical, width, height]);

	return (
		<svg
			width={svgWidth}
			height={svgHeight}
			className={cn(
				"absolute inset-0 h-full w-full border border-gray-400/30 dark:border-gray-600/30",
				className,
			)}
			{...props}
		>
			{rects.map(({ index, x, y }) => (
				<rect
					key={index}
					x={x}
					y={y}
					width={width}
					height={height}
					className={cn(
						"fill-transparent stroke-gray-400/30 transition-colors duration-500 ease-out hover:fill-gray-300/30 dark:stroke-gray-600/30 dark:hover:fill-gray-700/30",
						squaresClassName,
					)}
				/>
			))}
		</svg>
	);
};

InteractiveGridPatternComponent.displayName = "InteractiveGridPattern";

export const InteractiveGridPattern = memo(InteractiveGridPatternComponent);
