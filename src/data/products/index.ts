import type { ProductType } from "@/types/products";
import { agentProducts } from "./agents";
import { closerProducts } from "./closers";
import { creditProducts } from "./credits";
import { essentialsProducts } from "./essentials";
import { freeResourceProducts } from "./free-resources";
import { monetizeProducts } from "./monetize";
import { notionProducts } from "./notion";
import { workflowProducts } from "./workflow";

export const mockProducts: ProductType[] = [
	...freeResourceProducts,
	...creditProducts,
	...essentialsProducts,
	...notionProducts,
	...workflowProducts,
	...agentProducts,
	...closerProducts,
	...monetizeProducts, // Marketplace entry points for monetization
];

export function getAllProducts(): ProductType[] {
	return mockProducts;
}
