"use client";

import { Button } from "@/components/ui/button";
import type { BeehiivPost } from "@/types/behiiv";
import { motion } from "framer-motion";
import { RssIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NewsletterFooter } from "../contact/newsletter/NewsletterFooter";
import { RecentPostsSection } from "./RecentPostsSection";

interface BlogSidebarProps {
	posts: BeehiivPost[];
}

const BlogSidebar = ({ posts }: BlogSidebarProps) => {
	const [fallbackPosts, setFallbackPosts] = useState<BeehiivPost[]>([]);

	// If no posts are provided, fetch the latest 3 as a fallback
	useEffect(() => {
		if (Array.isArray(posts) && posts.length > 0) return;
		const controller = new AbortController();
		const fetchRecent = async () => {
			try {
				const res = await fetch(
					"/api/beehiiv/posts?limit=3&order_by=publish_date&direction=desc&include_scheduled=true",
					{ cache: "no-store", signal: controller.signal },
				);
				if (!res.ok) return;
				const data = await res.json();
				const items: BeehiivPost[] = Array.isArray(data?.data)
					? data.data
					: Array.isArray(data?.posts)
						? data.posts
						: [];
				// Safety filter: exclude hidden_from_feed and future-dated (scheduled) posts
				const visible = items.filter((p: any) => isVisible(p));
				setFallbackPosts(visible);
			} catch (_) {
				// ignore
			}
		};
		void fetchRecent();
		return () => controller.abort();
	}, [posts]);

	const toTime = (v: unknown): number => {
		// Handles: ISO strings, ms timestamps, and unix seconds
		if (typeof v === "number") {
			const ms = v < 1e12 ? v * 1000 : v; // seconds -> ms if too small
			return Number.isFinite(ms) ? ms : 0;
		}
		if (typeof v === "string") {
			const num = Number(v);
			if (!Number.isNaN(num)) {
				const ms = num < 1e12 ? num * 1000 : num;
				return Number.isFinite(ms) ? ms : 0;
			}
			const t = new Date(v).getTime();
			return Number.isFinite(t) ? t : 0;
		}
		if (v instanceof Date) return v.getTime();
		return 0;
	};

	const isVisible = (p: any) => {
		const hidden = p?.hidden_from_feed === true;
		return !hidden;
	};

	const sourcePosts = (
		Array.isArray(posts) && posts.length > 0 ? posts : fallbackPosts
	) as BeehiivPost[];
	const visibleSource = useMemo(() => {
		return (sourcePosts || []).filter((p: any) => isVisible(p));
	}, [sourcePosts]);
	const recentPosts = useMemo(() => {
		return [...visibleSource]
			.sort(
				(a, b) =>
					toTime((b as any).published_at ?? b.publish_date) -
					toTime((a as any).published_at ?? a.publish_date),
			)
			.slice(0, 3);
	}, [visibleSource]);

	const popularityScore = (p: BeehiivPost): number => {
		const webViews = Number((p as any)?.stats?.web?.views) || 0;
		const webClicks = Number((p as any)?.stats?.web?.clicks) || 0;
		const emailUniqueClicks =
			Number((p as any)?.stats?.email?.unique_clicks) || 0;
		const emailUniqueOpens =
			Number((p as any)?.stats?.email?.unique_opens) || 0;
		// Weighted score: prioritize views, then clicks, then opens
		return (
			webViews * 1 +
			webClicks * 0.8 +
			emailUniqueClicks * 0.7 +
			emailUniqueOpens * 0.4
		);
	};

	const popularPosts = useMemo(() => {
		return [...visibleSource]
			.sort(
				(a, b) =>
					popularityScore(b as BeehiivPost) - popularityScore(a as BeehiivPost),
			)
			.slice(0, 3);
	}, [visibleSource]);

	return (
		<div className="space-y-6 lg:sticky lg:top-24">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="rounded-2xl border border-border/50 bg-card/90 p-6 shadow-lg backdrop-blur"
			>
				<NewsletterFooter />
			</motion.div>

			<RecentPostsSection title="Recent Posts" posts={recentPosts} />

			<RecentPostsSection title="Popular Posts" posts={popularPosts} />

			{/* <motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="glass-card rounded-xl p-6"
			>
				<h3 className="mb-4 font-semibold text-black text-xl dark:text-white">
					Popular Tags
				</h3>
				<div className="flex flex-wrap gap-2">
					{allTags
						.filter((tag): tag is string => typeof tag === "string")
						.map((tag) => (
							<a
								key={uuidv4()}
								href={`/blogs?tag=${tag}`}
								className="rounded-full bg-white/5 px-3 py-1.5 text-black text-xs transition-colors hover:bg-primary/20 hover:text-primary dark:text-white/70"
							>
								{tag}
							</a>
						))}
				</div>
			</motion.div> */}

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="glass-card flex items-center justify-between rounded-xl p-6"
			>
				<div>
					<h3 className="mb-1 font-semibold text-xl text-foreground">
						RSS Feed
					</h3>
					<p className="text-sm text-muted-foreground">
						Subscribe to our RSS feed
					</p>
				</div>
				<Link href="/rss/hybrid.xml" target="_blank" rel="noopener noreferrer">
					<Button
						variant="outline"
						size="default"
						className="border-primary/30 text-primary"
					>
						<RssIcon className="h-4 w-4" />
					</Button>
				</Link>
			</motion.div>
		</div>
	);
};

export default BlogSidebar;
