import type { ManifestoSectionSummary } from "@/data/about/timelineSummary";
import type { MediumArticle } from "@/data/medium/post";
import type { BeehiivPost } from "@/types/behiiv";
import type { CaseStudy } from "@/types/case-study";
import type { ServiceItemData } from "@/types/service/services";
import * as React from "react";
import { defaultSeo } from "./staticSeo";

import { getPostByGuid } from "@/lib/medium/get";
/**
 * Returns full Next.js Metadata for a blog post, including canonical/original tags
 * Used by both generateMetadata and test suites for DRY SEO logic
 */
// src/utils/seo/getSeoMetadataForPost.ts
import type { Metadata } from "next";

export interface SeoMeta {
	/**
	 * Sitemap priority for SEO (0.0 - 1.0)
	 */
	priority?: number;
	/**
	 * Sitemap changeFrequency for SEO
	 */
	changeFrequency?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	title: string;
	description: string;
	canonical?: string;
	keywords: string[];
	image: string;
	type?:
		| "website"
		| "article"
		| "book"
		| "profile"
		| "music.song"
		| "music.album"
		| "music.playlist"
		| "music.radio_station"
		| "video.movie"
		| "video.episode"
		| "video.tv_show"
		| "video.other";
	datePublished?: string;
	dateModified?: string;
	siteName?: string;
	manifestoSections?: ManifestoSectionSummary[];
	[key: string]:
		| string
		| string[]
		| number
		| SeoMeta["changeFrequency"]
		| ManifestoSectionSummary[]
		| undefined;
}

function toIsoString(
	value: number | string | Date | null | undefined,
): string | undefined {
	if (value === null || value === undefined) {
		return undefined;
	}
	if (value instanceof Date) {
		const time = value.getTime();
		return Number.isNaN(time) ? undefined : value.toISOString();
	}
	if (typeof value === "number") {
		const ms = value < 1e12 ? value * 1000 : value;
		const date = new Date(ms);
		return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) {
			return undefined;
		}
		const numeric = Number(trimmed);
		if (!Number.isNaN(numeric)) {
			return toIsoString(numeric);
		}
		const date = new Date(trimmed);
		return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
	}
	return undefined;
}

export function resolveBeehiivDate(
	...values: Array<number | string | Date | null | undefined>
): string | undefined {
	for (const value of values) {
		const iso = toIsoString(value);
		if (iso) {
			return iso;
		}
	}
	return undefined;
}

// * Renders Open Graph meta tags for Next.js/React head
// ! Only use in server components or <head> blocks

