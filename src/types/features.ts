/**
 * Features and voting system type definitions
 */

export type FeatureStatus =
	| "planned"
	| "under_review"
	| "in_development"
	| "testing"
	| "released"
	| "cancelled";
export type VoteSource = "beta_program" | "pilot_program" | "admin" | "user";

export interface Feature {
	id: string;
	slug: string;
	title: string;
	description: string;
	status: FeatureStatus;
	tags: string[];
	votes_total: number;
	votes_weighted: number;
	priority_score: number;
	estimated_effort?: string;
	target_release?: string;
	created_at: string;
	updated_at: string;
	metadata?: Record<string, unknown>;
}

export interface FeatureCatalogResponse {
	features: Feature[];
	total_count: number;
	page: number;
	per_page: number;
}

export interface VotingStatsResponse {
	total_features: number;
	total_votes: number;
	total_voters: number;
	most_requested_feature: string;
	voting_trends?: Record<string, unknown>;
}

export interface Vote {
	id: string;
	user_id: string;
	feature_id: string;
	weight: number;
	source: VoteSource;
	tester_type?: string;
	comment?: string;
	created_at: string;
	updated_at: string;
	metadata?: Record<string, unknown>;
}

export interface VoteRequest {
	feature_id: string;
	comment?: string;
	user_id?: string;
}

export interface VoteResponse {
	success: boolean;
	message: string;
	vote: Vote;
	feature_votes_total: number;
}

export interface UserVotesResponse {
	votes: Vote[];
	total_votes: number;
}

export interface FeatureCatalogQueryParams {
	status_filter?: FeatureStatus[];
	page?: number;
	per_page?: number;
}
