"use client";

import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type IntentModalSize = "sm" | "md" | "lg";
export type IntentModalVariant = "inline" | "drawer" | "modal";
export type IntentModalTone = "default" | "subtle" | "elevated";
export type IntentType =
	| "feedback"
	| "exit-intent"
	| "survey"
	| "newsletter"
	| "cookie-consent"
	| "custom";
export type IntentAccent = "primary" | "emerald" | "sky" | "amber" | "violet";

const SIZE_CONFIG: Record<
	IntentModalSize,
	{ width: string; padding: string; gap: string }
> = {
	sm: { width: "max-w-sm", padding: "p-4", gap: "gap-3" },
	md: { width: "max-w-md", padding: "p-5", gap: "gap-4" },
	lg: { width: "max-w-xl", padding: "p-6", gap: "gap-5" },
};

const TONE_CLASSES: Record<IntentModalTone, string> = {
	default:
		"border-white/10 bg-background/95 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.45)]",
	subtle:
		"border-border/60 bg-background/90 shadow-[0_25px_45px_-30px_rgba(15,23,42,0.6)]",
	elevated:
		"border-primary/30 bg-gradient-to-br from-background/95 via-background/80 to-primary/10 shadow-[0_30px_80px_-20px_rgba(59,130,246,0.55)]",
};

const INTENT_ICONS: Record<IntentType, string> = {
	feedback: "💬",
	"exit-intent": "👋",
	survey: "📋",
	newsletter: "📧",
	"cookie-consent": "🍪",
	custom: "✨",
};

export interface IntentModalProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Size of the modal
	 * @default "md"
	 */
	size?: IntentModalSize;
	/**
	 * Display variant: inline, drawer (bottom), or modal (centered)
	 * @default "modal"
	 */
	variant?: IntentModalVariant;
	/**
	 * Visual tone/style
	 * @default "default"
	 */
	tone?: IntentModalTone;
	/**
	 * Intent type for semantic styling and icons
	 * @default "custom"
	 */
	intent?: IntentType;
	/**
	 * Whether the modal is open
	 * @default false
	 */
	open?: boolean;
	/**
	 * Modal title
	 */
	title?: string;
	/**
	 * Modal description/subtitle
	 */
	description?: string;
	/**
	 * Optional eyebrow headline rendered above the title.
	 */
	eyebrow?: string;
	/**
	 * Whether to show the close button
	 * @default true
	 */
	showCloseButton?: boolean;
	/**
	 * Close button aria label
	 * @default "Close modal"
	 */
	closeLabel?: string;
	/**
	 * Callback when modal should close
	 */
	onClose?: () => void;
	/**
	 * Action buttons/content (rendered at bottom)
	 */
	actions?: React.ReactNode;
	/**
	 * Whether to show intent icon next to title
	 * @default true
	 */
	showIntentIcon?: boolean;
	/**
	 * Custom icon to override default intent icon
	 */
	customIcon?: React.ReactNode;
	/**
	 * Whether to prevent body scroll when modal/drawer is open
	 * @default true
	 */
	preventBodyScroll?: boolean;
	/**
	 * Accent color used for decorative elements when provided.
	 * @default "primary"
	 */
	accent?: IntentAccent;
}

/**
 * A flexible, general-purpose intent modal that can render inline, as a modal, or as a bottom drawer.
 * Perfect for feedback forms, exit intent captures, surveys, newsletter signups, cookie consent, and more.
 *
 * @example
 * ```tsx
 * // Exit intent feedback modal
 * const [open, setOpen] = useState(false);
 * useExitIntent({
 *   onExitIntent: () => setOpen(true),
 *   minTimeOnPage: 5000
 * });
 *
 * <IntentModal
 *   intent="exit-intent"
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Wait! Before you go..."
 *   description="We'd love your feedback to improve DealScale"
 *   actions={
 *     <>
 *       <Button onClick={handleSubmit}>Submit Feedback</Button>
 *       <Button variant="outline" onClick={() => setOpen(false)}>Maybe Later</Button>
 *     </>
 *   }
 * >
 *   <FeedbackForm />
 * </IntentModal>
 * ```
 */
