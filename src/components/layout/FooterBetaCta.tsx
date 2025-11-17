"use client";

import {
	FOUNDERS_CIRCLE_DEADLINE,
	FOUNDERS_CIRCLE_DEADLINE_ISO,
} from "@/constants/foundersCircleDeadline";
import { useCountdown } from "@/hooks/useCountdown";
import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

/**
 * FooterBetaCta renders the footer CTA with the Founders Circle countdown.
 */
export function FooterBetaCta({ className = "" }: { className?: string }) {
	const hasMounted = useHasMounted();
	const countdown = useCountdown({ targetTimestamp: FOUNDERS_CIRCLE_DEADLINE });
	const isClosed = hasMounted ? countdown.isExpired : false;
	const countdownLabel = hasMounted
		? `Closes in ${countdown.formatted}`
		: "Closes soon";

	return (
		<div
			className={cn(
				"flex w-full flex-col items-center gap-2 text-center sm:gap-3 md:items-center md:text-center lg:items-start lg:text-left",
				className,
			)}
		>
			<div
				className="flex w-full flex-col items-center gap-1 font-semibold text-primary text-sm md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-2 dark:text-emerald-200"
				aria-live="polite"
			>
				<span className="text-primary/80 text-xs uppercase tracking-[0.12em] md:text-sm dark:text-emerald-200/80">
					Founders Circle
				</span>
				{isClosed ? (
					<span className="font-medium text-primary/70 text-xs md:text-sm dark:text-emerald-200/70">
						Applications closed
					</span>
				) : (
					<time
						dateTime={FOUNDERS_CIRCLE_DEADLINE_ISO}
						className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-primary/15 px-3 py-1 font-mono font-semibold text-primary text-xs uppercase tracking-[0.1em] shadow-sm md:text-sm dark:bg-emerald-200/10 dark:text-emerald-200"
					>
						{countdownLabel}
					</time>
				)}
			</div>
			<p className="text-muted-foreground text-xs md:mx-auto md:max-w-xs md:text-sm dark:text-white/60">
				Try DealScale free before public launch and help shape the roadmap.
			</p>
			<div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:gap-3 md:w-full md:flex-row md:justify-center md:gap-3 lg:w-auto lg:justify-start">
				<Link
					href="/contact?utm_source=founders-circle-footer"
					className="flex w-full justify-center lg:w-auto lg:justify-start"
				>
					<Button className="flex w-full items-center justify-center bg-gradient-to-r from-primary to-focus text-black transition-opacity hover:opacity-90 md:w-auto dark:text-white">
						Request Early Access <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</Link>
				<a
					href="https://discord.gg/BNrsYRPtFN"
					target="_blank"
					rel="noopener noreferrer"
					className="flex w-full justify-center lg:w-auto lg:justify-start"
				>
					<Button
						variant="outline"
						className="flex w-full items-center justify-center border-primary/40 bg-background/70 text-primary transition hover:bg-primary/10 lg:w-auto"
					>
						Join Community <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</a>
			</div>
		</div>
	);
}