export function renderOpenGraphMeta(openGraph: {
	title?: string;
	description?: string;
	url?: string;
	type?:
		| "website"
		| "article"
		| "book"
		| "profile"
		| "music.song"
		| "music.album"
		| "music.playlist"
		| "music.radio_station"
		| "video.movie"
		| "video.episode"
		| "video.tv_show"
		| "video.other";
	publishedTime?: string;
	authors?: string[];
	images?: { url: string; width?: number; height?: number; alt?: string }[];
	keywords?: string[];
	siteName?: string;
	locale?: string;
	metadataBase?: string;
	twitter?: {
		card?: string;
		title?: string;
		description?: string;
		creator?: string;
		images?: string[];
	};
}): React.ReactNode[] {
	if (!openGraph) return [];
	const tags: React.ReactNode[] = [];
	if (openGraph.title)
		tags.push(
			React.createElement("meta", {
				key: "og:title",
				property: "og:title",
				content: openGraph.title,
			}),
		);
	if (openGraph.description)
		tags.push(
			React.createElement("meta", {
				key: "og:description",
				property: "og:description",
				content: openGraph.description,
			}),
		);
	if (openGraph.url)
		tags.push(
			React.createElement("meta", {
				key: "og:url",
				property: "og:url",
				content: openGraph.url,
			}),
		);
	if (openGraph.type)
		tags.push(
			React.createElement("meta", {
				key: "og:type",
				property: "og:type",
				content: openGraph.type,
			}),
		);
	if (openGraph.publishedTime)
		tags.push(
			React.createElement("meta", {
				key: "og:published_time",
				property: "og:published_time",
				content: openGraph.publishedTime,
			}),
		);
	if (openGraph.authors?.length)
		openGraph.authors.forEach((author, i) =>
			tags.push(
				React.createElement("meta", {
					key: `og:article:author:${i}`,
					property: "article:author",
					content: author,
				}),
			),
		);
	if (openGraph.images?.length)
		openGraph.images.forEach((img, i) => {
			tags.push(
				React.createElement("meta", {
					key: `og:image:${i}`,
					property: "og:image",
					content: img.url,
				}),
			);
			if (img.width)
				tags.push(
					React.createElement("meta", {
						key: `og:image:width:${i}`,
						property: "og:image:width",
						content: String(img.width),
					}),
				);
			if (img.height)
				tags.push(
					React.createElement("meta", {
						key: `og:image:height:${i}`,
						property: "og:image:height",
						content: String(img.height),
					}),
				);
			if (img.alt)
				tags.push(
					React.createElement("meta", {
						key: `og:image:alt:${i}`,
						property: "og:image:alt",
						content: img.alt,
					}),
				);
		});
	// Keywords
	if (openGraph.keywords?.length) {
		tags.push(
			React.createElement("meta", {
				key: "keywords",
				name: "keywords",
				content: openGraph.keywords.join(", "),
			}),
		);
	}
	// OG site name
	if (openGraph.siteName)
		tags.push(
			React.createElement("meta", {
				key: "og:site_name",
				property: "og:site_name",
				content: openGraph.siteName,
			}),
		);
	// OG locale
	if (openGraph.locale)
		tags.push(
			React.createElement("meta", {
				key: "og:locale",
				property: "og:locale",
				content: openGraph.locale,
			}),
		);
	// OG metadataBase as canonical url
	if (openGraph.metadataBase)
		tags.push(
			React.createElement("link", {
				key: "canonical",
				rel: "canonical",
				href: openGraph.metadataBase,
			}),
		);
	// Twitter meta tags
	if (openGraph.twitter) {
		if (openGraph.twitter.card)
			tags.push(
				React.createElement("meta", {
					key: "twitter:card",
					name: "twitter:card",
					content: openGraph.twitter.card,
				}),
			);
		if (openGraph.twitter.title)
			tags.push(
				React.createElement("meta", {
					key: "twitter:title",
					name: "twitter:title",
					content: openGraph.twitter.title,
				}),
			);
		if (openGraph.twitter.description)
			tags.push(
				React.createElement("meta", {
					key: "twitter:description",
					name: "twitter:description",
					content: openGraph.twitter.description,
				}),
			);
		if (openGraph.twitter.creator)
			tags.push(
				React.createElement("meta", {
					key: "twitter:creator",
					name: "twitter:creator",
					content: openGraph.twitter.creator,
				}),
			);
		if (openGraph.twitter.images?.length)
			openGraph.twitter.images.forEach((img, i) =>
				tags.push(
					React.createElement("meta", {
						key: `twitter:image:${i}`,
						name: "twitter:image",
						content: img,
					}),
				),
			);
	}
	return tags;
}
export function getBlogSeo(post: BeehiivPost): SeoMeta {
	// Description: prefer meta_default_description, preview_text, or content
	let description =
		post.meta_default_description ||
		post.preview_text ||
		defaultSeo.description;
	if (
		!description &&
		post.content &&
		typeof post.content === "object" &&
		"free" in post.content &&
		typeof post.content.free.web === "string"
	) {
		description = post.content.free.web.slice(0, 160);
	}

	// Keywords: use content_tags or fallback
	const keywords =
		Array.isArray(post.content_tags) && post.content_tags.length > 0
			? post.content_tags
			: defaultSeo.keywords;

	// Image: use thumbnail_url or fallback
	const image = post.thumbnail_url || defaultSeo.image;

	// Dates: use publish_date if present, else undefined
	const datePublished = resolveBeehiivDate(
		post.published_at,
		post.publish_date,
		post.displayed_date,
	);
	const dateModified =
		resolveBeehiivDate(
			post.displayed_date,
			post.publish_date,
			post.published_at,
		) || datePublished;

	return {
		title: `${post.title} | Blog | Deal Scale`,
		description,
		canonical: post.web_url || undefined,
		keywords,
		image,
		type: "article",
		datePublished,
		dateModified,
	};
}

export function getCaseStudySeo(cs: CaseStudy): SeoMeta {
	return {
		title: `${cs.title} | Case Study | Deal Scale`,
		description: cs.subtitle || defaultSeo.description,
		canonical: `https://dealscale.io/case-studies/${cs.slug}`,
		keywords: defaultSeo.keywords,
		image: cs.featuredImage || defaultSeo.image,
		type: "article",
		datePublished: cs.lastModified.toISOString(),
		dateModified: cs.lastModified.toISOString(),
	};
}
export function getServiceSeo(service: ServiceItemData): SeoMeta {
	return {
		title: `${service.title} | Services | Deal Scale`,
		description: service.description || defaultSeo.description,
		canonical: `https://dealscale.io/features/${service.slugDetails.slug}`,
		keywords: defaultSeo.keywords,
		image: defaultSeo.image,
		type: "article",
		datePublished: service.slugDetails.datePublished
			? service.slugDetails.datePublished.toISOString()
			: new Date().toISOString(),
		dateModified: service.slugDetails.lastModified
			? service.slugDetails.lastModified.toISOString()
			: new Date().toISOString(),
	};
}
