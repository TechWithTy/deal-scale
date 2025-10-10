import type { ProductType } from "@/types/products";
import { creditProducts } from "./credits";
import { essentialsProducts } from "./essentials";
import { notionProducts } from "./notion";
import { workflowProducts } from "./workflow";
import { agentProducts } from "./agents";
import { freeResourceProducts } from "./free-resources";

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
