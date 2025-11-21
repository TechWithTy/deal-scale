import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useDataModule } from "@/stores/useDataModuleStore";
import type { TeamMember } from "@/types/about/team";
import React from "react";
import Header from "../common/Header";

interface AboutTeamProps {
	team?: TeamMember[];
}

export default function AboutTeam({ team }: AboutTeamProps) {
	const { status, teamMembers, error } = useDataModule(
		"about/team",
		({ status: moduleStatus, data, error: moduleError }) => ({
			status: moduleStatus,
			teamMembers: data?.teamMembers ?? [],
			error: moduleError,
		}),
	);

	const hasProvidedTeam = Array.isArray(team) && team.length > 0;
	const resolvedTeam = hasProvidedTeam ? team : teamMembers;
	const hasResolvedTeam = resolvedTeam.length > 0;
	const isLoadingFromStore =
		!hasProvidedTeam && (status === "idle" || status === "loading");
	const isErroredFromStore = !hasProvidedTeam && status === "error";

	if (isLoadingFromStore) {
		return (
			<section>
				<div className="mx-auto max-w-4xl text-center">
					<Header title="Our Team" subtitle="" />
					<div className="py-12 text-muted-foreground">Loading team…</div>
				</div>
			</section>
		);
	}

	if (isErroredFromStore) {
		console.error("[AboutTeam] Failed to load team", error);
		return (
			<section>
				<div className="mx-auto max-w-4xl text-center">
					<Header title="Our Team" subtitle="" />
					<div className="py-12 text-destructive">
						Unable to load team members right now.
					</div>
				</div>
			</section>
		);
	}

	if (!hasResolvedTeam) {
		return (
			<section>
				<div className="mx-auto max-w-4xl text-center">
					<Header title="Our Team" subtitle="" />
					<div className="py-12 text-muted-foreground">
						Team information is coming soon.
					</div>
				</div>
			</section>
		);
	}

	return (
		<section>
			{/* Uses theme bg-card as per Templating.md */}
			<div className="mx-auto max-w-4xl text-center">
				<Header title="Our Team" subtitle="" />
				<AnimatedTestimonials testimonials={resolvedTeam} />
			</div>
		</section>
	);
}
