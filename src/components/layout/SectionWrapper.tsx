"use client";

import type { ReactNode } from "react";
import { Fragment, useEffect } from "react";

import { ViewportLazy } from "@/components/common/ViewportLazy";
import { cn } from "@/lib/utils";

const SectionSkeleton = ({ label }: { label?: string }) => (
	<div
		aria-hidden="true"
		className="min-h-[22rem] w-full rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950/40 via-slate-900/40 to-slate-950/50 p-6 dark:from-white/5 dark:via-white/10 dark:to-white/5"
	>
		<div className="flex h-full flex-col justify-center gap-6">
			<div className="space-y-3">
				<div className="h-3 w-32 animate-pulse rounded-full bg-white/30 dark:bg-white/20" />
				<div className="h-8 w-1/2 animate-pulse rounded-full bg-white/40 dark:bg-white/30" />
				<div className="h-4 w-2/3 animate-pulse rounded-full bg-white/20 dark:bg-white/10" />
			</div>
			{label ? (
				<div className="font-semibold text-white/50 text-xs uppercase tracking-[0.3em]">
					{label}
				</div>
			) : null}
		</div>
	</div>
);

type SectionWrapperProps = {
	id?: string;
	className?: string;
	children: ReactNode;
	lazy?: boolean;
	rootMargin?: string;
	fallback?: ReactNode;
	fallbackLabel?: string;
};

const SECTION_WRAPPER_ENABLED =
	process.env.NEXT_PUBLIC_SECTION_WRAPPER_ENABLED !== "false";

export function SectionWrapper({
	id,
	className,
	children,
	lazy = true,
    rootMargin = "1200px",
	fallback,
	fallbackLabel,
}: SectionWrapperProps) {
	useEffect(() => {
		console.log("[SectionWrapper] mounted", id ?? "unnamed-section");
	}, [id]);

	const shouldLazy = SECTION_WRAPPER_ENABLED && lazy;
	const WrapperComponent = className || id ? "section" : Fragment;
	const wrapperProps =
		WrapperComponent === Fragment
			? {}
			: {
					id,
					className: cn(className),
				};

	const resolvedFallback = fallback ?? (
		<SectionSkeleton label={fallbackLabel ?? id ?? undefined} />
	);

	return (
		<WrapperComponent {...wrapperProps}>
			{shouldLazy ? (
				<ViewportLazy rootMargin={rootMargin} fallback={resolvedFallback}>
					{children}
				</ViewportLazy>
			) : (
				children
			)}
		</WrapperComponent>
	);
}
