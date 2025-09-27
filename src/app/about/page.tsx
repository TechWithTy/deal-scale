import AboutUsClient from "@/components/about/AboutUsClient";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

// * Generate metadata for the about page
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/about");
	return mapSeoMetaToMetadata(seo);
}

const AboutPage = () => {
	return <AboutUsClient />;
};

export default AboutPage;
