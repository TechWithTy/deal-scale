// ProductGrid.tsx
// ! ProductGrid: displays a grid of products with filtering and pagination
// * Follows DRY, SOLID, and type-safe best practices (see user rules)

"use client";
import { useAuthModal } from "@/components/auth/use-auth-store";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { ProductCategory, type ProductType } from "@/types/products";
import { useSession } from "next-auth/react";
import type React from "react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import FreeResourceCard from "./product/FreeResourceCard";
import ProductCardNew from "./product/ProductCardNew";
import ProductFilter from "./product/ProductFilter";
import type { ProductCategoryOption } from "./product/ProductFilter";
import ProductHero from "./product/ProductHero";
import MonetizeCard from "./workflow/MonetizeCard";
import WorkflowCreateModal from "./workflow/WorkflowCreateModal";
// todo: Move to data file or API

// * Category pretty labels for ProductCategory enum
const CATEGORY_LABELS: Record<ProductCategory, string> = {
	credits: "Credits",
	workflows: "Workflows",
	essentials: "Essentials",
	notion: "Notion",
	voices: "Voices",
	"text-agents": "Text Agents",
	leads: "Leads",
	data: "Data",
	monetize: "Monetize",
	automation: "Automation",
	"add-on": "Add-On",
	agents: "Agents",
	"free-resources": "Free Resources",
	"sales-scripts": "Sales Scripts",
	prompts: "Prompts",
	"remote-closers": "Remote Closers",
};

const MONETIZE_PORTAL_URL = "https://app.leadorchestra.com";
const MONETIZE_CATEGORY_OVERRIDES: Partial<
	Record<
		ProductCategory,
		{
			title: string;
			subtitle: string;
			ariaLabel: string;
		}
	>
> = {
	[ProductCategory.Workflows]: {
		title: "Monetize Your Workflow",
		subtitle: "Share your automation with the world and earn revenue",
		ariaLabel: "Create and monetize your workflow",
	},
	[ProductCategory.Agents]: {
		title: "Launch Your Agent on Deal Scale",
		subtitle: "List your AI agent and start collecting revenue faster",
		ariaLabel: "Launch your AI agent on Deal Scale",
	},
	[ProductCategory.Voices]: {
		title: "Monetize Your Voice Agent",
		subtitle: "Tap into our network and deploy your concierge for clients",
		ariaLabel: "Monetize your voice agent on Deal Scale",
	},
	[ProductCategory.SalesScripts]: {
		title: "Sell Your Sales Scripts",
		subtitle: "Publish proven cadences to thousands of Deal Scale operators",
		ariaLabel: "Sell your sales scripts on Deal Scale",
	},
	[ProductCategory.Prompts]: {
		title: "List Your Prompt Library",
		subtitle: "Package prompts, earn recurring revenue, and reach new teams",
		ariaLabel: "List your prompt library on Deal Scale",
	},
};
const MONETIZE_CATEGORY_TARGETS: ReadonlySet<string> = new Set([
	ProductCategory.Workflows,
	ProductCategory.Agents,
	ProductCategory.Prompts,
	ProductCategory.Voices,
	ProductCategory.SalesScripts,
]);

