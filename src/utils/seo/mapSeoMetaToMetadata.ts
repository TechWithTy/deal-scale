import type { Metadata } from "next";
// * Maps custom SeoMeta to Next.js Metadata type, including canonical tag
import type { SeoMeta } from "./seo";

export function mapSeoMetaToMetadata(seo: SeoMeta): Metadata {
	// Ensure we have a full URL for the image
	const imageUrl = seo.image?.startsWith("http")
		? seo.image
		: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dealscale.io"}${seo.image.startsWith("/") ? "" : "/"}${seo.image}`;

	return {
		title: seo.title,
		description: seo.description,
		keywords: seo.keywords,
		openGraph: {
			title: seo.title,
			description: seo.description,
			url: seo.canonical,
			siteName: seo.siteName,
			images: seo.image
				? [
						{
							url: imageUrl,
							width: 1200,
							height: 630,
							alt: seo.title,
						},
					]
				: undefined,
			type: seo.type || "website",
		},
		twitter: seo.image
			? {
					card: "summary_large_image",
					images: [imageUrl],
					title: seo.title,
					description: seo.description,
				}
			: undefined,
		alternates: {
			canonical: seo.canonical,
		},
	};
}
