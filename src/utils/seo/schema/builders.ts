import { companyData } from "@/data/company";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
import type { BeehiivPost } from "@/types/behiiv";
import type { CaseStudy } from "@/types/case-study";
import type { FAQItem } from "@/types/faq";
import { buildPartnersOrganizationSchema } from "@/lib/partners/schemaBuilders";
import { defaultSeo } from "@/utils/seo/staticSeo";

import {
	ORGANIZATION_ID,
	SCHEMA_CONTEXT,
	WEBSITE_ID,
	buildAbsoluteUrl,
	buildContactPoints,
	buildPostalAddress,
	buildSocialProfiles,
} from "./helpers";
import { getTestimonialReviewData } from "./reviewData";
import type {
	BlogPostingSchema,
	BlogSchema,
	CreativeWorkSchema,
	DatasetSchema,
	FAQPageSchema,
	OfferSchema,
	OrganizationSchema,
	ProductSchema,
	ProductSchemaInput,
	ReviewSchema,
	ServiceSchema,
	ServiceSchemaInput,
	SoftwareApplicationSchema,
	WebPageReference,
	WebSiteSchema,
} from "./types";

const AUTHORITY_REVIEW_SCHEMAS: ReviewSchema[] = [
	{
		"@type": "Review",
		name: "Real Estate Investor · DealScale",
		reviewBody:
			"DealScale’s AI agents handle our seller calls and follow-ups automatically — we’ve doubled our closing rate.",
		author: {
			"@type": "Person",
			name: "Real Estate Investor",
		},
		reviewRating: {
			"@type": "Rating",
			ratingValue: 5,
			bestRating: 5,
		},
		itemReviewed: {
			"@id": ORGANIZATION_ID,
			"@type": "Organization",
			name: companyData.companyName,
		},
	},
	{
		"@type": "Review",
		name: "Wholesaler · DealScale",
		reviewBody:
			"The voice cloning and CRM sync save us hours daily. Onboarding took minutes.",
		author: {
			"@type": "Person",
			name: "Wholesaler",
		},
		reviewRating: {
			"@type": "Rating",
			ratingValue: 4.8,
			bestRating: 5,
		},
		itemReviewed: {
			"@id": ORGANIZATION_ID,
			"@type": "Organization",
			name: companyData.companyName,
		},
	},
	{
		"@type": "Review",
		name: "AI Automation Consultant · DealScale",
		reviewBody:
			"DealScale is a must-have for AI-driven real estate prospecting. The lookalike lead engine is game-changing.",
		author: {
			"@type": "Person",
			name: "AI Automation Consultant",
		},
		reviewRating: {
			"@type": "Rating",
			ratingValue: 5,
			bestRating: 5,
		},
		itemReviewed: {
			"@id": ORGANIZATION_ID,
			"@type": "Organization",
			name: companyData.companyName,
		},
	},
];

type BuildCaseStudySchemaOptions = {
	canonicalUrl?: string;
	relatedCaseStudies?: CaseStudy[];
};

type BuildFAQPageSchemaOptions = {
	canonicalUrl: string;
	name: string;
	description?: string;
	faqs: FAQItem[];
};

type BuildBlogSchemaOptions = {
	canonicalUrl: string;
	name: string;
	description?: string;
	posts: BeehiivPost[];
};

