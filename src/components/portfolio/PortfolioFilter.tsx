// In src/components/portfolio/PortfolioFilter.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useCategoryFilter } from "@/hooks/use-category-filter";

interface PortfolioFilterProps {
	categories: Array<{ id: string; name: string }>;
	activeCategory: string;
	onSearch: (term: string) => void;
	onCategoryChange: (category: string) => void;
}

export default function PortfolioFilter({
	categories,
	activeCategory,
	onSearch,
	onCategoryChange,
}: PortfolioFilterProps) {
	const { CategoryFilter } = useCategoryFilter(
		categories,
		activeCategory,
		onCategoryChange,
	);
	return (
		<div className="mb-8">
			<Input
				type="text"
				placeholder="Search projects..."
				onChange={(e) => onSearch(e.target.value)}
				className="mb-4"
			/>
			{CategoryFilter && <CategoryFilter />}
		</div>
	);
}
