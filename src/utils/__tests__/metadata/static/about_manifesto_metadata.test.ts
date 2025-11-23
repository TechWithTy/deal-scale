import { timelineSummary } from "@/data/about/timelineSummary";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";

describe("mapSeoMetaToMetadata manifesto integration", () => {
	it("generates seeAlso links for manifesto sections", () => {
		const metadata = mapSeoMetaToMetadata({
			title: "About DealScale",
			description: "Discover DealScale's manifesto and mission.",
			canonical: "https://leadorchestra.com/about",
			keywords: ["DealScale", "about"],
			image: "/og-image.png",
			manifestoSections: timelineSummary,
		});

		expect(metadata.openGraph?.seeAlso).toEqual(
			timelineSummary.map(
				(section) => `https://leadorchestra.com/about#${section.anchor}`,
			),
		);
	});
});
