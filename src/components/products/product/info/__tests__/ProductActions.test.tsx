import { render, screen } from "@testing-library/react";
import React from "react";
import ProductActions from "../ProductActions";
import { ProductCategory, type ProductType } from "@/types/products";

jest.mock("@/stores/useCartStore", () => ({
        useCartStore: () => ({
                addItem: jest.fn(),
        }),
}));

jest.mock("@/components/common/social/SocialShare", () => ({
        __esModule: true,
        SocialShare: () => <div data-testid="social-share" />,
        default: () => <div data-testid="social-share" />,
}));

describe("ProductActions", () => {
        const baseProduct: ProductType = {
                id: "prod-1",
                name: "AI Deal Assistant",
                description: "Automate your deal workflows.",
                price: 199,
                sku: "SKU-001",
                images: ["/test.png"],
                reviews: [],
                categories: [ProductCategory.Workflows],
                types: [],
                colors: [],
                sizes: [],
        };

        it("renders download and demo CTAs for free resource products", () => {
                const resourceProduct: ProductType = {
                        ...baseProduct,
                        price: 0,
                        categories: [ProductCategory.FreeResources],
                        resource: {
                                type: "download",
                                url: "https://example.com/resource.pdf",
                                fileName: "resource.pdf",
                                demoUrl: "https://demo.example.com",
                        },
                };

                render(
                        <ProductActions
                                product={resourceProduct}
                                onCheckout={jest.fn()}
                                checkoutLoading={false}
                                stripeLoaded={false}
                                enableAddToCart={false}
                        />,
                );

                const downloadLink = screen.getByRole("link", { name: /download resource/i });
                expect(downloadLink).toHaveAttribute("href", "https://example.com/resource.pdf");
                expect(downloadLink).toHaveAttribute("download");
                expect(screen.getByRole("button", { name: /view demo/i })).toBeInTheDocument();
                expect(screen.queryByText(/add to cart/i)).not.toBeInTheDocument();
                expect(screen.queryByText(/purchase/i)).not.toBeInTheDocument();
        });

        it("renders visit CTA for external free resources", () => {
                const externalResourceProduct: ProductType = {
                        ...baseProduct,
                        price: 0,
                        categories: [ProductCategory.FreeResources],
                        resource: {
                                type: "external",
                                url: "https://example.com/resource",
                        },
                };

                render(
                        <ProductActions
                                product={externalResourceProduct}
                                onCheckout={jest.fn()}
                                checkoutLoading={false}
                                stripeLoaded={false}
                                enableAddToCart={false}
                        />,
                );

                const visitLink = screen.getByRole("link", { name: /visit resource/i });
                expect(visitLink).toHaveAttribute("href", "https://example.com/resource");
                expect(visitLink).not.toHaveAttribute("download");
                expect(screen.queryByText(/add to cart/i)).not.toBeInTheDocument();
        });

        it("continues to render checkout actions for monetized products", () => {
                render(
                        <ProductActions
                                product={baseProduct}
                                onCheckout={jest.fn()}
                                checkoutLoading={false}
                                stripeLoaded={true}
                                ctaText="Purchase"
                                enableAddToCart
                        />,
                );

                expect(screen.getByRole("button", { name: /purchase/i })).toBeInTheDocument();
                expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
        });
});
