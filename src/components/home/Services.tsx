"use client";

import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilter from "@/components/services/ServiceFilter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { useDataModuleGuardTelemetry } from "@/hooks/useDataModuleGuardTelemetry";
import { useDataModule } from "@/stores/useDataModuleStore";
import {
	SERVICE_CATEGORIES,
	type ServiceCategoryValue,
	type ServiceItemData,
	type ServicesData,
} from "@/types/service/services";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../common/Header";

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
	// DEBUG: Track component render and hook count
	// NOTE: These refs are hooks themselves, so they count in hook order
	const renderIdRef = useRef(0);
	const hookCountRef = useRef(0);
	// Component instance ID for debugging - only used in console.log, not in render output
	// useRef initializer only runs once per component instance, so this is safe
	// It will differ between server and client instances, but that's OK for logging
	const componentInstanceId = useRef<string>(
		typeof window !== "undefined"
			? `client-${Date.now()}-${Math.random().toString(36).substring(7)}`
			: `server-${Date.now()}-${Math.random().toString(36).substring(7)}`,
	);
	renderIdRef.current += 1;
	hookCountRef.current = 0;

	// CRITICAL: Date.now() can cause hydration mismatch if used in render output
	// Only use for logging, not for actual rendering logic
	const renderTimestamp = typeof window !== "undefined" ? Date.now() : 0;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Render #${renderIdRef.current} starting (local hooks start at 0)`,
		{
			isServer: typeof window === "undefined",
			timestamp: renderTimestamp,
			instanceId: componentInstanceId.current,
		},
	);

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

	// All hooks must be called unconditionally in the same order every render
	// Note: usePathname() returns "/" during SSR, then the actual pathname on client
	// This can cause hydration mismatches if used for conditional rendering
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useState(internalActiveTab)`,
	);
	const [internalActiveTab, setInternalActiveTab] =
		useState<ServiceCategoryValue>(showTabs[0]);
	// Pagination state now handled by usePagination

	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useState(searchTerm)`,
	);
	const [searchTerm, setSearchTerm] = useState("");
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useState(activeCategory)`,
	);
	const [activeCategory, setActiveCategory] = useState<
		ServiceCategoryValue | ""
	>("");
	// Initialize cardsPerPage safely for SSR
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useState(cardsPerPage)`,
	);
	const [cardsPerPage, setCardsPerPage] = useState(() => {
		if (typeof window !== "undefined") {
			if (window.innerWidth < 640) return 6;
			if (window.innerWidth < 1024) return 3;
			return 6;
		}
		return 6; // SSR fallback
	});

	const activeTab =
		activeTabProp !== undefined ? activeTabProp : internalActiveTab;

	// CRITICAL: Use error-safe selector to prevent throwing during SSR
	// If selector throws, React's error recovery might skip subsequent hooks
	// NOTE: Cannot wrap hooks in try-catch - hooks must be called unconditionally
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useDataModule - BEFORE`,
	);
	const servicesModuleResult = useDataModule(
		"service/services",
		// Error-safe selector - never throws, always returns valid object
		({ status, data, error }) => {
			try {
				return {
					status,
					services: (data?.services ?? {}) as ServicesData,
					getServicesByCategory: data?.getServicesByCategory,
					error,
				};
			} catch (selectorError) {
				// If selector throws, return safe fallback to prevent hook skipping
				console.error("[Services] Selector error:", selectorError);
				return {
					status: "error" as const,
					services: {} as ServicesData,
					getServicesByCategory: undefined,
					error: selectorError,
				};
			}
		},
	);
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useDataModule - AFTER`,
		{
			status: servicesModuleResult.status,
		},
	);

	const {
		status: servicesStatus,
		services: servicesData,
		getServicesByCategory: servicesByCategoryFn,
		error: servicesError,
	} = servicesModuleResult;

	// Gather all unique categories from all services
	// IMPORTANT: All hooks must be called before any early returns
	// Use useMemo to ensure stable references and prevent hook order issues
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useMemo(allServices)`,
	);
	const allServices = useMemo(() => {
		if (!servicesData || typeof servicesData !== "object") {
			return [];
		}
		return Object.values(servicesData).flatMap((cat) =>
			Object.values(cat ?? {}),
		);
	}, [servicesData]);
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useMemo(categoryOptions)`,
	);
	const categoryOptions = useMemo(() => {
		const unique = new Set<string>();
		for (const service of allServices) {
			if (service?.categories) {
				for (const category of service.categories) {
					unique.add(category);
				}
			}
		}

		return Array.from(unique).map((cat) => ({
			id: cat,
			name: cat,
		}));
	}, [allServices]);

	// Memoize filterServices to avoid recreating on every render
	// This must be a hook (useCallback) to maintain consistent hook order
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useCallback(filterServices)`,
	);
	const filterServices = useCallback(
		(categoryValue: ServiceCategoryValue) => {
			// Get category entries - inline to avoid dependency issues
			let categoryEntries: Array<[string, ServiceItemData]>;
			if (typeof servicesByCategoryFn === "function") {
				const categoryServices = servicesByCategoryFn(categoryValue) ?? {};
				categoryEntries = Object.entries(categoryServices) as Array<
					[string, ServiceItemData]
				>;
			} else {
				const categoryServices = servicesData?.[categoryValue];
				if (!categoryServices) {
					categoryEntries = [];
				} else {
					categoryEntries = Object.entries(categoryServices) as Array<
						[string, ServiceItemData]
					>;
				}
			}

			if (categoryEntries.length === 0) {
				return [];
			}
			let filtered = categoryEntries;
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
		},
		[activeCategory, searchTerm, servicesData, servicesByCategoryFn],
	);

	// Memoize filteredEntries - CRITICAL: Must be a hook to maintain hook order
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useMemo(filteredEntries)`,
	);
	const filteredEntries = useMemo(
		() => filterServices(activeTab),
		[filterServices, activeTab],
	);

	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useMemo(guardDetail) - THIS IS HOOK 33 IN ERROR - CRITICAL HOOK`,
	);
	const guardDetail = useMemo(
		() => ({
			activeTab,
			activeCategory: activeCategory || undefined,
			searchTerm: searchTerm || undefined,
		}),
		[activeCategory, activeTab, searchTerm],
	);
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useDataModuleGuardTelemetry`,
	);

	useDataModuleGuardTelemetry({
		key: "service/services",
		surface: "home/ServicesSection",
		status: servicesStatus,
		hasData: filteredEntries.length > 0,
		error: servicesError,
		detail: guardDetail,
	});

	// Call usePagination ONCE at the top level
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: usePagination`,
	);
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
	} = usePagination(filteredEntries, {
		itemsPerPage: cardsPerPage,
		initialPage: 1,
		enableShowAll: true,
	});
	hookCountRef.current += 1;
	console.log(
		`[ServicesSection:${componentInstanceId.current}] Local Hook ${hookCountRef.current}: useEffect(resize)`,
	);

	useEffect(() => {
		// Only run on client
		if (typeof window === "undefined") return;

		const handleResize = () => {
			const newCardsPerPage = getCardsPerPage();
			setCardsPerPage(newCardsPerPage);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
		// biome-ignore lint/correctness/useExhaustiveDependencies: getCardsPerPage is a pure function that doesn't need to be in deps
	}, []);

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

	// * Helper to convert category enum to human-friendly label
	const getTabLabel = (tab: ServiceCategoryValue) => {
		switch (tab) {
			case SERVICE_CATEGORIES.LEAD_GENERATION:
				return "Lookalike Audience Expansion";
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

	// CRITICAL: This function must never throw or return undefined/null
	// It's called during JSX rendering, so any errors here can cause hydration mismatches
	const renderCardsForCategory = (_categoryValue: ServiceCategoryValue) => {
		try {
			const isLoading = ["idle", "loading"].includes(servicesStatus);
			const hasEntries = filteredEntries.length > 0;
			const encounteredError = servicesStatus === "error" && !hasEntries;

			const filterControls = (
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
			);

			if (isLoading && !hasEntries) {
				return (
					<>
						{filterControls}
						<div className="py-12 text-center text-muted-foreground">
							Loading services…
						</div>
					</>
				);
			}

			if (encounteredError) {
				console.error(
					"[ServicesSection] Failed to load services",
					servicesError,
				);
				return (
					<>
						{filterControls}
						<div className="py-12 text-center text-destructive">
							Unable to load services right now.
						</div>
					</>
				);
			}

			return (
				<>
					{filterControls}
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
											key={serviceData.slugDetails.slug ?? serviceKey}
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
											{Array.from({ length: totalPages }, (_, i) => (
												<button
													key={`page-${i + 1}`}
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
		} catch (renderError) {
			// If rendering throws, return safe fallback to prevent hydration mismatch
			console.error(
				"[ServicesSection] Error in renderCardsForCategory:",
				renderError,
			);
			return (
				<div className="py-12 text-center text-muted-foreground">
					Unable to load services.
				</div>
			);
		}
	};

	console.log(
		`[ServicesSection:${componentInstanceId.current}] Render #${renderIdRef.current} COMPLETE - Local hooks: ${hookCountRef.current} - About to return JSX`,
		{
			instanceId: componentInstanceId.current,
			isServer: typeof window === "undefined",
		},
	);

	// CRITICAL: Wrap return in try-catch to ensure component ALWAYS renders, even if JSX throws
	// This prevents hydration mismatches where server renders nothing but client renders something
	try {
		console.log(
			`[ServicesSection:${componentInstanceId.current}] Attempting to render JSX...`,
		);
		const jsxResult = (
			<section
				id="services"
				className="px-4 pt-12 pb-6 md:px-6 md:pt-0 md:pb-16 lg:px-8"
			>
				<div className="mx-auto max-w-7xl">
					<div className="mt-8 mb-12 text-center md:mt-0">
						<Header
							title={title}
							subtitle={subtitle}
							size="lg"
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
								{/* Always render the link - pathname check removed to prevent hydration mismatch */}
								<div className="mt-12 text-center">
									<Link href="/features" className="inline-block">
										<Button variant="default" size="lg">
											Explore All {getTabLabel(tab)} Services
										</Button>
									</Link>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</div>
			</section>
		);
		console.log(
			`[ServicesSection:${componentInstanceId.current}] JSX rendered successfully`,
		);
		return jsxResult;
	} catch (error) {
		// If JSX rendering throws, log and return fallback to prevent hydration mismatch
		console.error(
			`[ServicesSection:${componentInstanceId.current}] ERROR rendering JSX:`,
			error,
		);
		// Return minimal valid structure to match server/client
		return (
			<section
				id="services"
				className="px-4 pt-12 pb-6 md:px-6 md:pt-0 md:pb-16 lg:px-8"
			>
				<div className="mx-auto max-w-7xl">
					<div className="py-12 text-center text-muted-foreground">
						Unable to render services section.
					</div>
				</div>
			</section>
		);
	}
};

export default ServicesSection;
