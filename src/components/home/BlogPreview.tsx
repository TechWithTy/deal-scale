"use client";

import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { BeehiivPost } from "@/types/behiiv";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../common/Header";
import { SectionHeading } from "../ui/section-heading";
type BlogPreviewProps = {
	posts: BeehiivPost[];
	title?: string;
	showViewAll?: boolean;
	className?: string;
};

export function BlogPreview({
	posts,
	title = "Latest Insights",
	showViewAll = true,
	className = "",
}: BlogPreviewProps) {
	const isMobile = useIsMobile();
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [activeDot, setActiveDot] = useState(0);
	const [visibleItemsCount, setVisibleItemsCount] = useState(3);
	const hasMounted = useHasMounted();

	useEffect(() => {
		if (!api) return;

		const handleSelect = () => {
			if (!api) return;
			setActiveDot(api.selectedScrollSnap());
		};

		api.on("select", handleSelect);
		handleSelect();

		return () => {
			api.off("select", handleSelect);
		};
	}, [api]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const updateVisibleItems = () => {
			const width = window.innerWidth;
			if (width < 640) {
				setVisibleItemsCount(1);
			} else if (width < 1024) {
				setVisibleItemsCount(2);
			} else {
				setVisibleItemsCount(3);
			}
		};

		updateVisibleItems();
		window.addEventListener("resize", updateVisibleItems);

		return () => {
			window.removeEventListener("resize", updateVisibleItems);
		};
	}, []);

	if (!hasMounted) return null;

	if (!posts || posts.length === 0) return null;

	const totalSlides = Math.max(1, posts.length - (visibleItemsCount - 1));
	const shouldUseCarousel = isMobile || posts.length > 3;

	return (
		<section id="blog" className={`px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
			<div className="mx-auto max-w-7xl">
				<div className="mb-8 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
					<Header title={title} size="lg" className="mb-12" />
					{showViewAll && (
						<Button
							asChild
							variant="outline"
							className="w-fit border-primary/30 text-primary hover:bg-primary/10"
						>
							<Link href="/blogs" className="flex items-center justify-center">
								View All Articles
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					)}
				</div>

				{shouldUseCarousel ? (
					<div className="relative">
						<Carousel
							opts={{
								align: "start",
								loop: false,
							}}
							className="w-full touch-pan-x"
							setApi={setApi}
						>
							<CarouselContent className="-ml-2 md:-ml-4">
								{posts.map((post, idx) => (
									<CarouselItem
										key={typeof post.id === "string" ? post.id : idx}
										className="pl-2 sm:basis-[85%] md:basis-1/2 md:pl-4 lg:basis-1/3"
									>
										<BlogCard post={post} />
									</CarouselItem>
								))}
							</CarouselContent>

							<CarouselPrevious className="-left-4 lg:-left-6 absolute hidden border-primary/30 text-primary hover:bg-primary/10 md:flex" />
							<CarouselNext className="-right-4 lg:-right-6 absolute hidden border-primary/30 text-primary hover:bg-primary/10 md:flex" />
						</Carousel>

						<div className="relative z-10 mt-4 flex justify-center md:hidden">
							<div className="flex space-x-2">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										size="default"
										className="h-8 w-8 border border-primary/50 bg-white/10 text-primary hover:bg-primary/10"
										onClick={() => api?.scrollPrev()}
										disabled={activeDot === 0}
										aria-label="Previous post"
									>
										<ArrowLeft className="h-4 w-4 min-w-[1rem] text-primary" />
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										size="default"
										className="h-8 w-8 border border-primary/50 bg-white/10 text-primary hover:bg-primary/10"
										onClick={() => api?.scrollNext()}
										disabled={activeDot === totalSlides - 1}
										aria-label="Next post"
									>
										<ArrowRight className="h-4 w-4 min-w-[1rem] text-primary" />
									</Button>
								</motion.div>
							</div>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{posts.slice(0, 3).map((post, idx) => (
							<div
								key={typeof post.id === "string" ? post.id : idx}
								className="flex w-full"
							>
								<div className="w-full max-w-full flex-1">
									<BlogCard post={post} />
								</div>
							</div>
						))}
					</div>
				)}

				{shouldUseCarousel && (
					<div className="mt-4 flex justify-center space-x-1.5 md:mt-6 md:space-x-2">
						{Array.from({ length: totalSlides }).map((_, index) => (
							<button
								key={uuidv4()}
								type="button"
								className={`h-2 w-2 rounded-full transition-all duration-300 md:h-3 md:w-3 ${
									activeDot === index
										? "w-4 bg-primary md:w-6"
										: "bg-white/20 hover:bg-white/40"
								}`}
								onClick={() => api?.scrollTo(index)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
