import type { ProductType } from "@/types/products";
import { creditProducts } from "./credits";
import { essentialsProducts } from "./essentials";
import { notionProducts } from "./notion";
import { workflowProducts } from "./workflow";

export const mockProducts: ProductType[] = [
	...creditProducts,
	...essentialsProducts,
	...notionProducts,
	...workflowProducts,
];

export function getAllProducts(): ProductType[] {
	return mockProducts;
}
