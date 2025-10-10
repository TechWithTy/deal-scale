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
                const openSpy = jest.fn();
                const originalOpen = window.open;
                // @ts-expect-error - jsdom defines window.open as function | undefined
                window.open = openSpy;

                render(<FreeResourceCard product={product} />);

                fireEvent.click(screen.getByRole("button", { name: /get resource/i }));
                expect(openSpy).toHaveBeenCalledWith("https://example.com/resource", "_blank", "noopener,noreferrer");

                fireEvent.click(screen.getByRole("button", { name: /watch demo/i }));
                expect(screen.getByRole("dialog")).toBeInTheDocument();
                expect(screen.getByTitle(/free workflow template demo/i)).toHaveAttribute(
                        "src",
                        "https://example.com/demo",
                );

                window.open = originalOpen;
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
});
