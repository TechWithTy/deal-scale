import type { BeehiivPost } from "@/types/behiiv";
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
import type React from "react";
import { Suspense } from "react";
import { truncateSubtitle, truncateTitle } from "./BlogGrid";

interface FeaturedBlogCardProps {
	featuredPost: BeehiivPost;
}

const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({
	featuredPost,
}) => {
	// Extract web + email stats safely for featured post
	const featuredWebStats = featuredPost?.stats?.web;
	const featuredEmailStats = (featuredPost?.stats as any)?.email as
		| {
				unique_opens?: number;
				unique_clicks?: number;
				open_rate?: number;
				click_rate?: number;
		  }
		| undefined;
	const featuredViews =
		typeof featuredWebStats?.views === "number"
			? featuredWebStats.views
			: undefined;
	const featuredClicks =
		typeof featuredWebStats?.clicks === "number"
			? featuredWebStats.clicks
			: undefined;
	const featuredUniqueOpens =
		typeof featuredEmailStats?.unique_opens === "number"
			? featuredEmailStats.unique_opens
			: undefined;
	const featuredUniqueClicks =
		typeof featuredEmailStats?.unique_clicks === "number"
			? featuredEmailStats.unique_clicks
			: undefined;
	const featuredOpenRate =
		typeof featuredEmailStats?.open_rate === "number"
			? featuredEmailStats.open_rate
			: undefined;
	const featuredClickRate =
		typeof featuredEmailStats?.click_rate === "number"
			? featuredEmailStats.click_rate
			: undefined;

	// Safely extract content string for reading time
	const contentString =
		typeof featuredPost.content === "string"
			? featuredPost.content
			: typeof featuredPost.content === "object" &&
					featuredPost.content?.free?.web
				? featuredPost.content.free.web
				: "";
	const readingTime = contentString
		? Math.ceil(contentString.split(" ").length / 200)
		: 0;

	return (
		<Suspense fallback={<div>Loading post...</div>}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="glass-card group flex flex-col items-center overflow-hidden rounded-xl text-center md:items-stretch md:text-left"
			>
				<div className="relative h-72 w-full overflow-hidden">
					<Image
						src={
							typeof featuredPost.thumbnail_url === "string"
								? featuredPost.thumbnail_url
								: "https://via.placeholder.com/800x450"
						}
						alt={featuredPost.title}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						style={{
							objectFit:
								typeof featuredPost.thumbnail_url === "string" &&
								featuredPost.thumbnail_url.endsWith(".gif")
									? "contain"
									: "cover",
						}}
						fill
					/>
					<div className="absolute top-4 left-4 rounded bg-primary/90 px-2 py-1 font-medium text-black text-xs dark:text-white">
						Featured
					</div>
				</div>
				<div className="flex w-full flex-col items-center p-6 md:items-start">
					<div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-xs md:justify-start">
						<span className="inline-flex items-center text-black dark:text-white/60">
							<Calendar className="mr-1 h-3 w-3 text-secondary" />
							{typeof featuredPost.publish_date === "number"
								? new Date(
										featuredPost.publish_date * 1000,
									).toLocaleDateString()
								: typeof featuredPost.publish_date === "string"
									? new Date(featuredPost.publish_date).toLocaleDateString()
									: "Unknown date"}
						</span>
						<span className="inline-flex items-center text-black dark:text-white/60">
							<Clock className="mr-1 h-3 w-3 text-secondary" /> {readingTime}{" "}
							min read
						</span>
						{typeof featuredViews === "number" && featuredViews > 0 && (
							<span className="inline-flex items-center gap-1">
								<Eye className="h-4 w-4 text-secondary" /> {featuredViews} views
							</span>
						)}
						{typeof featuredClicks === "number" && featuredClicks > 0 && (
							<span className="inline-flex items-center gap-1">
								<MousePointerClick className="h-4 w-4 text-secondary" />{" "}
								{featuredClicks} clicks
							</span>
						)}
						{typeof featuredUniqueOpens === "number" &&
							featuredUniqueOpens > 0 && (
								<span className="inline-flex items-center gap-1">
									<Eye className="h-4 w-4 text-secondary" />{" "}
									{featuredUniqueOpens} unique opens
								</span>
							)}
						{typeof featuredUniqueClicks === "number" &&
							featuredUniqueClicks > 0 && (
								<span className="inline-flex items-center gap-1">
									<MousePointerClick className="h-4 w-4 text-secondary" />{" "}
									{featuredUniqueClicks} unique clicks
								</span>
							)}
						{typeof featuredOpenRate === "number" && featuredOpenRate > 0 && (
							<span className="inline-flex items-center gap-1">
								{featuredOpenRate}% open rate
							</span>
						)}
						{typeof featuredClickRate === "number" && featuredClickRate > 0 && (
							<span className="inline-flex items-center gap-1">
								{featuredClickRate}% click rate
							</span>
						)}
					</div>
					<div className="mb-4 flex flex-col items-center space-y-1">
						<Link
							href={featuredPost.web_url || "#"}
							className="line-clamp-2 text-center font-semibold text-xl transition-colors hover:text-primary"
						>
							{truncateTitle(featuredPost.title)}
						</Link>
						{featuredPost.subtitle && (
							<small className="text-center text-muted-foreground text-sm">
								{truncateSubtitle(featuredPost.subtitle)}
							</small>
						)}
						{/* Vital web stats for featured post */}
					</div>
					<div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
						{Array.isArray(featuredPost.content_tags) &&
						featuredPost.content_tags.length > 0 ? (
							featuredPost.content_tags
								.filter((tag): tag is string => typeof tag === "string")
								.map((tag) => (
									<Link
										key={tag}
										href={`/blogs?tag=${tag}`}
										className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs"
									>
										{tag}
									</Link>
								))
						) : (
							<span className="text-muted-foreground text-xs">No tags</span>
						)}
					</div>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<div className="flex w-full items-center justify-center md:w-auto md:justify-start">
							<span className="text-black text-sm dark:text-white/80">
								{featuredPost.authors?.join(", ")}
							</span>
						</div>
						<Link
							href={featuredPost.web_url || "#"}
							className="inline-flex items-center text-primary text-sm transition-colors hover:text-tertiary"
						>
							Read Article <ArrowUpRight className="ml-1 h-3 w-3" />
						</Link>
					</div>
				</div>
			</motion.div>
		</Suspense>
	);
};

export default FeaturedBlogCard;
