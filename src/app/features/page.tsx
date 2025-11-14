import { dataModules } from "@/data/__generated__/modules";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector, buildFAQPageSchema } from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import ServiceHomeClient from "./ServiceHomeClient";

// * Centralized SEO for /services using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/features");
	return mapSeoMetaToMetadata(seo);
}

export default function ServicesPage() {
	const seo = getStaticSeo("/features");
	const { faqItems } = dataModules["faq/default"];
	const schema = buildFAQPageSchema({
		canonicalUrl: seo.canonical,
		name: `${seo.title ?? "Deal Scale Features"} FAQs`,
		description: seo.description,
		faqs: faqItems.slice(0, 8),
	});

	return (
		<>
			<SchemaInjector schema={schema} />
			<ServiceHomeClient />
		</>
	);
}
