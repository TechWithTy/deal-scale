// Mock SEO utilities before importing the page
jest.mock("@/utils/seo/staticSeo", () => ({
	getStaticSeo: jest.fn(),
	defaultSeo: {
		canonical: "https://dealscale.io",
		title: "Deal Scale",
		description: "Default description",
	},
}));

jest.mock("@/utils/seo/mapSeoMetaToMetadata", () => ({
	mapSeoMetaToMetadata: jest.fn((seo) => ({
		title: seo.title || "Deal Scale",
		description: seo.description || "Default description",
		alternates: {
			canonical: seo.canonical || "https://dealscale.io",
		},
	})),
}));

import { generateMetadata } from "@/app/linktree/page";
import { getStaticSeo } from "@/utils/seo/staticSeo";

describe("LinkTree Page Metadata", () => {
	const mockSeo = {
		title: "Link Tree | Deal Scale",
		description:
			"Quick access to DealScale's most important links, resources, and pages.",
		canonical: "https://dealscale.io/linktree",
		keywords: ["links", "resources"],
		image: "/banners/main.png",
		siteName: "Deal Scale",
		type: "website" as const,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(getStaticSeo as jest.Mock).mockReturnValue(mockSeo);
	});

	test("generates metadata with correct title", async () => {
		const metadata = await generateMetadata();

		expect(metadata.title).toBe(
			"Link Tree | DealScale - Quick Access to Resources",
		);
	});

	test("generates metadata with correct description", async () => {
		const metadata = await generateMetadata();

		expect(metadata.description).toContain(
			"Explore DealScale's curated collection of links",
		);
		expect(metadata.description).toContain(
			"products, services, blog posts, events, case studies",
		);
	});

	test("includes OpenGraph metadata", async () => {
		const metadata = await generateMetadata();

		expect(metadata.openGraph).toEqual({
			title: "DealScale Link Tree",
			description:
				"Quick access to DealScale's most important links, resources, and pages.",
			url: "https://dealscale.io/linktree",
			type: "website",
		});
	});

	test("includes Twitter Card metadata", async () => {
		const metadata = await generateMetadata();

		expect(metadata.twitter).toEqual({
			card: "summary_large_image",
			title: "DealScale Link Tree",
			description: "Quick access to DealScale's resources and pages.",
		});
	});

	test("uses canonical URL from static SEO", async () => {
		const metadata = await generateMetadata();

		expect(getStaticSeo).toHaveBeenCalledWith("/linktree");
		expect(metadata.openGraph?.url).toBe("https://dealscale.io/linktree");
	});

	test("falls back to default URL if SEO not found", async () => {
		(getStaticSeo as jest.Mock).mockReturnValue({
			canonical: undefined,
		});

		const metadata = await generateMetadata();

		expect(metadata.openGraph?.url).toBe("https://dealscale.io/linktree");
	});
});
