// ProductGrid.tsx
// ! ProductGrid: displays a grid of products with filtering and pagination
// * Follows DRY, SOLID, and type-safe best practices (see user rules)

"use client";
import { useAuthModal } from "@/components/auth/use-auth-store";
import { usePagination } from "@/hooks/use-pagination";
import { ProductCategory, type ProductType } from "@/types/products";
import { useSession } from "next-auth/react";
import React, {
        useCallback,
        useEffect,
        useMemo,
        useRef,
        useState,
        type ReactNode,
} from "react";
import ProductCardNew from "./product/ProductCardNew";
import FreeResourceCard from "./product/FreeResourceCard";
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
	leads: "Leads",
	data: "Data",
	monetize: "Monetize",
	automation: "Automation",
	"add-on": "Add-On",
	agents: "Agents",
	"free-resources": "Free Resources",
};

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

		if (activeCategory === "workflows") {
			items.unshift({
				key: "workflow-monetize",
				node: <MonetizeCard onClick={handleWorkflowClick} />,
			});
		}

                        return items;
        }, [paginatedProducts, callbackUrl, activeCategory, handleWorkflowClick]);

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
												className="rounded bg-gray-200 px-3 py-1 text-gray-700 disabled:opacity-50"
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
												return (
													<button
														key={pageNum}
														className={`rounded px-3 py-1 ${page === pageNum ? "bg-blue-600 text-black dark:text-white" : "bg-gray-200 text-gray-700"}`}
														onClick={() => setPage(pageNum)}
														type="button"
														aria-label={`Page ${pageNum}`}
													>
														{pageNum}
													</button>
												);
											})}
											<button
												className="rounded bg-gray-200 px-3 py-1 text-gray-700 disabled:opacity-50"
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
