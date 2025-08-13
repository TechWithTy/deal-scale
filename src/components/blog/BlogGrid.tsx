import { motion } from "framer-motion";
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

  // Sort posts by published_at (most recent first). Fallback to popularity only when dates are equal/missing
  const toTime = (v: unknown): number => {
    if (typeof v === "string" || typeof v === "number") {
      const t = new Date(v as string | number).getTime();
      return Number.isFinite(t) ? t : 0;
    }
    if (v instanceof Date) return v.getTime();
    return 0;
  };

  const sortedByRecency = [...posts].sort((a, b) => {
    const aDate = toTime(a.published_at as unknown);
    const bDate = toTime(b.published_at as unknown);
    if (aDate !== bDate) return bDate - aDate;
    // tie-breaker by views then clicks
    const aViews = typeof a.stats?.web?.views === "number" ? a.stats.web.views : 0;
    const bViews = typeof b.stats?.web?.views === "number" ? b.stats.web.views : 0;
    if (aViews !== bViews) return bViews - aViews;
    const aClicks = typeof a.stats?.web?.clicks === "number" ? a.stats.web.clicks : 0;
    const bClicks = typeof b.stats?.web?.clicks === "number" ? b.stats.web.clicks : 0;
    return bClicks - aClicks;
  });

  // Analytics-driven featured selection: combine email + web metrics
  const getNum = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const analyticsScore = (p: typeof posts[number]): number => {
    const web = p.stats?.web;
    const email = p.stats?.email as any;
    const webViews = getNum(web?.views);
    const webClicks = getNum(web?.clicks);
    const emailUniqueOpens = getNum(email?.unique_opens);
    const emailUniqueClicks = getNum(email?.unique_clicks);
    const emailOpenRate = getNum(email?.open_rate);
    const emailClickRate = getNum(email?.click_rate);
    // Heuristic weighting: prioritize unique clicks, then clicks/views and rates
    return (
      emailUniqueClicks * 8 +
      emailUniqueOpens * 2 +
      webClicks * 5 +
      webViews * 1 +
      emailClickRate * 0.5 +
      emailOpenRate * 0.2
    );
  };

  // Pick featured by best analytics; fall back to recency
  const featuredByAnalytics = [...posts].sort((a, b) => {
    const sa = analyticsScore(a);
    const sb = analyticsScore(b);
    if (sa !== sb) return sb - sa;
    // tie-breaker by recency
    return toTime(b.published_at as unknown) - toTime(a.published_at as unknown);
  });
  const featuredPost = featuredByAnalytics[0];
  // Regular posts: all others, sorted by recency for browsing
  const regularPosts = sortedByRecency.filter((p) => p.id !== featuredPost?.id);

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
                    key={pageNum}
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
