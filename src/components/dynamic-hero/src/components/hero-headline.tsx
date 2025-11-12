"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { AvatarCircles } from "@/components/ui/avatar-circles";
import { Globe } from "@/components/ui/globe";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { DEFAULT_HERO_SOCIAL_PROOF } from "../fixtures/social-proof";
import type {
	HeroSocialProof,
	HeroSocialProofReview,
} from "../types/social-proof";
import type { ResolvedHeroCopy } from "../utils/copy";

import styles from "../styles/hero-headline.module.css";

const PROBLEM_INTERVAL_MS = 8200;
const SOLUTION_INTERVAL_MS = 10200;
const FEAR_INTERVAL_MS = 9400;
const baseSpanAnimation = {
	initial: { opacity: 0, y: -10, filter: "blur(6px)" },
	animate: { opacity: 1, y: 0, filter: "blur(0px)" },
	exit: { opacity: 0, y: 10, filter: "blur(8px)" },
	transition: { duration: 0.46, ease: "easeInOut" as const },
};

interface HeroHeadlineProps {
	readonly copy: ResolvedHeroCopy;
	readonly className?: string;
	readonly socialProof?: HeroSocialProof;
	readonly showSocialProof?: boolean;
	readonly showChips?: boolean;
	readonly showPersonaChip?: boolean;
	readonly personaLabel?: string;
	readonly personaDescription?: string;
	readonly reviews?: HeroSocialProofReview[];
}