export const buildOrganizationSchema = (): OrganizationSchema => {
	const address = buildPostalAddress();
	const logo = buildAbsoluteUrl("/logo.png");
	const primaryImage = buildAbsoluteUrl("/banners/main.png");
	const { reviews, aggregateRating } = getTestimonialReviewData();
	const partnerOrganizations = buildPartnersOrganizationSchema(companyLogos);
	const allReviews =
		reviews.length > 0
			? [...AUTHORITY_REVIEW_SCHEMAS, ...reviews]
			: AUTHORITY_REVIEW_SCHEMAS;

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "Organization",
		"@id": ORGANIZATION_ID,
		name: companyData.companyName,
		legalName: companyData.companyLegalName,
		url: defaultSeo.canonical,
		description: companyData.companyDescription,
		sameAs: buildSocialProfiles(),
		alternateName: ["DealScale.io", "Deal Scale", "DS", "Deal Scaler"],
		foundingDate: "2024-03-01",
		founder: {
			"@type": "Person",
			name: "Ty",
			jobTitle: "Co-Founder & CTO",
			url: "https://www.linkedin.com/in/techwithty",
		},
		knowsAbout: [
			"Artificial Intelligence",
			"Real Estate Technology",
			"Sales Automation",
			"CRM Automation",
			"Voice AI",
			"Lead Generation",
			"PropTech",
			"Real Estate Investing",
		],
		brand: {
			"@type": "Brand",
			name: companyData.companyName,
			logo,
		},
		logo,
		image: primaryImage,
		contactPoint: buildContactPoints(),
		...(address && { address }),
		...(aggregateRating ? { aggregateRating } : {}),
		...(allReviews.length ? { review: allReviews } : {}),
		...(partnerOrganizations.length ? { member: partnerOrganizations } : {}),
	};
};

export const buildWebSiteSchema = (): WebSiteSchema => ({
	"@context": SCHEMA_CONTEXT,
	"@type": "WebSite",
	"@id": WEBSITE_ID,
	url: defaultSeo.canonical,
	name: defaultSeo.siteName,
	description: defaultSeo.description,
	publisher: {
		"@id": ORGANIZATION_ID,
	},
	potentialAction: {
		"@type": "SearchAction",
		target: `${defaultSeo.canonical}/search?q={search_term_string}`,
		"query-input": "required name=search_term_string",
	},
	hasPart: ["/marketplace", "/blog", "/ai-agents"]
		.map((path): WebPageReference | undefined => {
			const url = buildAbsoluteUrl(path);

			return {
				"@type": "WebPage",
				"@id": `${url}#webpage`,
				url,
			};
		})
		.filter((entry): entry is WebPageReference => Boolean(entry)),
});

export const buildSoftwareApplicationSchema =
	(): SoftwareApplicationSchema => ({
		"@context": SCHEMA_CONTEXT,
		"@type": "SoftwareApplication",
		"@id": `${defaultSeo.canonical}#software`,
		name: "DealScale",
		description:
			defaultSeo.description ??
			"DealScale automates lead generation, enrichment, and outreach for real estate teams.",
		url: defaultSeo.canonical,
		image: buildAbsoluteUrl("/images/marketplace/ai-automations.png"),
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			url: buildAbsoluteUrl("/pricing"),
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: 4.9,
			reviewCount: 120,
			bestRating: 5,
			worstRating: 1,
		},
		review: AUTHORITY_REVIEW_SCHEMAS,
		sameAs: buildSocialProfiles(),
		publisher: {
			"@id": ORGANIZATION_ID,
		},
	});

export const buildDatasetSchema = (): DatasetSchema => ({
	"@context": SCHEMA_CONTEXT,
	"@type": "Dataset",
	"@id": `${buildAbsoluteUrl("/ai-agents")}#dataset`,
	name: "DealScale Lookalike Audience Engine",
	description:
		"AI-generated real estate prospect datasets enriched via pgvector embeddings, CRM intent signals, and public market data.",
	url: buildAbsoluteUrl("/ai-agents"),
	license: buildAbsoluteUrl("/tos"),
	provider: {
		"@type": "Organization",
		"@id": ORGANIZATION_ID,
		name: companyData.companyName,
		url: defaultSeo.canonical,
	},
	keywords: [
		"real estate",
		"lookalike audience",
		"ai prospecting",
		"deal sourcing",
	],
	distribution: [
		{
			"@type": "DataDownload",
			contentUrl: buildAbsoluteUrl("/contact"),
			encodingFormat: "application/json",
		},
	],
});

const buildOfferSchema = (
	offer?: ServiceSchemaInput["offers"],
): OfferSchema | undefined => {
	if (!offer) {
		return undefined;
	}

	return {
		...offer,
		"@type": "Offer",
		url: offer.url ? buildAbsoluteUrl(offer.url) : offer.url,
	};
};

