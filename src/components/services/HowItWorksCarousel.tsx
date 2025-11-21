"use client";

import ClientLottie from "@/components/ui/ClientLottie";
import type { ServiceHowItWorks } from "@/types/service/services";
import type { LottieRefCurrentProps } from "lottie-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * Props for HowItWorksCarousel component.
 */
interface HowItWorksCarouselProps {
	howItWorks: ServiceHowItWorks[];
	/**
	 * Lottie animation data (JSON). Provide the animation to be shown for all steps.
	 */
	lottieData?: object;
	/**
	 * Interval (ms) for auto-advancing the carousel. Default: 3000ms.
	 */
	autoAdvanceInterval?: number;
}

/**
 * Carousel for "How It Works" steps with Lottie animation progress synced to current step.
 *
 * - Uses custom navigation for navigation and auto-advance.
 * - Uses ClientLottie for SSR-safe animation.
 * - Progress increments by step (e.g., step 2/4 = 50%).
 */
const HowItWorksCarousel: React.FC<HowItWorksCarouselProps> = ({
	howItWorks,
	lottieData,
	autoAdvanceInterval = 3000,
}) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [autoAdvance, setAutoAdvance] = useState(true);
	const [isMounted, setIsMounted] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const stepsCount = howItWorks.length;

	// Default Lottie animation import
	const defaultLottieData = require("@/assets/animations/processSteps.json");

	// Use default animation if none provided
	const animationData = lottieData || defaultLottieData;

	// Effect to handle client-side mounting. This prevents SSR issues.
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Auto-advance logic
	useEffect(() => {
		if (!autoAdvance || stepsCount <= 1) return;
		intervalRef.current = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % stepsCount);
		}, autoAdvanceInterval);
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [stepsCount, autoAdvanceInterval, autoAdvance]);

	// This is the single source of truth for controlling the animation frame.
	useEffect(() => {
		// Don't do anything until the Lottie player is mounted and ready.
		if (!isMounted || !lottieRef.current) return;

		const totalFrames = lottieRef.current.getDuration(true);
		let targetFrame = 0;

		// For any step other than the first, calculate the new frame.
		if (activeIndex > 0 && stepsCount > 1) {
			const progress = activeIndex / (stepsCount - 1);
			targetFrame = Math.round(progress * (totalFrames - 1));
		}

		// Go to the calculated frame. For the first step, this will be 0.
		lottieRef.current.goToAndStop(targetFrame, true);
	}, [activeIndex, stepsCount, isMounted]);

	// Stop auto-advance on user interaction
	const stopAutoAdvance = () => setAutoAdvance(false);

	// Navigation handlers
	const goToStep = (idx: number) => {
		stopAutoAdvance();
		setActiveIndex(idx);
	};
	const prevStep = () => {
		stopAutoAdvance();
		setActiveIndex((prev) => (prev - 1 + stepsCount) % stepsCount);
	};
	const nextStep = () => {
		stopAutoAdvance();
		setActiveIndex((prev) => (prev + 1) % stepsCount);
	};

	return (
		<div className="flex w-full flex-col items-center gap-8">
			{/* Step card and Lottie side by side on desktop */}
			<div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
				{/* Step content card */}
				<div className="flex min-h-[320px] max-w-xl flex-1 flex-col items-center justify-center rounded-2xl border border-primary/10 bg-card p-8 shadow-xl">
					<div className="mb-4 flex flex-col items-center gap-2">
						<span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-card-foreground text-xl shadow">
							{howItWorks[activeIndex].stepNumber}
						</span>
						<h4 className="mt-2 mb-1 text-center font-semibold text-2xl text-primary">
							{howItWorks[activeIndex].title}
						</h4>
						<p className="mb-2 text-center text-base text-muted-foreground">
							{howItWorks[activeIndex].subtitle}
						</p>
					</div>
					<p className="mb-4 max-w-xs text-center text-muted-foreground">
						{howItWorks[activeIndex].description}
					</p>
				</div>
				{/* Lottie animation on the right */}
				<div className="flex w-full flex-1 items-center justify-center md:w-auto">
					<div className="flex h-72 w-72 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-background/10 p-4 shadow-lg">
						<div className="h-full w-full p-2">
							{isMounted && (
								<ClientLottie
									lottieRef={lottieRef}
									animationData={animationData}
									loop={false}
									autoplay={false}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Navigation */}
			<div className="mt-4 flex w-full max-w-lg items-center justify-between px-4">
				<button
					onClick={prevStep}
					disabled={activeIndex === 0}
					type="button"
					className={`flex h-10 w-10 items-center justify-center rounded-full p-0 shadow-md transition-colors ${activeIndex === 0 ? "cursor-not-allowed bg-primary/30 text-card-foreground" : "bg-primary text-card-foreground hover:bg-primary/80"}`}
					aria-label="Previous step"
				>
					<svg
						width={24}
						height={24}
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-arrow-left"
					>
						<line x1="19" y1="12" x2="5" y2="12" />
						<polyline points="12 19 5 12 12 5" />
					</svg>
				</button>
				<div className="flex gap-2">
					{howItWorks.map((_, i) => (
						<button
							key={uuidv4()}
							type="button"
							onClick={() => goToStep(i)}
							className={`h-3 w-3 rounded-full transition-all duration-200 ${i === activeIndex ? "w-6 bg-primary" : "bg-gray-400"}`}
							aria-label={`Go to item ${i + 1}`}
						/>
					))}
				</div>
				<button
					type="button"
					onClick={nextStep}
					disabled={activeIndex === stepsCount - 1}
					className={`flex h-10 w-10 items-center justify-center rounded-full p-0 shadow-md transition-colors ${activeIndex === stepsCount - 1 ? "cursor-not-allowed bg-primary/30 text-card-foreground" : "bg-primary text-card-foreground hover:bg-primary/80"}`}
					aria-label="Next step"
				>
					<svg
						width={24}
						height={24}
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-arrow-right"
					>
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default HowItWorksCarousel;
