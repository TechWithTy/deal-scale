import type { VoteResponse } from "../hooks/featureTypes";
import type { FeatureRequest } from "../types";

export const getVoteMessage = (
	originalVote: "up" | "down" | null | undefined,
	newVote: "up" | "down" | null,
): string => {
	if (originalVote === newVote) {
		return "Your vote was removed";
	}

	if (newVote) {
		return `You ${newVote}voted this feature`;
	}

	return "Your vote was recorded";
};

export const mergeUserVotesWithFeatures = (
	features: FeatureRequest[],
	userVotes: { feature_id: string; vote_type: string }[],
): FeatureRequest[] => {
	return features.map((feature) => {
		const userVote = userVotes.find((vote) => vote.feature_id === feature.id);
		return {
			...feature,
			userVote: userVote ? (userVote.vote_type as "up" | "down") : null,
		};
	});
};

export const updateFeatureAfterVote = (
	features: FeatureRequest[],
	featureId: string,
	response: VoteResponse,
): FeatureRequest[] => {
	return features.map((feature) => {
		if (feature.id === featureId) {
			// Use the exact upvotes count from the server response
			return {
				...feature,
				upvotes: response.upvotes,
				userVote: response.userVote,
			};
		}
		return feature;
	});
};
