import { getLatestBeehiivPosts } from "@/lib/beehiiv/getPosts";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import {
        SchemaInjector,
        buildBlogSchema,
} from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import BlogClient from "./BlogClient";

// * Centralized SEO for /blogs using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/blogs");
	return mapSeoMetaToMetadata(seo);
}

export default async function BlogsPage() {
        const seo = getStaticSeo("/blogs");
        const posts = await getLatestBeehiivPosts({ perPage: 12 });
        const schema = buildBlogSchema({
                canonicalUrl: seo.canonical,
                name: seo.title ?? "Deal Scale Blog",
                description: seo.description,
                posts,
        });

        return (
                <>
                        <SchemaInjector schema={schema} />
                        <BlogClient />
                </>
        );
}
