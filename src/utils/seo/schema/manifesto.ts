import type { ManifestoSectionSummary } from "@/data/about/timelineSummary";
import { companyData } from "@/data/company";
import { defaultSeo } from "@/utils/seo/staticSeo";

import { ORGANIZATION_ID, SCHEMA_CONTEXT, buildAbsoluteUrl } from "./helpers";

function slugifyAnchor(
	anchor: string,
	fallback: string,
	index: number,
): string {
	const base = anchor.trim() || fallback.trim().toLowerCase();
	return (
		base
			.normalize("NFKD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/gi, "-")
			.replace(/^-+|-+$/g, "")
			.toLowerCase() || `section-${index + 1}`
	);
}

export interface BuildManifestoSchemaOptions {
	url?: string;
	name?: string;
	description?: string;
}

export function buildManifestoSchema(
	sections: ManifestoSectionSummary[],
	options: BuildManifestoSchemaOptions = {},
) {
	const baseUrl = buildAbsoluteUrl(options.url ?? "/about");
	const seriesId = `${baseUrl}#manifesto`;

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "CreativeWorkSeries",
		"@id": seriesId,
		name: options.name ?? "DealScale Blue Ocean Manifesto",
		headline:
			options.description ??
			"Ten-part manifesto outlining how DealScale automates wealth creation for real estate operators.",
		description:
			options.description ??
			"Discover how DealScale scales revenue leverage with automation, ownership, and lifestyle-driven outcomes.",
		url: baseUrl,
		inLanguage: "en-US",
		author: {
			"@type": "Organization",
			"@id": ORGANIZATION_ID,
			name: companyData.companyName,
			url: defaultSeo.canonical,
		},
		dateModified: new Date().toISOString(),
		hasPart: sections.map((section, index) => {
			const anchor = slugifyAnchor(section.anchor, section.title, index);
			const partId = `${seriesId}-${anchor}`;
			return {
				"@type": "CreativeWork",
				"@id": partId,
				name: section.title,
				headline: section.subtitle || section.title,
				description: section.summary || section.subtitle || "",
				position: index + 1,
				url: `${baseUrl}#${anchor}`,
			};
		}),
		itemListElement: sections.map((section, index) => {
			const anchor = slugifyAnchor(section.anchor, section.title, index);
			return {
				"@type": "ListItem",
				position: index + 1,
				name: section.title,
				description: section.summary || section.subtitle || "",
				url: `${baseUrl}#${anchor}`,
			};
		}),
	};
}


