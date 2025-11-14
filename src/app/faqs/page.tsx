import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import FaqClinet from "./FaqClinet";

// * Centralized SEO for /faqs using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/faqs");
	return mapSeoMetaToMetadata(seo);
}

export default function FaqsPage() {
	return <FaqClinet />;
}
