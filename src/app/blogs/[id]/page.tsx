import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { redirect, notFound } from "next/navigation";

interface BlogPostPageProps {
	params: Promise<{ id: string }>;
}

/**
 * Dynamic route handler for individual blog posts
 * Redirects to the actual Beehiiv URL to avoid broken links in sitemap
 * 
 * This allows sitemap to use dealscale.io URLs (required by Google Search Console)
 * while redirecting to Beehiiv content. The redirect passes SEO value to the destination URL.
 */
export default async function BlogPostPage(props: BlogPostPageProps) {
	const { id } = await props.params;

	try {
		// Fetch all posts to find the matching one
		const posts = await getLatestBeehiivPosts({
			all: true,
			includeScheduled: true,
		});
		const post = posts.find((p) => p.id === id);

		// If post not found, return 404
		if (!post) {
			notFound();
		}

		// If post exists but has no web_url, redirect to blogs index
		const webUrl = post.web_url;
		if (!webUrl || typeof webUrl !== "string") {
			redirect("/blogs");
		}

		// Redirect to the Beehiiv URL
		// Next.js redirect() uses 307 (temporary) but search engines will still follow it
		redirect(webUrl);
	} catch (error) {
		// On error, redirect to blogs index
		console.error(`[BlogPostPage] Error fetching post ${id}:`, error);
		redirect("/blogs");
	}
}

