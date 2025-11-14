// src/components/services/ServiceFilter.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import type { ServiceCategoryValue } from "@/types/service/services";
import React from "react";

interface ServiceFilterProps {
	categories: Array<{ id: string; name: string }>;
	activeCategory: ServiceCategoryValue | "";
	searchTerm: string;
	onSearch: (term: string) => void;
	onCategoryChange: (category: ServiceCategoryValue | "") => void;
	showSearch?: boolean;
	showCategories?: boolean;
}

export default function ServiceFilter({
	categories,
	activeCategory,
	searchTerm,
	onSearch,
	onCategoryChange,
	showSearch = true,
	showCategories = true,
}: ServiceFilterProps) {
	const { CategoryFilter } = useCategoryFilter(
		categories,
		activeCategory,
		onCategoryChange,
	);

	return (
		<div className="mb-8 flex w-full flex-col gap-4">
			{showSearch && (
				<div className="relative mx-auto w-full max-w-xs md:max-w-sm">
					<span className="-translate-y-1/2 absolute top-1/2 left-3 text-purple-400">
						<svg
							aria-label="Search"
							width={18}
							height={18}
							fill="none"
							viewBox="0 0 24 24"
						>
							<title>Search</title>
							<path
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
							/>
						</svg>
					</span>
					<Input
						type="text"
						placeholder="Search features..."
						value={searchTerm}
						onChange={(e) => onSearch(e.target.value)}
						className="rounded-lg border border-white/10 bg-white py-2 pl-10 text-black placeholder:text-gray-500 focus:border-primary focus:ring-primary dark:bg-[#181825] dark:text-white dark:placeholder:text-white/50"
					/>
				</div>
			)}
			{showCategories && CategoryFilter && <CategoryFilter />}
		</div>
	);
}
