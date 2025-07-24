import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { timeline as defaultTimeline } from "@/data/about/timeline";
import React from "react";
import Header from "../common/Header";
// ! Default to new timeline data. Accepts override for reusability.

interface AboutTimelineProps {
	milestones?: TimelineEntry[];
}

export default function AboutTimeline({
	milestones = defaultTimeline,
}: AboutTimelineProps) {
	return (
		<section className=" my-5 ">
			<Header title="Our Journey" subtitle="" />
			{/* Uses theme bg-card as per Templating.md */}
			<div className="mx-auto max-w-3xl">
				{/* Magic UI: AnimatedList or Timeline */}
				<Timeline data={milestones} />
			</div>
		</section>
	);
}
