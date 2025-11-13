import type { ABTest } from "@/types/testing";

export type SemanticChangeLevel = "none" | "minor" | "moderate" | "major";

export interface SemanticDiffEntry {
	variantName: string;
	field: string;
	changeLevel: SemanticChangeLevel;
	similarityScore: number;
	beforeValue: string;
	afterValue: string;
}

const tokenize = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, " ")
		.split(/\s+/)
		.filter(Boolean);

const jaccardSimilarity = (a: string, b: string): number => {
	const tokensA = tokenize(a);
	const tokensB = tokenize(b);

	if (!tokensA.length && !tokensB.length) return 1;
	if (!tokensA.length || !tokensB.length) return 0;

	const setA = new Set(tokensA);
	const setB = new Set(tokensB);

	const intersection = new Set([...setA].filter((token) => setB.has(token)));
	const union = new Set([...setA, ...setB]);

	return intersection.size / union.size;
};

const classify = (similarity: number): SemanticChangeLevel => {
	if (similarity >= 0.9) return "none";
	if (similarity >= 0.75) return "minor";
	if (similarity >= 0.5) return "moderate";
	return "major";
};

const comparableFields: Array<keyof ABTest["variants"][number]["copy"]> = [
	"cta",
	"pain_point",
	"solution",
	"hope",
	"fear",
	"whatsInItForMe",
];

const normalizeValue = (value: unknown): string => {
	if (Array.isArray(value)) {
		return value.map((item) => normalizeValue(item)).join(" ");
	}
	if (typeof value === "object" && value !== null) {
		return JSON.stringify(value);
	}
	if (typeof value === "string") {
		return value;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return "";
};

const getVariantName = (variant: ABTest["variants"][number], index: number) =>
	variant.name ?? `Variant #${index + 1}`;

export const diffAbTests = (
	previous: ABTest,
	next: ABTest,
): SemanticDiffEntry[] => {
	const results: SemanticDiffEntry[] = [];

	const maxVariants = Math.max(previous.variants.length, next.variants.length);

	for (let index = 0; index < maxVariants; index += 1) {
		const prevVariant = previous.variants[index];
		const nextVariant = next.variants[index];

		if (!prevVariant || !nextVariant || !prevVariant.copy || !nextVariant.copy)
			continue;

		for (const field of comparableFields) {
			const beforeValue = normalizeValue(prevVariant.copy?.[field]);
			const afterValue = normalizeValue(nextVariant.copy?.[field]);

			if (beforeValue === afterValue) continue;

			const similarity = jaccardSimilarity(beforeValue, afterValue);

			results.push({
				variantName: getVariantName(nextVariant, index),
				field: field.toString(),
				changeLevel: classify(similarity),
				similarityScore: Number(similarity.toFixed(3)),
				beforeValue,
				afterValue,
			});
		}
	}

	return results;
};
