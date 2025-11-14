// app/products/page.tsx
// ! Products page: displays ProductGrid with mock API call
// * Follows DRY, SOLID, and type-safe best practices (see user rules)

import type { ProductType } from "@/types/products";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { SchemaInjector, buildProductListJsonLd } from "@/utils/seo/schema";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/products");
	return mapSeoMetaToMetadata(seo);
}

async function fetchProducts(): Promise<ProductType[]> {
	const { mockProducts } = await import("@/data/products");
	return mockProducts;
}

interface ProductsPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({
	searchParams,
}: ProductsPageProps) {
	const resolvedSearchParams = await searchParams;
	const callbackUrl = resolvedSearchParams.callbackUrl
		? Array.isArray(resolvedSearchParams.callbackUrl)
			? resolvedSearchParams.callbackUrl[0]
			: resolvedSearchParams.callbackUrl
		: undefined;
	const products = await fetchProducts();
	const productSchemas = buildProductListJsonLd(products);

	return (
		<>
			{productSchemas.length > 0 && <SchemaInjector schema={productSchemas} />}
			<ProductsClient initialProducts={products} callbackUrl={callbackUrl} />
		</>
	);
}
