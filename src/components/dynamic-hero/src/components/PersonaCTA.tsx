"use client";

import type { FC, ReactNode } from "react";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Pointer } from "@/components/ui/pointer";
import { cn } from "@/lib/utils";

import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";

const ctaButtonSchema = z.object({
	label: z.string().min(1).max(50),
	ariaLabel: z.string().optional(),
	emphasis: z.enum(["solid", "outline", "ghost"]).default("solid"),
	description: z.string().min(1).max(100).optional(),
	badge: z.string().max(24).optional(),
});

type PersonaCTAButton = z.infer<typeof ctaButtonSchema>;

type PersonaCTADisplayMode = "primary" | "secondary" | "both";

interface PersonaCTAProps {
	readonly primary: PersonaCTAButton;
	readonly secondary?: PersonaCTAButton;
	readonly microcopy?: string;
	readonly orientation?: "vertical" | "horizontal";
	readonly displayMode?: PersonaCTADisplayMode;
	readonly onPrimaryClick?: () => void;
	readonly onSecondaryClick?: () => void;
	readonly className?: string;
	readonly primaryLoading?: boolean;
}

const buttonVariantForEmphasis = (
	emphasis: PersonaCTAButton["emphasis"],
): "default" | "secondary" | "ghost" => {
	if (emphasis === "outline") {
		return "secondary";
	}

	if (emphasis === "ghost") {
		return "ghost";
	}

	return "default";
};

