"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
	ArrowDown,
	ArrowUp,
	CalendarClock,
	ChevronDown,
	Heart,
	Lightbulb,
	Rocket,
	Star,
	Target,
	Users,
	Zap,
} from "lucide-react";
import { type MouseEvent, useState } from "react";
import type { FeatureRequest } from "./types";

const ICON_OPTIONS = [Lightbulb, Rocket, Star, Zap, Heart];
const ICON_LABELS = ["Idea", "Launch", "Favorite", "Lightning", "Love"];

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
	feature: FeatureRequest;
	onVote: (featureId: string, voteType: "up" | "down") => Promise<boolean>;
	isVoting: boolean;
	iconIndex?: number;
	showIconPicker?: boolean;
	isTopFeature?: boolean;
	onAutoScrollPause?: () => void;
	onAutoScrollResume?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
	planned:
		"border-sky-400/40 bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-100",
	planning:
		"border-sky-400/40 bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-100",
	in_progress:
		"border-amber-400/40 bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100",
	in_development:
		"border-indigo-400/30 bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-100",
	in_discovery:
		"border-purple-400/30 bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-100",
	under_review:
		"border-violet-400/30 bg-violet-500/10 text-violet-700 dark:bg-violet-500/15 dark:text-violet-100",
	backlogged:
		"border-slate-400/30 bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-100",
	released:
		"border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100",
	testing:
		"border-orange-400/30 bg-orange-500/10 text-orange-700 dark:bg-orange-500/15 dark:text-orange-100",
	cancelled:
		"border-rose-400/30 bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-100",
};

const normalizeStatusKey = (status?: string) =>
	status?.toLowerCase().replace(/[-\s]+/g, "_") ?? "";

const formatStatusLabel = (status?: string) =>
	status
		?.replace(/[_-]+/g, " ")
		.split(" ")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ") ?? "Status";

const clampPercent = (value?: number) => {
	if (typeof value !== "number" || Number.isNaN(value)) return 0;
	return Math.min(Math.max(Math.round(value), 0), 100);
};

