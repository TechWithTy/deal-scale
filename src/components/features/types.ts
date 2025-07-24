export interface FeatureRequest {
	id: string;
	title: string;
	description: string;
	status: string;
	upvotes: number;
	created_at: string;
	userVote?: "up" | "down" | null;
	iconIndex?: number; // * Optional: which icon to show (0-4)
}
