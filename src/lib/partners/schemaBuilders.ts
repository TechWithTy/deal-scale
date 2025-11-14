import type { CompanyLogoDictType } from "@/data/service/slug_data/trustedCompanies";
import { staticSeoMeta } from "@/utils/seo/staticSeo";

const SCHEMA_CONTEXT = "https://schema.org";
const BASE_CANONICAL = (
	staticSeoMeta["/partners"]?.canonical || "https://dealscale.io/partners"
).replace(/\/$/, "");

const isAbsoluteUrl = (value: string | undefined): boolean =>
	typeof value === "string" && /^https?:\/\//i.test(value);

const resolveAssetUrl = (asset: string | undefined): string | undefined => {
	if (!asset) {
		return undefined;
	}

	if (isAbsoluteUrl(asset)) {
		return asset;
	}

	const normalized = asset.startsWith("/")
		? `${BASE_CANONICAL}${asset}`
		: `${BASE_CANONICAL}/${asset}`;

	return normalized.replace(/(?<!:)\/{2,}/g, "/").replace("https:/", "https://");
};

function resolvePartnerUrl(slug: string, link?: string): string {
	if (link && isAbsoluteUrl(link)) {
		return link;
	}

	const anchor = slug.trim().length > 0 ? `#${slug}` : "";
	return `${BASE_CANONICAL}${anchor}`;
}

export function buildPartnersItemListSchema(partners: CompanyLogoDictType) {
	const entries = Object.entries(partners);

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "ItemList",
		name: "DealScale Partner Directory",
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		itemListElement: entries.map(([slug, partner], index) => {
			const url = resolvePartnerUrl(slug, partner.link);
			const image = resolveAssetUrl(partner.logo);

			return {
				"@type": "ListItem",
				position: index + 1,
				url,
				name: partner.name,
				item: {
					"@type": "Organization",
					"@id": `${url}#partner`,
					name: partner.name,
					url,
					description: partner.description,
					...(image ? { image } : {}),
				},
			};
		}),
	};
}

export function buildPartnersOrganizationSchema(
	partners: CompanyLogoDictType,
) {
	return Object.entries(partners).map(([slug, partner]) => {
		const url = resolvePartnerUrl(slug, partner.link);
		const logo = resolveAssetUrl(partner.logo);
		const sameAs =
			partner.link && isAbsoluteUrl(partner.link) ? [partner.link] : undefined;

		return {
			"@type": "Organization",
			"@id": `${url}#partner`,
			name: partner.name,
			url,
			...(partner.description ? { description: partner.description } : {}),
			...(logo ? { logo } : {}),
			...(sameAs ? { sameAs } : {}),
		};
	});
}
