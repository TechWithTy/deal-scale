// ProductFilter.tsx
// ! ProductFilter component: UI for searching and filtering products by category
// * Modeled after ServiceFilter, but for products
// * Follows DRY, SOLID, and type-safe best practices (see user rules)

"use client";

import { Input } from "@/components/ui/input";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import React from "react";

// todo: Move to shared types if needed elsewhere
// ! ProductCategory is now an enum in @/types/products
import type { ProductCategory } from "@/types/products";

export interface ProductCategoryOption {
	id: ProductCategory;
	name: string;
}

// * categories should be passed in as unique ProductCategoryOption[] (see parent for mapping)
// Example for parent:
// import { mockProducts } from "@/data/products";
// import { ProductCategory } from "@/types/products";
// const CATEGORY_LABELS: Record<ProductCategory, string> = {
//   credits: "Credits",
//   workflows: "Workflows",
//   essentials: "Essentials",
//   notion: "Notion",
//   leads: "Leads",
//   data: "Data",
//   automation: "Automation",
//   "add-on": "Add-On",
// };
// const categoryOptions = Array.from(new Set(mockProducts.flatMap(p => p.categories)))
//   .map((cat) => ({ id: cat, name: CATEGORY_LABELS[cat] || cat }));

interface ProductFilterProps {
	categories: ProductCategoryOption[];
	activeCategory: string;
	searchTerm: string;
	onSearch: (term: string) => void;
	onCategoryChange: (category: string) => void;
	showSearch?: boolean;
	showCategories?: boolean;
}

/**
 * ProductFilter - filter/search UI for products
 * @param props ProductFilterProps
 */
export default function ProductFilter({
	categories,
	activeCategory,
	searchTerm,
	onSearch,
	onCategoryChange,
	showSearch = true,
	showCategories = true,
}: ProductFilterProps) {
	const { CategoryFilter } = useCategoryFilter(
		categories,
		activeCategory,
		(cat) => {
			// Update URL to include /category={cat}
			if (cat && cat !== "all") {
				window.location.hash = `category=${cat}`;
			} else {
				window.location.hash = "";
			}
			onCategoryChange(cat);
		},
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
						placeholder="Search products..."
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
