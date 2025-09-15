"use client";

import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilter from "@/components/services/ServiceFilter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServicesByCategory, services } from "@/data/service/services";
import { usePagination } from "@/hooks/use-pagination";
import { useHasMounted } from "@/hooks/useHasMounted";
import {
	SERVICE_CATEGORIES,
	type ServiceCategoryValue,
	type ServiceItemData,
} from "@/types/service/services";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../common/Header";
import { SectionHeading } from "../ui/section-heading";

interface ServicesSectionProps {
	title?: string;
	subtitle?: string;
	showTabs?: Array<ServiceCategoryValue>;
	showSearch: boolean;
	showCategories: boolean;
	activeTab?: ServiceCategoryValue;
	onTabChange?: (tab: ServiceCategoryValue) => void;
}

const ServicesSection = (props: ServicesSectionProps) => {
	const {
		title = "Tailored Solutions for Visionary Companies",
		subtitle = "Whether launching lean or scaling enterprise-wide, we craft user-centric digital experiences that drive growth and innovation.",
		showTabs = [
			SERVICE_CATEGORIES.LEAD_GENERATION,
			SERVICE_CATEGORIES.LEAD_PREQUALIFICATION,
			SERVICE_CATEGORIES.SKIP_TRACING,
			SERVICE_CATEGORIES.AI_FEATURES,
			SERVICE_CATEGORIES.REAL_ESTATE_TOOLS,
		],
		showSearch,
		showCategories,
		activeTab: activeTabProp,
		onTabChange,
	} = props;

	const hasMounted = useHasMounted();
	const currentPathname = usePathname();
	const [internalActiveTab, setInternalActiveTab] =
		useState<ServiceCategoryValue>(showTabs[0]);
	// Pagination state now handled by usePagination

	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState<
		ServiceCategoryValue | ""
	>("");
	const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage()); // Responsive, passed to hook below
	// Define filterServices above its first usage

	const activeTab =
		activeTabProp !== undefined ? activeTabProp : internalActiveTab;

	const filterServices = (categoryValue: ServiceCategoryValue) => {
		const categoryServices = services[categoryValue];
		if (!categoryServices) return [];
		let filtered = Object.entries(categoryServices);
		if (activeCategory) {
			filtered = filtered.filter(([_, s]) =>
				s.categories.includes(activeCategory),
			);
		}
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			filtered = filtered.filter(
				([_, s]) =>
					s.title.toLowerCase().includes(term) ||
					s.description.toLowerCase().includes(term) ||
					s.features.some((f) => f.toLowerCase().includes(term)),
			);
		}
		return filtered;
	};
	const filteredEntries = filterServices(activeTab);

	// Call usePagination ONCE at the top level
	const {
		pagedItems,
		canShowShowMore,
		canShowPagination,
		canShowShowLess,
		prevPage,
		nextPage,
		showMore,
		showLess,
		setPage,
		reset,
		page,
		totalPages,
		setShowAll,
	} = usePagination(filteredEntries, {
		itemsPerPage: cardsPerPage,
		initialPage: 1,
		enableShowAll: true,
	});
	// All hooks above this line!

	useEffect(() => {
		const handleResize = () => setCardsPerPage(getCardsPerPage());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Only after all hooks, do early return
	if (!hasMounted) return null;

	const handleTabChange = (tab: ServiceCategoryValue) => {
		// Reset pagination and search state when tab changes
		setPage(1);
		reset();
		setSearchTerm("");
		setActiveCategory("");

		// Call the appropriate tab change handler
		if (onTabChange) {
			onTabChange(tab);
		} else {
			setInternalActiveTab(tab);
		}
	};

	// Gather all unique categories from all services
	const allServices = Object.values(services).flatMap((cat) =>
		Object.values(cat),
	);
	const uniqueCategories = Array.from(
		new Set(allServices.flatMap((s) => s.categories)),
	);
	const categoryOptions = uniqueCategories.map((cat) => ({
		id: cat,
		name: cat,
	}));

	// * Helper to convert category enum to human-friendly label
	const getTabLabel = (tab: ServiceCategoryValue) => {
		switch (tab) {
			case SERVICE_CATEGORIES.LEAD_GENERATION:
				return "Lead Generation";
			case SERVICE_CATEGORIES.LEAD_PREQUALIFICATION:
				return "Lead Pre-qualification";
			case SERVICE_CATEGORIES.SKIP_TRACING:
				return "Skip Tracing";
			case SERVICE_CATEGORIES.AI_FEATURES:
				return "AI Features";
			case SERVICE_CATEGORIES.REAL_ESTATE_TOOLS:
				return "Real Estate Tools";
			default:
				return tab;
		}
	};

	function getCardsPerPage() {
		if (typeof window !== "undefined") {
			if (window.innerWidth < 640) return 6; // mobile: 3 when collapsed, 6 when expanded
			if (window.innerWidth < 1024) return 3; // md
			return 6; // desktop (2 rows of 3)
		}
		return 6; // SSR fallback
	}

	const renderCardsForCategory = (categoryValue: ServiceCategoryValue) => {
		return (
			<>
				<ServiceFilter
					categories={categoryOptions}
					activeCategory={activeCategory}
					searchTerm={searchTerm}
					onSearch={(term) => {
						setSearchTerm(term);
					}}
					onCategoryChange={(cat) => {
						setActiveCategory(cat);
					}}
					showSearch={showSearch}
					showCategories={showCategories}
				/>
				{filteredEntries.length === 0 ? (
					<div className="py-12 text-center font-semibold text-black text-lg dark:text-white/60">
						No results found. Try a different tab.
					</div>
				) : (
					<>
						<div className="grid min-h-0 grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
							{pagedItems.map(
								([serviceKey, serviceData]: [string, ServiceItemData]) => (
									<ServiceCard
										id={serviceData.id}
										key={serviceData.slugDetails.slug}
										iconName={serviceData.iconName}
										title={serviceData.title}
										description={serviceData.description}
										features={serviceData.features || []}
										slugDetails={serviceData.slugDetails}
										categories={serviceData.categories}
										price={serviceData.price}
										onSale={serviceData.onSale}
										showBanner={serviceData.showBanner}
										bannerText={serviceData.bannerText}
										bannerColor={serviceData.bannerColor}
										className="flex flex-col"
									/>
								),
							)}
						</div>
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
												Show More Services
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
											Show Less Services
										</button>
									)}
								</>
							)}
						</div>
					</>
				)}
			</>
		);
	};

	return (
		<section id="services" className="px-4 py-6 md:px-6 md:py-16 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 text-center">
					<Header
						title="Features"
						subtitle="A full suite of cutting-edge tools designed to help you close more 
deals"
						className="mb-12 md:mb-16"
					/>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={(value) =>
						handleTabChange(value as ServiceCategoryValue)
					}
					className="w-full"
				>
					<div className="-mx-4 mb-8 flex w-full overflow-x-auto px-4 sm:justify-center">
						<TabsList className="inline-flex min-w-max rounded-full border border-white/10 bg-card p-1 backdrop-blur-md">
							{showTabs.map((tab) => (
								<TabsTrigger
									key={tab}
									value={tab}
									className="rounded-full px-4 py-2 font-medium text-black text-sm transition-all duration-200 hover:text-primary data-[state=active]:bg-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-focus/30 data-[state=active]:text-white md:px-6 dark:text-white/70 dark:hover:text-primary"
								>
									{getTabLabel(tab)}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{showTabs.map((tab) => (
						<TabsContent
							key={tab}
							value={tab}
							className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							{renderCardsForCategory(tab)}
							{currentPathname !== "/features" && (
								<div className="mt-12 text-center">
									<Link href="/features" className="inline-block">
										<Button variant="default" size="lg">
											Explore All {getTabLabel(tab)} Services
										</Button>
									</Link>
								</div>
							)}
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	);
};

export default ServicesSection;
