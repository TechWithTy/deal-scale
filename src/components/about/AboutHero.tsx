import { AuroraText } from "@/components/magicui/aurora-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useDataModule } from "@/stores/useDataModuleStore";
import React from "react";
// * Accepts title and subtitle as props for reusability

// * Magic UI: BlurFade, AuroraText, GridBackground
// * Framer Motion for extra animation if needed
// ! This component is the hero section for the About page

export default function AboutHero({
        title,
        subtitle,
}: { title?: string; subtitle?: string }) {
        const { status, hero, error } = useDataModule(
                "about/hero",
                ({ status: heroStatus, data, error: heroError }) => ({
                        status: heroStatus,
                        hero: data?.hero,
                        error: heroError,
                }),
        );

        const resolvedTitle = title ?? hero?.title ?? "About Deal Scale";
        const resolvedSubtitle = subtitle ?? hero?.subtitle ?? "";

        if (!title && !hero && status === "loading") {
                return (
                        <section className="relative flex items-center justify-center bg-background py-20 md:py-32">
                                <div className="text-muted-foreground">Loading story…</div>
                        </section>
                );
        }

        if (!title && !hero && status === "error") {
                console.error("[AboutHero] Failed to load hero copy", error);
        }

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
                                        {resolvedTitle}
                                </AuroraText>
                                <p className="text-lg text-muted-foreground md:text-2xl">
                                        {resolvedSubtitle}
                                </p>
                        </div>
                </section>
        );
}
