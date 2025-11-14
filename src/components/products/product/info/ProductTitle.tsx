import type { ProductType } from "@/types/products";

/**
 * * ProductTitle: Displays the product name and price
 * @param {ProductType} product
 * @param {number} currentPrice
 */
export default function ProductTitle({
	product,
	currentPrice,
}: { product: ProductType; currentPrice: number }) {
	return (
		<>
			<h1 className="font-bold text-3xl text-primary tracking-tight sm:text-4xl">
				{product.name}
			</h1>
			<div className="mt-3">
				<h2 className="sr-only">Product information</h2>
				<p className="text-3xl text-primary tracking-tight">
					${currentPrice.toFixed(2)}
				</p>
			</div>
		</>
	);
}
