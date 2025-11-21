// ProductHero.tsx
// * Hero section for the products page: bold headline, subtitle, horizontally scrolling hero cards
// ! Follows DRY, SOLID, and type-safe best practices

import { BorderBeam } from "@/components/magicui/border-beam";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { HeroGridItem } from "@/data/products/hero";
import { DEFAULT_GRID, defaultHeroProps } from "@/data/products/hero";
import { toast } from "@/hooks/use-toast";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

export type ProductHeroProps = {
	headline?: string;
	highlight?: string;
	subheadline?: string;
	grid?: HeroGridItem[];
	testimonial?: {
		quote: string;
		author: string;
	};
};

interface ProductHeroExtendedProps extends ProductHeroProps {
	categories: { id: string; name: string }[];
	setActiveCategory: (cat: string) => void;
	gridRef: React.RefObject<HTMLDivElement>;
}

const ProductHero: React.FC<ProductHeroExtendedProps> = (props) => {
	const router = useNavigationRouter();
	const {
		headline = "",
		highlight = "",
		subheadline = "",
		grid = [],
		testimonial,
		categories = [],
		setActiveCategory = () => {},
		gridRef,
	} = {
		...defaultHeroProps,
		...props,
	};

	const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi | null>(
		null,
	);
	const [activeHeroSlide, setActiveHeroSlide] = useState(0);
	const [heroSlideCount, setHeroSlideCount] = useState(0);

	// Helper for keyboard accessibility
	const handleKeyDown =
		(href: string) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				router.push(href);
			}
		};

	// Handle category selection with scroll behavior
	const handleCategorySelect = (categoryId: string) => {
		const exists = categories.some((c) => c.id === categoryId); // * Robust category lookup using categoryId
		if (exists) {
			setActiveCategory(categoryId);
			window.location.hash = `category=${categoryId}`;
			setTimeout(() => {
				gridRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
			// * Logging for success
			console.log(`[ProductHero] Category click successful: '${categoryId}'`);
		} else {
			toast({ title: "Category does not exist." });
			// ! Logging for failure
			console.warn(
				`[ProductHero] Category click failed: '${categoryId}' does not exist`,
			);
		}
	};

	const heroGrid = useMemo(
		() => (grid.length > 0 ? grid : DEFAULT_GRID),
		[grid],
	);

	useEffect(() => {
		if (!heroCarouselApi) {
			return;
		}

		const handleSelect = () => {
			setActiveHeroSlide(heroCarouselApi.selectedScrollSnap());
		};

		setHeroSlideCount(heroCarouselApi.scrollSnapList().length);
		handleSelect();
		heroCarouselApi.on("select", handleSelect);

		return () => {
			heroCarouselApi.off("select", handleSelect);
		};
	}, [heroCarouselApi, heroGrid.length]);

	return (
		<div className="mx-auto my-5 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
			<h1 className="mb-8 font-bold text-5xl text-primary md:text-7xl">
				{headline}{" "}
				<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
					{highlight}
				</span>
			</h1>
			<p className="mx-auto mb-16 max-w-2xl text-foreground/80 text-xl">
				{subheadline}
			</p>
			<Carousel
				opts={{ align: "start" }}
				className="group relative"
				setApi={setHeroCarouselApi}
			>
				<CarouselContent className="ml-0 flex min-w-0 snap-x items-start gap-4 sm:gap-6">
					{heroGrid.map((item) => (
						<CarouselItem
							key={item.label}
							className="min-w-0 basis-full pl-1 sm:basis-1/2 sm:pl-2 lg:basis-1/3 lg:pl-3"
						>
							<button
								className="group glow glow-hover relative block w-full cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
								onClick={() => handleCategorySelect(item.categoryId)}
								type="button"
								aria-label={item.ariaLabel || item.label}
								tabIndex={0}
								onKeyDown={handleKeyDown(item.link)}
								data-hero-card
							>
								<div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[3/2] lg:aspect-[5/4]">
									<img
										src={item.src}
										alt={item.alt}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										draggable={false}
									/>
									<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
										<div className="text-white">
											<h3
												className="mb-1.5 font-bold text-lg leading-tight transition-colors duration-200 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] hover:text-accent md:text-xl"
												title={
													categories.some((c) => c.id === item.categoryId)
														? `Filter by ${item.label}`
														: `No category '${item.label}'`
												}
											>
												{item.label}
											</h3>
											{item.description && (
												<p className="text-sm text-white/95 leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] md:text-base">
													{item.description}
												</p>
											)}
										</div>
									</div>
								</div>
							</button>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="-left-4 -translate-y-1/2 absolute top-1/2 hidden h-10 w-10 rounded-full border-primary/40 bg-background/80 text-primary backdrop-blur hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:flex" />
				<CarouselNext className="-right-4 -translate-y-1/2 absolute top-1/2 hidden h-10 w-10 rounded-full border-primary/40 bg-background/80 text-primary backdrop-blur hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:flex" />
			</Carousel>
			{heroSlideCount > 1 && (
				<div className="mt-6 flex justify-center gap-2">
					{Array.from({ length: heroSlideCount }).map((_, index) => (
						<button
							key={`hero-dot-${index.toString()}`}
							type="button"
							className={cn(
								"h-2.5 w-2.5 rounded-full border border-primary/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
								activeHeroSlide === index
									? "bg-primary"
									: "bg-primary/20 hover:bg-primary/40",
							)}
							onClick={() => heroCarouselApi?.scrollTo(index)}
							aria-label={`Go to hero slide ${index + 1}`}
						/>
					))}
				</div>
			)}

			<div className="glow relative mx-auto my-5 max-w-2xl overflow-hidden rounded-2xl bg-card p-8 text-card-foreground shadow-lg">
				<BorderBeam duration={8} size={100} />
				<blockquote className="mb-4 text-foreground/90 text-lg">
					{testimonial?.quote}
				</blockquote>
				{testimonial?.author && (
					<cite className="font-medium text-primary">
						— {testimonial.author}
					</cite>
				)}
			</div>
		</div>
	);
};

export default ProductHero;
