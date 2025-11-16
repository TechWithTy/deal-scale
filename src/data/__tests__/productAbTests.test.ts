import * as productAbTests from "@/data/products/copy";
import type { ABTest, AbTestVariant, ABTestCopy } from "@/types/testing";

const isAbTest = (value: unknown): value is ABTest => {
	if (!value || typeof value !== "object") {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	return Array.isArray(candidate.variants);
};

const hasHopeAndFear = (copy: ABTestCopy | undefined): copy is ABTestCopy => {
	if (!copy) {
		return false;
	}

	return Boolean(copy.hope?.trim() && copy.fear?.trim());
};

const collectVariants = (variantSource: AbTestVariant[]) =>
	variantSource.reduce<AbTestVariant[]>((accumulator, variant) => {
		accumulator.push(variant);
		return accumulator;
	}, []);

describe("Product AB test copy", () => {
	it("ensures every variant includes hope and fear messaging", () => {
		const missing: string[] = [];

		Object.entries(productAbTests).forEach(([exportName, value]) => {
			const tests = Array.isArray(value)
				? value.filter(isAbTest)
				: isAbTest(value)
					? [value]
					: [];

			tests.forEach((test) => {
				collectVariants(test.variants).forEach((variant, index) => {
					if (!hasHopeAndFear(variant.copy)) {
						missing.push(
							`${exportName} -> ${test.id} -> variant[${index}] (${variant.name ?? "unnamed"})`,
						);
					}
				});
			});
		});

		expect(missing).toEqual([]);
	});
});


