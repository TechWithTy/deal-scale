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
				"grid grid-cols-1 justify-items-center gap-4 md:grid-cols-4",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default BentoGrid;
