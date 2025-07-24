import type { Metadata } from "next";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import AboutUsClient from "@/components/about/AboutUsClient";

// * Generate metadata for the about page
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/about");
	return mapSeoMetaToMetadata(seo);
}

const AboutPage = () => {
	return <AboutUsClient />;
};

export default AboutPage;
