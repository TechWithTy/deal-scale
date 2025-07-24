// use-pagination.ts
// ! Reusable, customizable pagination hook for arrays
// * Supports paged mode, "Show More/Less" toggle, and type safety
// * Follows DRY, SOLID, and clean code best practices

import { useCallback, useMemo, useState } from "react";

/**
 * Pagination hook options
 */
export interface UsePaginationOptions {
	itemsPerPage?: number;
	initialPage?: number;
	enableShowAll?: boolean;
}

/**
 * Return type for usePagination
 */
export interface UsePaginationResult<T> {
	page: number;
	setPage: (page: number) => void;
	totalPages: number;
	pagedItems: T[];
	showAll: boolean;
	setShowAll: (show: boolean) => void;
	canShowPagination: boolean;
	canShowShowMore: boolean;
	canShowShowLess: boolean;
	nextPage: () => void;
	prevPage: () => void;
	reset: () => void;
	showMore: () => void;
	showLess: () => void;
}

/**
 * usePagination - generic, customizable pagination logic for arrays
 * @param items The array of items to paginate
 * @param options Pagination options (itemsPerPage, initialPage, enableShowAll)
 * @returns Pagination state and helpers
 */
export function usePagination<T>(
	items: T[],
	options: UsePaginationOptions = {},
): UsePaginationResult<T> {
	const { itemsPerPage = 8, initialPage = 1, enableShowAll = true } = options;
	const [page, setPage] = useState(initialPage);
	const [showAll, setShowAll] = useState(false);

	const totalPages = useMemo(
		() => (itemsPerPage > 0 ? Math.ceil(items.length / itemsPerPage) : 1),
		[items.length, itemsPerPage],
	);

	// Slice items for current page
	const pagedItems = useMemo(() => {
		if (showAll || !itemsPerPage) return items;
		const start = (page - 1) * itemsPerPage;
		return items.slice(start, start + itemsPerPage);
	}, [items, page, itemsPerPage, showAll]);

	// Helpers for UI
	// Pagination controls should be available if there is more than one page AND NOT showing all
	const canShowPagination = !showAll && totalPages > 1;
	// Show More is available if not showing all and there are more items than per page
	const canShowShowMore =
		enableShowAll && !showAll && items.length > itemsPerPage;
	// Show Less is available if currently showing all
	const canShowShowLess = enableShowAll && showAll;

	// Navigation
	const nextPage = useCallback(
		() => setPage((p) => Math.min(totalPages, p + 1)),
		[totalPages],
	);
	const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
	// Show More: show all items and reset to first page
	const showMore = useCallback(() => {
		setShowAll(true);
		setPage(1);
	}, []);

	// Show Less: return to paginated mode and reset to first page
	const showLess = useCallback(() => {
		setShowAll(false);
		setPage(1);
	}, []);

	const reset = showLess; // alias for backward compatibility

	return {
		page,
		setPage,
		totalPages,
		pagedItems,
		showAll,
		setShowAll,
		canShowPagination,
		canShowShowMore,
		canShowShowLess,
		nextPage,
		prevPage,
		reset,
		showMore,
		showLess,
	};
}
