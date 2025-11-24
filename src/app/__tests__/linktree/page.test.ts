import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/seo/staticSeo", () => {
	const getStaticSeo = vi.fn();
	return {
		__esModule: true,
		getStaticSeo,
		defaultSeo: {
			canonical: "https://leadorchestra.com",
			title: "Deal Scale",
			description: "Default description",
		},
	};
});

vi.mock("@/utils/seo/mapSeoMetaToMetadata", () => ({
	__esModule: true,
	mapSeoMetaToMetadata: vi.fn((seo) => ({
		title: seo.title || "Deal Scale",
		description: seo.description || "Default description",
		alternates: {
			canonical: seo.canonical || "https://leadorchestra.com",
		},
	})),
}));

import { generateMetadata } from "@/app/linktree/page";
import { getStaticSeo } from "@/utils/seo/staticSeo";

const mockedGetStaticSeo = vi.mocked(getStaticSeo);

describe("LinkTree Page Metadata", () => {
	const mockSeo = {
		title: "Link Tree | Deal Scale",
		description:
			"Quick access to DealScale's most important links, resources, and pages.",
		canonical: "https://leadorchestra.com/linktree",
		keywords: ["links", "resources"],
		image: "/banners/main.png",
		siteName: "Deal Scale",
		type: "website" as const,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockedGetStaticSeo.mockReturnValue(mockSeo);
	});

	it("generates metadata with correct title", async () => {
		const metadata = await generateMetadata();

		expect(metadata.title).toBe(
			"Link Tree | DealScale - Quick Access to Resources",
		);
	});

	it("generates metadata with correct description", async () => {
		const metadata = await generateMetadata();

		expect(metadata.description).toContain(
			"Explore DealScale's curated collection of links",
		);
		expect(metadata.description).toContain(
			"products, services, blog posts, events, case studies",
		);
	});

	it("includes OpenGraph metadata", async () => {
		const metadata = await generateMetadata();

		expect(metadata.openGraph).toEqual({
			title: "DealScale Link Tree",
			description:
				"Quick access to DealScale's most important links, resources, and pages.",
			url: "https://leadorchestra.com/linktree",
			type: "website",
		});
	});

	it("includes Twitter Card metadata", async () => {
		const metadata = await generateMetadata();

		expect(metadata.twitter).toEqual({
			card: "summary_large_image",
			title: "DealScale Link Tree",
			description: "Quick access to DealScale's resources and pages.",
		});
	});

	it("uses canonical URL from static SEO", async () => {
		const metadata = await generateMetadata();

		expect(mockedGetStaticSeo).toHaveBeenCalledWith("/linktree");
		expect(metadata.openGraph?.url).toBe("https://leadorchestra.com/linktree");
	});

	it("falls back to default URL if SEO not found", async () => {
		mockedGetStaticSeo.mockReturnValue({
			canonical: undefined,
		} as Partial<typeof mockSeo>);

		const metadata = await generateMetadata();

		expect(metadata.openGraph?.url).toBe("https://leadorchestra.com/linktree");
	});
});
