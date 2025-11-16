import type { ABTest, AbTestWarning } from "@/types/testing";

export interface CopyWarningsResult {
	testId: string;
	testName: string;
	warnings: AbTestWarning[];
}

const ensureArray = <T>(value: T | T[] | undefined): T[] => {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
};

const normalizeTests = (tests: ABTest | ABTest[] | undefined): ABTest[] => {
	if (!tests) return [];
	return Array.isArray(tests) ? tests : [tests];
};

export const collectCopyWarnings = (
	tests: ABTest | ABTest[] | undefined,
): CopyWarningsResult[] => {
	const normalized = normalizeTests(tests);

	return normalized.map((test) => {
		const existingWarnings = ensureArray(test.analysis?.warnings);
		const inferredWarnings: AbTestWarning[] = [];

		test.variants.forEach((variant, index) => {
			const copy = variant.copy;
			if (!copy) return;

			if (
				copy.pain_points &&
				Array.isArray(copy.pain_points) &&
				copy.pain_points.length === 0
			) {
				inferredWarnings.push({
					code: "empty-pain-list",
					message: `Variant "${variant.name ?? `#${index + 1}`}" defines an empty pains list.`,
					severity: "info",
					variantIndex: index,
					variantName: variant.name,
				});
			}

			if (copy.fears && Array.isArray(copy.fears) && copy.fears.length === 0) {
				inferredWarnings.push({
					code: "empty-fear-list",
					message: `Variant "${variant.name ?? `#${index + 1}`}" defines an empty fears list.`,
					severity: "info",
					variantIndex: index,
					variantName: variant.name,
				});
			}

			if (copy.hope.length > 250) {
				inferredWarnings.push({
					code: "hope-too-long",
					message: `Hope copy exceeds 250 characters in variant "${variant.name ?? `#${index + 1}`}".`,
					severity: "warning",
					variantIndex: index,
					variantName: variant.name,
					field: "hope",
				});
			}

			if (copy.fear.length > 250) {
				inferredWarnings.push({
					code: "fear-too-long",
					message: `Fear copy exceeds 250 characters in variant "${variant.name ?? `#${index + 1}`}".`,
					severity: "warning",
					variantIndex: index,
					variantName: variant.name,
					field: "fear",
				});
			}
		});

		return {
			testId: test.id,
			testName: test.name,
			warnings: [...existingWarnings, ...inferredWarnings],
		};
	});
};


