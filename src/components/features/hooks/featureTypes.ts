import type { Category } from "@/types/case-study";
import type { JSX } from "react";
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
	categories: Category[];
	activeCategory: string | "all" | "";
	CategoryFilter: () => JSX.Element;
	loading: boolean;
	handleVote: (featureId: string, voteType: "up" | "down") => Promise<boolean>;
	isVotingInProgress: (featureId: string) => boolean;
}
