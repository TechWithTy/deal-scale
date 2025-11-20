"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Phone, MessageSquare, Database, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStep {
	id: string;
	label: string;
	icon: React.ReactNode;
	status: "pending" | "processing" | "completed";
}

interface ProcessingStatusListProps {
	steps: ProcessingStep[];
	className?: string;
}

const stepVariants = {
	hidden: { opacity: 0, x: -20, scale: 0.9 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			delay: i * 0.2,
			duration: 0.4,
			ease: [0.4, 0, 0.2, 1],
		},
	}),
};

export function ProcessingStatusList({
	steps,
	className,
}: ProcessingStatusListProps) {
	return (
		<div
			className={cn(
				"w-full space-y-2",
				className,
			)}
		>
			<div className="space-y-2">
				<AnimatePresence>
					{steps.map((step, index) => (
						<motion.div
							key={step.id}
							custom={index}
							initial="hidden"
							animate="visible"
							variants={stepVariants}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
								step.status === "processing" &&
									"bg-sky-500/10 border border-sky-500/30",
								step.status === "completed" &&
									"bg-green-500/10 border border-green-500/30",
								step.status === "pending" && "bg-white/5 border border-white/10",
							)}
						>
							<div
								className={cn(
									"flex h-8 w-8 items-center justify-center rounded-full transition-colors",
									step.status === "processing" && "bg-sky-500/20",
									step.status === "completed" && "bg-green-500/20",
									step.status === "pending" && "bg-white/10",
								)}
							>
								{step.status === "processing" ? (
									<Loader2 className="h-4 w-4 animate-spin text-sky-400" />
								) : step.status === "completed" ? (
									<CheckCircle2 className="h-4 w-4 text-green-400" />
								) : (
									<div className="h-4 w-4 rounded-full border-2 border-white/30" />
								)}
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									{step.icon}
									<span
										className={cn(
											"text-sm font-medium transition-colors",
											step.status === "processing" && "text-sky-300",
											step.status === "completed" && "text-green-300",
											step.status === "pending" && "text-white/60",
										)}
									>
										{step.label}
									</span>
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}

