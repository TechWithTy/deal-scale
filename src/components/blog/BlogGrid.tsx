import { motion } from "framer-motion";
import {
	ArrowUpRight,
	Calendar,
	Clock,
	Eye,
	MousePointerClick,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import FeaturedBlogCard from "./FeaturedBlogCard";
const BlogCard = React.lazy(() =>
	import("./BlogCard").then((mod) => ({ default: mod.BlogCard })),
);

export function truncateTitle(title: string, maxLength = 60): string {
	return title.length > maxLength ? `${title.slice(0, maxLength)}…` : title;
}

export function truncateSubtitle(subtitle: string, maxLength = 60): string {
	return subtitle.length > maxLength
		? `${subtitle.slice(0, maxLength)}…`
		: subtitle;
}

import type { BeehiivPost } from "@/types/behiiv";

import { usePagination } from "@/hooks/use-pagination";
import { v4 as uuidv4 } from "uuid";

const BlogGrid = ({ posts }: { posts: BeehiivPost[] }) => {
	if (posts.length === 0) {
		return (
			<div className="glass-card rounded-xl py-20 text-center">
				<h3 className="mb-2 font-semibold text-2xl">No posts found</h3>
				<p className="text-black dark:text-white/70">
					Try changing your search or filter criteria
				</p>
			</div>
		);
	}

	// Sort posts by views (desc), then clicks (desc), fallback to 0 if missing
	const sortedPosts = [...posts].sort((a, b) => {
		const aViews =
			typeof a.stats?.web?.views === "number" ? a.stats.web.views : 0;
		const bViews =
			typeof b.stats?.web?.views === "number" ? b.stats.web.views : 0;
		if (aViews !== bViews) return bViews - aViews;
		const aClicks =
			typeof a.stats?.web?.clicks === "number" ? a.stats.web.clicks : 0;
		const bClicks =
			typeof b.stats?.web?.clicks === "number" ? b.stats.web.clicks : 0;
		return bClicks - aClicks;
	});

	const featuredPost = sortedPosts[0];
	const regularPosts = sortedPosts.slice(1);

	// PAGINATION LOGIC for regular posts
	const {
		pagedItems: paginatedPosts,
		page,
		totalPages,
		nextPage,
		prevPage,
		setPage,
		canShowPagination,
		canShowShowMore,
		canShowShowLess,
		showMore,
		showLess,
	} = usePagination(regularPosts, {
		itemsPerPage: 6,
		initialPage: 1,
		enableShowAll: true,
	});

	return (
		<div className="space-y-10">
			{featuredPost ? <FeaturedBlogCard featuredPost={featuredPost} /> : null}

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{paginatedPosts.map((post) => (
					<Suspense key={post.id} fallback={<div>Loading post...</div>}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<BlogCard post={post} />
						</motion.div>
					</Suspense>
				))}
			</div>

			{/* Pagination Controls */}
			{(canShowPagination || canShowShowMore || canShowShowLess) && (
				<div className="mt-8 flex flex-col items-center justify-center gap-2">
					{canShowShowMore && (
						<button
							className="mb-2 cursor-pointer border-none bg-transparent p-0 font-medium text-blue-600 underline"
							onClick={showMore}
							type="button"
						>
							Show More
						</button>
					)}
					{canShowPagination && (
						<div className="flex items-center justify-center gap-2">
							<button
								className="rounded bg-gray-200 px-3 py-1 text-gray-700 disabled:opacity-50"
								onClick={prevPage}
								disabled={page === 1}
								type="button"
								aria-label="Previous page"
							>
								Prev
							</button>
							{/* Page numbers */}
							{Array.from({ length: totalPages }, (_, i) => {
								const pageNum = i + 1;
								return (
									<button
										key={uuidv4()}
										className={`rounded px-3 py-1 ${page === pageNum ? "bg-blue-600 text-black dark:text-white" : "bg-gray-200 text-gray-700"}`}
										onClick={() => setPage(pageNum)}
										type="button"
										aria-label={`Page ${pageNum}`}
									>
										{pageNum}
									</button>
								);
							})}
							<button
								className="rounded bg-gray-200 px-3 py-1 text-gray-700 disabled:opacity-50"
								onClick={nextPage}
								disabled={page === totalPages}
								type="button"
								aria-label="Next page"
							>
								Next
							</button>
						</div>
					)}
					{canShowShowLess && (
						<button
							className="mt-2 cursor-pointer font-medium text-blue-600 underline"
							onClick={showLess}
							type="button"
						>
							Show Less
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default BlogGrid;
