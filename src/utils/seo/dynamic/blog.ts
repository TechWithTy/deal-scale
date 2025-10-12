import type { BeehiivPost } from "@/types/behiiv";
import type { Metadata } from "next";

import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { getTestBaseUrl } from "@/utils/env";

import { resolveBeehiivDate } from "@/utils/seo/seo";
import type { SeoMeta } from "@/utils/seo/seo";

export async function getSeoMetadataForPost(id: string): Promise<SeoMeta> {
	// Fetch all Beehiiv posts using the shared util
	const posts: BeehiivPost[] = await getLatestBeehiivPosts(100); // fetch enough to find any post
	const post = posts.find((p) => p.id === id);
	// Always build a fallback canonical URL for not-found
	const fallbackCanonical = `${getTestBaseUrl()}/blogs/${id}`;
	const pageUrl = post?.web_url || fallbackCanonical;

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
        };
}
