"use client";
import { CTASection } from "@/components/common/CTASection";
import Hero from "@/components/home/heros/Hero";
import PortfolioFilter from "@/components/portfolio/PortfolioFilter";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import { Separator } from "@/components/ui/separator";
import { projects } from "@/data/portfolio";
import { usePagination } from "@/hooks/use-pagination";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PortfolioHomeClient() {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("all");
	// Filter projects by category and search term
	const filteredProjects = projects.filter((project) => {
		const matchesCategory =
			activeCategory === "all" || project.category === activeCategory;
		const matchesSearch =
			project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.description?.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	// Use the pagination hook
	const {
		pagedItems: paginatedProjects,
		page,
		totalPages,
		nextPage,
		prevPage,
		setPage,
		canShowPagination,
		canShowShowMore,
		canShowShowLess,
		showMore,
		showLess,
	} = usePagination(filteredProjects, {
		itemsPerPage: 6,
		initialPage: 1,
		enableShowAll: false, // set true if you want Show More/Less
	});

	// Reset to first page if filter/search changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setPage(1);
	}, [searchTerm, activeCategory]);

	const categories = [
		{ id: "all", name: "All Projects" },
		...Array.from(new Set(projects.map((project) => project.category)))
			.filter(Boolean)
			.map((category) => ({
				id: category,
				name: category.charAt(0).toUpperCase() + category.slice(1),
			})),
	];

	// Pagination controls
	const Pagination = () => (
		<div className="mt-12 flex w-full flex-col items-center justify-center gap-6">
			{canShowPagination && (
				<>
					{/* Show More button at the top */}
					{canShowShowMore && (
						<div className="flex w-full justify-center">
							<button
								className="flex items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
								onClick={showMore}
								type="button"
							>
								Show More Projects
							</button>
						</div>
					)}

					{/* Pagination controls */}
					<div className="flex items-center justify-center gap-2">
						<button
							className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
							onClick={prevPage}
							disabled={page === 1}
							type="button"
							aria-label="Previous page"
						>
							Prev
						</button>
						{/* Page numbers */}
						{Array.from({ length: totalPages }, (_, i) => (
							<button
								key={uuidv4()}
								className={`rounded-lg px-4 py-2 transition-colors ${
									page === i + 1
										? "bg-primary text-primary-foreground"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
								}`}
								onClick={() => setPage(i + 1)}
								type="button"
								aria-label={`Page ${i + 1}`}
							>
								{i + 1}
							</button>
						))}
						<button
							className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
							onClick={nextPage}
							disabled={page === totalPages}
							type="button"
							aria-label="Next page"
						>
							Next
						</button>
					</div>

					{/* Show Less button at the bottom */}
					{canShowShowLess && (
						<button
							className="mt-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
							onClick={showLess}
							type="button"
						>
							Show Less Projects
						</button>
					)}
				</>
			)}
		</div>
	);

	// Debug logs for filtering
	// ! Debug: Log activeCategory and filteredProjects
	console.log("activeCategory", activeCategory);
	console.log(
		"filteredProjects.length",
		filteredProjects.length,
		"projects.length",
		projects.length,
	);

	return (
		<>
			<Hero
				badgeLeft="AI Driven"
				badgeRight="For Wholesalers & Investors"
				headline="Stop Chasing Cold Leads."
				subheadline="Start Closing Deals."
			/>
			<div className="px-6 py-12 lg:px-8">
				<PortfolioFilter
					categories={categories}
					activeCategory={activeCategory}
					onSearch={setSearchTerm}
					onCategoryChange={setActiveCategory}
				/>
				{/* Pass only paginated projects to PortfolioGrid */}
				<PortfolioGrid projects={paginatedProjects} />
				{/* Pagination controls */}
				{totalPages > 1 && <Pagination />}
				<Separator className="mx-auto my-8 max-w-7xl border-white/10" />
				<CTASection
					title="Want to integrate our tools?"
					description="Let's build something amazing together."
					buttonText="Get Started"
					href="/contact"
				/>
			</div>
		</>
	);
}