interface ProductGridProps {
	products: ProductType[];
	callbackUrl?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, callbackUrl }) => {
	const { data: session } = useSession();
	const { open: openAuthModal } = useAuthModal();
	const [showWorkflowModal, setShowWorkflowModal] = useState(false);
	const [activeCategory, setActiveCategory] = useState<string>("all");
	const freeResourceCategory = ProductCategory.FreeResources;
	// On mount, check for #category=... in the hash and set activeCategory
	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			window.location.hash.startsWith("#category=")
		) {
			const cat = window.location.hash.replace("#category=", "");
			if (cat && cat !== "all") {
				setActiveCategory(cat.toLowerCase());
			}
		}
	}, []);
	const [searchTerm, setSearchTerm] = useState<string>("");

	// Dynamically generate unique categories from products (not types)

	const categories = useMemo((): ProductCategoryOption[] => {
		const catSet = new Set<ProductCategory>();
		for (const p of products) {
			if (Array.isArray(p.categories)) {
				for (const c of p.categories) {
					catSet.add(c);
				}
			}
		}
		return Array.from(catSet).map((cat) => ({
			id: cat,
			name: CATEGORY_LABELS[cat] || cat,
		}));
	}, [products]);

	// Ref for scrolling to the grid
	const gridRef = useRef<HTMLDivElement>(null);

	// Filter products by category and search
	const featuredFreeResources = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		return products.filter((product) => {
			const isFreeResource = product.categories.includes(freeResourceCategory);

			if (!isFreeResource || !product.isFeaturedFreeResource) {
				return false;
			}

			if (activeCategory !== "all" && activeCategory !== freeResourceCategory) {
				return false;
			}

			if (!term) {
				return true;
			}

			return (
				product.name.toLowerCase().includes(term) ||
				product.description.toLowerCase().includes(term)
			);
		});
	}, [products, searchTerm, activeCategory, freeResourceCategory]);

	const filteredProducts = useMemo(() => {
		let filtered = products;
		if (activeCategory !== "all") {
			filtered = filtered.filter(
				(p) =>
					Array.isArray(p.categories) &&
					p.categories
						.map(String)
						.map((s) => s.toLowerCase())
						.includes(activeCategory),
			);
		}
		
		// For Monetize category: Only show marketplace entry points where users can EARN income
		if (activeCategory === ProductCategory.Monetize) {
			filtered = filtered.filter((product) => {
				// Exclude products where users BUY things (they don't earn from these):
				// 1. Individual closers (users hire them, closers earn but buyers don't)
				const isIndividualCloser = product.id?.startsWith("closer-") || product.sku?.startsWith("DS-CLOSER-");
				// 2. Individual workflows (users BUY these, they don't earn from them)
				const isIndividualWorkflow = product.id?.includes("-workflow") || product.sku?.startsWith("WF-");
				// 3. Individual agents (users BUY these, they don't earn from them)
				const isIndividualAgent = product.id?.includes("-agent") || product.id?.includes("-concierge") || product.sku?.startsWith("AG-");
				// 4. Free resources (users download these for free, they don't earn from them)
				const isFreeResource = product.categories?.includes(ProductCategory.FreeResources);
				// 5. Products with price > 0 where users pay (not earn)
				const isBuyableProduct = product.price > 0 && !product.id?.includes("marketplace") && !product.sku?.includes("MARKETPLACE");
				
				// Exclude these - only show marketplace entry points where users can APPLY/SELL to earn
				if (isIndividualCloser || isIndividualWorkflow || isIndividualAgent || isFreeResource || isBuyableProduct) {
					return false;
				}
				
				// Include only marketplace entry points where users can EARN:
				// - Remote Closers marketplace (users can APPLY to become closers and earn)
				// - Sales Scripts marketplace (users can SELL scripts and earn)
				// - Other marketplace entry points (where users can monetize their content)
				return true;
			});
		}
		
		if (searchTerm.trim()) {
			const term = searchTerm.trim().toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.name.toLowerCase().includes(term) ||
					p.description.toLowerCase().includes(term),
			);
		}
		if (activeCategory === freeResourceCategory) {
			filtered = filtered.filter((product) =>
				product.categories.includes(freeResourceCategory),
			);
		}

		const shouldExcludeFeaturedFreebies =
			activeCategory === "all" || activeCategory === freeResourceCategory;

		if (shouldExcludeFeaturedFreebies) {
			filtered = filtered.filter(
				(product) =>
					!(
						product.categories.includes(freeResourceCategory) &&
						product.isFeaturedFreeResource
					),
			);
		}
		return filtered;
	}, [products, activeCategory, searchTerm, freeResourceCategory]);

	const shouldShowEmptyState =
		filteredProducts.length === 0 && featuredFreeResources.length === 0;

	// Pagination
	const {
		pagedItems: paginatedProducts,
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
	} = usePagination(filteredProducts, {
		itemsPerPage: 6,
		initialPage: 1,
		enableShowAll: true,
	});

	const handleWorkflowClick = useCallback(() => {
		if (session) {
			setShowWorkflowModal(true);
			return;
		}

		openAuthModal("signin", () => setShowWorkflowModal(true));
	}, [openAuthModal, session, setShowWorkflowModal]);

	const buildMonetizeParams = useCallback(
		(category: ProductCategory) => ({
			utm_source: "deal-scale-marketplace",
			utm_medium: "cta",
			utm_campaign: "monetize-card",
			utm_content: `category-${category}`,
		}),
		[],
	);

	const gridItems = useMemo(() => {
		const items: { key: string; node: ReactNode }[] = paginatedProducts.map(
			(product) => ({
				key: product.sku,
				node: (
					<ProductCardNew
						{...product}
						className="w-full"
						callbackUrl={callbackUrl}
					/>
				),
			}),
		);

		if (MONETIZE_CATEGORY_TARGETS.has(activeCategory)) {
			const categoryKey = activeCategory as ProductCategory;
			const copy = MONETIZE_CATEGORY_OVERRIDES[categoryKey];
			const ariaLabel = copy?.ariaLabel ?? "Monetize on Deal Scale";

			const cardNode =
				categoryKey === ProductCategory.Workflows ? (
					<MonetizeCard
						onClick={handleWorkflowClick}
						ariaLabel={ariaLabel}
						title={copy?.title}
						subtitle={copy?.subtitle}
					/>
				) : (
					<MonetizeCard
						href={MONETIZE_PORTAL_URL}
						utmParams={buildMonetizeParams(categoryKey)}
						ariaLabel={ariaLabel}
						title={copy?.title}
						subtitle={copy?.subtitle}
					/>
				);

			items.unshift({
				key: `monetize-${activeCategory}`,
				node: cardNode,
			});
		}

		return items;
	}, [
		paginatedProducts,
		callbackUrl,
		activeCategory,
		handleWorkflowClick,
		buildMonetizeParams,
	]);

	return (
		<>
			<ProductHero
				categories={categories}
				setActiveCategory={setActiveCategory}
				gridRef={gridRef}
			/>
			<section className="bg-background-dark px-6 py-6 lg:px-8" ref={gridRef}>
				<div className="mx-auto max-w-7xl">
					<ProductFilter
						categories={categories}
						activeCategory={activeCategory}
						searchTerm={searchTerm}
						onSearch={setSearchTerm}
						onCategoryChange={setActiveCategory}
					/>
					{shouldShowEmptyState ? (
						<div className="py-16 text-center">
							<p className="text-black dark:text-white/70">
								No products found for your criteria.
							</p>
						</div>
					) : (
						<>
							{featuredFreeResources.length > 0 && (
								<div className="mb-10 flex w-full flex-col gap-6">
									{featuredFreeResources.map((product) => (
										<FreeResourceCard
											key={`free-resource-${product.sku}`}
											product={product}
										/>
									))}
								</div>
							)}
							{(filteredProducts.length > 0 ||
								activeCategory === "workflows") &&
								gridItems.length > 0 && (
									<div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
										{gridItems.map((item) => (
											<div key={item.key}>{item.node}</div>
										))}
									</div>
								)}
							{activeCategory === "workflows" && (
								<WorkflowCreateModal
									open={showWorkflowModal}
									onClose={() => setShowWorkflowModal(false)}
								/>
							)}
							{/* Pagination Controls */}
							{(canShowPagination || canShowShowMore || canShowShowLess) && (
								<nav
									className="mt-8 flex flex-col items-center justify-center gap-2"
									aria-label="Pagination"
								>
									{canShowShowMore && (
										<button
											className="mb-2 cursor-pointer border-none bg-transparent p-0 font-medium text-blue-600 underline"
											onClick={showMore}
											type="button"
										>
											Show More
										</button>
									)}
									{canShowPagination && (
										<div className="flex items-center justify-center gap-2">
											<button
												className="rounded-md border border-slate-300 bg-slate-200 px-3 py-1 font-medium text-slate-700 text-sm shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
												onClick={prevPage}
												disabled={page === 1}
												type="button"
												aria-label="Previous page"
											>
												Prev
											</button>
											{/* Page numbers */}
											{Array.from({ length: totalPages }, (_, i) => {
												const pageNum = i + 1;
												const isActive = page === pageNum;
												return (
													<button
														key={pageNum}
														className={cn(
															"rounded-md border px-3 py-1 font-semibold text-sm transition",
															isActive
																? "border-blue-500 bg-blue-600 text-white shadow-sm dark:border-blue-400 dark:bg-blue-500 dark:text-slate-950"
																: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
														)}
														onClick={() => setPage(pageNum)}
														type="button"
														aria-label={`Page ${pageNum}`}
													>
														{pageNum}
													</button>
												);
											})}
											<button
												className="rounded-md border border-slate-300 bg-slate-200 px-3 py-1 font-medium text-slate-700 text-sm shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
												onClick={nextPage}
												disabled={page === totalPages}
												type="button"
												aria-label="Next page"
											>
												Next
											</button>
										</div>
									)}
									{canShowShowLess && (
										<button
											className="mt-2 cursor-pointer font-medium text-blue-600 underline"
											onClick={showLess}
											type="button"
										>
											Show Less
										</button>
									)}
								</nav>
							)}
						</>
					)}
				</div>
			</section>
		</>
	);
};

export default ProductGrid;
