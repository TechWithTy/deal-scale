import AboutUsClient from "@/components/about/AboutUsClient";
import { timelineSummary } from "@/data/about/timelineSummary";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector, buildManifestoSchema } from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

const MANIFESTO_SCHEMA = buildManifestoSchema(timelineSummary, {
	url: "/about",
	name: "DealScale Blue Ocean Manifesto",
});

// * Generate metadata for the about page
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/about");
	const enhancedSeo = {
		...seo,
		manifestoSections:
			seo.manifestoSections && Array.isArray(seo.manifestoSections)
				? seo.manifestoSections
				: timelineSummary,
	};

	return mapSeoMetaToMetadata(enhancedSeo);
}

const AboutPage = () => {
	return (
		<>
			<SchemaInjector schema={MANIFESTO_SCHEMA} />
			<AboutUsClient />
		</>
	);
};

export default AboutPage;
