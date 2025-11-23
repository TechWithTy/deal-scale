import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import AffiliatePaymentSetupClient from "./AffiliatePaymentSetupClient";

// * Centralized SEO for /affiliate/payment-setup using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/affiliate");
	return mapSeoMetaToMetadata({
		...seo,
		title: `${seo.title} - Payment Setup`,
		description:
			"Complete your affiliate payment setup to start earning commissions",
	});
}

const AffiliatePaymentSetupPage = () => {
	return <AffiliatePaymentSetupClient />;
};

export default AffiliatePaymentSetupPage;
