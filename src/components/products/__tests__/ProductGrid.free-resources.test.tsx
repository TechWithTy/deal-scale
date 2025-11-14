import { beforeEach, describe, expect, it, vi } from "vitest";
import * as React from "react";
import type { ProductType } from "@/types/products";
import { ProductCategory } from "@/types/products";
import type { ABTest } from "@/types/testing";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
	}),
	usePathname: () => "/products",
	useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/components/ui/use-toast", () => ({
	toast: vi.fn(),
}));

const useSessionMock = vi.fn(() => ({ data: null }));

vi.mock("next-auth/react", () => ({
	useSession: useSessionMock,
}));

vi.mock("@/components/auth/use-auth-store", () => ({
	useAuthModal: () => ({
		open: vi.fn(),
	}),
}));

const usePaginationMock = vi.fn();

vi.mock("@/hooks/use-pagination", () => ({
	usePagination: (...args: unknown[]) => usePaginationMock(...args),
}));

vi.mock("embla-carousel-react", () => ({
	__esModule: true,
	default: () => [vi.fn(), null],
	useEmblaCarousel: () => {
		const api = {
			on: vi.fn(),
			off: vi.fn(),
			scrollPrev: vi.fn(),
			scrollNext: vi.fn(),
			canScrollPrev: vi.fn(() => false),
			canScrollNext: vi.fn(() => false),
		};
		return [vi.fn(), api];
	},
}));

let ProductGrid: typeof import("../ProductGrid").default;

const LONG_TIMEOUT = 20_000;

beforeEach(async () => {
	usePaginationMock.mockImplementation((items: unknown[]) => ({
		pagedItems: items,
		page: 1,
		totalPages: 1,
		nextPage: vi.fn(),
		prevPage: vi.fn(),
		setPage: vi.fn(),
		canShowPagination: false,
		canShowShowMore: false,
		canShowShowLess: false,
		showMore: vi.fn(),
		showLess: vi.fn(),
		showAll: false,
		setShowAll: vi.fn(),
		reset: vi.fn(),
	}));

	({ default: ProductGrid } = await import("../ProductGrid"));
}, LONG_TIMEOUT);

describe("ProductGrid featured free resources", () => {
	const baseAbTest: ABTest = {
		id: "free-resource-copy",
		name: "Free Resource Messaging",
		startDate: new Date("2024-01-01T00:00:00.000Z"),
		isActive: true,
		variants: [
			{
				name: "Baseline",
				percentage: 100,
				copy: {
					cta: "Download now",
					whatsInItForMe: "Gain a new system",
					target_audience: "Investors",
					pain_point: "You lack a repeatable process.",
					solution: "A guided workflow removes the guesswork.",
				},
			},
		],
	};

	const buildProduct = (overrides: Partial<ProductType>): ProductType => ({
		id: "base",
		name: "Base Product",
		description: "Base description",
		price: 0,
		sku: "BASE",
		slug: "base-product",
		images: ["/base.png"],
		reviews: [],
		categories: [ProductCategory.Workflows],
		types: [],
		colors: [],
		sizes: [],
		...overrides,
	});

	it("surfaces only featured free resources in the highlight rail", () => {
		const featuredFreebie = buildProduct({
			id: "featured-freebie",
			name: "Featured Free Resource",
			sku: "FREE-FEATURED",
			slug: "featured-free-resource",
			categories: [ProductCategory.FreeResources, ProductCategory.Workflows],
			abTest: baseAbTest,
			price: 0,
			isFeaturedFreeResource: true,
			resource: {
				type: "download",
				url: "https://example.com/featured.pdf",
				fileName: "featured.pdf",
			},
		});

		const nonFeaturedFreebie = buildProduct({
			id: "non-featured-freebie",
			name: "Non-Featured Free Resource",
			sku: "FREE-REGULAR",
			slug: "non-featured-free-resource",
			categories: [ProductCategory.FreeResources, ProductCategory.Workflows],
			abTest: baseAbTest,
			price: 0,
			isFeaturedFreeResource: false,
			resource: {
				type: "download",
				url: "https://example.com/regular.pdf",
				fileName: "regular.pdf",
			},
		});

		const paidProduct = buildProduct({
			id: "paid-product",
			name: "Paid Workflow",
			sku: "PAID-1",
			slug: "paid-workflow",
			price: 99,
			categories: [ProductCategory.Workflows],
			abTest: baseAbTest,
		});

		const products: ProductType[] = [
			featuredFreebie,
			nonFeaturedFreebie,
			paidProduct,
		];

		render(<ProductGrid products={products} />);

		const featuredHeadings = screen.getAllByRole("heading", {
			name: "Featured Free Resource",
		});
		expect(featuredHeadings).toHaveLength(1);

		const regularLinks = screen.getAllByRole("link", {
			name: "Non-Featured Free Resource",
		});
		expect(regularLinks).toHaveLength(1);

		expect(screen.getByText("Paid Workflow")).toBeInTheDocument();
	});
});
