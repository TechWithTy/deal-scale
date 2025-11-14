import type { ServiceItemData } from "@/types/service/services";
import { getTestBaseUrl } from "@/utils/env";
import type { SeoMeta } from "@/utils/seo/seo";
import { getTestimonialReviewData } from "@/utils/seo/schema";

/**
 * Fetches SEO metadata for a service by slug.
 * @param slug Service slug
 * @param services All services data (flat array)
 * @returns Metadata object for Next.js
 */
export function getSeoMetadataForService(
	slug: string,
	services: ServiceItemData[],
): SeoMeta {
	const baseUrl = getTestBaseUrl();
	const pageUrl = `${baseUrl}/features/${slug}`;
	const service = services.find((s) => s.slugDetails.slug === slug);
	const { aggregateRating } = getTestimonialReviewData();

	if (!service) {
		return {
			title: "Service Not Found",
			description: "The requested service could not be found",
			canonical: pageUrl,
			keywords: [],
			image: "",
			type: "article",
			priority: 0.8, // * fallback
			changeFrequency: "weekly", // * fallback
		};
	}

	// Use slugDetails for SEO-relevant fields if available
	const { title, description } = service;
	const { integrations, datePublished, lastModified } = service.slugDetails;

	// Use the first tech stack image or fallback to default image
	const ogImage =
		integrations?.[0]?.libraries?.[0]?.customSvg || "/banners/Feature.png";
	return {
		title: `${title || service.title} | Service | Deal Scale`,
		description: description || service.description || "Service details.",
		canonical: pageUrl,
		keywords: service.categories || [],
		alternates: [pageUrl],
		image: ogImage,
		type: "article",
		datePublished: datePublished
			? new Date(datePublished).toISOString()
			: undefined,
		dateModified: lastModified
			? new Date(lastModified).toISOString()
			: undefined,
		priority: 0.8, // * or customize per service
		changeFrequency: "weekly", // * or customize per service
		ratingValue: aggregateRating?.ratingValue,
		reviewCount: aggregateRating?.reviewCount,
	};
}
