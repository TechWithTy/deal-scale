"use client";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";

import AiCallingDemo from "@/components/deal_scale/demo/AiCallingDemo";
import LeadEnrichmentDemo from "@/components/deal_scale/demo/LeadEnrichmentDemo";
import MlsSearchDemo from "@/components/deal_scale/demo/MlsSearchDemo";
import RentalMarketAnalyzer from "@/components/deal_scale/demo/RentalMarketAnalyzer";
import { VoiceCloningDemo } from "@/components/deal_scale/demo/VoiceCloningDemo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_LIST = [
	{ value: "rental-market-analysis", label: "Rental Market Analysis" },
	{ value: "mls-search", label: "Off Market Property Search" },
	{ value: "lead-enrichment", label: "Lead Enrichment" },
	{ value: "voice-cloning", label: "Voice Cloning Demo" },
	{ value: "ai-calling", label: "AI Outreach Demo" },
];

const scrollButtonVariants = cva(
	"absolute top-0 z-10 flex h-full items-center justify-center bg-gradient-to-r from-background to-transparent px-4 text-lg font-bold transition-opacity duration-300 ease-in-out",
	{
		variants: {
			direction: {
				left: "left-0 from-background to-transparent",
				right: "right-0 from-background to-transparent rotate-180",
			},
		},
	},
);

interface ScrollButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof scrollButtonVariants> {
	direction: "left" | "right";
}

const ScrollButton = React.forwardRef<HTMLButtonElement, ScrollButtonProps>(
	({ className, direction, ...props }, ref) => (
		<button
			ref={ref}
			type="button"
			className={scrollButtonVariants({ direction, className })}
			{...props}
		>
			&#x2039;
		</button>
	),
);
ScrollButton.displayName = "ScrollButton";

const DemoTabs = () => {
	const tabsContainerRef = React.useRef<HTMLDivElement>(null);

	const handleScroll = (direction: "left" | "right") => {
		const container = tabsContainerRef.current;
		if (container) {
			const scrollAmount = container.clientWidth * 0.8;
			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<Tabs defaultValue="rental-market-analysis" className="w-full py-8">
                        <div className="group relative w-full">
				<ScrollButton
					direction="left"
					aria-label="Scroll left"
					className="opacity-0 group-hover:opacity-100"
					onClick={() => handleScroll("left")}
				/>
				<TabsList
					ref={tabsContainerRef}
					className="scrollbar-hide w-full justify-start overflow-x-auto"
				>
					{TAB_LIST.map((tab) => (
						<TabsTrigger key={tab.value} value={tab.value}>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
				<ScrollButton
					direction="right"
					aria-label="Scroll right"
					className="opacity-0 group-hover:opacity-100"
					onClick={() => handleScroll("right")}
				/>
			</div>

			<TabsContent value="rental-market-analysis">
				<div className="mt-6">
					<RentalMarketAnalyzer />
				</div>
			</TabsContent>
			<TabsContent value="mls-search">
				<div className="mt-6">
					<MlsSearchDemo />
				</div>
			</TabsContent>
			<TabsContent value="lead-enrichment">
				<div className="mt-6">
					<LeadEnrichmentDemo />
				</div>
			</TabsContent>
			<TabsContent value="voice-cloning">
				<div className="mt-6">
					<VoiceCloningDemo />
				</div>
			</TabsContent>
			<TabsContent value="ai-calling">
				<div className="mt-6">
					<AiCallingDemo />
				</div>
			</TabsContent>
		</Tabs>
	);
};

export default DemoTabs;
