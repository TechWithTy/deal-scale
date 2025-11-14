"use client";

import { Button } from "@/components/ui/button";
import SplinePlaceHolder from "@/components/ui/SplinePlaceHolder";
import { default_cal_slug } from "@/data/constants/booking";
import { useCal } from "@/hooks/use-calendly";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { highlightKeyPhrases } from "@/utils/handle-highlight";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type React from "react";
import dynamic from "next/dynamic";

const SplineModel = dynamic(() => import("@/components/ui/spline-model"), {
	ssr: false,
	loading: () => <SplinePlaceHolder />,
});

interface EventsHeroProps {
	title: string;
	subtitle: string;
	splineUrl?: string;
	defaultZoom?: number;
	description?: string;
	keyServiceLeft?: string;
	keyServiceRight?: string;
	calSlug?: string;
}

const EventsHero: React.FC<EventsHeroProps> = ({
	title,
	subtitle,
	splineUrl = "",
	defaultZoom,
	description,
	keyServiceLeft = "Innovative",
	keyServiceRight = "Impactful Projects",
	calSlug = default_cal_slug,
}) => {
	useCal();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const adjustedZoom = isMobile ? (defaultZoom || 0) * 0.7 : defaultZoom;

	return (
		<div className="relative flex flex-col overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12">
			<div className="absolute inset-0 bg-grid-lines opacity-20" />
			<div className="-translate-x-1/2 absolute top-1/4 left-1/2 h-[500px] w-[500px] rounded-full bg-glow-gradient blur-3xl lg:h-[700px] lg:w-[700px] xl:h-[900px] xl:w-[900px]" />
			<div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center gap-6 pt-6 lg:flex-row lg:gap-10 xl:gap-16">
				<div
					className={`w-full ${isMobile ? "order-first" : "lg:order-last lg:w-1/2"} flex h-[300px] items-center justify-center sm:h-[350px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]`}
				>
					<SplineModel />
				</div>
				<div
					className={`flex flex-col items-center justify-center ${isMobile ? "w-full" : "lg:w-1/2 lg:items-start lg:pr-8"}`}
				>
					<div className="neo-blur mb-6 inline-flex w-fit items-center justify-center rounded-full border border-primary/20 px-4 py-1.5 backdrop-blur-md">
						<span className="mr-2 font-medium text-primary text-sm lg:text-base">
							{keyServiceLeft}
						</span>
						<div className="mx-1 h-0.5 w-2 rounded-full bg-primary/50" />
						<span className="ml-1 font-medium text-primary text-sm lg:text-base">
							{keyServiceRight}
						</span>
					</div>
					<h1
						className={`mb-4 animate-fade-in text-center font-bold text-3xl text-glow sm:mb-6 sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl ${isMobile ? "" : "lg:text-left"}`}
					>
						{title}
					</h1>
					<p
						className={`mb-6 text-center text-base text-black sm:mb-10 sm:text-lg lg:text-xl dark:text-white/70 ${isMobile ? "" : "lg:text-left"}`}
					>
						{highlightKeyPhrases(
							description || subtitle || "Explore our innovative projects",
						)}
					</p>
					<div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
						<Button
							data-cal-link={calSlug}
							data-cal-config='{"theme":"dark"}'
							className="relative h-12 overflow-hidden bg-gradient-to-r from-primary to-focus px-6 text-base text-black shadow-lg shadow-primary/20 transition-opacity before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-focus/10 before:opacity-50 hover:opacity-90 lg:h-14 lg:px-8 lg:text-lg dark:text-white"
						>
							Talk to Sales{" "}
							<ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
						</Button>
						<Link href="/contact">
							<Button
								variant="outline"
								className="h-12 border-white/20 bg-white/5 px-6 text-base text-black hover:bg-white/10 lg:h-14 lg:px-8 lg:text-lg dark:text-white"
							>
								Learn More
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventsHero;
