import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { teamMembers as defaultTeamMembers } from "@/data/about/team";
import type { TeamMember } from "@/types/about/team";
import React from "react";
import Header from "../common/Header";

interface AboutTeamProps {
	team?: TeamMember[];
}

export default function AboutTeam({
	team = defaultTeamMembers,
}: AboutTeamProps) {
	return (
		<section className=" ">
			{/* Uses theme bg-card as per Templating.md */}
			<div className="mx-auto max-w-4xl text-center">
				<Header title="Our Team" subtitle="" />
				<AnimatedTestimonials testimonials={team} />
			</div>
		</section>
	);
}
