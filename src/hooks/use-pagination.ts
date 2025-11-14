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
	console.log("[usePagination] Hook starting", {
		itemsLength: items.length,
		options,
	});
	const { itemsPerPage = 8, initialPage = 1, enableShowAll = true } = options;
	console.log("[usePagination] Hook 1: useState(page)");
	const [page, setPage] = useState(initialPage);
	console.log("[usePagination] Hook 2: useState(showAll)");
	const [showAll, setShowAll] = useState(false);

	console.log("[usePagination] Hook 3: useMemo(totalPages)");
	const totalPages = useMemo(() => {
		const result =
			itemsPerPage > 0 ? Math.ceil(items.length / itemsPerPage) : 1;
		console.log("[usePagination] totalPages computed", {
			result,
			itemsLength: items.length,
			itemsPerPage,
		});
		return result;
	}, [items.length, itemsPerPage]);

	// Slice items for current page
	console.log("[usePagination] Hook 4: useMemo(pagedItems)");
	const pagedItems = useMemo(() => {
		const result =
			showAll || !itemsPerPage
				? items
				: items.slice(
						(page - 1) * itemsPerPage,
						(page - 1) * itemsPerPage + itemsPerPage,
					);
		console.log("[usePagination] pagedItems computed", {
			resultLength: result.length,
			showAll,
			page,
			itemsPerPage,
		});
		return result;
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
	console.log("[usePagination] Hook 5: useCallback(nextPage)");
	const nextPage = useCallback(
		() => setPage((p) => Math.min(totalPages, p + 1)),
		[totalPages],
	);
	console.log("[usePagination] Hook 6: useCallback(prevPage)");
	const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
	// Show More: show all items and reset to first page
	console.log("[usePagination] Hook 7: useCallback(showMore)");
	const showMore = useCallback(() => {
		setShowAll(true);
		setPage(1);
	}, []);

	// Show Less: return to paginated mode and reset to first page
	console.log("[usePagination] Hook 8: useCallback(showLess)");
	const showLess = useCallback(() => {
		setShowAll(false);
		setPage(1);
	}, []);

	const reset = showLess; // alias for backward compatibility

	console.log("[usePagination] Hook COMPLETE", {
		page,
		totalPages,
		pagedItemsLength: pagedItems.length,
		showAll,
		canShowPagination: !showAll && totalPages > 1,
	});

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
