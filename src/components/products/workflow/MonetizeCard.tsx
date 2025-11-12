import type React from "react";

interface MonetizeCardProps {
	onClick?: () => void;
	className?: string;
	ariaLabel?: string;
	href?: string;
	utmParams?: Record<string, string>;
	title?: string;
	subtitle?: string;
}

const MonetizeCard: React.FC<MonetizeCardProps> = ({
	onClick,
	className = "",
	ariaLabel = "Create and monetize your workflow",
	href,
	utmParams,
	title = "Monetize Your Workflow",
	subtitle = "Share your automation with the world and earn revenue",
}) => {
	const navigate = () => {
		if (onClick) {
			onClick();
			return;
		}

		if (!href || typeof window === "undefined") {
			return;
		}

		try {
			const url = new URL(href);
			for (const [key, value] of Object.entries(utmParams ?? {})) {
				url.searchParams.set(key, value);
			}
			window.open(url.toString(), "_blank", "noopener");
		} catch (error) {
			console.warn("[MonetizeCard] Failed to open monetize link", error);
			window.open(href, "_blank", "noopener");
		}
	};

	return (
		<div
			className={`flex min-h-[220px] w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-primary border-dashed bg-gradient-to-br from-white via-purple-100 to-white p-6 text-center transition-all hover:shadow-xl dark:border-primary dark:bg-gradient-to-br dark:from-purple-900/70 dark:to-primary/30 ${className}`}
			onClick={navigate}
			tabIndex={0}
			role="button"
			aria-label={ariaLabel}
			onKeyPress={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					navigate();
				}
			}}
		>
			<span className="mb-2 text-5xl text-primary dark:text-primary">+</span>
			<span className="mb-1 font-semibold text-gray-900 text-lg dark:text-white">
				{title}
			</span>
			<span className="text-gray-600 text-sm dark:text-gray-300">
				{subtitle}
			</span>
		</div>
	);
};

export default MonetizeCard;
