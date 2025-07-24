import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import BlogClient from "./BlogClient";

// * Centralized SEO for /blogs using getStaticSeo helper
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/blogs");
	return mapSeoMetaToMetadata(seo);
}

export default function BlogsPage() {
	return <BlogClient />;
}
