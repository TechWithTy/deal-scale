"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
	size?: "sm" | "default" | "lg";
	variant?: "default" | "outline" | "ghost" | "link";
	isOpen: boolean;
	onClick: () => void;
	showLabels?: boolean;
}

export const ShareButton = ({
	size = "default",
	variant = "outline",
	isOpen,
	onClick,
	showLabels = false,
}: ShareButtonProps) => (
	<Button
		variant={variant}
		size={size}
		className={cn("rounded-full transition-all", {
			"rotate-180": isOpen,
		})}
		onClick={onClick}
		aria-label="Share"
		aria-expanded={isOpen}
	>
		<Share2 className={cn("h-4 w-4", { "h-5 w-5": size === "lg" })} />
		{showLabels && <span className="ml-2">Share</span>}
	</Button>
);
