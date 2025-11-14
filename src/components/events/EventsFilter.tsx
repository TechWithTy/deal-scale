"use client";

import { Input } from "@/components/ui/input";

interface EventFilterProps {
	categories: Array<{ id: string; name: string }>;
	activeCategory: string;
	onSearch: (term: string) => void;
	onCategoryChange: (category: string) => void;
}

export default function EventFilter({
	categories,
	activeCategory,
	onSearch,
	onCategoryChange,
}: EventFilterProps) {
	return (
		<div className="mb-8">
			<div className="my-5 flex w-full justify-center">
				<Input
					type="text"
					placeholder="Search events..."
					onChange={(e) => onSearch(e.target.value)}
					className="mb-4 w-full max-w-xs sm:max-w-sm"
				/>
			</div>
			<div className="flex flex-wrap justify-center gap-2">
				{categories.map((category) => (
					<button
						key={category.id}
						type="button"
						onClick={() => onCategoryChange(category.id)}
						className={`rounded-full px-4 py-2 font-medium text-sm transition-colors ${
							activeCategory === category.id
								? "bg-primary text-black dark:text-white"
								: "bg-white/5 text-black hover:bg-white/10 dark:text-white/70"
						}`}
					>
						{category.name}
					</button>
				))}
			</div>
		</div>
	);
}
