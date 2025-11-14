import type { FAQItem } from "@/types/faq";

import { staticSeoMeta, defaultSeo } from "@/utils/seo/staticSeo";
import type { SeoMeta } from "@/utils/seo/seo";

import {
	buildFAQPageSchema,
	buildProductSchema,
} from "@/utils/seo/schema/builders";
import {
	SCHEMA_CONTEXT,
} from "@/utils/seo/schema/helpers";
import type { ProductSchema } from "@/utils/seo/schema/types";

const EXTERNAL_TOOLS_BASE = "/external-tools";

const normalizePath = (slug: string): string => {
	const trimmed = slug.trim();
	if (!trimmed) return EXTERNAL_TOOLS_BASE;

	if (trimmed.startsWith(`${EXTERNAL_TOOLS_BASE}/`)) {
		return trimmed;
	}

	const normalized = trimmed.startsWith("/")
		? trimmed.slice(1)
		: trimmed;

	return `${EXTERNAL_TOOLS_BASE}/${normalized}`.replace(/\/{2,}/g, "/");
};

export const getExternalToolSeo = (slug: string): SeoMeta => {
	const path = normalizePath(slug);
	return staticSeoMeta[path] ?? defaultSeo;
};

export interface ExternalToolFaqSchemaInput {
	canonicalUrl: string;
	name: string;
	description?: string;
	faqs: FAQItem[];
}

export const buildExternalToolFaqSchema = ({
	canonicalUrl,
	name,
	description,
	faqs,
}: ExternalToolFaqSchemaInput) =>
	buildFAQPageSchema({
		canonicalUrl,
		name,
		description,
		faqs,
	});

export interface ExternalToolHowToStep {
	name: string;
	text: string;
}

export interface ExternalToolHowToSchemaInput {
	canonicalUrl: string;
	name: string;
	description?: string;
	totalTime?: string;
	steps: ExternalToolHowToStep[];
	supplies?: string[];
	tools?: string[];
}

export const buildExternalToolHowToSchema = ({
	canonicalUrl,
	name,
	description,
	totalTime,
	steps,
	supplies,
	tools,
}: ExternalToolHowToSchemaInput) => ({
	"@context": SCHEMA_CONTEXT,
	"@type": "HowTo" as const,
	"@id": `${canonicalUrl}#howto`,
	url: canonicalUrl,
	name,
	description,
	totalTime,
	step: steps.map((step, index) => ({
		"@type": "HowToStep" as const,
		position: index + 1,
		name: step.name,
		text: step.text,
	})),
	supply: supplies?.map((item) => ({
		"@type": "HowToSupply" as const,
		name: item,
	})),
	tool: tools,
});

export interface ExternalToolProductSchemaInput {
	name: string;
	description: string;
	url: string;
	image?: string;
	price: number | string;
	priceCurrency: string;
	brand?: string;
	sku?: string;
	availability?: string;
}

export const buildExternalToolProductSchema = ({
	name,
	description,
	url,
	image,
	price,
	priceCurrency,
	brand,
	sku,
	availability,
}: ExternalToolProductSchemaInput): ProductSchema =>
	buildProductSchema({
		name,
		description,
		url,
		image,
		brand,
		sku,
		offers: {
			price,
			priceCurrency,
			url,
			availability,
		},
	});



