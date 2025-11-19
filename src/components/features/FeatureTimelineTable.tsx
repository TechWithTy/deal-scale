"use client";

import { Badge } from "@/components/ui/badge";
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

export type FeatureTimelineMilestone = {
	quarter: string;
	status: "Live" | "Limited Beta" | "In Build" | "Planned";
	initiative: string;
	focus: string;
	summary: string;
	highlights: string[];
};

const statusVariant: Record<
	FeatureTimelineMilestone["status"],
	"default" | "secondary" | "outline"
> = {
	Live: "default",
	"Limited Beta": "secondary",
	"In Build": "outline",
	Planned: "outline",
};

type FeatureTimelineTableProps = {
	rows: FeatureTimelineMilestone[];
	className?: string;
};

export function FeatureTimelineTable({
	rows,
	className,
}: FeatureTimelineTableProps) {
	if (!rows.length) {
		return null;
	}

	return (
		<Card
			className={cn(
				"border-border/60 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80",
				className,
			)}
		>
			<CardHeader className="gap-2">
				<CardTitle className="text-balance text-2xl">
					Delivery Roadmap
				</CardTitle>
				<CardDescription className="text-pretty">
					A transparent view of what is live inside Deal Scale today, what is
					enjoying limited beta access, and the initiatives we are building next
					for revenue and acquisitions teams.
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<Table>
					<TableCaption className="text-muted-foreground text-xs">
						Status values update automatically from our product ops module—no
						screenshots, no stale decks.
					</TableCaption>
					<TableHeader>
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
						{rows.map((row) => (
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
									<Badge variant={statusVariant[row.status]}>
										{row.status}
									</Badge>
								</TableCell>
								<TableCell className="align-top text-muted-foreground text-sm">
									{row.focus}
								</TableCell>
								<TableCell className="align-top">
									<ul className="space-y-2 text-muted-foreground text-sm">
										{row.highlights.map((highlight) => (
											<li key={highlight} className="leading-relaxed">
												{highlight}
											</li>
										))}
									</ul>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}