const PersonaCTA: FC<PersonaCTAProps> = ({
	primary,
	secondary,
	microcopy,
	displayMode = "primary",
	onPrimaryClick,
	onSecondaryClick,
	className,
	orientation = "vertical",
	primaryLoading = false,
}) => {
	const shouldRenderPrimary = displayMode !== "secondary";
	const shouldRenderSecondary =
		displayMode !== "primary" && secondary !== undefined;
	const isHorizontal = orientation === "horizontal";
	const stackClasses = isHorizontal
		? "grid w-full max-w-3xl grid-cols-1 items-stretch justify-center gap-4 sm:gap-5 md:[grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] md:gap-6"
		: "flex w-full max-w-3xl flex-col items-stretch justify-center gap-4";
	const contentAlignment = isHorizontal
		? "items-center text-center md:items-center md:text-center"
		: "items-center text-center";
	const secondaryCopy = useMemo(() => secondary, [secondary]);

	const renderMicrocopy = useCallback((copy?: string): ReactNode[] | null => {
		if (!copy) {
			return null;
		}
		const elements: ReactNode[] = [];
		let lastIndex = 0;
		const linkRegex = /<link\s+href="([^"]+)">(.*?)<\/link>/gi;
		let match: RegExpExecArray | null = linkRegex.exec(copy);

		while (match !== null) {
			const [fullMatch, href, text] = match;
			if (match.index > lastIndex) {
				elements.push(copy.slice(lastIndex, match.index));
			}
			elements.push(
				<span
					key={`cta-link-${match.index}`}
					className={cn("inline-flex", "items-center", "relative")}
				>
					<a
						href={href}
						className={cn(
							"bg-primary/10",
							"font-semibold",
							"gap-1",
							"hover:bg-primary/15",
							"inline-flex",
							"items-center",
							"no-underline",
							"px-2.5",
							"py-1",
							"relative",
							"rounded-full",
							"text-primary",
							"text-sm",
							"transition",
						)}
					>
						{text}
					</a>
					<Pointer
						className="text-primary"
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 0.9, scale: 1 }}
						exit={{ opacity: 0, scale: 0 }}
						transition={{ type: "spring", stiffness: 160, damping: 20 }}
					/>
				</span>,
			);
			lastIndex = match.index + fullMatch.length;
			match = linkRegex.exec(copy);
		}
		if (lastIndex < copy.length) {
			elements.push(copy.slice(lastIndex));
		}
		return elements;
	}, []);

	const microcopyContent = useMemo(
		() => renderMicrocopy(microcopy),
		[microcopy, renderMicrocopy],
	);

	return (
		<div className={cn("flex flex-col items-center gap-6", className)}>
			<div className={cn(isHorizontal ? "w-full" : "", stackClasses)}>
				{shouldRenderPrimary && (
					<div
						className={cn(
							"relative w-full min-w-0",
							isHorizontal ? "md:min-w-[260px]" : "",
						)}
					>
						<Button
							variant={buttonVariantForEmphasis(primary.emphasis)}
							onClick={onPrimaryClick}
							aria-label={primary.ariaLabel ?? primary.label}
							aria-busy={primaryLoading}
							disabled={primaryLoading}
							data-testid="primary-cta"
							className={cn(
								"group relative flex h-full w-full flex-col justify-center gap-1 overflow-hidden rounded-3xl border-none px-6 py-5 text-primary-foreground shadow-[0_28px_60px_-20px_rgba(16,185,129,0.55)] transition",
								"bg-green-500",
								isHorizontal ? "sm:px-9 sm:py-6" : "",
								shouldRenderSecondary ? "ring-2 ring-emerald-200" : "",
								"whitespace-normal text-balance",
								contentAlignment,
								primaryLoading ? "cursor-wait opacity-80" : "",
							)}
						>
							{primary.badge ? (
								<span
									className={cn(
										"bg-white/20",
										"font-semibold",
										"inline-flex",
										"items-center",
										"justify-center",
										"px-3",
										"py-[4px]",
										"rounded-full",
										"shadow-[0_6px_20px_rgba(255,255,255,0.45)]",
										"text-[10px]",
										"text-white",
										"tracking-[0.28em]",
										"uppercase",
									)}
								>
									{primary.badge}
								</span>
							) : null}
							<span className={cn("font-semibold", "md:text-xl", "text-lg")}>
								{primary.label}
							</span>
							{primary.description ? (
								<span
									className={cn("text-emerald-50/90", "text-pretty", "text-sm")}
								>
									{primary.description}
								</span>
							) : null}
							<span
								className={cn(
									"-z-10",
									"absolute",
									"inset-0",
									"opacity-0",
									"transition",
									"group-hover:opacity-100",
								)}
							>
								<span
									className={cn(
										"absolute",
										"bg-gradient-to-br",
										"from-white/30",
										"inset-0",
										"to-transparent",
										"via-white/10",
									)}
								/>
							</span>
						</Button>
						<Pointer
							className="text-emerald-200"
							transition={{
								type: "spring",
								stiffness: 130,
								damping: 16,
							}}
						/>
					</div>
				)}
				{shouldRenderSecondary && secondaryCopy && (
					<div
						className={cn(
							"relative w-full min-w-0",
							isHorizontal ? "md:min-w-[260px]" : "",
						)}
					>
						<Button
							variant={buttonVariantForEmphasis(secondaryCopy.emphasis)}
							onClick={onSecondaryClick}
							aria-label={secondaryCopy.ariaLabel ?? secondaryCopy.label}
							className={cn(
								"relative flex h-full w-full flex-col justify-center gap-1 rounded-3xl border border-primary/25 bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-5 text-primary shadow-[0_12px_30px_-16px_rgba(37,99,235,0.3)] transition hover:border-primary/35",
								isHorizontal ? "sm:px-8 sm:py-5" : "",
								"backdrop-blur-md",
								"whitespace-normal text-balance",
								contentAlignment,
							)}
							data-testid="secondary-cta"
						>
							{secondaryCopy.badge ? (
								<span
									className={cn(
										"bg-primary/15",
										"font-semibold",
										"inline-flex",
										"items-center",
										"justify-center",
										"px-3",
										"py-[4px]",
										"rounded-full",
										"shadow-[0_4px_12px_rgba(31,141,255,0.3)]",
										"text-[10px]",
										"text-primary",
										"tracking-[0.25em]",
										"uppercase",
									)}
								>
									{secondaryCopy.badge}
								</span>
							) : null}
							<span
								className={cn(
									"font-semibold",
									"md:text-lg",
									"text-base",
									"text-primary/90",
								)}
							>
								{secondaryCopy.label}
							</span>
							{secondaryCopy.description ? (
								<span
									className={cn("text-pretty", "text-primary/75", "text-sm")}
								>
									{secondaryCopy.description}
								</span>
							) : null}
						</Button>
						<Pointer
							className="text-primary/90"
							transition={{
								type: "spring",
								stiffness: 120,
								damping: 14,
							}}
						/>
					</div>
				)}
			</div>
			{microcopyContent ? (
				<AnimatePresence mode="wait">
					<motion.p
						key={microcopy}
						initial={{ opacity: 0, y: 4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.2 }}
						className={cn(
							"max-w-xl",
							"text-balance",
							"text-center",
							"text-muted-foreground",
							"text-sm",
						)}
					>
						{microcopyContent}
					</motion.p>
				</AnimatePresence>
			) : null}
		</div>
	);
};

export default PersonaCTA;
