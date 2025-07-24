"use client";

import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import AiCallingDemo from "../AiCallingDemo";
import { VoiceCloningDemo } from "../VoiceCloningDemo";

const demos = [
	{
		title: "AI Calling Demo",
		component: <AiCallingDemo />,
	},
	{
		title: "Voice Cloning Demo",
		component: <VoiceCloningDemo />,
	},
];

export const DemoCarousel = () => {
	const [emblaRef, emblaApi] = useEmblaCarousel();

	const scrollPrev = React.useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = React.useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	return (
		<div className="relative mt-12">
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex">
					{demos.map((demo) => (
						<div
							className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full p-4"
							key={demo.title}
						>
							<div className="text-card-foreground">
								<div className="p-6">
									<h3 className="font-semibold text-2xl leading-none tracking-tight">
										{demo.title}
									</h3>
								</div>
								<div className="p-6 pt-0">{demo.component}</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="absolute inset-y-0 left-0 z-10 flex items-center">
				<Button
					onClick={scrollPrev}
					variant="outline"
					size="icon"
					className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
			</div>
			<div className="absolute inset-y-0 right-0 z-10 flex items-center">
				<Button
					onClick={scrollNext}
					variant="outline"
					size="icon"
					className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
				>
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};