export const buildServiceSchema = (
	service: ServiceSchemaInput,
): ServiceSchema => ({
	"@context": SCHEMA_CONTEXT,
	"@type": "Service",
	"@id": `${service.url}#service`,
	name: service.name,
	description: service.description,
	url: service.url,
	serviceType: service.serviceType ?? service.name,
	category: service.category,
	areaServed: service.areaServed,
	provider: {
		"@id": ORGANIZATION_ID,
	},
	offers: buildOfferSchema(service.offers),
	...(service.aggregateRating
		? { aggregateRating: service.aggregateRating }
		: {}),
	...(service.reviews?.length ? { review: service.reviews } : {}),
});

export const buildProductSchema = (
	product: ProductSchemaInput,
): ProductSchema => ({
	"@context": SCHEMA_CONTEXT,
	"@type": "Product",
	"@id": `${product.url}#product`,
	name: product.name,
	description: product.description,
	url: product.url,
	sku: product.sku,
	brand: {
		"@type": "Brand",
		name: product.brand ?? companyData.companyName,
	},
	image: Array.isArray(product.image)
		? product.image.map(buildAbsoluteUrl)
		: product.image
			? [buildAbsoluteUrl(product.image)]
			: undefined,
	offers: {
		...product.offers,
		"@type": "Offer",
		url: product.offers.url
			? buildAbsoluteUrl(product.offers.url)
			: product.offers.url,
	},
	manufacturer: {
		"@id": ORGANIZATION_ID,
	},
});

const normalizeIsoDate = (
	value?: number | string | Date | null,
): string | undefined => {
	if (value === undefined || value === null) {
		return undefined;
	}

	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
	}

	if (typeof value === "number") {
		const milliseconds = value > 1_000_000_000_000 ? value : value * 1000;
		const dateFromNumber = new Date(milliseconds);

		return Number.isNaN(dateFromNumber.getTime())
			? undefined
			: dateFromNumber.toISOString();
	}

	const parsed = new Date(value);

	return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const buildCaseStudyReviews = (
	caseStudy: CaseStudy,
	caseStudyUrl: string,
): ReviewSchema[] => {
	const baseDate = normalizeIsoDate(caseStudy.lastModified);

	const outcomeReviews = (caseStudy.businessOutcomes ?? []).map(
		(outcome): ReviewSchema => ({
			"@type": "Review",
			name: outcome.title,
			reviewBody: outcome.subtitle,
			datePublished: baseDate,
			author: {
				"@type": "Organization",
				name: caseStudy.clientName,
			},
			itemReviewed: {
				"@id": `${caseStudyUrl}#case-study`,
			},
		}),
	);

	const resultReviews = (caseStudy.results ?? []).map((result) => {
		const ratingValue =
			typeof result.value === "string"
				? Number.parseFloat(result.value.replace(/[^\d.]/g, ""))
				: Number.NaN;

		const review: ReviewSchema = {
			"@type": "Review",
			name: result.title,
			reviewBody: `${result.title}: ${result.value}`.trim(),
			datePublished: baseDate,
			author: {
				"@type": "Organization",
				name: caseStudy.clientName,
			},
			itemReviewed: {
				"@id": `${caseStudyUrl}#case-study`,
			},
		};

		if (Number.isFinite(ratingValue)) {
			review.reviewRating = {
				"@type": "Rating",
				ratingValue,
			};

			if (typeof result.value === "string" && result.value.includes("%")) {
				review.reviewRating.bestRating = 100;
				review.reviewRating.worstRating = 0;
			}
		}

		return review;
	});

	return [...outcomeReviews, ...resultReviews].filter((review) =>
		Boolean(review.reviewBody?.trim()),
	);
};

