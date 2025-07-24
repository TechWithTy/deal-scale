// app/products/page.tsx
// ! Products page: displays ProductGrid with mock API call
// * Follows DRY, SOLID, and type-safe best practices (see user rules)

import type { Metadata } from "next";
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import ProductsClient from "./ProductsClient";
import type { ProductType } from "@/types/products";

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

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams.callbackUrl
    ? Array.isArray(resolvedSearchParams.callbackUrl)
      ? resolvedSearchParams.callbackUrl[0]
      : resolvedSearchParams.callbackUrl
    : undefined;
  const products = await fetchProducts();
  return <ProductsClient initialProducts={products} callbackUrl={callbackUrl} />;
}
