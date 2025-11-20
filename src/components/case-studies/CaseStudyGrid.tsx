"use client";
import { GlassCard } from "@/components/ui/glass-card";
import type { CaseStudy } from "@/types/case-study";
import { motion } from "framer-motion";
import { ChevronRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

// Accepts caseStudies and categoryFilter as props
import { useCategoryFilter } from "@/hooks/use-category-filter";
import { useDataModuleGuardTelemetry } from "@/hooks/useDataModuleGuardTelemetry";
import { useDataModule } from "@/stores/useDataModuleStore";
import Header from "../common/Header";

interface CaseStudyGridProps {
	caseStudies: CaseStudy[];
	title?: string;
	subtitle?: string;
	/**
	 * ! If set, limits the number of visible case studies (used for home/landing page)
	 */
	limit?: number;
	/**
	 * ! If true, shows the "View All Case Studies" button (used for home/landing page)
	 */
	showViewAllButton?: boolean;
	/**
	 * * Controls display of the category filter. Default: true
	 */
	showCategoryFilter?: boolean;
}

const DEFAULT_TITLE = "Case Studies";
const DEFAULT_SUBTITLE =
	"See real success stories and ways to leverage Deal Scale to grow your business.";

const CaseStudyGrid: React.FC<CaseStudyGridProps> = ({
	caseStudies,
	title = DEFAULT_TITLE,
	subtitle = DEFAULT_SUBTITLE,
	limit,
	showViewAllButton = false,
	showCategoryFilter = true,
}) => {
	const {
		status: caseStudyStatus,
		categories: moduleCategories,
		caseStudies: moduleCaseStudies,
		error: caseStudyError,
	} = useDataModule("caseStudy/caseStudies", ({ status, data, error }) => ({
		status,
		categories: data?.caseStudyCategories ?? [],
		caseStudies: data?.caseStudies ?? [],
		error,
	}));

	const hasModuleCaseStudies = moduleCaseStudies.length > 0;
	const guardDetail = useMemo(
		() => ({ providedViaProp: caseStudies.length > 0 }),
		[caseStudies.length],
	);

	useDataModuleGuardTelemetry({
		key: "caseStudy/caseStudies",
		surface: "CaseStudyGrid",
		status: caseStudyStatus,
		hasData: hasModuleCaseStudies,
		error: caseStudyError,
		detail: guardDetail,
	});

	const resolvedCaseStudies =
		caseStudies.length > 0 ? caseStudies : moduleCaseStudies;

	const { activeCategory, setActiveCategory, CategoryFilter } =
		useCategoryFilter(moduleCategories);

	// * If limit is set, ignore category filtering and show latest case studies
	let visibleStudies: CaseStudy[];
	let showViewAll = false;

	if (typeof limit === "number") {
		// todo: If caseStudies have a 'date' or 'createdAt', sort by newest first. Otherwise, use array order.
		visibleStudies = [...resolvedCaseStudies]
			// .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Uncomment if date exists
			.slice(0, limit);
		showViewAll = showViewAllButton && resolvedCaseStudies.length > limit;
	} else {
		// * Filter by category if no limit
		// * Robust filtering: show all if no category, 'All' (any case), empty string, or empty array
		const isAll =
			!activeCategory ||
			(typeof activeCategory === "string" &&
				activeCategory.toLowerCase() === "all") ||
			activeCategory === "" ||
			(Array.isArray(activeCategory) && activeCategory.length === 0);

		const filteredStudies = isAll
			? resolvedCaseStudies
			: resolvedCaseStudies.filter((cs) =>
					cs.categories.includes(activeCategory),
				);
		visibleStudies = filteredStudies;
		showViewAll = showViewAllButton && filteredStudies.length > 0;
	}

	if (
		resolvedCaseStudies.length === 0 &&
		(caseStudyStatus === "idle" || caseStudyStatus === "loading")
	) {
		return (
			<section className="bg-background-dark px-6 py-20 lg:px-8">
				<div className="mx-auto mb-10 max-w-4xl text-center">
					<Header title={title} subtitle={subtitle} size="lg" />
				</div>
				<div className="py-16 text-center text-muted-foreground">
					Loading case studies…
				</div>
			</section>
		);
	}

	if (resolvedCaseStudies.length === 0 && caseStudyStatus === "error") {
		console.error(
			"[CaseStudyGrid] Failed to load case studies",
			caseStudyError,
		);
		return (
			<section className="bg-background-dark px-6 py-20 lg:px-8">
				<div className="mx-auto mb-10 max-w-4xl text-center">
					<Header title={title} subtitle={subtitle} size="lg" />
				</div>
				<div className="py-16 text-center text-destructive">
					Unable to load case studies right now.
				</div>
			</section>
		);
	}

	if (resolvedCaseStudies.length === 0 && caseStudyStatus === "ready") {
		return (
			<section className="bg-background-dark px-6 py-20 lg:px-8">
				<div className="mx-auto mb-10 max-w-4xl text-center">
					<Header title={title} subtitle={subtitle} size="lg" />
				</div>
				<div className="py-16 text-center text-muted-foreground">
					Case studies coming soon.
				</div>
			</section>
		);
	}

	return (
		<section className="bg-background-dark px-6 py-20 lg:px-8">
			{/* Title and subtitle header */}
			<div className="mx-auto mb-10 max-w-4xl text-center">
				<Header
					title={title}
					subtitle={subtitle}
					size="lg" // or "sm", "md", "xl"
				/>
			</div>

			<div className="mx-auto max-w-7xl">
				{/* Optionally render the category filter */}
				{showCategoryFilter && CategoryFilter && <CategoryFilter />}
				<div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
					{visibleStudies.map((study) => (
						<motion.div
							key={study.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="w-full max-w-sm"
						>
							<Link href={`/case-studies/${study.slug}`} passHref>
								<GlassCard
									highlighted={study.featured}
									className="hover:-translate-y-2 flex h-full flex-col transition-all duration-300"
								>
									<div className="relative">
										{study.featured && (
											<div className="absolute top-4 left-4 z-10 rounded bg-focus px-2 py-1 font-medium text-black text-xs dark:text-white">
												Featured
											</div>
										)}
										<div className="relative h-48 overflow-hidden">
											<Image
												src={study.thumbnailImage}
												alt={study.title}
												fill
												style={{ objectFit: "cover" }}
												sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
												className="transition-transform duration-500 group-hover:scale-105"
											/>
										</div>
									</div>
									<div className="flex flex-grow flex-col p-6">
										<div className="mb-3 flex flex-wrap items-center justify-center gap-2">
											{study.categories.map((category) => (
												<span
													key={category}
													className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-medium text-white/80 text-xs backdrop-blur-sm transition-colors hover:bg-white/20"
												>
													{category}
												</span>
											))}
										</div>
										<h3 className="mb-2 text-center font-semibold text-xl transition-colors group-hover:text-primary">
											{study.title}
										</h3>
										<p className="mb-4 line-clamp-2 text-center text-black text-sm dark:text-white/70">
											{study.subtitle}
										</p>
										<span className="inline-flex items-center justify-center text-primary text-sm transition-colors hover:text-tertiary">
											<FileText className="mr-1 h-4 w-4" /> View Case
										</span>
									</div>
								</GlassCard>
							</Link>
						</motion.div>
					))}
				</div>
				{/* Show 'View All Case Studies' button if enabled and more studies exist */}
				{showViewAll && (
					<div className="mt-8 flex justify-center">
						<Link
							href="/case-studies"
							className="inline-flex items-center rounded-md bg-primary px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/60"
						>
							<span>View All Case Studies</span>
							<ChevronRight className="ml-2 h-5 w-5 flex-shrink-0" />
						</Link>
					</div>
				)}
				{visibleStudies.length === 0 && (
					<div className="py-16 text-center">
						<p className="text-black dark:text-white/70">
							No case studies found for this category. Please try another
							filter.
						</p>
					</div>
				)}
			</div>
		</section>
	);
};

export default CaseStudyGrid;
