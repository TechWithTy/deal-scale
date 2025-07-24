// ProductGrid.tsx
// ! ProductGrid: displays a grid of products with filtering and pagination
// * Follows DRY, SOLID, and type-safe best practices (see user rules)

"use client";
import { useAuthModal } from "@/components/auth/use-auth-store";
import { usePagination } from "@/hooks/use-pagination";
import type { ProductCategory, ProductType } from "@/types/products";
import { useSession } from "next-auth/react";
import React from "react";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
	leads: "Leads",
	data: "Data",
	monetize: "Monetize",
	automation: "Automation",
	"add-on": "Add-On",
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
	const gridRef = React.useRef<HTMLDivElement>(null);

	// Filter products by category and search
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
		return filtered;
	}, [products, activeCategory, searchTerm]);

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
					{filteredProducts.length === 0 ? (
						<div className="py-16 text-center">
							<p className="text-black dark:text-white/70">
								No products found for your criteria.
							</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
								{/* + Create Workflow Card (only for workflows category) */}
								{activeCategory === "workflows" && (
									<>
										<MonetizeCard
											onClick={() => {
												if (session) {
													setShowWorkflowModal(true);
												} else {
													openAuthModal("signin", () =>
														setShowWorkflowModal(true),
													);
												}
											}}
										/>
										<WorkflowCreateModal
											open={showWorkflowModal}
											onClose={() => setShowWorkflowModal(false)}
										/>
									</>
								)}
								{paginatedProducts.map((product) => (
									<ProductCardNew
										key={product.sku}
										{...product}
										callbackUrl={callbackUrl}
									/>
								))}
							</div>
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
