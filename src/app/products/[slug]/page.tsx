import type { ProductType } from "@/types/products";
import { SchemaInjector, buildProductJsonLd } from "@/utils/seo/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

// Next.js 15+ Dynamic Route Compatibility Pattern
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const { mockProducts } = await import("@/data/products");
	const product = mockProducts.find(
		(p: ProductType) =>
			p.slug === resolvedParams.slug || p.sku === resolvedParams.slug,
	);

	if (!product)
		return {
			title: "Product Not Found",
			description: "The requested product could not be found.",
		};

	// Get the first image URL or fallback to default
	const firstImage = product.images?.[0] || "";
	// Ensure image URL is absolute
	const imageUrl = firstImage.startsWith("http")
		? firstImage
		: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}${firstImage || "/images/og-default.jpg"}`;

	return {
		title: product.name,
		description: product.description,
		openGraph: {
			title: product.name,
			description: product.description,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: product.name,
				},
			],
			siteName: "Deal Scale",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: product.name,
			description: product.description,
			images: [imageUrl],
		},
	};
}

async function fetchProduct(slug: string): Promise<ProductType | null> {
	const { mockProducts } = await import("@/data/products");
	return (
		mockProducts.find((p: ProductType) => p.slug === slug || p.sku === slug) ||
		null
	);
}

interface ProductPageProps {
	params: Promise<{ slug: string }>;
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({
	params,
	searchParams,
}: ProductPageProps) {
	const { slug } = await params;
	const resolvedSearchParams = searchParams ? await searchParams : {};
	const product = await fetchProduct(slug);
	if (!product) return notFound();

	// Handle callbackUrl from resolvedSearchParams
	const callbackUrl = resolvedSearchParams.callbackUrl
		? Array.isArray(resolvedSearchParams.callbackUrl)
			? resolvedSearchParams.callbackUrl[0]
			: resolvedSearchParams.callbackUrl
		: undefined;

	const productSchema = buildProductJsonLd(product);

	return (
		<>
			<SchemaInjector schema={productSchema} />
			<ProductClient product={product} callbackUrl={callbackUrl} />
		</>
	);
}
