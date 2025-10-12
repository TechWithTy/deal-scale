// ProductHero.tsx
// * Hero section for the products page: bold headline, subtitle, horizontally scrolling hero cards
// ! Follows DRY, SOLID, and type-safe best practices

import { BorderBeam } from "@/components/magicui/border-beam";
import type { HeroGridItem } from "@/data/products/hero";
import { DEFAULT_GRID, defaultHeroProps } from "@/data/products/hero";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type React from "react";

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
	const router = useRouter();
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

        const heroGrid = grid.length > 0 ? grid : DEFAULT_GRID;

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
                        {/* Horizontal Scroll Layout */}
                        <div
                                className="-mx-4 overflow-hidden pb-2 sm:-mx-6 lg:-mx-8"
                                aria-label="Featured product categories"
                        >
                                <div
                                        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8"
                                        role="list"
                                >
                                        {heroGrid.map((item) => (
                                                <button
                                                        key={item.label}
                                                        className={cn(
                                                                "group glow glow-hover relative flex h-full min-h-[260px] min-w-0 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                                                                "aspect-[4/3] sm:aspect-[5/4] md:aspect-[4/3]",
                                                                "snap-start sm:min-h-[280px] md:min-h-[300px]",
                                                                "basis-full md:basis-1/2 lg:basis-1/3",
                                                        )}
                                                        onClick={() => handleCategorySelect(item.categoryId)}
                                                        type="button"
                                                        aria-label={item.ariaLabel || item.label}
                                                        tabIndex={0}
                                                        onKeyDown={handleKeyDown(item.link)}
                                                        data-hero-card
                                                        role="listitem"
                                                >
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
                                                </button>
                                        ))}
                                </div>
                        </div>

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
