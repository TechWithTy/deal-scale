"use client";

import BentoCard from "@/components/bento/BentoCard";
import BentoGrid from "@/components/bento/BentoGrid";
import Header from "@/components/common/Header";
import { SectionHeading } from "@/components/ui/section-heading";
import type { BentoFeature } from "@/types/bento/features";
import type React from "react";

interface BentoPageProps {
	title: string;
	subtitle: string;
	features: BentoFeature[];
}

const BentoPage: React.FC<BentoPageProps> = ({ title, subtitle, features }) => {
	return (
		<div className="py-12 text-black dark:text-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6">
				<Header title={title} subtitle={subtitle} className="mb-12" />
				<BentoGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => (
						<BentoCard
							key={feature.title}
							title={feature.title}
							description={feature.description || ""}
							icon={feature.icon}
							size={feature.size}
							className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
						>
							{feature.content}
						</BentoCard>
					))}
				</BentoGrid>
			</div>
		</div>
	);
};

export default BentoPage;
