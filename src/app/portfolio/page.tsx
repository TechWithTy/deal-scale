import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import PortfolioHomeClient from "./PortfolioHomeClient";

// * Centralized SEO for /portfolio using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/portfolio");
	return mapSeoMetaToMetadata(seo);
}

export default function PortfolioPage() {
	return <PortfolioHomeClient />;
}
