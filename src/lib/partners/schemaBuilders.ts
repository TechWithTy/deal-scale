import type { CompanyLogoDictType } from "@/data/service/slug_data/trustedCompanies";
import { staticSeoMeta } from "@/utils/seo/staticSeo";

const SCHEMA_CONTEXT = "https://schema.org";
const BASE_CANONICAL = (
	staticSeoMeta["/partners"]?.canonical || "https://dealscale.io/partners"
).replace(/\/$/, "");

function resolvePartnerUrl(slug: string, link?: string): string {
	return link ?? `${BASE_CANONICAL}#${slug}`;
}

export function buildPartnersItemListSchema(partners: CompanyLogoDictType) {
	const entries = Object.entries(partners);

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "ItemList",
		name: "DealScale Partner Directory",
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		itemListElement: entries.map(([slug, partner], index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: resolvePartnerUrl(slug, partner.link),
			name: partner.name,
			item: {
				"@type": "Organization",
				name: partner.name,
				url: resolvePartnerUrl(slug, partner.link),
				description: partner.description,
				image: partner.logo,
			},
		})),
	};
}
