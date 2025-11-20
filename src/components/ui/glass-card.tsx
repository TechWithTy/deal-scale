import { cn } from "@/lib/utils";
import type React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
	highlighted?: boolean;
	children: React.ReactNode;
}

export function GlassCard({
	highlighted = false,
	className,
	children,
	...props
}: GlassCardProps) {
	return (
		<div
			className={cn(
				"glass-card overflow-hidden rounded-xl transition-all duration-300",
				highlighted
					? "hover:-translate-y-2 relative transform border-primary/50"
					: "border-white/10 hover:border-white/30",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
