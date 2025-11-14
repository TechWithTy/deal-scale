import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import ContactClient from "./ContactClient";

// * Centralized SEO for /contact using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/contact");
	return mapSeoMetaToMetadata(seo);
}

export default function ContactPage() {
	return <ContactClient />;
}