export const buildCaseStudyCreativeWorkSchema = (
	caseStudy: CaseStudy,
	options: BuildCaseStudySchemaOptions = {},
): CreativeWorkSchema => {
	const canonicalUrl = options.canonicalUrl
		? options.canonicalUrl
		: buildAbsoluteUrl(`/case-studies/${caseStudy.slug}`);
	const related = (options.relatedCaseStudies ?? []).map((relatedCaseStudy) => {
		const relatedUrl = buildAbsoluteUrl(
			`/case-studies/${relatedCaseStudy.slug}`,
		);

		return {
			"@type": "CreativeWork" as const,
			"@id": `${relatedUrl}#case-study`,
			url: relatedUrl,
			name: relatedCaseStudy.title,
		};
	});

	const isoDate = normalizeIsoDate(caseStudy.lastModified);

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "CreativeWork",
		"@id": `${canonicalUrl}#case-study`,
		url: canonicalUrl,
		name: caseStudy.title,
		headline: caseStudy.subtitle,
		description: caseStudy.description,
		datePublished: isoDate,
		dateModified: isoDate,
		inLanguage: "en",
		author: {
			"@type": "Organization",
			"@id": ORGANIZATION_ID,
			name: companyData.companyName,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": canonicalUrl,
		},
		citation: caseStudy.referenceLink,
		image: caseStudy.featuredImage
			? buildAbsoluteUrl(caseStudy.featuredImage)
			: undefined,
		keywords: caseStudy.tags,
		about: caseStudy.categories,
		review: buildCaseStudyReviews(caseStudy, canonicalUrl),
		isRelatedTo: related.length > 0 ? related : undefined,
	};
};

export const buildFAQPageSchema = ({
	canonicalUrl,
	name,
	description,
	faqs,
}: BuildFAQPageSchemaOptions): FAQPageSchema => ({
	"@context": SCHEMA_CONTEXT,
	"@type": "FAQPage",
	"@id": `${canonicalUrl}#faq`,
	url: canonicalUrl,
	name,
	description,
	mainEntity: faqs.map((faq) => ({
		"@type": "Question" as const,
		name: faq.question,
		acceptedAnswer: {
			"@type": "Answer" as const,
			text: faq.answer,
		},
	})),
});

const buildBlogPostingSchema = (post: BeehiivPost): BlogPostingSchema => {
	const resolvedUrl = post.web_url
		? post.web_url
		: buildAbsoluteUrl(`/blogs/${post.slug ?? post.id}`);
	const isoDate =
		normalizeIsoDate(post.published_at) ??
		normalizeIsoDate(post.publish_date) ??
		normalizeIsoDate(post.displayed_date);
	const keywordTags = Array.isArray(post.content_tags)
		? post.content_tags.filter(
				(tag): tag is string =>
					typeof tag === "string" && tag.trim().length > 0,
			)
		: undefined;

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "BlogPosting",
		"@id": `${resolvedUrl}#blog-post`,
		url: resolvedUrl,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": resolvedUrl,
		},
		headline: post.title,
		description: post.meta_default_description ?? post.subtitle,
		datePublished: isoDate,
		dateModified: isoDate,
		image: post.thumbnail_url,
		keywords: keywordTags,
		articleSection: keywordTags,
		author:
			post.authors && post.authors.length > 0
				? {
						"@type": "Person",
						name: post.authors[0] ?? companyData.companyName,
					}
				: {
						"@type": "Organization",
						"@id": ORGANIZATION_ID,
						name: companyData.companyName,
					},
		publisher: {
			"@id": ORGANIZATION_ID,
		},
		inLanguage: "en",
	};
};

export const buildBlogSchema = ({
	canonicalUrl,
	name,
	description,
	posts,
}: BuildBlogSchemaOptions): BlogSchema => {
	const uniquePosts = posts.filter((post): post is BeehiivPost =>
		Boolean(post?.title && (post.web_url || post.slug)),
	);

	const blogPosts = uniquePosts.map((post) => buildBlogPostingSchema(post));

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "Blog",
		"@id": `${canonicalUrl}#blog`,
		url: canonicalUrl,
		name,
		description,
		publisher: {
			"@id": ORGANIZATION_ID,
		},
		blogPost: blogPosts.length > 0 ? blogPosts : undefined,
	};
};
