import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";

// * Centralized SEO for /case-studies using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/case-studies");
	return mapSeoMetaToMetadata(seo);
}

export default function CaseStudiesPage() {
	return <CaseStudiesClient />;
}
