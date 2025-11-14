"use client";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/data/categories";
import { projects } from "@/data/projects";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHasMounted } from "@/hooks/useHasMounted";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Link } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const Projects = () => {
	// All hooks at the top
	const hasMounted = useHasMounted();
	const [activeDot, setActiveDot] = useState(0);
	const isMobile = useIsMobile();
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [visibleItemsCount, setVisibleItemsCount] = useState(3);
	const [showAllTags, setShowAllTags] = useState(false);

	// Category filter logic
	const { activeCategory, setActiveCategory, CategoryFilter } =
		useCategoryFilter(categories);

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

	// Only after all hooks, do early return
	if (!hasMounted) return null;

	const totalSlides = Math.max(1, projects.length - (visibleItemsCount - 1));

	// Filter projects by active category (except 'all')
	const filteredProjects =
		activeCategory === "all"
			? projects
			: projects.filter((p) =>
					p.tags
						.map((t) => t.toLowerCase())
						.includes(activeCategory.toLowerCase()),
				);

	return (
		<section id="projects" className="relative p-4 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-6 flex w-full flex-col items-center justify-center md:mb-10">
					<SectionHeading
						centered
						title="Our Live Projects"
						description="Explore our portfolio of innovative AI-powered software solutions delivered to clients worldwide."
						className="mb-4 text-center md:mb-0"
					/>
				</div>

				{/* Category filter row */}
				<CategoryFilter />

				<div className="relative mt-4 min-w-0 overflow-x-visible">
					<Carousel
						opts={{
							align: "start",
							loop: false,
						}}
						className="my-2 w-full touch-pan-x"
						setApi={setApi}
					>
						<CarouselContent className="my-2 ml-0 flex min-w-0">
							{filteredProjects.map((project) => (
								<CarouselItem
									key={project.id}
									className="min-w-0 flex-shrink-0 pl-2 sm:basis-[85%] md:basis-1/2 md:pl-4 lg:basis-1/3"
								>
									<div className="glass-card h-full overflow-hidden rounded-xl transition-all duration-300 hover:border-primary/30">
										<Image
											src={project.image}
											alt={project.title}
											className="h-40 w-full border-white/10 border-b object-cover md:h-48"
											width={400}
											height={225}
										/>
										<div className="p-4 md:p-6">
											<div className="mb-2 flex flex-wrap gap-1 md:mb-3 md:gap-2">
												{project.tags.map((tag) => (
													<span
														key={tag}
														className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs"
													>
														{tag}
													</span>
												))}
											</div>
											<h3 className="mb-2 font-semibold text-lg md:text-xl">
												{project.title}
											</h3>
											<p className="mb-3 line-clamp-3 text-black text-xs md:mb-4 md:text-sm dark:text-white/70">
												{project.description}
											</p>
											<a
												href={project.link}
												className="inline-flex items-center text-primary text-sm transition-colors hover:text-tertiary"
											>
												View Case Study <ArrowRight className="ml-1 h-3 w-3" />
											</a>
										</div>
									</div>
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
									aria-label="Previous project"
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
									aria-label="Next project"
								>
									<ArrowRight className="h-4 w-4 min-w-[1rem] text-primary" />
								</Button>
							</motion.div>
						</div>
					</div>
				</div>
				<div className="mt-4 flex justify-center space-x-1.5 md:mt-6 md:space-x-2">
					{Array.from({ length: totalSlides }).map((_, index) => (
						<button
							key={uuidv4()}
							type="button"
							className={`h-2 w-2 rounded-full border border-neutral-200 transition-all duration-300 md:h-3 md:w-3 dark:border-neutral-700 ${
								activeDot === index
									? "w-4 bg-primary md:w-6"
									: "bg-black/20 hover:bg-black/40 dark:bg-white/20 dark:hover:bg-white/40"
							}`}
							onClick={() => api?.scrollTo(index)}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Projects;
