"use client";

import { Button } from "@/components/ui/button";
import type { BeehiivPost } from "@/types/behiiv";
import { motion } from "framer-motion";
import { RssIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NewsletterFooter } from "../contact/newsletter/NewsletterFooter";

interface BlogSidebarProps {
	posts: BeehiivPost[];
}

const BlogSidebar = ({ posts }: BlogSidebarProps) => {
	const [email, setEmail] = useState("");
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

	const sourcePosts = (Array.isArray(posts) && posts.length > 0 ? posts : fallbackPosts) as BeehiivPost[];
	const visibleSource = useMemo(() => {
		return (sourcePosts || []).filter((p: any) => isVisible(p));
	}, [sourcePosts]);
	const recentPosts = useMemo(() => {
		return [...visibleSource]
			.sort((a, b) => toTime((b as any).published_at ?? b.publish_date) - toTime((a as any).published_at ?? a.publish_date))
			.slice(0, 3);
	}, [visibleSource]);

	const allTags = useMemo(() => {
		return Array.from(
			new Set(
				(visibleSource || []).flatMap((post) =>
					Array.isArray((post as any).content_tags)
						? (post as any).content_tags.filter((t: unknown): t is string => typeof t === "string")
						: [],
				),
			),
		).sort();
	}, [visibleSource]);

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Subscribed with email:", email);
		setEmail("");
		alert("Thanks for subscribing!");
	};

	return (
		<div className="space-y-8">
			<NewsletterFooter />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="glass-card rounded-xl p-6"
			>
				<h3 className="mb-4 font-semibold text-black text-xl dark:text-white">
					Recent Posts
				</h3>
				<div className="space-y-4">
					{recentPosts.map((post) => (
						<a
							key={post.id}
							href={typeof post.web_url === "string" ? post.web_url : "/"}
							className="group flex items-start space-x-3"
						>
							<Image
								src={
									typeof post.thumbnail_url === "string"
										? post.thumbnail_url
										: "https://place-hold.it/600x600"
								}
								alt={post.title}
								className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
								style={{
									objectFit:
										typeof post.thumbnail_url === "string" &&
										post.thumbnail_url.endsWith(".gif")
											? "contain"
											: "cover",
								}}
								width={800}
								height={450}
							/>
							<div>
								<h4 className="font-medium text-black text-sm transition-colors group-hover:text-primary dark:text-white">
									{post.title}
								</h4>
								<p className="text-primary text-xs">
									{(() => {
										const raw = (post as any).published_at ?? (post as any).publish_date;
										if (typeof raw === "number") return new Date(raw * 1000).toLocaleDateString();
										if (typeof raw === "string") return new Date(raw).toLocaleDateString();
										return "—";
									})()}
								</p>
								{Array.isArray(post.content_tags) &&
									post.content_tags.length > 0 && (
										<div className="mt-1 flex flex-wrap gap-1">
											{post.content_tags
												.filter((tag): tag is string => typeof tag === "string")
												.map((tag) => (
													<span
														key={tag}
														className="rounded bg-primary/10 px-2 py-0.5 text-primary text-xs"
													>
														{tag}
													</span>
												))}
										</div>
									)}
							</div>
						</a>
					))}
				</div>
			</motion.div>

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
					<h3 className="mb-1 font-semibold text-black text-xl dark:text-white">
						RSS Feed
					</h3>
					<p className="text-black text-sm dark:text-white/70">
						Subscribe to our RSS feed
					</p>
				</div>
				<Link href="/rss" target="_blank" rel="noopener noreferrer">
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