export function IntentModal({
	size = "md",
	variant = "modal",
	open = false,
	title,
	intent = "custom",
	tone = "default",
	description,
	eyebrow,
	showCloseButton = true,
	closeLabel = "Close modal",
	onClose,
	className,
	actions,
	children,
	showIntentIcon = true,
	customIcon,
	preventBodyScroll = true,
	accent = "primary",
	...rest
}: IntentModalProps) {
	const descriptionId = React.useId();
	const titleId = React.useId();

	React.useEffect(() => {
		if (preventBodyScroll && (variant === "drawer" || variant === "modal")) {
			if (open) {
				document.body.style.setProperty("overflow", "hidden");
			} else {
				document.body.style.removeProperty("overflow");
			}
			return () => {
				document.body.style.removeProperty("overflow");
			};
		}
		return undefined;
	}, [open, variant, preventBodyScroll]);

	const { width, padding, gap } = SIZE_CONFIG[size];
	const intentIcon =
		customIcon ?? (showIntentIcon ? INTENT_ICONS[intent] : null);
	const hasCloseButton =
		showCloseButton && (variant === "modal" || variant === "drawer");
	const accentClasses: Record<IntentAccent, string> = {
		primary: "from-primary/50 to-primary/10 text-primary",
		emerald: "from-emerald-400/50 to-emerald-300/10 text-emerald-300",
		sky: "from-sky-400/50 to-sky-300/10 text-sky-300",
		amber: "from-amber-400/50 to-amber-300/10 text-amber-300",
		violet: "from-violet-400/50 to-violet-300/10 text-violet-300",
	};

	const containerContent = (
		<div
			className={cn(
				"group relative flex w-full flex-col text-left backdrop-blur-md supports-[backdrop-filter]:backdrop-blur",
				width,
				padding,
				gap,
				TONE_CLASSES[tone],
				"rounded-2xl border transition-shadow duration-300 ease-out",
				"before:-z-10 before:absolute before:inset-0 before:rounded-[18px] before:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_65%)]",
				variant === "drawer" && "sm:min-w-[24rem]",
				className,
			)}
			role={variant !== "inline" ? "dialog" : undefined}
			aria-modal={variant !== "inline" ? true : undefined}
			aria-labelledby={title ? titleId : undefined}
			aria-describedby={description ? descriptionId : undefined}
			{...rest}
		>
			{hasCloseButton && (
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
					aria-label={closeLabel}
				>
					<X className="h-4 w-4" aria-hidden="true" />
				</button>
			)}
			{eyebrow && (
				<span
					className={cn(
						"inline-flex items-center gap-2 font-semibold text-xs uppercase tracking-[0.28em]",
						"text-muted-foreground/80",
					)}
				>
					{eyebrow}
				</span>
			)}
			<div
				className={cn(
					"flex flex-col gap-3",
					hasCloseButton ? "pr-8 sm:pr-10" : "",
				)}
			>
				{title && (
					<h3
						id={titleId}
						className="flex items-center gap-3 text-left font-semibold text-lg md:text-xl"
					>
						{intentIcon && (
							<span
								aria-hidden="true"
								className={cn(
									"inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-base shadow-sm md:h-10 md:w-10",
									accentClasses[accent],
								)}
							>
								{intentIcon}
							</span>
						)}
						{title}
					</h3>
				)}
				{description ? (
					<p id={descriptionId} className="text-muted-foreground/90 text-sm">
						{description}
					</p>
				) : null}
				{children}
			</div>
			{actions ? (
				<div className="mt-4 flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
					{actions}
				</div>
			) : null}
		</div>
	);

	if (variant === "inline") {
		return containerContent;
	}

	if (!open) {
		return null;
	}

	const overlayInteractiveProps = onClose
		? ({
				role: "button",
				tabIndex: 0,
				"aria-label": "Dismiss modal",
				onClick: onClose,
				onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						onClose();
					}
				},
			} satisfies React.HTMLAttributes<HTMLDivElement>)
		: {};

	const overlay = (
		<div
			className="fixed inset-0 z-[9998] bg-background/75 backdrop-blur-sm transition-opacity"
			{...overlayInteractiveProps}
		/>
	);

	if (variant === "modal") {
		return (
			<>
				{overlay}
				<div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 sm:px-0">
					{containerContent}
				</div>
			</>
		);
	}

	// Drawer variant
	return (
		<>
			{overlay}
			<div className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center px-4 pb-6 sm:pb-8">
				<div className="w-full max-w-3xl transition-transform duration-300 ease-out">
					{containerContent}
				</div>
			</div>
		</>
	);
}
