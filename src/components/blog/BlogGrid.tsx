import { motion } from "framer-motion";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const BlogGrid = ({ posts }: { posts: BeehiivPost[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = (() => {
    const s = searchParams?.get("per_page");
    const n = s ? Number(s) : 10;
    return Number.isFinite(n) && n > 0 ? n : 10;
  })();
  const currentPage = (() => {
    const p = searchParams?.get("page");
    const n = p ? Number(p) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  })();

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

  // Server-driven pagination: render posts as provided (no client re-slicing)
  const paginatedPosts = regularPosts;

  // URL-driven pagination: push ?page= and enforce per_page=10 so server returns 10 and grid uses first as featured + 9 regular
  const goToPage = (next: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(next));
    // Ensure consistent server page size for featured+12 layout
    if (!params.get("per_page")) params.set("per_page", "10");
    router.push(`/blogs?${params.toString()}`);
  };

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

      {/* URL-driven pagination controls */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="rounded bg-gray-200 px-3 py-1 text-gray-700 disabled:opacity-50"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          type="button"
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className="px-2 text-sm text-gray-600 dark:text-gray-300">Page {currentPage}</span>
        <button
          className="rounded bg-gray-200 px-3 py-1 text-gray-700"
          onClick={() => goToPage(currentPage + 1)}
          disabled={posts.length < pageSize}
          type="button"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogGrid;
