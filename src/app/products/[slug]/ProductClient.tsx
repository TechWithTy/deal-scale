"use client";

import ProductPage from "@/components/products/product/ProductPage";
import type { ProductType } from "@/types/products";
import React from "react";

interface ProductClientProps {
	product: ProductType;
	callbackUrl?: string;
}

export default function ProductClient({
	product,
	callbackUrl,
}: ProductClientProps) {
	// Add any client-side state or effects here if needed
	// For example: cart state, quantity selectors, etc.

	return (
		<div className="min-h-screen bg-background-dark">
			<ProductPage product={product} callbackUrl={callbackUrl} />
		</div>
	);
}
