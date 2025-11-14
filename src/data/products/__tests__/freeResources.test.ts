import { mockProducts } from "@/data/products";
import { freeResourceProducts } from "@/data/products/free-resources";
import { ProductCategory } from "@/types/products";

describe("free resource catalog", () => {
	it("exposes resource metadata for each free product", () => {
		expect(freeResourceProducts.length).toBeGreaterThan(0);

		for (const product of freeResourceProducts) {
			expect(product.price).toBe(0);
			expect(product.resource).toBeDefined();
			expect(product.resource?.type).toMatch(/download|external/);
			expect(product.resource?.url).toBeTruthy();
		}
	});

	it("registers free resources within the main product catalog", () => {
		const categoryId = ProductCategory.FreeResources;
		const catalogResources = mockProducts.filter((product) =>
			product.categories.includes(categoryId),
		);

		const catalogSkus = new Set(catalogResources.map((product) => product.sku));

		for (const resource of freeResourceProducts) {
			expect(resource.categories).toContain(categoryId);
			expect(catalogSkus.has(resource.sku)).toBe(true);
		}
	});

	it("flags free resources as a first-class category", () => {
		const values = Object.values(ProductCategory) as string[];
		expect(values).toContain("free-resources");
		expect(values).toContain("voices");
		expect(values).toContain("sales-scripts");
		expect(values).toContain("prompts");
	});

	it("maps marketplace extensions to at least one product", () => {
		const categories: ProductCategory[] = [
			ProductCategory.Voices,
			ProductCategory.SalesScripts,
			ProductCategory.Prompts,
		];

		for (const category of categories) {
			const hasCategory = mockProducts.some((product) =>
				product.categories.includes(category),
			);
			expect(hasCategory).toBeTruthy();
		}
	});

	it("includes the latest download and external spotlight resources", () => {
		const handbook = freeResourceProducts.find(
			(product) => product.slug === "tinthe-investpros-handbook",
		);
		expect(handbook).toBeDefined();
		expect(handbook?.resource?.type).toBe("download");
		expect(handbook?.resource?.url).toContain("tinthe-investpros-handbook.pdf");

		const marketSnapshot = freeResourceProducts.find(
			(product) => product.slug === "market-metrics-snapshot",
		);
		expect(marketSnapshot).toBeDefined();
		expect(marketSnapshot?.resource?.type).toBe("external");
		expect(marketSnapshot?.resource?.url).toContain(
			"Market-Metrics-Snapshot-Toolkit",
		);
	});
});
