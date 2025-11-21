import { mockProducts } from "@/data/products";
import type { ProductType } from "@/types/products";
import { getTestBaseUrl } from "@/utils/env";
import { getTestimonialReviewData } from "@/utils/seo/schema";
import type { SeoMeta } from "@/utils/seo/seo";

/**
 * Fetch a product by slug (replace with real DB or API call in production)
 */
function getProductBySlug(slug: string): ProductType | undefined {
	return mockProducts.find((p) => p.sku.toLowerCase() === slug.toLowerCase());
}

/**
 * Generate dynamic SEO metadata for a product page
 */
export async function getSeoMetadataForProduct(slug: string): Promise<SeoMeta> {
	const product = getProductBySlug(slug);
	const baseUrl = getTestBaseUrl();
	const pageUrl = `${baseUrl}/products/${slug}`;
	const { aggregateRating } = getTestimonialReviewData();

	if (!product) {
		return {
			title: "Product Not Found",
			description: "The requested product could not be found.",
			canonical: pageUrl,
			keywords: [],
			image: "",
			type: "article",
			priority: 0.6, // * fallback
			changeFrequency: "monthly", // * fallback
		};
	}

	// Compose keywords from product name, type, and default keywords
	const keywords = [
		product.name,
		...(product.types?.map((t) => t.name) || []),
		"Deal Scale",
		"shop",
		"products",
		"digital",
		"ecommerce",
	];

	return {
		title: `${product.name} | Product | Deal Scale`,
		description: product.description || "Product details and features.",
		canonical: pageUrl,
		keywords,
		image: product.images?.[0] || "",
		type: "article",
		priority: 0.6, // * or customize per product
		changeFrequency: "monthly", // * or customize per product
		ratingValue: aggregateRating?.ratingValue,
		reviewCount: aggregateRating?.reviewCount,
	};
}
