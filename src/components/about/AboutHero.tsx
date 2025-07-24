import { AuroraText } from "@/components/magicui/aurora-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { hero as defaultHero } from "@/data/about/hero";
import React from "react";
// * Accepts title and subtitle as props for reusability

// * Magic UI: BlurFade, AuroraText, GridBackground
// * Framer Motion for extra animation if needed
// ! This component is the hero section for the About page

export default function AboutHero({
	title = defaultHero.title,
	subtitle = defaultHero.subtitle,
}: { title?: string; subtitle?: string }) {
	return (
		<section className="relative flex flex-col items-center justify-center overflow-hidden bg-background py-20 md:py-32">
			{/* Uses theme bg-background as per Templating.md */}
			<div className="-z-10 absolute inset-0">
				<BlurFade>
					<div
						className="h-full w-full"
						style={{
							background: "linear-gradient(135deg, #7f5af0 0%, #2cb67d 100%)",
						}}
					/>
				</BlurFade>
			</div>
			<div className="max-w-2xl space-y-6 text-center">
				{/* Magic UI: AuroraText */}
				<AuroraText className="font-bold text-4xl tracking-tight md:text-6xl">
					{title}
				</AuroraText>
				<p className="text-lg text-muted-foreground md:text-2xl">{subtitle}</p>
			</div>
		</section>
	);
}
