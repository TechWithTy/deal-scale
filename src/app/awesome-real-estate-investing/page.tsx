import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector, buildTechArticleSchema } from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import AwesomeRealEstatePageClient from "./AwesomeRealEstatePageClient";

// Generate metadata for the awesome real estate investing page
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/awesome-real-estate-investing");
	return mapSeoMetaToMetadata(seo);
}

export default async function AwesomeRealEstateInvestingPage() {
	const seo = getStaticSeo("/awesome-real-estate-investing");
	const techArticleSchema = buildTechArticleSchema({
		headline: "Awesome Real Estate Investing – Curated List",
		url: seo.canonical || "/awesome-real-estate-investing",
		description: seo.description,
		mainEntityOfPage:
			"https://deal-scale.github.io/awesome-real-estate-investing/",
		sameAs: ["https://github.com/Deal-Scale/awesome-real-estate-investing"],
		keywords: Array.isArray(seo.keywords) ? seo.keywords : undefined,
		image: seo.image,
		datePublished: "2025-01-01",
		dateModified: new Date().toISOString().split("T")[0],
	});

	return (
		<>
			<SchemaInjector schema={techArticleSchema} />
			<AwesomeRealEstatePageClient />
		</>
	);
}
