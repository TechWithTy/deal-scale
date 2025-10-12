import { render, screen } from "@testing-library/react";
import ProductGrid from "../ProductGrid";
import type { ProductType } from "@/types/products";
import { ProductCategory } from "@/types/products";
import type { ABTest } from "@/types/testing";

jest.mock("react", () => {
        const actual = jest.requireActual<typeof import("react")>("react");
        return { ...actual, default: actual };
});

jest.mock("next/navigation", () => ({
        useRouter: () => ({
                push: jest.fn(),
                replace: jest.fn(),
                prefetch: jest.fn(),
        }),
        usePathname: () => "/products",
        useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/components/ui/use-toast", () => ({
        toast: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
        useSession: () => ({ data: null }),
}));

jest.mock("@/components/auth/use-auth-store", () => ({
        useAuthModal: () => ({
                open: jest.fn(),
        }),
}));

const usePaginationMock = jest.fn();

jest.mock("@/hooks/use-pagination", () => ({
        usePagination: (...args: unknown[]) => usePaginationMock(...args),
}));

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

        beforeEach(() => {
                usePaginationMock.mockImplementation((items: unknown[]) => ({
                        pagedItems: items,
                        page: 1,
                        totalPages: 1,
                        nextPage: jest.fn(),
                        prevPage: jest.fn(),
                        setPage: jest.fn(),
                        canShowPagination: false,
                        canShowShowMore: false,
                        canShowShowLess: false,
                        showMore: jest.fn(),
                        showLess: jest.fn(),
                        showAll: false,
                        setShowAll: jest.fn(),
                        reset: jest.fn(),
                }));
        });

        it("surfaces only featured free resources in the highlight rail", () => {
                const featuredFreebie = buildProduct({
                        id: "featured-freebie",
                        name: "Featured Free Resource",
                        sku: "FREE-FEATURED",
                        slug: "featured-free-resource",
                        categories: [
                                ProductCategory.FreeResources,
                                ProductCategory.Workflows,
                        ],
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
                        categories: [
                                ProductCategory.FreeResources,
                                ProductCategory.Workflows,
                        ],
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
