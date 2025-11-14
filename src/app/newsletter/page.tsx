import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import type { BeehiivPost } from "@/types/behiiv";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import NewsletterClient from "./NewsletterClient";

export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/newsletter");
	return mapSeoMetaToMetadata(seo);
}

// Fetch posts from Beehiiv API route (server-side)

export default async function NewsletterPage() {
	const posts = await getLatestBeehiivPosts();
	return <NewsletterClient posts={posts} />;
}
