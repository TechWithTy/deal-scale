import type { SeoMeta } from "@/utils/seo/seo";
import { defaultSeo } from "@/utils/seo/staticSeo";
// src/components/common/SEO.tsx
import Head from "next/head";

/**
 * SEO component for injecting dynamic meta tags into the page head.
 * All props are documented in the SeoMeta interface.
 */
/**
 * SEO component for injecting dynamic meta tags into the page head.
 * All props are documented in the SeoMeta interface.
 * @param renderCanonical - If true, renders the canonical <link> tag. Default: true. For Next.js app directory pages using generateMetadata, set to false to avoid duplicate canonical tags.
 */
export function SEOWrapper(
	meta: Partial<SeoMeta> & { renderCanonical?: boolean },
) {
	const {
		title,
		description,
		canonical,
		image,
		type,
		datePublished,
		dateModified,
		renderCanonical = true,
		...rest
	} = { ...defaultSeo, ...meta };

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			{/* ! Only render canonical tag if renderCanonical is true (default: true) */}
			{canonical && renderCanonical && (
				<link rel="canonical" href={canonical} />
			)}
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={type || "website"} />
			{image && <meta property="og:image" content={image} />}
			{canonical && <meta property="og:url" content={canonical} />}
			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{image && <meta name="twitter:image" content={image} />}
			{/* Article meta */}
			{datePublished && (
				<meta property="article:published_time" content={datePublished} />
			)}
			{dateModified && (
				<meta property="article:modified_time" content={dateModified} />
			)}

			{/* Additional custom meta tags */}
			{Object.entries(rest).map(([key, value]) => (
				<meta key={key} name={key} content={String(value)} />
			))}
		</Head>
	);
}