export function HeroHeadline({
	copy,
	className,
	socialProof,
	showSocialProof = true,
	showChips = true,
	showPersonaChip = true,
	personaLabel,
	personaDescription,
	reviews,
}: HeroHeadlineProps): JSX.Element {
	const problems = useMemo(() => {
		const source = copy.rotations?.problems ?? [copy.values.problem];
		const cleaned = source
			.map((phrase, index) => ({
				index,
				text: phrase?.trim() ?? "",
			}))
			.filter((entry, position, arr) => {
				if (!entry.text.length) {
					return false;
				}
				const firstMatch = arr.find(
					(other) => other.text.toLowerCase() === entry.text.toLowerCase(),
				);
				return firstMatch?.index === entry.index;
			})
			.map((entry) => entry.text);
		return cleaned.length ? cleaned : [copy.values.problem.trim()];
	}, [copy.rotations?.problems, copy.values.problem]);
	const solutions = useMemo(
		() => copy.rotations?.solutions ?? [copy.values.solution],
		[copy.rotations?.solutions, copy.values.solution],
	);
	const fears = useMemo(
		() => copy.rotations?.fears ?? [copy.values.fear],
		[copy.rotations?.fears, copy.values.fear],
	);

	const problemIndex = useRotatingIndex(problems, PROBLEM_INTERVAL_MS);
	const solutionIndex = useRotatingIndex(solutions, SOLUTION_INTERVAL_MS);
	const fearIndex = useRotatingIndex(fears, FEAR_INTERVAL_MS);

	const problemText =
		problems[problemIndex]?.trim() ?? problems[0]?.trim() ?? "";
	const solutionText =
		solutions[solutionIndex]?.trim() ?? solutions[0]?.trim() ?? "";
	const fearText = fears[fearIndex]?.trim() ?? fears[0]?.trim() ?? "";
	const problemDisplayText =
		problemText.length > 0
			? `${problemText[0]?.toUpperCase() ?? ""}${problemText.slice(1)}`
			: problemText;

	if (process.env.NODE_ENV !== "production") {
		// eslint-disable-next-line no-console
		console.debug("[HeroHeadline] flip state", {
			problems: problems.join(" | "),
			problemIndex,
			problemText,
			solutionIndex,
			solutionText,
			fearIndex,
			fearText,
		});
	}

	const proof = socialProof ?? DEFAULT_HERO_SOCIAL_PROOF;
	const primaryChip = copy.chips?.primary;
	const secondaryChip = copy.chips?.secondary;

	const personaChipLabel =
		personaLabel ?? copy.chips?.primary?.label ?? "AI Sellers";
	const personaChipTitle =
		personaDescription ??
		(personaChipLabel ? `${personaChipLabel} persona` : undefined);
	return (
		<div
			className={cn(
				"relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center",
				className,
			)}
		>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" />

			<div className="relative z-10 flex w-full flex-col items-center gap-6 text-center">
				{showChips && (primaryChip || secondaryChip) ? (
					<TooltipProvider>
						<div className={styles.tagRow}>
							{primaryChip ? (
								<Tooltip delayDuration={150}>
									<TooltipTrigger asChild>
										<span className={styles.tag}>{primaryChip.label}</span>
									</TooltipTrigger>
									{primaryChip.label ? (
										<TooltipContent side="top" className="text-xs">
											{`${primaryChip.label} program`}
										</TooltipContent>
									) : null}
								</Tooltip>
							) : null}
							{secondaryChip ? (
								<Tooltip delayDuration={150}>
									<TooltipTrigger asChild>
										<span className={cn(styles.tag, styles.tagSecondary)}>
											{secondaryChip.label}
										</span>
									</TooltipTrigger>
									{secondaryChip.label ? (
										<TooltipContent side="top" className="text-xs">
											{`${secondaryChip.label} focus`}
										</TooltipContent>
									) : null}
								</Tooltip>
							) : null}
						</div>
					</TooltipProvider>
				) : null}

				{showPersonaChip && personaChipLabel ? (
					<TooltipProvider>
						<div className={styles.personaWrapper}>
							<Tooltip delayDuration={150}>
								<TooltipTrigger asChild>
									<span className={cn(styles.tag, styles.tagPersona)}>
										{personaChipLabel}
									</span>
								</TooltipTrigger>
								{personaChipTitle ? (
									<TooltipContent side="bottom" className="text-xs">
										{personaChipTitle}
									</TooltipContent>
								) : null}
							</Tooltip>
						</div>
					</TooltipProvider>
				) : null}

				<div className="h-px w-20 bg-gradient-to-r from-transparent via-primary/60 to-transparent md:w-32" />
				<motion.h1
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.24 }}
				className={cn(
					styles.heroHeadline,
					"text-balance font-semibold text-slate-900 dark:text-white",
				)}
				>
					<span className={styles.heroHeadlineBlock}>
						Stop{" "}
						<AnimatePresence mode="wait" initial={false}>
							<motion.span
								key={`${problemIndex}-${problemDisplayText}`}
								{...baseSpanAnimation}
								className={cn(
									styles.heroHeadlineAccent,
									styles.heroHeadlineAccentPersona,
								)}
							>
								{problemDisplayText}
							</motion.span>
						</AnimatePresence>
					</span>
					<span className={styles.heroHeadlineBlock}>
						Start{" "}
						<AnimatePresence mode="sync" initial={false}>
							<motion.span
								key={`${solutionIndex}-${solutionText}`}
								{...baseSpanAnimation}
								className={cn(
									styles.heroHeadlineAccent,
									styles.heroHeadlineAccentAction,
								)}
							>
								{solutionText}
							</motion.span>
						</AnimatePresence>
					</span>
					<span className={styles.heroHeadlineBlock}>
						Before{" "}
						<AnimatePresence mode="sync" initial={false}>
							<motion.span
								key={`${fearIndex}-${fearText}`}
								{...baseSpanAnimation}
								className={cn(
									styles.heroHeadlineAccent,
									styles.heroHeadlineAccentRisk,
								)}
							>
								{fearText}
							</motion.span>
						</AnimatePresence>
					</span>
				</motion.h1>

				{copy.subtitle ? (
					<motion.p
						initial={{ opacity: 0, y: 4 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
						className="max-w-2xl text-balance text-base text-muted-foreground drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] md:text-lg"
					>
						{copy.subtitle}
					</motion.p>
				) : null}

				{showSocialProof && proof.avatars.length ? (
					<div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
						<AvatarCircles
							avatarUrls={proof.avatars}
							numPeople={proof.numPeople}
							className="justify-center"
						/>
						{proof.caption ? (
							<p className="max-w-xl text-center font-semibold text-foreground/90 text-xs uppercase tracking-[0.28em] drop-shadow-[0_1px_6px_rgba(21,94,255,0.45)] dark:text-white">
								{proof.caption}
							</p>
						) : null}
					</div>
				) : null}
			</div>
		</div>
	);
}

function useRotatingIndex(items: readonly string[], interval: number): number {
	const [index, setIndex] = useState(0);
	const length = items.length;

	// biome-ignore lint/correctness/useExhaustiveDependencies: rotation strings are tracked via array identity
	useEffect(() => {
		setIndex(0);
	}, [items]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: the rotation payload is keyed off the incoming array
	useEffect(() => {
		if (length <= 1) {
			return;
		}
		const timer = setInterval(
			() => setIndex((current) => (current + 1) % length),
			interval,
		);
		return () => clearInterval(timer);
	}, [interval, items, length]);

	if (length === 0) {
		return 0;
	}

	return index % length;
}
