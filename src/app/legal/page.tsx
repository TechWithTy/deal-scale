import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import LegalClient from "./LegalClient";

// Generate metadata for the legal hub page
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/legal");
	return mapSeoMetaToMetadata(seo);
}

const LegalPage = () => {
	return <LegalClient />;
};

export default LegalPage;
