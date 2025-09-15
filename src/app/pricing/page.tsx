import { PricingPlans } from "@/data/service/slug_data/pricing";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
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

	return <PricingClient plans={PricingPlans} />;
}
