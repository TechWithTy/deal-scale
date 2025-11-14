"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlatformConfig, SocialPlatform } from "@/types/social/share";
import { SocialIcon } from "react-social-icons";

interface SocialIconButtonProps {
	platform: SocialPlatform;
	config: PlatformConfig;
	size: "sm" | "default" | "lg";
	variant: "default" | "outline" | "ghost" | "link";
	showLabel: boolean;
	isVisible: boolean;
	onClick: () => void;
}

export const SocialIconButton = ({
	platform,
	config,
	size,
	variant,
	showLabel,
	isVisible,
	onClick,
}: SocialIconButtonProps) => {
	const sizeClasses = {
		sm: "h-6 w-6",
		default: "h-8 w-8",
		lg: "h-10 w-10",
	}[size];

	const iconSize = size === "lg" ? 20 : size === "sm" ? 16 : 18;

	return (
		<Button
			variant={variant}
			size="icon"
			className={cn(
				"m-1 rounded-full transition-all duration-200 hover:scale-105 focus:scale-105 active:scale-95",
				sizeClasses,
				!isVisible && "scale-95 opacity-0",
				isVisible && "scale-100 opacity-100",
				showLabel && "w-auto gap-2 px-3",
			)}
			onClick={onClick}
			aria-label={config.label}
		>
			<SocialIcon
				as="div"
				network={config.network}
				className="!h-4 !w-4"
				style={{
					height: `${iconSize}px`,
					width: `${iconSize}px`,
					pointerEvents: "none",
				}}
				fgColor="currentColor"
				bgColor="transparent"
			/>
			{showLabel && (
				<span className="text-sm capitalize">
					{platform === "twitter" ? "X (formerly Twitter)" : platform}
				</span>
			)}
		</Button>
	);
};
