"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowDown,
	ArrowUp,
	Heart,
	Lightbulb,
	Rocket,
	Star,
	Users,
	Zap,
} from "lucide-react"; // * Added 5 Lucide icons + Users icon
import type { FeatureRequest } from "./types";
import { useRouter } from "next/navigation";

// * Icon options for cards (extendable)
const ICON_OPTIONS = [Lightbulb, Rocket, Star, Zap, Heart];
const ICON_LABELS = ["Idea", "Launch", "Favorite", "Lightning", "Love"];

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
	feature: FeatureRequest;
	onVote: (featureId: string, voteType: "up" | "down") => void;
	isVoting: boolean;
	iconIndex?: number; // * Optional: which icon to show (0-4)
	showIconPicker?: boolean; // * Optional: show icon picker (future/admin)
	isTopFeature?: boolean; // * Highlight as top feature
}

// * Theme-adaptive status colors
const statusColors: Record<string, string> = {
	Planned:
		"bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
	"In Progress":
		"bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",
	Completed:
		"bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
	Rejected:
		"bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
	"Under Review":
		"bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700",
};

// * Capitalize first letter utility
function capitalizeFirst(text?: string) {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1);
}

const FeatureCard = ({
	feature,
	onVote,
	isVoting,
	iconIndex = 0,
	showIconPicker = false,
	isTopFeature = false,
	...rest
}: FeatureCardProps) => {
	const router = useRouter();
	// Helper functions to determine button states
	const isUpvoted = feature.userVote === "up";
	const isDownvoted = feature.userVote === "down";
	// * Determine icon
	const Icon = ICON_OPTIONS[iconIndex] || ICON_OPTIONS[0];

	// * Banner color based on status
	const statusClass =
		feature.status && statusColors[feature.status]
			? statusColors[feature.status]
			: "bg-muted text-muted-foreground border-muted";

	return (
		<Card
			className={`relative min-w-[300px] max-w-[300px] flex-shrink-0 border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md ${isTopFeature ? "border-4 border-amber-400 ring-2 ring-amber-300 dark:border-amber-500 dark:bg-amber-500/10 dark:ring-amber-600 dark:before:absolute dark:before:inset-0 dark:before:rounded-[inherit] dark:before:bg-amber-500/10 dark:before:blur-sm dark:before:content-['']" : "border-border"}`}
			{...rest}
		>
			{isTopFeature && (
				<span
					className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full bg-amber-400/90 px-3 py-1 font-bold text-amber-900 text-xs shadow dark:bg-amber-500/90 dark:text-amber-950"
					aria-label="Top voted feature"
				>
					<span role="img" aria-label="fire">
						🔥
					</span>{" "}
					Top Voted
				</span>
			)}{" "}
			{feature.status && (
				<div
					className={`absolute top-3 left-4 z-10 rounded-full border px-3 py-1 font-semibold text-xs tracking-wide ${statusClass}`}
				>
					{capitalizeFirst(feature.status)}
				</div>
			)}
			<CardHeader className="flex flex-col items-center gap-2 pb-2">
				{/* * Feature Icon */}
				<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
					<Icon
						className="h-7 w-7 text-primary"
						aria-label={ICON_LABELS[iconIndex]}
					/>
				</div>
				{/* ? Icon Picker (optional, for admin/future use) */}
				{showIconPicker && (
					<div className="mb-2 flex gap-1">
						{ICON_OPTIONS.map((Ic, idx) => (
							<button
								key={ICON_LABELS[idx]}
								className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${iconIndex === idx ? "bg-primary/90 text-primary-foreground ring-2 ring-primary" : "bg-muted text-muted-foreground"}`}
								// todo: Add onClick to change iconIndex in parent (controlled)
								type="button"
								aria-label={`Select ${ICON_LABELS[idx]} icon`}
								tabIndex={-1}
								disabled
							>
								<Ic className="h-5 w-5" />
							</button>
						))}
					</div>
				)}
				<CardTitle className="w-full whitespace-pre-line break-words text-center text-card-foreground text-xl">
					{feature.title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="mb-4 whitespace-pre-line break-words text-muted-foreground text-sm">
					{feature.description}
				</p>
				<div className="mt-2 flex items-center justify-between">
					<span className="flex items-center gap-1 font-medium text-card-foreground">
						<Users
							className="h-4 w-4 text-muted-foreground"
							aria-label="Community votes"
						/>
						{feature.upvotes} votes
					</span>
					<div className="flex gap-2">
						<Button
							type="button"
							size="sm"
							variant={isUpvoted ? "default" : "outline"}
							className={
								isUpvoted
									? "bg-primary/90 text-primary-foreground ring-2 ring-primary"
									: ""
							}
							onPointerDown={(e) => {
								e.stopPropagation();
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								console.log("[FeatureCard] Upvote clicked", {
									id: feature.id,
									title: feature.title,
								});
								onVote(feature.id, "up");
								const params = new URLSearchParams();
								params.set("featureVotes", `${feature.id},${feature.title}`);
								const url = `/contact-pilot?${params.toString()}`;
								console.log("[FeatureCard] Navigating to", url);
								router.push(url);
							}}
							aria-label="Upvote"
						>
							<ArrowUp className="h-4 w-4" />
						</Button>
						<Button
							type="button"
							size="sm"
							variant={isDownvoted ? "default" : "outline"}
							className={
								isDownvoted
									? "bg-destructive/90 text-destructive-foreground ring-2 ring-destructive"
									: ""
							}
							onPointerDown={(e) => {
								e.stopPropagation();
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								console.log("[FeatureCard] Downvote clicked", {
									id: feature.id,
									title: feature.title,
								});
								onVote(feature.id, "down");
								const url = "/contact-pilot";
								console.log("[FeatureCard] Navigating to", url);
								router.push(url);
							}}
							aria-label="Downvote"
						>
							<ArrowDown className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default FeatureCard;
