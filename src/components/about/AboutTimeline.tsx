import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { useDataModule } from "@/stores/useDataModuleStore";
import React from "react";
import Header from "../common/Header";
// ! Default to new timeline data. Accepts override for reusability.

interface AboutTimelineProps {
        milestones?: TimelineEntry[];
}

export default function AboutTimeline({
        milestones,
}: AboutTimelineProps) {
        const { status, timeline, error } = useDataModule(
                "about/timeline",
                ({ status: moduleStatus, data, error: moduleError }) => ({
                        status: moduleStatus,
                        timeline: data?.timeline ?? [],
                        error: moduleError,
                }),
        );

        const resolvedTimeline = milestones && milestones.length > 0 ? milestones : timeline;

        if ((!milestones || milestones.length === 0) && status === "loading") {
                return (
                        <section className=" my-5 ">
                                <Header title="Our Journey" subtitle="" />
                                <div className="py-12 text-center text-muted-foreground">
                                        Loading timeline…
                                </div>
                        </section>
                );
        }

        if ((!milestones || milestones.length === 0) && status === "error") {
                console.error("[AboutTimeline] Failed to load timeline", error);
                return (
                        <section className=" my-5 ">
                                <Header title="Our Journey" subtitle="" />
                                <div className="py-12 text-center text-destructive">
                                        Unable to load timeline right now.
                                </div>
                        </section>
                );
        }

        return (
                <section className=" my-5 ">
                        <Header title="Our Journey" subtitle="" />
                        {/* Uses theme bg-card as per Templating.md */}
                        <div className="mx-auto max-w-3xl">
                                {/* Magic UI: AnimatedList or Timeline */}
                                <Timeline data={resolvedTimeline} />
                        </div>
                </section>
        );
}
