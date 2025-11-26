"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowDown, Check, Copy } from "lucide-react";
import { useState } from "react";

// Convert markdown links to plain text for copy (format: "text (url)")
const convertLinksToText = (text: string): string => {
	return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
};

// Parse markdown-style links [text](url) and convert to JSX
const parseLinks = (text: string): (string | JSX.Element)[] => {
	const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
	const parts: (string | JSX.Element)[] = [];
	let lastIndex = 0;
	let key = 0;

	let match: RegExpExecArray | null = null;
	while (true) {
		match = linkRegex.exec(text);
		if (match === null) {
			break;
		}

		// Add text before the link
		if (match.index > lastIndex) {
			parts.push(text.slice(lastIndex, match.index));
		}

		// Add the link
		parts.push(
			<a
				key={key++}
				href={match[2]}
				target="_blank"
				rel="noopener noreferrer"
				className="font-medium text-primary underline-offset-4 hover:underline"
			>
				{match[1]}
			</a>,
		);

		lastIndex = linkRegex.lastIndex;
	}

	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}

	// Always return an array for consistent React rendering
	return parts.length > 0 ? parts : [text];
};

export type FeatureTimelineMilestone = {
	quarter: string;
	status:
		| "Completed"
		| "Alpha"
		| "Active"
		| "In Build"
		| "Upcoming"
		| "Planned";
	initiative: string;
	focus: string;
	summary: string;
	highlights: string[];
};

const statusVariant: Record<
	FeatureTimelineMilestone["status"],
	"default" | "secondary" | "outline"
> = {
	Completed: "default",
	Alpha: "secondary",
	Active: "default",
	"In Build": "outline",
	Upcoming: "secondary",
	Planned: "outline",
};

type FeatureTimelineTableProps = {
	rows: FeatureTimelineMilestone[];
	className?: string;
};

const ITEMS_PER_PAGE = 3;

export function FeatureTimelineTable({
	rows,
	className,
}: FeatureTimelineTableProps) {
	const [copied, setCopied] = useState(false);
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

	if (!rows.length) {
		return null;
	}

	const visibleRows = rows.slice(0, visibleCount);
	const hasMore = visibleCount < rows.length;

	const loadMore = () => {
		setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, rows.length));
	};

	const scrollToUpcomingFeatures = () => {
		const element = document.getElementById("upcoming-features");
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const formatRoadmapForCopy = () => {
		const header =
			"Deal Scale Delivery Roadmap (Alpha → Pilot → Launch Track)\n\n";
		const intro =
			"A strategic view of where Deal Scale is today and what's coming next.\n\nStatuses and progress come from our Product Ops layer—always live, always current.\n\n";

		const roadmapText = rows
			.map((row) => {
				const statusEmoji =
					row.status === "Completed"
						? "✅"
						: row.status === "Alpha"
							? "🟣"
							: row.status === "Active"
								? "🟡"
								: row.status === "In Build"
									? "🔵"
									: row.status === "Upcoming"
										? "🔗"
										: row.status === "Planned"
											? "🔥"
											: "📋";

				return `## ${row.quarter} – ${row.initiative}\n\n**Status:** ${row.status} ${statusEmoji}\n\n**Focus:** ${row.focus}\n\n${row.summary}\n\n**What's Included:**\n\n${row.highlights.map((h) => `* ${convertLinksToText(h)}`).join("\n")}\n\n---\n`;
			})
			.join("\n");

		return header + intro + roadmapText;
	};

	const handleCopy = async () => {
		const text = formatRoadmapForCopy();
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<Card
			className={cn(
				"border-border/60 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80",
				className,
			)}
		>
			<CardHeader className="relative gap-2">
				<div className="absolute top-4 right-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleCopy}
						className="h-8 w-8 p-0"
						aria-label="Copy roadmap"
					>
						{copied ? (
							<Check className="h-4 w-4 text-primary" />
						) : (
							<Copy className="h-4 w-4" />
						)}
					</Button>
				</div>
				<CardTitle className="text-balance pr-10 text-2xl">
					Delivery Roadmap
				</CardTitle>
				<CardDescription className="text-pretty">
					A strategic view of where Deal Scale is today and what's coming next.
					Statuses and progress come from our Product Ops layer—always live,
					always current.
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="max-h-[600px] overflow-y-auto">
					<Table>
						<TableCaption className="text-muted-foreground text-xs">
							All status values are powered by our internal Product Ops
							module—no screenshots, no stale decks, no manual updates.
						</TableCaption>
						<TableHeader className="sticky top-0 z-10 bg-card">
							<TableRow className="bg-muted/40 hover:bg-muted/40">
								<TableHead className="w-[110px] text-muted-foreground text-xs uppercase tracking-wide">
									Quarter
								</TableHead>
								<TableHead className="min-w-[180px] text-muted-foreground text-xs uppercase tracking-wide">
									Initiative
								</TableHead>
								<TableHead className="w-[110px] text-muted-foreground text-xs uppercase tracking-wide">
									Status
								</TableHead>
								<TableHead className="min-w-[150px] text-muted-foreground text-xs uppercase tracking-wide">
									Focus
								</TableHead>
								<TableHead className="min-w-[240px] text-muted-foreground text-xs uppercase tracking-wide">
									What&apos;s Included
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleRows.map((row) => (
								<TableRow
									key={`${row.quarter}-${row.initiative}`}
									className="transition-colors hover:bg-muted/30"
								>
									<TableCell className="align-top font-medium text-foreground">
										{row.quarter}
									</TableCell>
									<TableCell className="align-top font-semibold text-foreground">
										{row.initiative}
										<p className="mt-2 text-muted-foreground text-sm">
											{row.summary}
										</p>
									</TableCell>
									<TableCell className="align-top">
										<Badge
											variant={statusVariant[row.status]}
											className="whitespace-nowrap"
										>
											{row.status}
										</Badge>
									</TableCell>
									<TableCell className="align-top text-muted-foreground text-sm">
										{row.focus}
									</TableCell>
									<TableCell className="align-top">
										<ul className="space-y-2 text-muted-foreground text-sm">
											{row.highlights.map((highlight, idx) => (
												<li
													key={`${row.quarter}-${row.initiative}-${idx}`}
													className="leading-relaxed"
												>
													{parseLinks(highlight)}
												</li>
											))}
										</ul>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{hasMore && (
					<div className="mt-6 flex justify-center border-t pt-6">
						<Button
							variant="outline"
							onClick={loadMore}
							className="w-full border-primary/50 text-primary hover:border-primary hover:bg-primary/10 sm:w-auto dark:border-primary/50 dark:text-primary dark:hover:border-primary dark:hover:bg-primary/10"
						>
							Load More Roadmaps
						</Button>
					</div>
				)}
				<div className="mt-6 flex justify-center border-t pt-6">
					<Button
						variant="default"
						onClick={scrollToUpcomingFeatures}
						className="gap-2 bg-gradient-to-r from-primary via-primary to-focus text-white shadow-lg hover:from-primary/90 hover:via-primary/90 hover:to-focus/90 dark:from-primary dark:via-primary dark:to-focus dark:text-white dark:hover:from-primary/90 dark:hover:via-primary/90 dark:hover:to-focus/90"
					>
						Vote on Upcoming Features
						<ArrowDown className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
