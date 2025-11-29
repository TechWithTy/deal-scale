import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils/seo/staticSeo", () => ({
	getStaticSeo: () => ({
		title: "Home | Deal Scale",
		description: "Home description",
		canonical: "https://dealscale.io",
		keywords: ["BaseKeyword"],
		image: "/banners/main.png",
		siteName: "Deal Scale",
		type: "website",
	}),
}));

import {
	AI_OUTREACH_STUDIO_DESCRIPTION,
	AI_OUTREACH_STUDIO_FEATURES,
	AI_OUTREACH_STUDIO_HEADING,
	AI_OUTREACH_STUDIO_SEO,
	AI_OUTREACH_STUDIO_TAGLINE,
	buildAiOutreachStudioSeo,
	buildPersonaAiOutreachStudioSeo,
} from "../home/aiOutreachStudio";

describe("buildAiOutreachStudioSeo", () => {
	it("uses static seo generator values with defaults", () => {
		const seo = buildAiOutreachStudioSeo();

		expect(seo.name).toBe(AI_OUTREACH_STUDIO_HEADING);
		expect(seo.headline).toBe(AI_OUTREACH_STUDIO_TAGLINE);
		expect(seo.description).toBe(AI_OUTREACH_STUDIO_DESCRIPTION);
		expect(seo.keywords).toEqual(
			expect.arrayContaining(["BaseKeyword", "AI Outreach Studio"]),
		);
		expect(seo.anchor).toBe("ai-outreach-studio");
		expect(seo.features).toEqual(
			expect.arrayContaining(AI_OUTREACH_STUDIO_FEATURES),
		);
	});

	it("allows overrides to replace copy and keywords", () => {
		const seo = buildAiOutreachStudioSeo({
			name: "Custom Studio",
			description: "Custom description",
			keywords: ["Custom", "Deal Flow", "Custom"],
		});

		expect(seo.name).toBe("Custom Studio");
		expect(seo.description).toBe("Custom description");
		expect(seo.keywords).toEqual(["Custom", "Deal Flow"]);
	});
});

describe("buildPersonaAiOutreachStudioSeo", () => {
	it("injects persona label and goal into headline/description", () => {
		const seo = buildPersonaAiOutreachStudioSeo({
			persona: "agent",
			goal: "Win more listings",
		});

		expect(seo.headline).toContain("Real Estate Agents");
		expect(seo.description).toContain("win more listings".toLowerCase());
		expect(seo.keywords).toEqual(
			expect.arrayContaining(["Real Estate Agents", "Win more listings"]),
		);
	});

	it("falls back to defaults when persona data missing", () => {
		const seo = buildPersonaAiOutreachStudioSeo();

		expect(seo.headline).toContain(
			"Turn conversations into conversions automatically.",
		);
		expect(seo.description).toContain(
			AI_OUTREACH_STUDIO_DESCRIPTION.slice(0, 10),
		);
	});
});

describe("AI_OUTREACH_STUDIO_SEO constant", () => {
	it("matches the builder output", () => {
		const manual = buildAiOutreachStudioSeo();
		expect(AI_OUTREACH_STUDIO_SEO).toEqual(manual);
	});
});
