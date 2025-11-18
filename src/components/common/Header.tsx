import { motion } from "framer-motion";
import type React from "react";

/**
 * HeaderProps defines the props for the reusable Header component.
 * @param title - The main heading text
 * @param subtitle - The subheading/description text
 * @param size - Size of the header: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param className - Optional additional classes for the container
 */
export interface HeaderProps {
	title: string;
	subtitle?: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

// Mapping size prop to Tailwind font size classes
const sizeMap = {
	sm: {
		h2: "text-xl sm:text-2xl md:text-3xl",
		p: "text-sm sm:text-base md:text-lg",
		spacing: "pt-2 pb-2 mb-1 mt-2",
	},
	md: {
		h2: "text-3xl sm:text-4xl md:text-5xl",
		p: "text-base sm:text-lg md:text-xl",
		spacing: "pt-2 pb-2 mb-2 mt-4",
	},
	lg: {
		h2: "text-4xl sm:text-5xl md:text-6xl",
		p: "text-lg sm:text-xl md:text-2xl",
		spacing: "pt-3 pb-3 mb-3 mt-6",
	},
	xl: {
		h2: "text-5xl sm:text-6xl md:text-7xl",
		p: "text-xl sm:text-2xl md:text-3xl",
		spacing: "pt-4 pb-4 mb-4 mt-8",
	},
};

/**
 * Reusable animated gradient header with subtitle.
 * Font size and spacing are dynamic based on the size prop.
 */
export const Header: React.FC<HeaderProps> = ({
	title,
	subtitle,
	size = "md",
	className = "",
}) => {
	const { h2, p, spacing } = sizeMap[size];

	return (
		<div className={`text-center ${className}`}>
			<motion.h2
				className={`relative z-10 mb-2 break-words font-bold text-black leading-normal dark:text-white ${h2} ${spacing}`}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				{title}
			</motion.h2>
			{subtitle && (
				<motion.p
					className={`mx-auto max-w-2xl text-black leading-normal dark:text-white/80 ${p} ${spacing.replace("pt-", "mt-")}`}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					{subtitle}
				</motion.p>
			)}
		</div>
	);
};

export default Header;
