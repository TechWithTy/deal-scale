"use client";

import type { PersonaKey } from "@/data/personas/catalog";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import { usePersonaStore } from "@/stores/usePersonaStore";
import type {
	BeehiivPost,
	BeehiivPostContentEmailStats,
	BeehiivPostContentWebStats,
} from "@/types/behiiv";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import React, { Suspense, lazy, useMemo } from "react";
import FeaturedBlogCard from "./FeaturedBlogCard";
const BlogCard = lazy(() =>
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

type PageWindowOptions = {
	currentPage: number;
	totalPages: number;
	windowSize?: number;
};

export function getPageWindow({
	currentPage,
	totalPages,
	windowSize = 3,
}: PageWindowOptions): number[] {
	const safeCurrent = Math.min(
		Math.max(currentPage, 1),
		Math.max(totalPages, 1),
	);
	const safeWindow = Math.max(windowSize, 1);
	const halfWindow = Math.floor(safeWindow / 2);

	let start = Math.max(safeCurrent - halfWindow, 1);
	const end = Math.min(start + safeWindow - 1, totalPages);

	if (end - start + 1 < safeWindow) {
		start = Math.max(end - safeWindow + 1, 1);
	}

	const pages: number[] = [];
	for (let page = start; page <= end; page += 1) {
		pages.push(page);
	}
	return pages;
}

const BlogCardSkeleton = () => (
	<div className="flex h-full flex-col justify-between rounded-xl border border-border/40 bg-background/60 p-6 shadow-black/5 shadow-sm">
		<div className="h-40 w-full animate-pulse rounded-lg bg-muted" />
		<div className="mt-4 space-y-3">
			<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
			<div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
		</div>
		<div className="mt-6 h-3 w-1/3 animate-pulse rounded bg-muted" />
	</div>
);

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;

type FreshnessBadge = "7-day" | "30-day" | "all";

type ExtendedEmailStats = BeehiivPostContentEmailStats & {
	open_rate?: number;
	click_rate?: number;
};

const PERSONA_PREFERENCES: Partial<
	Record<
		PersonaKey,
		{
			tags: string[];
			keywords?: string[];
		}
	>
> = {
	investor: {
		tags: [
			"finding motivated sellers",
			"investor wholesaler tools",
			"ai & automation",
			"deal analysis",
			"wholesaling",
		],
		keywords: [
			"investor",
			"deal flow",
			"portfolio",
			"cash buyer",
			"underwriting",
		],
	},
	wholesaler: {
		tags: [
			"wholesaling",
			"lead qualification",
			"closing deals",
			"lead & sales strategy",
		],
		keywords: [
			"wholesale",
			"assignment",
			"motivated seller",
			"disposition",
			"seller outreach",
		],
	},
	agent: {
		tags: [
			"lead-generation",
			"lead-conversion",
			"scaling your business",
			"pipeline",
			"follow-up",
		],
		keywords: ["agent", "listing", "buyer", "referral", "commission"],
	},
	founder: {
		tags: [
			"product",
			"go-to-market",
			"ai & automation",
			"startup",
			"scaling your business",
		],
		keywords: ["founder", "startup", "mvp", "product", "growth"],
	},
	loan_officer: {
		tags: ["mortgage", "loan automation", "lead qualification", "follow-up"],
		keywords: ["loan", "mortgage", "borrower", "refi", "lender"],
	},
};

const getNumericValue = (value: unknown): number =>
	typeof value === "number" && Number.isFinite(value) ? value : 0;

const computeAnalyticsScore = (post: BeehiivPost): number => {
	const webStats = post.stats?.web as BeehiivPostContentWebStats | undefined;
	const emailStats = post.stats?.email as ExtendedEmailStats | undefined;

	const webViews = getNumericValue(webStats?.views);
	const webClicks = getNumericValue(webStats?.clicks);
	const emailUniqueOpens = getNumericValue(emailStats?.unique_opens);
	const emailUniqueClicks = getNumericValue(emailStats?.unique_clicks);
	const emailOpenRate = getNumericValue(emailStats?.open_rate);
	const emailClickRate = getNumericValue(emailStats?.click_rate);

	return (
		emailUniqueClicks * 8 +
		emailUniqueOpens * 2 +
		webClicks * 5 +
		webViews * 1 +
		emailClickRate * 0.5 +
		emailOpenRate * 0.2
	);
};

const tokenize = (text?: string): string[] =>
	(text ?? "")
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.filter(
			(token, index, arr) => token.length >= 4 && arr.indexOf(token) === index,
		);

const toTime = (value: unknown): number => {
	if (typeof value === "number") {
		const ms = value < 1_000_000_000_000 ? value * 1000 : value;
		return Number.isFinite(ms) ? ms : 0;
	}
	if (typeof value === "string") {
		const numeric = Number(value);
		if (!Number.isNaN(numeric)) {
			const ms = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
			return Number.isFinite(ms) ? ms : 0;
		}
		const parsed = Date.parse(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	if (value instanceof Date) {
		return Number.isFinite(value.getTime()) ? value.getTime() : 0;
	}
	return 0;
};

const getPublishedTimestamp = (post: BeehiivPost): number => {
	return (
		toTime(post.published_at) ||
		toTime(post.publish_date) ||
		toTime(post.displayed_date) ||
		toTime(post.created)
	);
};

const getFreshnessBadge = (publishedTimestamp: number): FreshnessBadge => {
	if (!Number.isFinite(publishedTimestamp) || publishedTimestamp === 0) {
		return "all";
	}
	const ageMs = Date.now() - publishedTimestamp;
	if (ageMs <= WEEK_MS) return "7-day";
	if (ageMs <= MONTH_MS) return "30-day";
	return "all";
};

const computePersonaAffinity = (
	post: BeehiivPost,
	persona: PersonaKey,
	goal: string | undefined,
): number => {
	const preference = PERSONA_PREFERENCES[persona];
	if (!preference) return 0;

	const tags = new Set(
		(Array.isArray(post.content_tags) ? post.content_tags : [])
			.filter((tag): tag is string => typeof tag === "string")
			.map((tag) => tag.toLowerCase()),
	);
	const haystack = `${post.title ?? ""} ${post.subtitle ?? ""}`
		.toLowerCase()
		.replace(/\s+/g, " ");

	let score = 0;

	for (const tag of preference.tags) {
		if (tags.has(tag.toLowerCase())) {
			score += 12;
		}
	}

	if (preference.keywords) {
		for (const keyword of preference.keywords) {
			if (haystack.includes(keyword.toLowerCase())) {
				score += 6;
			}
		}
	}

	if (goal) {
		const goalTokens = tokenize(goal);
		for (const token of goalTokens) {
			if (haystack.includes(token) || tags.has(token)) {
				score += 2;
			}
		}
	}

	return score;
};

const BlogGrid = ({ posts }: { posts: BeehiivPost[] }) => {
	const router = useNavigationRouter();
	const searchParams = useSearchParams();
	const persona = usePersonaStore((state) => state.persona);
	const goal = usePersonaStore((state) => state.goal);
	const pageSize = useMemo(() => {
		const s = searchParams?.get("per_page");
		const parsed = s ? Number(s) : Number.NaN;
		return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
	}, [searchParams]);
	const currentPage = useMemo(() => {
		const p = searchParams?.get("page");
		const parsed = p ? Number(p) : Number.NaN;
		return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
	}, [searchParams]);

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

	const sortByRecency = useMemo(() => {
		return [...posts].sort((a, b) => {
			const diff = getPublishedTimestamp(b) - getPublishedTimestamp(a);
			if (diff !== 0) return diff;
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
	}, [posts]);

	const scoredPosts = useMemo(() => {
		return posts.map((post) => {
			const publishedTimestamp = getPublishedTimestamp(post);
			const badge = getFreshnessBadge(publishedTimestamp);
			const recencyMultiplier =
				badge === "7-day" ? 1.35 : badge === "30-day" ? 1.15 : 1;
			const baseScore = computeAnalyticsScore(post);
			const personaScore = persona
				? computePersonaAffinity(post, persona, goal)
				: 0;
			const finalScore = baseScore * recencyMultiplier + personaScore;
			return {
				post,
				finalScore,
				baseScore,
				personaScore,
				publishedTimestamp,
				badge,
			};
		});
	}, [posts, persona, goal]);

	const featuredEntry = useMemo(() => {
		if (scoredPosts.length === 0) return undefined;
		return [...scoredPosts].sort((a, b) => b.finalScore - a.finalScore)[0];
	}, [scoredPosts]);

	const featuredPost = featuredEntry?.post;

	const regularPosts = useMemo(() => {
		if (!featuredPost) return sortByRecency;
		return sortByRecency.filter((post) => post.id !== featuredPost.id);
	}, [sortByRecency, featuredPost]);

	const gridPageSize = Math.max(pageSize - (featuredPost ? 1 : 0), 1);
	const paginatedPosts = useMemo(() => {
		return regularPosts.slice(0, gridPageSize);
	}, [regularPosts, gridPageSize]);

	const totalPagesFromParams = useMemo(() => {
		const total = searchParams?.get("total_pages");
		const parsed = total ? Number(total) : Number.NaN;
		return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
	}, [searchParams]);

	const hasFullPage = regularPosts.length >= gridPageSize;
	const totalPages =
		totalPagesFromParams ?? (hasFullPage ? currentPage + 1 : currentPage);
	const pageWindow = useMemo(
		() =>
			getPageWindow({
				currentPage,
				totalPages,
				windowSize: 3,
			}),
		[currentPage, totalPages],
	);

	// URL-driven pagination: push ?page= and enforce per_page=10 so server returns 10 and grid uses first as featured + 9 regular
	const goToPage = (next: number) => {
		const params = new URLSearchParams(searchParams?.toString() || "");
		params.set("page", String(next));
		if (!params.get("per_page")) params.set("per_page", String(pageSize));
		router.push(`/blogs?${params.toString()}`);
	};

	const disablePrev = currentPage <= 1;
	const disableNext =
		totalPagesFromParams !== null
			? currentPage >= totalPagesFromParams
			: !hasFullPage;

	return (
		<div className="space-y-10">
			{featuredPost ? (
				<FeaturedBlogCard
					featuredPost={featuredPost}
					freshnessBadge={featuredEntry?.badge}
					persona={persona}
					personaGoal={goal}
				/>
			) : null}

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{paginatedPosts.map((post) => (
					<motion.div
						key={post.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.05 }}
					>
						<Suspense fallback={<BlogCardSkeleton />}>
							<BlogCard post={post} />
						</Suspense>
					</motion.div>
				))}
			</div>

			{/* URL-driven pagination controls */}
			<div className="mt-8 flex flex-wrap items-center justify-center gap-2">
				<button
					className="rounded bg-gray-200 px-3 py-1 text-gray-700 text-sm transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
					onClick={() => goToPage(currentPage - 1)}
					disabled={disablePrev}
					type="button"
					aria-label="Previous page"
				>
					Prev
				</button>
				{pageWindow.map((page) => (
					<button
						key={page}
						type="button"
						onClick={() => goToPage(page)}
						className={`rounded px-3 py-1 text-sm transition ${
							page === currentPage
								? "bg-primary text-primary-foreground shadow"
								: "bg-muted text-foreground hover:bg-muted/80"
						}`}
						aria-current={page === currentPage ? "page" : undefined}
						aria-label={`Go to page ${page}`}
					>
						{page}
					</button>
				))}
				<button
					className="rounded bg-gray-200 px-3 py-1 text-gray-700 text-sm transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
					onClick={() => goToPage(currentPage + 1)}
					disabled={disableNext}
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
