import { fireEvent, render, screen } from "@testing-library/react";
import FreeResourceCard from "../FreeResourceCard";
import { ProductCategory, type ProductType } from "@/types/products";

describe("FreeResourceCard", () => {
        const baseProduct: ProductType = {
                id: "free-resource-1",
                name: "Free Workflow Template",
                description: "A starter template you can download immediately.",
                price: 0,
                sku: "FREE-RESOURCE-1",
                slug: "free-workflow-template",
                images: ["/products/workflows.png"],
                reviews: [],
                categories: [ProductCategory.FreeResources],
                types: [{ name: "Download", value: "download", price: 0 }],
                colors: [],
                sizes: [],
        };

        it("launches external resources and opens the optional demo modal", () => {
                const product = {
                        ...baseProduct,
                        resource: {
                                type: "external",
                                url: "https://example.com/resource",
                                demoUrl: "https://example.com/demo",
                        },
                } satisfies ProductType;
                render(<FreeResourceCard product={product} />);

                const visitLink = screen.getByRole("link", { name: /visit resource/i });
                expect(visitLink).toHaveAttribute("href", "https://example.com/resource");
                expect(visitLink).toHaveAttribute("target", "_blank");
                expect(visitLink).toHaveAttribute("rel", "noopener noreferrer");

                fireEvent.click(screen.getByRole("button", { name: /view demo/i }));
                expect(screen.getByRole("dialog")).toBeInTheDocument();
                expect(screen.getByTitle(/free workflow template demo/i)).toHaveAttribute(
                        "src",
                        "https://example.com/demo",
                );
        });

        it("provides download links for downloadable resources", () => {
                const product = {
                        ...baseProduct,
                        resource: {
                                type: "download",
                                url: "https://example.com/download.pdf",
                                fileName: "download.pdf",
                        },
                } satisfies ProductType;

                render(<FreeResourceCard product={product} />);

                const downloadLink = screen.getByRole("link", { name: /download resource/i });
                expect(downloadLink).toHaveAttribute("href", "https://example.com/download.pdf");
                expect(downloadLink).toHaveAttribute("download", "download.pdf");
        });

        it("links to the product detail page for seo visibility", () => {
                const product = {
                        ...baseProduct,
                        resource: {
                                type: "download",
                                url: "https://example.com/download.pdf",
                        },
                } satisfies ProductType;

                render(<FreeResourceCard product={product} />);

                const titleLink = screen.getByRole("link", {
                        name: /free workflow template/i,
                });
                expect(titleLink).toHaveAttribute("href", "/products/free-workflow-template");

                const detailsCta = screen.getByRole("link", { name: /view details/i });
                expect(detailsCta).toHaveAttribute("href", "/products/free-workflow-template");
        });

        it("omits product detail links when the slug is unavailable", () => {
                const product = {
                        ...baseProduct,
                        slug: undefined,
                        sku: "FREE-RESOURCE-ONLY-SKU",
                        resource: {
                                type: "download",
                                url: "https://example.com/download.pdf",
                        },
                } satisfies ProductType;

                render(<FreeResourceCard product={product} />);

                expect(
                        screen.queryByRole("link", {
                                name: /free workflow template/i,
                        }),
                ).not.toBeInTheDocument();

                expect(
                        screen.queryByRole("link", {
                                name: /view details/i,
                        }),
                ).not.toBeInTheDocument();

                expect(
                        screen.getByText(/free workflow template/i),
                ).toBeInTheDocument();
        });
});
