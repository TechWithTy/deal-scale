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
	FAQPageSchema,
	OfferSchema,
	OrganizationSchema,
	ProductSchema,
	ProductSchemaInput,
	ReviewSchema,
	ServiceSchema,
	ServiceSchemaInput,
	WebSiteSchema,
} from "./types";

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
	const logo = defaultSeo.image
		? buildAbsoluteUrl(defaultSeo.image)
		: undefined;
	const { reviews, aggregateRating } = getTestimonialReviewData();
	const partnerOrganizations = buildPartnersOrganizationSchema(companyLogos);

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "Organization",
		"@id": ORGANIZATION_ID,
		name: companyData.companyName,
		legalName: companyData.companyLegalName,
		url: defaultSeo.canonical,
		description: companyData.companyDescription,
		sameAs: buildSocialProfiles(),
		logo,
		image: "https://dealscale.io/banners/main.png",
		contactPoint: buildContactPoints(),
		...(address && { address }),
		...(aggregateRating ? { aggregateRating } : {}),
		...(reviews.length ? { review: reviews } : {}),
		...(partnerOrganizations.length
			? { member: partnerOrganizations }
			: {}),
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
	...(service.aggregateRating ? { aggregateRating: service.aggregateRating } : {}),
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
