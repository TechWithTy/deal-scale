"use client";

import { BentoGrid as MagicBentoGrid } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BentoGridProps {
	children: ReactNode;
	className?: string;
}

const BentoGrid = ({ children, className }: BentoGridProps) => {
	return (
		<MagicBentoGrid
			className={cn(
				"grid-cols-1 gap-6 md:grid-flow-dense md:auto-rows-[minmax(0,max-content)] md:grid-cols-6 lg:grid-cols-12",
				className,
			)}
		>
			{children}
		</MagicBentoGrid>
	);
};

export default BentoGrid;
