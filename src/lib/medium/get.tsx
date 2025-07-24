import { companyData } from "@/data/company";
import type { MediumArticle } from "@/data/medium/post";

export async function getAllPosts(): Promise<MediumArticle[]> {
	try {
		console.log("Fetching Medium posts...");
		const mediumUrl = `https://medium.com/feed/@${companyData.socialLinks.mediumUsername}`;
		const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumUrl)}`;
		console.log("Fetching Medium posts from:", apiUrl);
		const response = await fetch(apiUrl);

		if (!response || typeof response.ok === "undefined")
			throw new Error("No response from Medium API");
		if (!response.ok) throw new Error("Failed to fetch posts");

		const data = await response.json();
		console.log("Raw Medium API response:", data);

		return data.items.map((item: MediumArticle) => {
			const imgRegex = /<img.*?src="(.*?)".*?>/;
			const match = item.content.match(imgRegex);
			const firstImage = match ? match[1] : null;
			const slug =
				item.guid.split("/").pop() ||
				item.title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-|-$/g, "");

			// Extract subtitle from description if available
			const description = item.description || "";
			const subtitle = description.replace(/<[^>]+>/g, "").split(".")[0];

			// console.log('Processed post:', {
			//     title: item.title,
			//     subtitle: subtitle,
			//     slug: slug
			// });

			return {
				...item,
				thumbnail: firstImage,
				slug,
				subtitle,
			};
		});
	} catch (error) {
		console.error("Error fetching Medium posts:", error);
		return [];
	}
}

import { extractGuidFromSlug } from "@/utils/extractGuidFromSlug";

export async function getPostByGuid(
	guid: string | string[],
): Promise<MediumArticle | null> {
	try {
		const mediumUrl = `https://medium.com/feed/@${companyData.socialLinks.mediumUsername}`;
		const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumUrl)}`;
		console.log("Fetching Medium posts from:", apiUrl);
		const response = await fetch(apiUrl);

		if (!response || typeof response.ok === "undefined")
			throw new Error("No response from Medium API");
		if (!response.ok) throw new Error("Failed to fetch posts");

		const data = await response.json();
		console.log("Raw Medium API response:", data);
		// Normalize for robust matching (handle array or string)
		const normalizedGuid = extractGuidFromSlug(guid);
		const normGuid = normalizedGuid.trim().toLowerCase();
		// Find post where the guid ends with the provided guid (robust for new slugs)
		const post = data.items.find((item: MediumArticle) =>
			item.guid.trim().toLowerCase().endsWith(normGuid),
		);
		// Debug: log all GUIDs for troubleshooting
		console.log(
			"Raw Medium API response GUIDs:",
			data.items.map((item: MediumArticle) => item.guid),
		);

		if (!post) return null;

		const imgRegex = /<img.*?src="(.*?)".*?>/;
		const match = post.content.match(imgRegex);
		const firstImage = match ? match[1] : null;
		const slug =
			post.guid.split("/").pop() ||
			post.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "");

		return {
			...post,
			slug,
			thumbnail: post.thumbnail || firstImage,
			categories: post.categories || [],
		} as MediumArticle;
	} catch (error) {
		console.error("Error fetching post:", error);
		return null;
	}
}
