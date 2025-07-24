import type { FeatureRequest } from "../types";

export interface FeatureVote {
	feature_id: string;
	vote_type: "up" | "down";
}

export interface VoteResponse {
	success: boolean;
	upvotes: number;
	userVote: "up" | "down" | null;
	error?: string;
}

export interface FeatureHookReturn {
	features: FeatureRequest[];
	loading: boolean;
	handleVote: (featureId: string, voteType: "up" | "down") => Promise<void>;
	isVotingInProgress: (featureId: string) => boolean;
}
