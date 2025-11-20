"use client";

import type { BeehiivPost } from "@/types/behiiv";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface RecentPostsSectionProps {
	title: string;
	posts: BeehiivPost[];
}

export function RecentPostsSection({ title, posts }: RecentPostsSectionProps) {
	const recentPosts = Array.isArray(posts) ? posts : [];

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, delay: 0.08 }}
			className="rounded-2xl border border-white/10 bg-background-dark/90 p-6 shadow-black/10 shadow-lg backdrop-blur"
			aria-labelledby={`${title.replace(/\s+/g, "-").toLowerCase()}-heading`}
		>
			<h3
				id={`${title.replace(/\s+/g, "-").toLowerCase()}-heading`}
				className="mb-5 font-semibold text-lg text-white"
			>
				{title}
			</h3>
			<div className="flex flex-col gap-4">
				{recentPosts.map((post) => (
					<Link
						key={post.id}
						href={typeof post.web_url === "string" ? post.web_url : "/"}
						className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-primary/60 hover:bg-primary/10"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src={
								typeof post.thumbnail_url === "string"
									? post.thumbnail_url
									: "https://place-hold.it/600x600"
							}
							alt={post.title}
							className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
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
						<div className="flex flex-col">
							<h4 className="font-semibold text-sm text-white transition-colors group-hover:text-primary">
								{post.title}
							</h4>
							<p className="mt-0.5 text-muted-foreground text-xs">
								{(() => {
									const raw =
										(post as any).published_at ?? (post as any).publish_date;
									if (typeof raw === "number")
										return new Date(raw * 1000).toLocaleDateString();
									if (typeof raw === "string")
										return new Date(raw).toLocaleDateString();
									return "—";
								})()}
							</p>
							{Array.isArray(post.content_tags) &&
								post.content_tags.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-1.5">
										{post.content_tags
											.filter((tag): tag is string => typeof tag === "string")
											.map((tag) => (
												<span
													key={tag}
													className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] text-primary transition group-hover:border-primary/40"
												>
													{tag}
												</span>
											))}
									</div>
								)}
						</div>
					</Link>
				))}
			</div>
		</motion.section>
	);
}
