import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

// * StickyBanner Props
export interface StickyBannerProps
	extends React.HTMLAttributes<HTMLDivElement> {
	open: boolean; // ! Controls visibility (external logic)
	onClose: () => void; // ! Close handler (external logic)
	variant?: "default" | "success" | "warning" | "danger";
	children: React.ReactNode;
}

// * Banner color variants
const variantClasses = {
	default: "bg-primary text-primary-foreground border-primary",
	success: "bg-green-500 text-white border-green-600",
	warning: "bg-yellow-400 text-black border-yellow-500",
	danger: "bg-red-500 text-white border-red-600",
};

/**
 * * StickyBanner: A sticky, closeable banner for alerts/updates.
 * @param {StickyBannerProps} props
 */
export const StickyBanner = React.forwardRef<HTMLDivElement, StickyBannerProps>(
	(
		{ open, onClose, variant = "default", children, className, ...props },
		ref,
	) => {
		if (!open) return null;
		return (
			<div
				ref={ref}
				role="alert"
				aria-live="assertive"
				className={cn(
					// * Sticky, full-width, glassy, with gradient and neon/aurora highlight
					"fade-in slide-in-from-top-2 sticky z-50 flex w-full animate-in flex-col gap-3 border-b px-4 py-3 shadow-lg backdrop-blur-2xl transition-all md:flex-row md:items-center md:justify-between md:gap-4",
					// * Glass/gradient background for default and success
					variant === "default"
						? "border border-border bg-[linear-gradient(90deg,_hsl(var(--primary)/0.90)_0%,_hsl(var(--accent)/0.85)_100%)] text-glow text-primary-foreground"
						: variant === "success"
							? "border border-[hsl(var(--primary))] bg-[linear-gradient(90deg,_hsl(var(--tertiary)/0.9)_0%,_hsl(var(--primary)/0.8)_100%)] text-[hsl(var(--primary-foreground))]"
							: variant === "warning"
								? "border-yellow-500 bg-yellow-400/90 text-black"
								: variant === "danger"
									? "border border-[hsl(var(--destructive))] bg-[linear-gradient(90deg,_hsl(var(--destructive)/0.93)_0%,_hsl(var(--accent)/0.8)_100%)] text-[hsl(var(--destructive-foreground))]"
									: "",
					// * Neon/aurora highlight for default (optional)
					variant === "default"
						? "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_left,_rgba(78,234,255,0.15)_0%,_transparent_70%)] before:content-['']"
						: "",
					// * Glassy effect
					"glass-card",
					// * Focus ring for accessibility
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--focus))] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					className,
				)}
				{...props}
			>
				<div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center">
					{children}
				</div>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Close banner"
					onClick={onClose}
					className="flex h-9 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:ml-2 md:h-10 md:w-auto md:justify-center"
				>
					<X className="h-5 w-5" aria-hidden="true" />
				</Button>
			</div>
		);
	},
);
StickyBanner.displayName = "StickyBanner";

// * Usage Example (logic handled by parent):
// <StickyBanner open={show} onClose={() => setShow(false)} variant="success">Update successful!</StickyBanner>
