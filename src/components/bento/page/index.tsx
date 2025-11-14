"use client";

import Header from "@/components/common/Header";
import {
	BentoCard as MagicBentoCard,
	BentoGrid as MagicBentoGrid,
} from "@/components/ui/bento-grid";
import type { BentoFeature } from "@/types/bento/features";
import type React from "react";

interface BentoPageProps {
	title: string;
	subtitle: string;
	features: BentoFeature[];
}

const BentoPage: React.FC<BentoPageProps> = ({ title, subtitle, features }) => {
	return (
		<div
			className="py-12 text-black dark:text-white transform-gpu will-change-transform will-change-opacity"
			style={{ overflowClipMargin: "24px" }}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 transform-gpu will-change-transform will-change-opacity">
				<Header title={title} subtitle={subtitle} className="mb-12" />
				<MagicBentoGrid className="lg:grid-rows-3">
					{features.map((feature) => (
						<MagicBentoCard
							key={feature.title}
							name={feature.title}
							description={feature.description ?? ""}
							Icon={() => <>{feature.icon}</>}
							href="#"
							cta="Learn more"
							className={`group relative overflow-hidden bg-background-dark/80 text-foreground shadow-[0_16px_45px_-30px_rgba(14,165,233,0.35)] transition-all duration-300 transform-gpu will-change-transform will-change-opacity dark:bg-background-dark/90 ${feature.className ?? ""}`}
							background={
								<div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-300 transform-gpu will-change-transform will-change-opacity group-hover:blur-sm group-hover:opacity-70">
									{feature.background}
								</div>
							}
						>
							<div className="relative z-10 flex flex-col gap-4 rounded-2xl bg-background/95 p-5 text-left text-foreground shadow-[0_15px_45px_-30px_rgba(14,165,233,0.35)] ring-1 ring-border/40 transition-all duration-300 ease-out transform-gpu will-change-transform will-change-opacity dark:bg-background/85 dark:text-foreground group-hover:bg-background group-hover:ring-accent/50">
								{feature.content}
							</div>
						</MagicBentoCard>
					))}
				</MagicBentoGrid>
			</div>
		</div>
	);
};

export default BentoPage;
