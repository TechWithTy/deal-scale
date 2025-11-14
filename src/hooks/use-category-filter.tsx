"use client";

import type { Category } from "@/types/case-study";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useNavigationRouter } from "@/hooks/useNavigationRouter";

export function useCategoryFilter<T extends string>(
	categories: Category[],
	activeCategoryProp?: T | "",
	onCategoryChangeProp?: (category: T | "" | "all") => void,
	defaultCategory = "all",
) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useNavigationRouter();
	const [internalActiveCategory, setInternalActiveCategory] = useState<
		T | "" | "all"
	>("all");

	// Helper: extract category from path or query
	function getCategoryFromUrl(): T | "" | "all" | null {
		// 1. Check /category={id} in the path
		const match = pathname.match(/category=([^/?&#]+)/);
		if (match && categories.some((c) => c.id === match[1])) {
			return match[1] as T;
		}
		// 2. Check ?category={id} in the query
		const catParam = searchParams?.get("category");
		if (catParam && categories.some((c) => c.id === catParam)) {
			return catParam as T;
		}
		// 3. Fallback to ?tag={id} (legacy support)
		const tag = searchParams?.get("tag");
		if (tag && categories.some((c) => c.id === tag)) {
			return tag as T;
		}
		return null;
	}

	const isControlled =
		typeof activeCategoryProp === "string" &&
		typeof onCategoryChangeProp === "function";
	const activeCategory = isControlled
		? activeCategoryProp
		: internalActiveCategory;
	const setActiveCategory = (category: T | "" | "all") => {
		if (isControlled && onCategoryChangeProp) {
			onCategoryChangeProp(category);
		} else {
			setInternalActiveCategory(category);
		}
	};

	useEffect(() => {
		// Get tag from URL on initial load (uncontrolled mode only)
		if (!isControlled) {
			const tag = searchParams?.get("tag");
			if (tag && categories.some((c) => c.id === tag)) {
				setInternalActiveCategory(tag as T);
			}
		}
	}, [searchParams, categories, isControlled]);

	const handleCategoryChange = (categoryId: T | "" | "all") => {
		setActiveCategory(categoryId);
		if (!isControlled) {
			const params = new URLSearchParams(searchParams?.toString());
			if (categoryId === "all") {
				params.delete("tag");
			} else {
				params.set("tag", categoryId);
			}
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		}
	};

	// Filter out any categories that represent 'All' or 'All Posts' to avoid duplicates
	const filteredCategories = categories.filter(
		(cat) =>
			cat.id.toLowerCase() !== "all" && cat.name.toLowerCase() !== "all posts",
	);

	const CategoryFilter = () => (
		<div className="mb-8 w-full">
			{/* Mobile: horizontal scroll, single row; Desktop: flex-wrap */}
			<div
				className="scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-transparent flex w-full flex-nowrap gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible"
				role="tablist"
				aria-label="Category filter"
			>
				<button
					type="button"
					className={`shrink-0 rounded-full border px-4 py-2 font-medium text-sm shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-focus/60 md:text-base ${activeCategory === "all" ? "glow scale-105 border-accent bg-accent text-accent-foreground shadow-lg dark:text-white" : "border-border bg-card text-foreground hover:border-focus hover:bg-focus/10 hover:text-focus dark:text-white"}`}
					onClick={() => handleCategoryChange("all")}
					aria-selected={activeCategory === "all"}
				>
					All
				</button>
				{filteredCategories.map((cat) => (
					<button
						type="button"
						key={cat.id}
						className={`shrink-0 rounded-full border px-4 py-2 font-medium text-sm shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-focus/60 md:text-base ${activeCategory === cat.id ? "glow scale-105 border-accent bg-accent text-accent-foreground shadow-lg dark:text-white" : "border-border bg-card text-foreground hover:border-focus hover:bg-focus/10 hover:text-focus dark:text-white"}`}
						onClick={() => handleCategoryChange(cat.id as T)}
						aria-selected={activeCategory === cat.id}
					>
						{cat.name}
						{activeCategory === cat.id && (
							<div className="flex w-full justify-center">
								<span
									className="cursor-pointer rounded-full bg-card px-2 py-0.5 align-middle text-foreground text-xs transition hover:bg-accent dark:text-white"
									onMouseDown={(e) => {
										e.stopPropagation();
										handleCategoryChange("all");
									}}
									onKeyDown={(e) => {
										e.stopPropagation();
										handleCategoryChange("all");
									}}
									title="Clear filter"
									style={{ outline: "none" }}
								>
									×
								</span>
							</div>
						)}
					</button>
				))}
			</div>
		</div>
	);

	return {
		activeCategory,
		setActiveCategory,
		CategoryFilter,
	};
}
