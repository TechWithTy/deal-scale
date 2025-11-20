import type { VoteResponse } from "../hooks/featureTypes";
// import { supabase } from "@/integrations/supabase/client";
import type { FeatureRequest } from "../types";

const withDefaults = (
	feature: Partial<FeatureRequest> &
		Pick<FeatureRequest, "id" | "title" | "description" | "status">,
): FeatureRequest => {
	const now = new Date().toISOString();
	return {
		category: feature.category ?? "Productivity",
		categoryId: feature.categoryId ?? "productivity",
		icpFocus: feature.icpFocus ?? "General",
		completeness: feature.completeness ?? 25,
		benefit: feature.benefit,
		priority: feature.priority ?? "Medium",
		toolUrl: feature.toolUrl,
		owner: feature.owner ?? "Product Team",
		lastUpdated: feature.lastUpdated ?? now,
		created_at: feature.created_at ?? now,
		updated_at: feature.updated_at ?? feature.lastUpdated ?? now,
		upvotes: feature.upvotes ?? 0,
		userVote: feature.userVote ?? null,
		iconIndex: feature.iconIndex ?? 0,
		...feature,
	};
};

const mockFeatures: FeatureRequest[] = [
	withDefaults({
		id: "1",
		title: "Dark Mode",
		description: "Add support for dark mode.",
		status: "discovery",
		category: "Interface",
		categoryId: "interface",
		icpFocus: "Platform Admins",
		completeness: 45,
		priority: "High",
		upvotes: 12,
		iconIndex: 0,
	}),
	withDefaults({
		id: "2",
		title: "Export Data",
		description: "Allow exporting data as CSV.",
		status: "planning",
		category: "Data Ops",
		categoryId: "data-ops",
		icpFocus: "Finance Teams",
		completeness: 35,
		priority: "Medium",
		upvotes: 8,
		iconIndex: 1,
	}),
	withDefaults({
		id: "3",
		title: "Favorites",
		description: "Mark items as favorite.",
		status: "in_progress",
		category: "Productivity",
		categoryId: "productivity",
		icpFocus: "Deal Finders",
		completeness: 70,
		priority: "Medium",
		upvotes: 5,
		iconIndex: 2,
	}),
	withDefaults({
		id: "4",
		title: "Quick Actions",
		description: "Add lightning-fast shortcuts.",
		status: "in_discovery",
		category: "Workflow Automation",
		categoryId: "workflow-automation",
		icpFocus: "Sales Ops",
		completeness: 30,
		priority: "Low",
		upvotes: 3,
		iconIndex: 3,
	}),
	withDefaults({
		id: "5",
		title: "Like Feature",
		description: "Show love for features you enjoy.",
		status: "released",
		category: "Engagement",
		categoryId: "engagement",
		icpFocus: "Customer Success",
		completeness: 100,
		priority: "High",
		upvotes: 7,
		iconIndex: 4,
	}),
];

const mockVotes: { [featureId: string]: { [userId: string]: "up" | "down" } } =
	{};

export const fetchFeatureRequests = async (): Promise<FeatureRequest[]> => {
	return mockFeatures;
};

export const fetchUserVotes = async (
	userId: string,
): Promise<{ feature_id: string; vote_type: "up" | "down" }[]> => {
	return Object.entries(mockVotes)
		.filter(([_, users]) => users[userId])
		.map(([feature_id, users]) => ({
			feature_id,
			vote_type: users[userId],
		}));
};

export const voteOnFeature = async (
	featureId: string,
	userId: string,
	voteType: "up" | "down",
): Promise<VoteResponse> => {
	if (!mockVotes[featureId]) {
		mockVotes[featureId] = {};
	}
	mockVotes[featureId][userId] = voteType;

	// Tally upvotes for each feature
	let upvotes = 0;
	for (const feature of mockFeatures) {
		const users = mockVotes[feature.id] || {};
		const upCount = Object.values(users).filter((v) => v === "up").length;
		feature.upvotes = upCount;
		if (feature.id === featureId) upvotes = upCount;
	}

	return {
		success: true,
		upvotes,
		userVote: voteType,
	};
};
