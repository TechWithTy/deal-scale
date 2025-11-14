"use client";

import type { MediumArticle } from "@/data/medium/post";
import { useMemo, useState } from "react";

type UseBlogSearchReturn = {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filteredPosts: MediumArticle[];
};

export function useBlogSearch(
	articles: MediumArticle[],
	activeCategory: string,
	searchParams?: string,
): UseBlogSearchReturn {
	const [searchQuery, setSearchQuery] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const filteredPosts = useMemo(() => {
		let filtered = [...articles];

		// Filter by category
		if (activeCategory !== "all") {
			filtered = filtered.filter((article) =>
				article.categories.includes(activeCategory),
			);
		}

		// Filter by search query
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(article) =>
					article.title.toLowerCase().includes(query) ||
					article.description.toLowerCase().includes(query) ||
					article.categories.some((cat) => cat.toLowerCase().includes(query)),
			);
		}

		return filtered;
	}, [articles, activeCategory, searchQuery, searchParams]);

	return { searchQuery, setSearchQuery, filteredPosts };
}
