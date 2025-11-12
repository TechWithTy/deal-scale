import { freeResourceProducts } from "../free-resources";

describe("freeResourceProducts", () => {
	it("attaches AB test copy to every free resource", () => {
		expect(freeResourceProducts.length).toBeGreaterThan(0);

		for (const product of freeResourceProducts) {
			expect(product.abTest).toBeDefined();

			const variants = product.abTest?.variants ?? [];
			expect(variants.length).toBeGreaterThan(0);

			const variantWithCopy = variants.find((variant) => variant.copy);
			expect(variantWithCopy?.copy?.pain_point).toBeTruthy();
			expect(variantWithCopy?.copy?.solution).toBeTruthy();
		}
	});

	it("defines a curated set of featured free resources", () => {
		const featuredFreebies = freeResourceProducts.filter(
			(product) => product.isFeaturedFreeResource,
		);

		expect(featuredFreebies.length).toBeGreaterThan(0);
	});
});
