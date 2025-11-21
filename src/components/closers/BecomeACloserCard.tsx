"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface BecomeACloserCardProps {
	onClick?: () => void;
	className?: string;
	title?: string;
	subtitle?: string;
	imageUrl?: string;
}

const BecomeACloserCard = ({
	onClick,
	className = "",
	title = "Remote Closers Marketplace",
	subtitle = "Browse closers or apply to join",
	imageUrl,
}: BecomeACloserCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.02 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={cn(
				"relative flex min-h-[280px] w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-dashed border-blue-400 transition-all hover:border-blue-300 hover:shadow-2xl dark:border-blue-500",
				imageUrl ? "border-blue-300" : "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900/70 dark:via-indigo-900/70 dark:to-purple-900/70",
				className,
			)}
			onClick={onClick}
			tabIndex={0}
			role="button"
			aria-label="View closers marketplace"
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onClick?.();
				}
			}}
		>
			{imageUrl && (
				<div className="absolute inset-0">
					<Image
						src={imageUrl}
						alt={title || "Remote Closers Marketplace"}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-600/80 to-purple-600/80 dark:from-blue-900/80 dark:via-indigo-900/80 dark:to-purple-900/80" />
				</div>
			)}
			<div className="relative z-10 flex min-h-[280px] w-full flex-col items-center justify-center p-8 text-center">
				<div className="mb-4 flex gap-2">
					<span className="rounded-full bg-white/20 px-3 py-1 text-white text-xs font-semibold backdrop-blur-sm">
						Browse All
					</span>
					<span className="rounded-full bg-white/20 px-3 py-1 text-white text-xs font-semibold backdrop-blur-sm">
						Apply to Join
					</span>
				</div>
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white text-5xl backdrop-blur-sm">
					+
				</div>
				<h3 className="mb-2 font-bold text-white text-2xl">{title}</h3>
				<p className="max-w-md text-white/90 text-sm leading-relaxed">{subtitle}</p>
			</div>
		</motion.div>
	);
};

export default BecomeACloserCard;

