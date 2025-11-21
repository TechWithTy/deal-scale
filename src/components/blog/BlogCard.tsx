import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { BeehiivPost } from "@/types/behiiv";
import { ArrowRight, Eye, MousePointerClick } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { truncateSubtitle, truncateTitle } from "./BlogGrid";

type BlogCardProps = {
	post: BeehiivPost;
	className?: string;
	aspectRatio?: "square" | "landscape" | "portrait" | "auto";
};

export function BlogCard({
	post,
	className = "",
	aspectRatio = "landscape",
}: BlogCardProps) {
	// Extract web stats safely
	const webStats = post.stats?.web;
	const emailStats = (post.stats as any)?.email as
		| {
				open_rate?: number;
				click_rate?: number;
				unique_opens?: number;
				unique_clicks?: number;
				opens?: number;
				clicks?: number;
		  }
		| undefined;
	const views =
		typeof webStats?.views === "number" ? webStats.views : undefined;
	const clicks =
		typeof webStats?.clicks === "number" ? webStats.clicks : undefined;
	const uniqueOpens =
		typeof emailStats?.unique_opens === "number"
			? emailStats.unique_opens
			: undefined;
	const uniqueClicks =
		typeof emailStats?.unique_clicks === "number"
			? emailStats.unique_clicks
			: undefined;
	const openRate =
		typeof emailStats?.open_rate === "number"
			? emailStats.open_rate
			: undefined;
	const clickRate =
		typeof emailStats?.click_rate === "number"
			? emailStats.click_rate
			: undefined;

	// Helper function to determine aspect ratio class
	const getAspectRatioClass = () => {
		switch (aspectRatio) {
			case "square":
				return "aspect-square"; // 1:1 (4:4)
			case "portrait":
				return "aspect-[9/16]"; // 9:16
			case "landscape":
			default:
				return "aspect-video"; // 16:9
		}
	};

	return (
		<Card className={`transition-colors ${className}`}>
			<CardHeader className="relative overflow-hidden p-0">
				<div className={`relative w-full ${getAspectRatioClass()}`}>
					{post.thumbnail_url && typeof post.thumbnail_url === "string" ? (
						<Link
							href={post.web_url || "/"}
							aria-label={`Read ${post.title}`}
							className="block h-full w-full"
						>
							<Image
								src={post.thumbnail_url}
								alt={post.title}
								className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</Link>
					) : (
						<Link
							href={post.web_url || "/"}
							aria-label={`Read ${post.title}`}
							className="block h-full w-full"
						>
							<Image
								src="/placeholder.jpg"
								alt="No image available"
								className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</Link>
					)}
				</div>
			</CardHeader>
			<CardContent className="flex-1 pt-6 pr-6 pl-4">
				<div className="mb-3 flex flex-wrap justify-center gap-2">
					{post.content_tags?.map((category: string) => (
						<Link
							key={category}
							href={`/blogs?tag=${category}`}
							className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs"
						>
							{category}
						</Link>
					))}
				</div>
				<div className="mb-4 flex flex-col items-center space-y-1">
					<Link
						href={post.web_url || "/"}
						className="line-clamp-2 text-center font-semibold text-card-foreground text-xl transition-colors hover:text-primary dark:text-card-foreground"
					>
						{truncateTitle(post.title)}
					</Link>
					{post.subtitle && (
						<small className="text-center text-muted-foreground text-sm">
							{truncateSubtitle(post.subtitle)}
						</small>
					)}
				</div>
				{/* Web and Email analytics */}
				<div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground text-xs">
					{typeof views === "number" && views > 0 && (
						<span className="inline-flex items-center gap-1">
							<Eye className="h-4 w-4" /> {views} views
						</span>
					)}
					{typeof clicks === "number" && clicks > 0 && (
						<span className="inline-flex items-center gap-1">
							<MousePointerClick className="h-4 w-4" /> {clicks} clicks
						</span>
					)}
					{typeof uniqueOpens === "number" && uniqueOpens > 0 && (
						<span className="inline-flex items-center gap-1">
							{/* reuse Eye icon to represent opens */}
							<Eye className="h-4 w-4" /> {uniqueOpens} unique opens
						</span>
					)}
					{typeof uniqueClicks === "number" && uniqueClicks > 0 && (
						<span className="inline-flex items-center gap-1">
							<MousePointerClick className="h-4 w-4" /> {uniqueClicks} unique
							clicks
						</span>
					)}
					{typeof openRate === "number" && openRate > 0 && (
						<span className="inline-flex items-center gap-1">
							{openRate}% open rate
						</span>
					)}
					{typeof clickRate === "number" && clickRate > 0 && (
						<span className="inline-flex items-center gap-1">
							{clickRate}% click rate
						</span>
					)}
				</div>
			</CardContent>
			<CardFooter className="flex justify-end pt-0 pr-6 pl-4">
				<Button
					asChild
					variant="link"
					className="px-0 text-primary hover:text-tertiary"
				>
					<Link href={post.web_url || "/"} className="flex items-center">
						Read More
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
