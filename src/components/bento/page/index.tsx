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
			className="transform-gpu py-12 text-black will-change-opacity will-change-transform dark:text-white"
			style={{ overflowClipMargin: "24px" }}
		>
			<div className="mx-auto max-w-7xl transform-gpu px-4 will-change-opacity will-change-transform sm:px-6">
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
							className={`group relative transform-gpu overflow-hidden bg-background-dark/80 text-foreground shadow-[0_16px_45px_-30px_rgba(14,165,233,0.35)] transition-all duration-300 will-change-opacity will-change-transform dark:bg-background-dark/90 ${feature.className ?? ""}`}
							background={
								<div className="pointer-events-none absolute inset-0 flex transform-gpu items-center justify-center opacity-50 blur-sm transition-all duration-300 will-change-opacity will-change-transform group-hover:opacity-70 group-hover:blur-sm">
									{feature.background}
								</div>
							}
						>
							<div className="relative z-10 flex transform-gpu flex-col gap-4 rounded-2xl bg-background/98 p-5 text-left text-foreground shadow-[0_15px_45px_-30px_rgba(14,165,233,0.35)] ring-1 ring-border/40 backdrop-blur-lg transition-all duration-300 ease-out will-change-opacity will-change-transform before:absolute before:inset-0 before:rounded-2xl before:bg-black/10 before:pointer-events-none group-hover:bg-background group-hover:ring-accent/50 dark:bg-background/90 dark:text-foreground">
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
