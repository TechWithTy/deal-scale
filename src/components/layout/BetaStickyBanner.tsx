"use client";

import { FOUNDERS_CIRCLE_DEADLINE } from "@/constants/foundersCircleDeadline";
import { useCountdown } from "@/hooks/useCountdown";
import Link from "next/link";

/**
 * BetaStickyBanner renders the Founders Circle beta CTA with a live countdown.
 *
 * @example
 * ```tsx
 * <StickyBanner>
 *   <BetaStickyBanner />
 * </StickyBanner>
 * ```
 */
export function BetaStickyBanner() {
	const countdown = useCountdown({ targetTimestamp: FOUNDERS_CIRCLE_DEADLINE });
	const isClosed = countdown.isExpired;

	return (
		<div className="flex w-full flex-col items-center gap-2 text-center text-xs sm:text-sm md:flex-row md:items-center md:justify-between md:gap-4 md:text-left">
			<div className="flex flex-col items-center gap-1 text-center md:flex-row md:items-center md:gap-3 md:text-left">
				<span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold text-white tracking-wide backdrop-blur-sm dark:bg-white/15">
					<span className="hidden whitespace-nowrap text-[0.65rem] text-primary-foreground/80 uppercase tracking-[0.18em] md:inline">
						🆓 5 AI Credits
					</span>
					<span className="whitespace-nowrap text-white text-xs uppercase tracking-[0.12em]">
						Founders Circle Access
					</span>
				</span>
				<p className="text-white/80 text-xs sm:text-sm md:text-sm lg:text-base dark:text-white/70">
					Try DealScale free before public launch.
				</p>
			</div>

			<div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center md:w-auto md:flex-wrap md:justify-end md:gap-2 lg:flex-nowrap lg:gap-3">
				<span
					className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 font-mono font-semibold text-[0.7rem] text-emerald-100 uppercase tracking-[0.18em] shadow-sm md:text-[0.68rem] md:leading-none lg:text-xs"
					aria-live="polite"
					aria-label={
						isClosed
							? "Founders Circle applications have closed."
							: `Founders Circle applications close in ${countdown.formatted}.`
					}
				>
					{isClosed
						? "Applications closed"
						: `Closes in ${countdown.formatted}`}
				</span>
				<Link
					className="inline-flex w-full min-w-[10rem] items-center justify-center rounded-full bg-white px-4 py-2 font-semibold text-black text-xs transition hover:bg-white/90 sm:w-auto sm:px-5 sm:text-sm md:text-xs lg:text-sm"
					href="/contact?utm_source=founders-circle"
				>
					Request Early Access
				</Link>
			</div>
		</div>
	);
}
