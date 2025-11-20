"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import type { FlowChartProps } from "@/types/service/howItWorks";
import { motion } from "framer-motion";
import type * as React from "react";
import { v4 as uuidv4 } from "uuid";

export const FlowChart: React.FC<FlowChartProps> = ({ nodes }) => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<div className="w-full overflow-x-auto py-8">
			<div
				className={cn(
					"relative min-h-[500px] w-full",
					isMobile && "flex flex-col items-center",
				)}
			>
				{nodes.map((node, index) => (
					<motion.div
						key={uuidv4()}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: index * 0.1,
							ease: "easeOut",
						}}
						whileHover={{ scale: 1.03 }}
						className={cn(
							"w-full max-w-[280px] rounded-lg border border-border/50 bg-background p-4 shadow-sm",
							!isMobile && "absolute",
							isMobile && "mb-8",
							node.className,
							!isMobile && index === 0 && "top-0 left-[5%] md:left-[10%]",
							!isMobile && index === 1 && "top-[25%] left-[25%] md:left-[30%]",
							!isMobile && index === 2 && "top-[50%] left-[45%] md:left-[50%]",
							!isMobile && index === 3 && "top-[75%] left-[65%] md:left-[70%]",
						)}
					>
						<div className="mb-3 flex items-center gap-3">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									delay: index * 0.1 + 0.2,
									type: "spring",
								}}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-black dark:text-white"
							>
								{node.stepNumber}
							</motion.div>
							<h4 className="font-medium text-lg">{node.title}</h4>
						</div>
						<p className="text-muted-foreground">{node.description}</p>

						{!isMobile && index < nodes.length - 1 && (
							<motion.div
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{
									delay: index * 0.1 + 0.3,
									duration: 0.5,
								}}
								className="absolute top-1/2 left-[calc(100%-1rem)] h-1 w-16 origin-left bg-border"
							>
								<div className="-translate-y-1/2 absolute top-1/2 right-0 h-3 w-3 rotate-45 transform border-border border-r-2 border-b-2" />
							</motion.div>
						)}
					</motion.div>
				))}
			</div>
		</div>
	);
};
