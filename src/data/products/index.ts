import type { ProductType } from "@/types/products";
import { agentProducts } from "./agents";
import { creditProducts } from "./credits";
import { essentialsProducts } from "./essentials";
import { freeResourceProducts } from "./free-resources";
import { notionProducts } from "./notion";
import { workflowProducts } from "./workflow";

export const mockProducts: ProductType[] = [
	...freeResourceProducts,
	...creditProducts,
	...essentialsProducts,
	...notionProducts,
	...workflowProducts,
	...agentProducts,
];

export function getAllProducts(): ProductType[] {
	return mockProducts;
}
