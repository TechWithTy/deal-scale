"use client";
import CaseStudyGrid from "@/components/case-studies/CaseStudyGrid";
import { CTASection } from "@/components/common/CTASection";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import { usePagination } from "@/hooks/use-pagination";
import { useDataModuleGuardTelemetry } from "@/hooks/useDataModuleGuardTelemetry";
import { useDataModule } from "@/stores/useDataModuleStore";
import { useEffect, useMemo } from "react";

export default function CaseStudiesClient() {
	const { status, caseStudies, categories, error } = useDataModule(
		"caseStudy/caseStudies",
		({ status, data, error }) => ({
			status,
			caseStudies: data?.caseStudies ?? [],
			categories: data?.caseStudyCategories ?? [],
			error,
		}),
	);

	const hasModuleData = caseStudies.length > 0;
	const telemetryDetail = useMemo(() => ({ scope: "listing-page" }), []);

	const { activeCategory } = useCategoryFilter(categories);

	const filteredCaseStudies = useMemo(() => {
		if (!hasModuleData) {
			return [];
		}

		const category = typeof activeCategory === "string" ? activeCategory : "";
		const isAll = category.length === 0 || category.toLowerCase() === "all";

		if (isAll) {
			return caseStudies;
		}

		return caseStudies.filter((study) => study.categories.includes(category));
	}, [activeCategory, caseStudies, hasModuleData]);

	const { pagedItems: paginatedCaseStudies, setPage } = usePagination(
		filteredCaseStudies,
		{
			itemsPerPage: 6,
			initialPage: 1,
			enableShowAll: true,
		},
	);

	// Reset to first page when filter changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: category scope handled intentionally
	useEffect(() => {
		setPage(1);
	}, [activeCategory]);

	const guardDetail = useMemo(
		() => ({ ...telemetryDetail, activeCategory }),
		[activeCategory, telemetryDetail],
	);

	useDataModuleGuardTelemetry({
		key: "caseStudy/caseStudies",
		surface: "CaseStudiesClient",
		status,
		hasData: hasModuleData,
		error,
		detail: guardDetail,
	});

	useEffect(() => {
		if (status === "error") {
			console.error("[CaseStudiesClient] Failed to load case studies", error);
		}
	}, [error, status]);

	return (
		<>
			<CaseStudyGrid caseStudies={paginatedCaseStudies} />
			<CTASection
				title="Ready to Achieve Similar Results?"
				description="Let's discuss how our expertise can transform your business challenges into opportunities for growth and innovation."
				buttonText="Get in Touch"
				href={"/contact"}
			/>
		</>
	);
}
