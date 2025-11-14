import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useRef, useEffect, type ReactNode } from "react";

type CustomCarouselProps = {
	children: ReactNode[];
	visibleItemsCount: number;
	className?: string;
};

type CarouselItemProps = {
	children: ReactNode;
};

export function CustomCarousel({
	children,
	visibleItemsCount,
	className = "",
}: CustomCarouselProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const itemWidth = 100 / Math.min(visibleItemsCount, children.length);

	const scrollToIndex = (index: number) => {
		if (!containerRef.current) return;
		const maxIndex = Math.max(0, children.length - visibleItemsCount);
		const targetIndex = Math.max(0, Math.min(index, maxIndex));

		containerRef.current.scrollTo({
			left: targetIndex * (containerRef.current.scrollWidth / children.length),
			behavior: "smooth",
		});
		setActiveIndex(targetIndex);
	};

	const handleScroll = () => {
		if (!containerRef.current) return;
		const scrollPos = containerRef.current.scrollLeft;
		const itemWidth = containerRef.current.scrollWidth / children.length;
		const newIndex = Math.round(scrollPos / itemWidth);

		// Only update if index actually changed
		if (newIndex !== activeIndex) {
			setActiveIndex(newIndex);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll, { passive: true });
			return () => container.removeEventListener("scroll", handleScroll);
		}
	}, []);

	return (
		<div className={`relative ${className}`}>
			<div
				ref={containerRef}
				className="scrollbar-hide w-full touch-pan-x snap-x snap-mandatory overflow-x-auto"
			>
				<div className="flex" style={{ width: `${children.length * 100}%` }}>
					{React.Children.map(children, (child, index) => (
						<div
							key={
								React.isValidElement(child) && child.key != null
									? child.key
									: `carousel-item-${index}`
							}
							className="flex-shrink-0 snap-start px-2"
							style={{ width: `${100 / visibleItemsCount}%` }}
						>
							{child}
						</div>
					))}
				</div>
			</div>

			{children.length > visibleItemsCount && (
				<div className="mt-4 flex items-center justify-between px-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => scrollToIndex(activeIndex - 1)}
						disabled={activeIndex <= 0}
						className="h-8 w-8 p-0"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>

					<div className="flex gap-2">
						{React.Children.map(children, (child, i) => {
							const key =
								React.isValidElement(child) && child.key != null
									? child.key
									: `carousel-dot-${i}`;
							return (
								<button
									key={key}
									type="button"
									onClick={() => scrollToIndex(i)}
									className={`h-3 w-3 rounded-full transition-all ${
										i === activeIndex ? "w-6 bg-primary" : "bg-gray-400"
									}`}
									aria-label={`Go to item ${i + 1}`}
								/>
							);
						})}
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => scrollToIndex(activeIndex + 1)}
						disabled={activeIndex >= children.length - visibleItemsCount}
						className="h-8 w-8 p-0"
					>
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
}

CustomCarousel.Item = function CarouselItem({ children }: CarouselItemProps) {
	return <>{children}</>;
};
