import { describe, expect, it } from "vitest";

import {
	buildExternalToolFaqSchema,
	buildExternalToolHowToSchema,
	buildExternalToolProductSchema,
	getExternalToolSeo,
} from "@/utils/seo/externalTools";
import { defaultSeo, staticSeoMeta } from "@/utils/seo/staticSeo";
import { validateProductSchema } from "@/utils/seo/schema/validation";

describe("external tools SEO utilities", () => {
	it("returns static SEO metadata for a registered external tool slug", () => {
		const meta = getExternalToolSeo("/external-tools/roi-simulator");

		expect(meta).toMatchObject({
			title: "ROI Simulator | Deal Scale",
			canonical: "https://app.dealscale.io/roi-simulator",
			keywords: expect.arrayContaining(["roi calculator"]),
			priority: 0.85,
			changeFrequency: "weekly",
		});
	});

	it("falls back to default SEO metadata when slug is unknown", () => {
		const meta = getExternalToolSeo("/external-tools/unknown-tool");

		expect(meta).toMatchObject({
			title: defaultSeo.title,
			description: defaultSeo.description,
			canonical: defaultSeo.canonical,
		});
	});

	it("builds FAQPage schema for external tool FAQs", () => {
		const schema = buildExternalToolFaqSchema({
			canonicalUrl: "https://app.dealscale.io/roi-simulator",
			name: "ROI Simulator FAQs",
			description: "Frequently asked questions about the ROI simulator.",
			faqs: [
				{
					question: "How do I export my results?",
					answer: "Sign in and click the export button to download CSV results.",
				},
				{
					question: "Does the simulator save my inputs?",
					answer: "Yes, authenticated users can save presets for later.",
				},
			],
		});

		expect(schema["@type"]).toBe("FAQPage");
		expect(schema["@id"]).toBe(
			"https://app.dealscale.io/roi-simulator#faq",
		);
		expect(schema.mainEntity).toHaveLength(2);
	});

	it("builds HowTo schema that mirrors calculator steps", () => {
		const schema = buildExternalToolHowToSchema({
			canonicalUrl: "https://app.dealscale.io/roi-simulator",
			name: "How to calculate real estate ROI",
			description: "Step-by-step guide to run the ROI simulator.",
			totalTime: "PT5M",
			steps: [
				{
					name: "Enter property basics",
					text: "Start by adding purchase price, rehab cost, and monthly rent.",
				},
				{
					name: "Adjust financing inputs",
					text: "Select loan type, down payment, and interest rate.",
				},
				{
					name: "Review results",
					text: "Analyze yearly ROI and payback period in the results panel.",
				},
			],
			tools: ["Deal Scale ROI simulator"],
		});

		expect(schema["@type"]).toBe("HowTo");
		expect(schema.step).toHaveLength(3);
		expect(schema.tool).toContain("Deal Scale ROI simulator");
	});

	it("maps marketing slug to canonical app domain", () => {
		const entry = staticSeoMeta["/external-tools/roi-simulator"];
		expect(entry?.canonical).toBe("https://app.dealscale.io/roi-simulator");
	});

	it("builds Product schema for external tool upsell blocks", () => {
		const schema = buildExternalToolProductSchema({
			name: "Deal Scale Pro",
			description: "Unlock saved ROI scenarios, CRM sync, and automation.",
			url: "https://dealscale.io/pricing",
			image: "/banners/pro-plan.png",
			price: "199.00",
			priceCurrency: "USD",
		});

		expect(() => validateProductSchema(schema)).not.toThrow();
		expect(schema["@id"]).toBe("https://dealscale.io/pricing#product");
		expect(schema.offers.price).toBe("199.00");
	});
});

