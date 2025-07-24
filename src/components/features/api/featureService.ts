import type { VoteResponse } from "../hooks/featureTypes";
// import { supabase } from "@/integrations/supabase/client";
import type { FeatureRequest } from "../types";

const mockFeatures: FeatureRequest[] = [
	{
		id: "1",
		title: "Dark Mode",
		description: "Add support for dark mode.",
		status: "open",
		upvotes: 12,
		created_at: "2024-05-22T12:00:00Z",
		userVote: null,
		iconIndex: 0, // Lightbulb
	},
	{
		id: "2",
		title: "Export Data",
		description: "Allow exporting data as CSV.",
		status: "planned",
		upvotes: 8,
		created_at: "2024-05-23T09:00:00Z",
		userVote: null,
		iconIndex: 1, // Rocket
	},
	{
		id: "3",
		title: "Favorites",
		description: "Mark items as favorite.",
		status: "in progress",
		upvotes: 5,
		created_at: "2024-05-24T10:00:00Z",
		userVote: null,
		iconIndex: 2, // Star
	},
	{
		id: "4",
		title: "Quick Actions",
		description: "Add lightning-fast shortcuts.",
		status: "planned",
		upvotes: 3,
		created_at: "2024-05-25T11:00:00Z",
		userVote: null,
		iconIndex: 3, // Zap
	},
	{
		id: "5",
		title: "Like Feature",
		description: "Show love for features you enjoy.",
		status: "open",
		upvotes: 7,
		created_at: "2024-05-26T12:00:00Z",
		userVote: null,
		iconIndex: 4, // Heart
	},
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
