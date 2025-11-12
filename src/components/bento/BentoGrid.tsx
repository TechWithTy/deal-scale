"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import type { ReactNode } from "react";

interface BentoGridProps {
	children: ReactNode;
	className?: string;
}

const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
	return (
		<div
			className={cn(
				"grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-5 md:auto-rows-[minmax(260px,auto)] md:grid-cols-6 lg:grid-cols-12",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default BentoGrid;
