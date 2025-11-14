"use client";
import { type MutableRefObject, useRef } from "react";
import Header from "../common/Header";
import FeaturesList from "../features/FeaturesList";
import { useFeatures } from "../features/useFeatures";

const UpcomingFeatures = () => {
	const { features, loading, handleVote, isVotingInProgress, CategoryFilter } =
		useFeatures();
	const scrollRef = useRef<HTMLDivElement>(null);
	const pausedRef: MutableRefObject<boolean> = useRef(false);

	return (
		<section id="upcoming-features">
			<div className="container mx-auto px-4">
				<div className="mb-10 text-center">
					<Header
						title="Vote On Upcoming Features"
						subtitle="Help us prioritize what to build next by voting on your favorite ideas"
						size="lg"
						className="mb-12 md:mb-16"
					/>
				</div>
				<div className="mx-auto mb-8 max-w-4xl">
					<CategoryFilter />
				</div>

				<FeaturesList
					features={features}
					loading={loading}
					onVote={handleVote}
					isVotingInProgress={isVotingInProgress}
					scrollRef={scrollRef}
					pausedRef={pausedRef}
				/>
			</div>
		</section>
	);
};

export default UpcomingFeatures;
