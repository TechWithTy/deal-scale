import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import {
	buildPartnersItemListSchema,
	buildPartnersOrganizationSchema,
} from "@/lib/partners/schemaBuilders";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";

import PartnersClient from "./PartnersClient";

// * Centralized SEO for /partners using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/partners");
	return mapSeoMetaToMetadata(seo);
}

export default function PartnersPage() {
	const itemListSchema = buildPartnersItemListSchema(companyLogos);
	const partnerOrganizations = buildPartnersOrganizationSchema(companyLogos);

	return (
		<>
			<SchemaInjector schema={[itemListSchema, ...partnerOrganizations]} />
			<PartnersClient partners={companyLogos} />
		</>
	);
}
