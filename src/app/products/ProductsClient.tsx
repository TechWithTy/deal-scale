"use client";

import ProductGrid from "@/components/products/ProductGrid";
import type { ProductType } from "@/types/products";
import React from "react";

interface ProductsClientProps {
	initialProducts: ProductType[];
	callbackUrl?: string;
}

export default function ProductsClient({
	initialProducts,
	callbackUrl,
}: ProductsClientProps) {
	const [products] = React.useState<ProductType[]>(initialProducts);

	return (
		<main className="min-h-screen bg-background-dark py-16">
			<div className="py-8">
				<ProductGrid products={products} callbackUrl={callbackUrl} />
			</div>
		</main>
	);
}
