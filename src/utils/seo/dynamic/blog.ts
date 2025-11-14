import type { BeehiivPost } from "@/types/behiiv";

import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { getTestBaseUrl } from "@/utils/env";

import { resolveBeehiivDate } from "@/utils/seo/seo";
import type { SeoMeta } from "@/utils/seo/seo";
import { getTestimonialReviewData } from "@/utils/seo/schema";

function toIsoDate(value: unknown): string | undefined {
	if (value === null || value === undefined) {
		return undefined;
	}

	if (value instanceof Date) {
		const time = value.getTime();
		return Number.isFinite(time) ? new Date(time).toISOString() : undefined;
	}

	if (typeof value === "number") {
		const ms = value < 1e12 ? value * 1000 : value;
		return Number.isFinite(ms) ? new Date(ms).toISOString() : undefined;
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return undefined;

		const numeric = Number(trimmed);
		if (!Number.isNaN(numeric)) {
			const ms = numeric < 1e12 ? numeric * 1000 : numeric;
			return Number.isFinite(ms) ? new Date(ms).toISOString() : undefined;
		}

		const parsed = new Date(trimmed);
		return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
	}

	return undefined;
}

export async function getSeoMetadataForPost(id: string): Promise<SeoMeta> {
	// Fetch all Beehiiv posts using the shared util
	const posts: BeehiivPost[] = await getLatestBeehiivPosts(100); // fetch enough to find any post
	const post = posts.find((p) => p.id === id);
	// Always build a fallback canonical URL for not-found
	const fallbackCanonical = `${getTestBaseUrl()}/blogs/${id}`;
	const pageUrl = post?.web_url || fallbackCanonical;
	const { aggregateRating } = getTestimonialReviewData();

	if (!post) {
		return {
			title: "Article Not Found",
			description: "The requested article could not be found",
			canonical: fallbackCanonical,
			keywords: [],
			image: "",
			type: "article",
			priority: 0.7, // * fallback
			changeFrequency: "weekly", // * fallback
		};
	}

	// Description: use meta_default_description, preview_text, or a safe fallback
	let description = post.meta_default_description || post.preview_text || "";
	if (
		!description &&
		post.content &&
		typeof post.content === "object" &&
		"free" in post.content &&
		typeof post.content.free.web === "string"
	) {
		description = post.content.free.web.slice(0, 160);
	}

	// Keywords: use content_tags or empty array
	const keywords = Array.isArray(post.content_tags) ? post.content_tags : [];

	// Images: use thumbnail_url if present
	const images = post.thumbnail_url ? [post.thumbnail_url] : [];

	const datePublished =
		toIsoDate(post.published_at) ??
		toIsoDate(post.publish_date) ??
		toIsoDate(post.displayed_date) ??
		toIsoDate(post.created);
	const dateModified =
		toIsoDate(post.displayed_date) ??
		toIsoDate(post.publish_date) ??
		toIsoDate((post as Record<string, unknown>).updated_at);

	return {
		title: post.title,
		description,
		canonical: pageUrl,
		keywords,
		image: images[0] || "",
		type: "article",
		datePublished,
		dateModified,
		priority: 0.7, // * or customize per post
		changeFrequency: "weekly", // * or customize per post
		ratingValue: aggregateRating?.ratingValue,
		reviewCount: aggregateRating?.reviewCount,
	};
}
