import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import { buildPartnersItemListSchema } from "@/lib/partners/schemaBuilders";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import type { Metadata } from "next";

import PartnersClient from "./PartnersClient";

// * Centralized SEO for /partners using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/partners");
	return mapSeoMetaToMetadata(seo);
}

export default function PartnersPage() {
        const schema = buildPartnersItemListSchema(companyLogos);

        return (
                <>
                        <SchemaInjector schema={schema} />
                        <PartnersClient partners={companyLogos} />
                </>
        );
}
