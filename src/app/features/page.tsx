import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import ServiceHomeClient from "./ServiceHomeClient";

// * Centralized SEO for /services using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/features");
	return mapSeoMetaToMetadata(seo);
}

export default function ServicesPage() {
	return <ServiceHomeClient />;
}