const FeatureCardComponent = ({
	feature,
	onVote,
	isVoting,
	iconIndex = 0,
	showIconPicker = false,
	isTopFeature = false,
	onAutoScrollPause,
	onAutoScrollResume,
	...rest
}: FeatureCardProps) => {
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const isUpvoted = feature.userVote === "up";
	const isDownvoted = feature.userVote === "down";
	const Icon = ICON_OPTIONS[iconIndex] || ICON_OPTIONS[0];
	const normalizedStatus = normalizeStatusKey(feature.status);
	const statusClass =
		STATUS_COLORS[normalizedStatus] ??
		"border-border bg-muted text-muted-foreground";
	const completenessPercent = clampPercent(feature.completeness);
	const lastUpdatedLabel = feature.lastUpdated
		? formatDistanceToNow(new Date(feature.lastUpdated), { addSuffix: true })
		: "Recently";
	const cardClasses = cn(
		"relative flex h-full min-w-[300px] max-w-[300px] flex-col flex-shrink-0 border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md",
		isTopFeature
			? "border-4 border-amber-400 ring-2 ring-amber-300 dark:border-amber-500 dark:bg-amber-500/10 dark:ring-amber-600"
			: "border-border",
	);
	const handleToggleDetails = () => {
		setIsDetailsOpen((prev) => {
			const next = !prev;
			if (next) {
				onAutoScrollPause?.();
			} else {
				onAutoScrollResume?.();
			}
			return next;
		});
	};

	const handleVoteClick =
		(voteType: "up" | "down") =>
		async (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.stopPropagation();
			if (isVoting) {
				return;
			}
			await onVote(feature.id, voteType);
		};

	return (
		<Card className={cardClasses} {...rest}>
			{isTopFeature && (
				<span
					className={cn(
						"absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-xs shadow",
						"bg-amber-400/90 text-amber-900 dark:bg-amber-500/90 dark:text-amber-950",
					)}
				>
					<span role="img" aria-label="Top voted">
						🔥
					</span>
					Top Voted
				</span>
			)}
			{feature.status && (
				<div
					className={cn(
						"absolute top-3 left-4 z-10 rounded-full border px-3 py-1 font-semibold text-xs tracking-wide",
						statusClass,
					)}
				>
					{formatStatusLabel(feature.status)}
				</div>
			)}
			<CardHeader className="flex flex-col items-center gap-2 pb-2">
				<div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
					<Icon
						className="h-7 w-7 text-primary"
						aria-label={ICON_LABELS[iconIndex]}
					/>
				</div>
				{showIconPicker && (
					<div className="flex gap-1">
						{ICON_OPTIONS.map((Ic, idx) => (
							<button
								key={ICON_LABELS[idx]}
								className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
									iconIndex === idx
										? "bg-primary/90 text-primary-foreground ring-2 ring-primary"
										: "bg-muted text-muted-foreground"
								}`}
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
				<CardTitle className="w-full whitespace-pre-line break-words text-center text-xl">
					{feature.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-6">
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center justify-center gap-2 text-xs">
						<Badge
							className={cn(
								"flex items-center gap-2 rounded-full px-3 py-1 text-xs",
								"border border-accent/20 bg-accent text-accent-foreground shadow-sm",
							)}
						>
							<Target className="h-3.5 w-3.5" aria-hidden />
							<span>{feature.category}</span>
						</Badge>
						{feature.icpFocus ? (
							<Badge
								className={cn(
									"flex items-center gap-2 rounded-full px-3 py-1",
									"border border-border/60 bg-background/60 text-muted-foreground",
								)}
							>
								<Target className="h-3 w-3" aria-hidden />
								<span>ICP: {feature.icpFocus}</span>
							</Badge>
						) : null}
					</div>
					<div className="rounded-lg border border-border/50 bg-muted/40 p-3 text-muted-foreground text-sm">
						<button
							type="button"
							className={cn(
								"flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 font-medium text-card-foreground text-sm transition",
								"hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
							)}
							onClick={handleToggleDetails}
							aria-expanded={isDetailsOpen}
						>
							<span>Feature details</span>
							<ChevronDown
								className={cn(
									"h-4 w-4 transition-transform",
									isDetailsOpen && "rotate-180",
								)}
								aria-hidden
							/>
						</button>
						{isDetailsOpen ? (
							<div className="mt-3 space-y-3">
								<p className="whitespace-pre-line break-words">
									{feature.description}
								</p>
								{feature.benefit ? (
									<p className="rounded-md border border-border/40 bg-background/60 p-3 text-muted-foreground text-xs">
										<span className="mr-1 font-semibold text-card-foreground">
											Why it matters:
										</span>
										{feature.benefit}
									</p>
								) : null}
							</div>
						) : null}
					</div>
					<div className="space-y-2 text-muted-foreground text-xs">
						<div className="flex items-center justify-between">
							<span>Completeness</span>
							<span>{completenessPercent}% done</span>
						</div>
						<Progress
							value={completenessPercent}
							className="h-2 bg-muted/80"
							indicatorClassName="bg-primary"
						/>
					</div>
				</div>
				<div className="mt-auto space-y-3 text-muted-foreground text-xs">
					<div className="flex items-center justify-between">
						{feature.owner ? (
							<span className="font-medium text-card-foreground">
								Owner: {feature.owner}
							</span>
						) : (
							<span />
						)}
						<span className="flex items-center gap-1 text-foreground/80">
							<CalendarClock className="h-3.5 w-3.5" aria-hidden />
							Updated {lastUpdatedLabel}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1 font-medium text-card-foreground text-sm">
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
								onPointerDown={(e) => e.stopPropagation()}
								onClick={handleVoteClick("up")}
								disabled={isVoting}
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
								onPointerDown={(e) => e.stopPropagation()}
								onClick={handleVoteClick("down")}
								disabled={isVoting}
								aria-label="Downvote"
							>
								<ArrowDown className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const FeatureCard = Object.assign(FeatureCardComponent, {
	displayName: "FeatureCard",
});

export default FeatureCard;
