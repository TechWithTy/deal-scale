import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { MutableRefObject } from "react";
import type React from "react";
import FeatureCard from "./FeatureCard";
import type { FeatureRequest } from "./types";
import { useAutoScrollFeatures } from "./useAutoScrollFeatures";
import { useDraggableScroll } from "./utils/useDragableScroll"; // * Adds drag/swipe-to-scroll UX

interface FeaturesListProps {
	features: FeatureRequest[];
	loading: boolean;
	onVote: (featureId: string, voteType: "up" | "down") => void;
	isVotingInProgress: (featureId: string) => boolean;
	scrollRef: React.RefObject<HTMLDivElement>;
	pausedRef: MutableRefObject<boolean>;
}

function isMobileDevice() {
	if (typeof navigator === "undefined") return false;
	return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	);
}

const usePaused = (pausedRef: MutableRefObject<boolean>) => {
	// No-op on mobile: always return true
	if (isMobileDevice()) return true;
	return useSyncExternalStore(
		(cb) => {
			const interval = setInterval(cb, 100);
			return () => clearInterval(interval);
		},
		() => pausedRef.current,
		() => true, // getServerSnapshot for SSR: always paused on server
	);
};

const FeaturesList = ({
	features,
	loading,
	onVote,
	isVotingInProgress,
	scrollRef,
	pausedRef,
}: FeaturesListProps) => {
	useAutoScrollFeatures(scrollRef, pausedRef);
	useDraggableScroll(scrollRef, pausedRef); // * Enables swipe/drag-to-scroll for all users
	// * If you need to customize drag UX, see useDraggableScroll.ts

	useEffect(() => {
		if (
			isMobileDevice() &&
			pausedRef &&
			typeof pausedRef.current !== "undefined"
		) {
			pausedRef.current = true;
		}
	}, [pausedRef]);

	// * Robust touch lock for mobile pause/resume
	const touchActiveRef = useRef(false);

	const handlePause = () => {
		if (pausedRef && typeof pausedRef.current !== "undefined") {
			pausedRef.current = true;
		}
	};

	const handleResume = () => {
		// Only resume if no touch is active
		if (
			!touchActiveRef.current &&
			pausedRef &&
			typeof pausedRef.current !== "undefined"
		) {
			pausedRef.current = false;
		}
	};

	const handleTouchStart = () => {
		touchActiveRef.current = true;
		if (pausedRef && typeof pausedRef.current !== "undefined") {
			pausedRef.current = true;
		}
	};

	const handleTouchEnd = () => {
		touchActiveRef.current = false;
		if (pausedRef && typeof pausedRef.current !== "undefined") {
			pausedRef.current = false;
		}
	};

	const handleTouchCancel = handleTouchEnd;

	// Visual indicator for pause/resume
	const isPaused = usePaused(pausedRef);

	if (loading) {
		return (
			<div
				className="flex gap-4 overflow-x-auto pb-4"
				aria-busy="true"
				aria-label="Loading features list"
			>
				{[1, 2, 3, 4].map((i) => (
					<Card
						key={i}
						className="min-w-[300px] max-w-[300px] flex-shrink-0 shadow-sm"
					>
						<CardHeader className="pb-2">
							<Skeleton className="mb-2 h-6 w-3/4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="mb-2 h-4 w-full" />
							<Skeleton className="mb-2 h-4 w-5/6" />
							<Skeleton className="h-4 w-4/6" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<section
			ref={scrollRef}
			className="relative flex gap-4 overflow-x-auto scroll-smooth pb-4"
			aria-label="Upcoming features list. Swipe or drag to scroll."
			// ! Drag/swipe-to-scroll handled by useDraggableScroll
			style={{ outline: "none" }} // * Remove default focus outline
		>
			{/* Visual indicator badge */}
			{/* <div
          className="absolute right-4 top-2 z-10 flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-2 py-1 text-xs font-semibold shadow"
          aria-live="polite"
        >
          {isPaused ? (
            <Pause className="h-4 w-4 text-yellow-600" />
          ) : (
            <Play className="h-4 w-4 text-green-600" />
          )}
          <span className={isPaused ? "text-yellow-700" : "text-green-700"}>
            {isPaused ? "Auto - Paused" : "Auto-Scroll"}
          </span>
        </div> */}
			{/* Sort features from most to least upvotes */}
			{[...features]
				.sort((a, b) => b.upvotes - a.upvotes)
				.map((feature) => (
					<FeatureCard
						key={feature.id}
						feature={feature}
						onVote={onVote}
						isVoting={isVotingInProgress(feature.id)}
						isTopFeature={
							feature.upvotes === Math.max(...features.map((f) => f.upvotes))
						}
						iconIndex={feature.iconIndex}
					/> // * Drag/swipe handled at container level
				))}
		</section>
	);
};

export default FeaturesList;
