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
};

export function BlogCard({ post, className = "" }: BlogCardProps) {
	// Extract web stats safely
	const webStats = post.stats?.web;
	const views =
		typeof webStats?.views === "number" ? webStats.views : undefined;
	const clicks =
		typeof webStats?.clicks === "number" ? webStats.clicks : undefined;

	return (
		<Card className={`transition-colors ${className}`}>
			<CardHeader className="relative h-48 overflow-hidden p-0">
				{post.thumbnail_url && typeof post.thumbnail_url === "string" ? (
					<Link href={post.web_url || "/"} aria-label={`Read ${post.title}`}>
						<Image
							src={post.thumbnail_url}
							alt={post.title}
							className="h-full w-full object-contain"
							width={800}
							height={450}
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								maxWidth: "100%",
								maxHeight: "100%",
							}}
						/>
					</Link>
				) : (
					<Link href={post.web_url || "/"} aria-label={`Read ${post.title}`}>
						<Image
							src="/placeholder.jpg"
							alt="No image available"
							className="h-full w-full object-contain"
							width={800}
							height={450}
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								maxWidth: "100%",
								maxHeight: "100%",
							}}
						/>
					</Link>
				)}
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
				{/* Vital web stats */}
				<div className="mt-2 flex items-center gap-4 text-muted-foreground text-xs">
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
