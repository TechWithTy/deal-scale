jest.mock("@/lib/beehiiv/getPosts", () => ({
	getLatestBeehiivPosts: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/utils/seo/dynamic/blog", () => ({
	getSeoMetadataForPost: jest.fn().mockResolvedValue({}),
}));

jest.mock("@/lib/caseStudies/case-studies", () => ({
	getAllCaseStudies: jest.fn().mockResolvedValue([
		{
			slug: "ai-outreach",
			lastModified: new Date("2024-12-01T00:00:00Z"),
		},
	]),
}));

jest.mock("@/utils/seo/dynamic/case-studies", () => ({
	getSeoMetadataForCaseStudy: jest.fn().mockResolvedValue({
		canonical: "https://dealscale.io/case-studies/ai-outreach",
		title: "AI Outreach Case Study",
		description: "How Deal Scale automates outreach.",
		keywords: ["ai", "outreach"],
		image: "https://dealscale.io/images/case-study.jpg",
		changeFrequency: "monthly",
		priority: 0.75,
	}),
}));

jest.mock("@/data/products/index", () => ({
	getAllProducts: jest.fn(() => [
		{
			slug: "ai-agent",
			sku: "sku-ai-agent",
		},
	]),
}));

jest.mock("@/utils/seo/product", () => ({
	getSeoMetadataForProduct: jest.fn().mockResolvedValue({
		canonical: "https://dealscale.io/products/ai-agent",
		title: "AI Agent",
		description: "AI agent product.",
		keywords: ["ai"],
		image: "https://dealscale.io/images/ai-agent.jpg",
		changeFrequency: "monthly",
		priority: 0.65,
	}),
}));

jest.mock("@/data/service/services", () => ({
	getAllServices: jest.fn(async () => [
		{
			slugDetails: {
				slug: "ai-caller",
				lastModified: new Date("2024-11-01T00:00:00Z"),
			},
		},
	]),
}));

jest.mock("@/utils/seo/dynamic/services", () => ({
	getSeoMetadataForService: jest.fn().mockResolvedValue({
		canonical: "https://dealscale.io/features/ai-caller",
		title: "AI Caller",
		description: "AI caller service.",
		keywords: ["caller"],
		image: "https://dealscale.io/images/ai-caller.jpg",
		changeFrequency: "weekly",
		priority: 0.85,
	}),
}));

import sitemap from "@/app/sitemap";

describe("sitemap metadata", () => {
	it("includes prioritized entries for key SEO routes", async () => {
		const entries = await sitemap();
		const byUrl = (url: string) => entries.find((entry) => entry.url === url);

		const baseUrl = "https://dealscale.io";

		const events = byUrl(`${baseUrl}/events`);
		expect(events).toBeDefined();
		expect(events?.priority).toBeGreaterThanOrEqual(0.8);

		const partners = byUrl(`${baseUrl}/partners`);
		expect(partners).toBeDefined();
		expect(partners?.priority).toBeGreaterThanOrEqual(0.7);

		const careers = byUrl(`${baseUrl}/careers`);
		expect(careers).toBeUndefined();

		const caseStudyEntry = entries.find((entry) =>
			entry.url?.startsWith(`${baseUrl}/case-studies/`),
		);
		expect(caseStudyEntry?.priority).toBeGreaterThan(0);
	});
});
