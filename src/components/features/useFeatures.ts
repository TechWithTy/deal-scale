import mockFeatures from "@/data/features";
import { useRef, useState } from "react";
import type { FeatureHookReturn } from "./hooks/featureTypes";
import type { FeatureRequest } from "./types";

export const useFeatures = (): FeatureHookReturn => {
	const [features] = useState<FeatureRequest[]>(mockFeatures);
	const [loading] = useState(false);
	const voteInProgressRef = useRef<{ [key: string]: boolean }>({});

	// No-op vote handler for mock/demo
	const handleVote = async (_featureId: string, _voteType: "up" | "down") => {
		return;
	};

	const isVotingInProgress = (featureId: string) =>
		!!voteInProgressRef.current[featureId];

	return {
		features,
		loading,
		handleVote,
		isVotingInProgress,
	};
};
