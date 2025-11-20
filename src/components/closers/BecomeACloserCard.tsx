"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BecomeACloserCardProps {
	onClick?: () => void;
	className?: string;
	title?: string;
	subtitle?: string;
}

const BecomeACloserCard = ({
	onClick,
	className = "",
	title = "Apply to Become a Closer",
	subtitle = "Join our marketplace of professional real estate closers. Share your expertise and earn revenue by helping others close deals remotely.",
}: BecomeACloserCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.02 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={cn(
				"flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-center transition-all hover:border-blue-300 hover:shadow-2xl dark:border-blue-500 dark:from-blue-900/70 dark:via-indigo-900/70 dark:to-purple-900/70",
				className,
			)}
			onClick={onClick}
			tabIndex={0}
			role="button"
			aria-label="Apply to become a closer"
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onClick?.();
				}
			}}
		>
			<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white text-5xl backdrop-blur-sm">
				+
			</div>
			<h3 className="mb-2 font-bold text-white text-2xl">{title}</h3>
			<p className="max-w-md text-white/90 text-sm leading-relaxed">{subtitle}</p>
		</motion.div>
	);
};

export default BecomeACloserCard;

