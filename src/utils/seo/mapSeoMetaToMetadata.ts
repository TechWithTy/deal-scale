import type { Metadata } from "next";
// * Maps custom SeoMeta to Next.js Metadata type, including canonical tag
import type { SeoMeta } from "./seo";

type ManifestoSection =
	| {
			title: string;
			subtitle?: string;
			summary?: string;
			anchor?: string;
	  }
	| Record<string, unknown>;

function toAbsoluteImageUrl(image?: string): string | undefined {
	if (!image) return undefined;
	if (image.startsWith("http")) return image;
	const base = process.env.NEXT_PUBLIC_SITE_URL || "https://dealscale.io";
	return `${base}${image.startsWith("/") ? "" : "/"}${image}`;
}

function slugify(value: string, fallback: string, index: number): string {
	const base = value || fallback || `section-${index + 1}`;
	return (
		base
			.toString()
			.trim()
			.normalize("NFKD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/gi, "-")
			.replace(/^-+|-+$/g, "")
			.toLowerCase() || `section-${index + 1}`
	);
}

export function mapSeoMetaToMetadata(seo: SeoMeta): Metadata {
	const imageUrl = toAbsoluteImageUrl(seo.image);
	const manifestoSections = Array.isArray(
		(seo as { manifestoSections?: ManifestoSection[] }).manifestoSections,
	)
		? (((seo as { manifestoSections?: ManifestoSection[] }).manifestoSections ??
				[]) as ManifestoSection[])
		: undefined;

	const canonicalBase =
		seo.canonical ||
		process.env.NEXT_PUBLIC_SITE_URL ||
		"https://dealscale.io/about";

	const seeAlsoLinks = manifestoSections
		? manifestoSections.map((section, index) => {
				const anchor =
					typeof section.anchor === "string" && section.anchor.length > 0
						? section.anchor
						: slugify(
								typeof section.title === "string" ? section.title : "",
								"manifesto",
								index,
							);
				return `${canonicalBase}${anchor.startsWith("#") ? "" : "#"}${anchor}`;
			})
		: undefined;

	return {
		title: seo.title,
		description: seo.description,
		keywords: seo.keywords,
		openGraph: {
			title: seo.title,
			description: seo.description,
			url: seo.canonical,
			siteName: seo.siteName,
			images: imageUrl
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
			seeAlso: seeAlsoLinks,
		},
		twitter: imageUrl
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
