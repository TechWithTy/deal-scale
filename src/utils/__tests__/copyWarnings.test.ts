import { collectCopyWarnings } from "@/utils/testing/copyWarnings";

const buildTest = () => ({
	id: "test-1",
	name: "Sample Test",
	isActive: true,
	startDate: new Date(),
	variants: [
		{
			name: "Variant A",
			percentage: 60,
			copy: {
				cta: "Buy Now",
				whatsInItForMe: "Value prop",
				pain_point: "Your process is slow.",
				solution: "We automate tasks.",
				hope: "You get hours back every week.",
				fear: "Competitors outrun you.",
				highlighted_words: ["automate"],
			},
		},
		{
			name: "Variant B",
			percentage: 40,
			copy: {
				cta: "Buy Now",
				pain_point: "No clarity.",
				solution: "We clarify.",
				hope: "You feel confident.",
				fear: "You miss targets.",
				highlighted_words: ["clarity"],
			},
		},
	],
	analysis: {
		normalized: true,
		summary: {
			variantCount: 2,
			totalPercentage: 100,
			isBalanced: true,
			isActive: true,
		},
		warnings: [],
	},
});

describe("collectCopyWarnings", () => {
	it("returns warnings from analysis metadata", () => {
		const test = buildTest();
		test.analysis?.warnings.push({
			code: "duplicate-cta",
			message: "Duplicate CTA",
			severity: "warning",
		});

		const [result] = collectCopyWarnings(test);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0].code).toBe("duplicate-cta");
	});

	it("adds inferred warnings for long hope/fear copy", () => {
		const test = buildTest();
		if (test.variants[0].copy) {
			test.variants[0].copy.hope = "a".repeat(251);
			test.variants[0].copy.fear = "b".repeat(251);
		}

		const [result] = collectCopyWarnings(test);
		expect(
			result.warnings.find((warning) => warning.code === "hope-too-long"),
		).toBeTruthy();
		expect(
			result.warnings.find((warning) => warning.code === "fear-too-long"),
		).toBeTruthy();
	});
});



