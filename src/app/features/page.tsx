import type { Metadata } from "next";
import { dataModules } from "@/data/__generated__/modules";
import { featureTimeline } from "@/data/features/feature_timeline";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import {
	buildFAQPageSchema,
	buildRoadmapSchema,
	SchemaInjector,
} from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import ServiceHomeClient from "./ServiceHomeClient";

// * Centralized SEO for /features using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/features");
	return mapSeoMetaToMetadata(seo);
}

export default function ServicesPage() {
	const seo = getStaticSeo("/features");
	const { faqItems } = dataModules["faq/default"];
	const faqSchema = buildFAQPageSchema({
		canonicalUrl: seo.canonical,
		name: `${seo.title ?? "Deal Scale Features"} FAQs`,
		description: seo.description,
		faqs: faqItems.slice(0, 8),
	});

	const roadmapSchema = buildRoadmapSchema(featureTimeline, {
		url: seo.canonical,
		name: "Deal Scale Delivery Roadmap",
		description:
			"A strategic view of where Deal Scale is today and what's coming next. Statuses and progress come from our Product Ops layer—always live, always current.",
	});

	return (
		<>
			<SchemaInjector schema={faqSchema} />
			<SchemaInjector schema={roadmapSchema} />
			<ServiceHomeClient />
		</>
	);
}
