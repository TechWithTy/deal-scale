"use client";
import CaseStudyGrid from "@/components/case-studies/CaseStudyGrid";
import { CTASection } from "@/components/common/CTASection";
import HeroSessionMonitor from "@/components/home/heros/HeroSessionMonitor";
import { caseStudies } from "@/data/caseStudy/caseStudies";
import { caseStudyCategories } from "@/data/caseStudy/caseStudies";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import { usePagination } from "@/hooks/use-pagination";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CaseStudiesClient() {
	const { activeCategory } = useCategoryFilter(caseStudyCategories);

	// Filter case studies by active category
	const filteredCaseStudies =
		activeCategory === "all"
			? caseStudies
			: caseStudies.filter((study) =>
					study.categories.includes(activeCategory),
				);

	// Use the pagination hook
	const {
		pagedItems: paginatedCaseStudies,
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
	} = usePagination(filteredCaseStudies, {
		itemsPerPage: 6,
		initialPage: 1,
		enableShowAll: true,
	});

	// Reset to first page when filter changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setPage(1);
	}, [activeCategory]);

	const router = useRouter();
	const handleContactClick = () => {
		router.push("/contact");
	};

	return (
		<>
			{/* Pass paginated and filtered case studies, and category filter, to grid */}
			<CaseStudyGrid caseStudies={paginatedCaseStudies} />
			{/* Pagination controls */}

			<CTASection
				title="Ready to Achieve Similar Results?"
				description="Let's discuss how our expertise can transform your business challenges into opportunities for growth and innovation."
				buttonText="Get in Touch"
				href={"/contact"}
			/>
		</>
	);
}
