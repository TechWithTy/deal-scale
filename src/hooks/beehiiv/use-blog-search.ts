"use client";

import type { BeehiivPost } from "@/types/behiiv";
import { useMemo, useState } from "react";

type UseBlogSearchReturn = {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filteredPosts: BeehiivPost[];
};

export function useBlogSearch(
	articles: BeehiivPost[],
	activeCategory: string,
	searchParams?: string,
): UseBlogSearchReturn {
	const [searchQuery, setSearchQuery] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const filteredPosts = useMemo(() => {
		let filtered = [...articles];

		// Filter by category
		if (activeCategory !== "all") {
			filtered = filtered.filter(
				(article) =>
					Array.isArray(article.content_tags) &&
					article.content_tags.includes(activeCategory),
			);
		}

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((article) => {
				const title = article.title?.toLowerCase() || "";
				const description = (
					article.subtitle ||
					article.meta_default_description ||
					""
				).toLowerCase();
				const tags = Array.isArray(article.content_tags)
					? article.content_tags.some(
							(cat) =>
								typeof cat === "string" && cat.toLowerCase().includes(query),
						)
					: false;
				return title.includes(query) || description.includes(query) || tags;
			});
		}

		return filtered;
	}, [articles, activeCategory, searchQuery, searchParams]);

	return { searchQuery, setSearchQuery, filteredPosts };
}
