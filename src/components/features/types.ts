export interface FeatureRequest {
	id: string;
	title: string;
	description: string;
	status: string;
	category: string;
	categoryId: string;
	icpFocus: string;
	completeness: number;
	benefit?: string;
	priority?: string;
	toolUrl?: string;
	owner?: string;
	lastUpdated: string;
	created_at: string;
	updated_at?: string;
	upvotes: number;
	userVote?: "up" | "down" | null;
	iconIndex?: number; // * Optional: which icon to show (0-4)
}
