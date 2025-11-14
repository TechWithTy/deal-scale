import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useRef, useEffect } from "react";
interface LogoScrollerProps {
	logos: {
		id: number;
		company: string;
		companyLogo: string;
	}[];
	className?: string;
	activeIndex?: number;
}

export const LogoScroller = ({
	logos,
	className,
	activeIndex,
}: LogoScrollerProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll effect
	useEffect(() => {
		if (!scrollRef.current) return;

		const scrollContainer = scrollRef.current;
		let animationId: number;
		let position = 0;

		const scroll = () => {
			if (!scrollContainer) return;

			position += 0.5;

			// Reset position when we've scrolled all the way through
			if (position >= scrollContainer.scrollWidth / 2) {
				position = 0;
			}

			scrollContainer.scrollLeft = position;
			animationId = requestAnimationFrame(scroll);
		};

		// Start the animation
		animationId = requestAnimationFrame(scroll);

		// Pause animation on hover
		const pauseAnimation = () => cancelAnimationFrame(animationId);
		const resumeAnimation = () => {
			animationId = requestAnimationFrame(scroll);
		};

		scrollContainer.addEventListener("mouseenter", pauseAnimation);
		scrollContainer.addEventListener("mouseleave", resumeAnimation);

		// Clean up
		return () => {
			cancelAnimationFrame(animationId);
			scrollContainer.removeEventListener("mouseenter", pauseAnimation);
			scrollContainer.removeEventListener("mouseleave", resumeAnimation);
		};
	}, []);

	// Duplicate logos for seamless scrolling effect
	const duplicatedLogos = [...logos, ...logos];

	return (
		<div className={cn("relative overflow-hidden", className)}>
			<div
				ref={scrollRef}
				className="scrollbar-none flex space-x-8 overflow-x-auto py-4"
			>
				{duplicatedLogos.map((logo, index) => (
					<div
						key={`${logo.id}-${index}`}
						className={cn(
							"flex flex-shrink-0 items-center justify-center px-4 transition-all duration-300",
							activeIndex !== undefined && index % logos.length === activeIndex
								? "scale-110 opacity-100"
								: "opacity-60 hover:opacity-100",
						)}
					>
						<Image
							src={logo.companyLogo}
							alt={logo.company}
							className="h-10 object-contain md:h-12"
							fill
						/>
					</div>
				))}
			</div>
		</div>
	);
};
