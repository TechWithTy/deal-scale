import type React from "react";

interface MonetizeCardProps {
	onClick?: () => void;
	className?: string;
	ariaLabel?: string;
}

const MonetizeCard: React.FC<MonetizeCardProps> = ({
	onClick,
	className = "",
	ariaLabel = "Create and monetize your workflow",
}) => (
	<div
		className={`flex min-h-[220px] w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-primary border-dashed bg-gradient-to-br from-white via-purple-100 to-white p-6 text-center transition-all hover:shadow-xl dark:border-primary dark:bg-gradient-to-br dark:from-purple-900/70 dark:to-primary/30 ${className}`}
		onClick={onClick}
		tabIndex={0}
		role="button"
		aria-label={ariaLabel}
		onKeyPress={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				onClick?.();
			}
		}}
	>
		<span className="mb-2 text-5xl text-primary dark:text-primary">+</span>
		<span className="mb-1 font-semibold text-gray-900 text-lg dark:text-white">
			Monetize Your Workflow
		</span>
		<span className="text-gray-600 text-sm dark:text-gray-300">
			Share your automation with the world and earn revenue
		</span>
	</div>
);

export default MonetizeCard;
