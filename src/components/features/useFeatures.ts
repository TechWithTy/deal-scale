import { useAuthModal } from "@/components/auth/use-auth-store";
import mockFeatures from "@/data/features";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import type { Category } from "@/types/case-study";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { FeatureHookReturn } from "./hooks/featureTypes";
import type { FeatureRequest } from "./types";

const deriveCategoriesFromFeatures = (
	features: FeatureRequest[],
): Category[] => {
	const categoryMap = new Map<string, Category>();
	for (const feature of features) {
		if (!categoryMap.has(feature.categoryId)) {
			categoryMap.set(feature.categoryId, {
				id: feature.categoryId,
				name: feature.category,
			});
		}
	}
	return Array.from(categoryMap.values()).sort((a, b) =>
		a.name.localeCompare(b.name),
	);
};

export const useFeatures = (): FeatureHookReturn => {
	const [allFeatures, setAllFeatures] =
		useState<FeatureRequest[]>(mockFeatures);
	const [loading] = useState(false);
	const voteInProgressRef = useRef<Record<string, boolean>>({});
	const [voteStatus, setVoteStatus] = useState<Record<string, boolean>>({});
	const { data: session } = useSession();
	const openAuthModal = useAuthModal((state) => state.open);

	const setVoteInProgress = useCallback(
		(featureId: string, inProgress: boolean) => {
			voteInProgressRef.current[featureId] = inProgress;
			setVoteStatus((prev) => {
				if (inProgress) {
					return { ...prev, [featureId]: true };
				}
				const next = { ...prev };
				delete next[featureId];
				return next;
			});
		},
		[],
	);

	const categories = useMemo(
		() => deriveCategoriesFromFeatures(allFeatures),
		[allFeatures],
	);

	const { activeCategory, CategoryFilter } = useCategoryFilter(categories);

	const filteredFeatures = useMemo(() => {
		if (activeCategory === "all" || activeCategory === "") {
			return allFeatures;
		}
		return allFeatures.filter(
			(feature) => feature.categoryId === activeCategory,
		);
	}, [activeCategory, allFeatures]);

	const handleVote = useCallback(
		async (featureId: string, voteType: "up" | "down") => {
			if (!session?.user) {
				openAuthModal("signin", () => {
					void handleVote(featureId, voteType);
				});
				return false;
			}

			if (voteInProgressRef.current[featureId]) {
				return false;
			}

			const currentFeature = allFeatures.find(
				(feature) => feature.id === featureId,
			);
			if (!currentFeature) {
				console.warn(`[useFeatures] Feature ${featureId} not found.`);
				return false;
			}

			if (voteType === "down" && currentFeature.userVote !== "up") {
				// Nothing to retract, ignore.
				return false;
			}

			setVoteInProgress(featureId, true);

			const endpoint = `/api/features/${featureId}/vote`;
			const isUpVote = voteType === "up";

			try {
				const response = await fetch(endpoint, {
					method: isUpVote ? "POST" : "DELETE",
					headers: isUpVote
						? {
								"Content-Type": "application/json",
							}
						: undefined,
					body: isUpVote
						? JSON.stringify({ feature_id: featureId })
						: undefined,
				});

				if (response.status === 401) {
					openAuthModal("signin", () => {
						void handleVote(featureId, voteType);
					});
					return false;
				}

				if (!response.ok) {
					throw new Error(`Vote request failed with status ${response.status}`);
				}

				let payload: { feature_votes_total?: number } | null = null;
				if (response.status !== 204) {
					payload = await response.json();
				}

				const nextUpvotes =
					typeof payload?.feature_votes_total === "number"
						? payload.feature_votes_total
						: Math.max(0, currentFeature.upvotes + (isUpVote ? 1 : -1));

				setAllFeatures((prev) =>
					prev.map((feature) =>
						feature.id === featureId
							? {
									...feature,
									upvotes: nextUpvotes,
									userVote: isUpVote ? "up" : null,
								}
							: feature,
					),
				);

				return true;
			} catch (error) {
				console.error(
					`[useFeatures] Failed to process ${voteType} vote`,
					error,
				);
				return false;
			} finally {
				setVoteInProgress(featureId, false);
			}
		},
		[allFeatures, openAuthModal, session?.user, setVoteInProgress],
	);

	const isVotingInProgress = useCallback(
		(featureId: string) => Boolean(voteStatus[featureId]),
		[voteStatus],
	);

	return {
		features: filteredFeatures,
		categories,
		activeCategory,
		CategoryFilter,
		loading,
		handleVote,
		isVotingInProgress,
	};
};
