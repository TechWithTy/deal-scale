import { dataModules } from "@/data/__generated__/modules";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector, buildFAQPageSchema } from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// * Centralized SEO for /pricing using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/pricing");
	return mapSeoMetaToMetadata(seo);
}

// Client component wrapper
export default function PricingPage() {
	const PricingClient = dynamic(() => import("./PricingClient"), {
		loading: () => <div>Loading pricing...</div>,
	});

	const seo = getStaticSeo("/pricing");
	const { PricingPlans } = dataModules["service/slug_data/pricing"];
	const { leadGenFAQ } = dataModules["service/slug_data/faq"];
	const schema = buildFAQPageSchema({
		canonicalUrl: seo.canonical,
		name: `${seo.title ?? "Deal Scale Pricing"} FAQs`,
		description: seo.description,
		faqs: leadGenFAQ.faqItems.slice(0, 8),
	});

	return (
		<>
			<SchemaInjector schema={schema} />
			<PricingClient plans={PricingPlans} />
		</>
	);
}
