import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useDataModule } from "@/stores/useDataModuleStore";
import type { TeamMember } from "@/types/about/team";
import React from "react";
import Header from "../common/Header";

interface AboutTeamProps {
        team?: TeamMember[];
}

export default function AboutTeam({
        team,
}: AboutTeamProps) {
        const { status, teamMembers, error } = useDataModule(
                "about/team",
                ({ status: moduleStatus, data, error: moduleError }) => ({
                        status: moduleStatus,
                        teamMembers: data?.teamMembers ?? [],
                        error: moduleError,
                }),
        );

        const resolvedTeam = team && team.length > 0 ? team : teamMembers;

        if ((!team || team.length === 0) && status === "loading") {
                return (
                        <section className=" ">
                                <div className="mx-auto max-w-4xl text-center">
                                        <Header title="Our Team" subtitle="" />
                                        <div className="py-12 text-muted-foreground">Loading team…</div>
                                </div>
                        </section>
                );
        }

        if ((!team || team.length === 0) && status === "error") {
                        console.error("[AboutTeam] Failed to load team", error);
                        return (
                                <section className=" ">
                                        <div className="mx-auto max-w-4xl text-center">
                                                <Header title="Our Team" subtitle="" />
                                                <div className="py-12 text-destructive">
                                                        Unable to load team members right now.
                                                </div>
                                        </div>
                                </section>
                        );
        }

        return (
                <section className=" ">
                        {/* Uses theme bg-card as per Templating.md */}
                        <div className="mx-auto max-w-4xl text-center">
                                <Header title="Our Team" subtitle="" />
                                <AnimatedTestimonials testimonials={resolvedTeam} />
                        </div>
                </section>
        );
}
