import { pricingCatalog } from "@/data/service/slug_data/pricing";
import { buildPricingJsonLd } from "@/utils/seo/schema";

describe("buildPricingJsonLd", () => {
	it("creates product schemas for recurring plans", () => {
		const schemas = buildPricingJsonLd({ catalog: pricingCatalog });

		const basicMonthly = schemas.find(
			(schema) =>
				schema["@type"] === "Product" &&
				typeof schema.name === "string" &&
				schema.name.includes("Basic (Monthly)"),
		);

		expect(basicMonthly).toBeDefined();
		expect(basicMonthly && basicMonthly.offers.price).toBe(2000);
	});

	it("includes service schema for one-time offerings", () => {
		const schemas = buildPricingJsonLd({ catalog: pricingCatalog });

		const selfHosted = schemas.find(
			(schema) =>
				schema["@type"] === "Service" &&
				typeof schema.name === "string" &&
				schema.name.includes("Self-Hosted"),
		);

		expect(selfHosted).toBeDefined();
	});
});
