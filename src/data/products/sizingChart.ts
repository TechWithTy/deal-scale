// ! Static sizing chart data for apparel (example)
// * Update or extend as needed for your products
import type { SizingChart } from "@/types/products";

export const sizingChart: SizingChart = [
	{ label: "XS", value: "XS", measurement: "Chest", unit: "in" },
	{ label: "S", value: "S", measurement: "Chest", unit: "in" },
	{ label: "M", value: "M", measurement: "Chest", unit: "in" },
	{ label: "L", value: "L", measurement: "Chest", unit: "in" },
	{ label: "XL", value: "XL", measurement: "Chest", unit: "in" },
	// * Add more rows or fields as needed, e.g. for length, waist, etc.
	// Example with actual numbers:
	// { label: "S", value: 36, measurement: "Chest", unit: "in" },
	// { label: "M", value: 38, measurement: "Chest", unit: "in" },
];
