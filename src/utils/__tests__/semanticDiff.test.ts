import type { ABTest } from "@/types/testing";
import { diffAbTests } from "@/utils/testing/semanticDiff";

const buildTest = (overrides?: Partial<ABTest>): ABTest => ({
	id: "ab-test",
	name: "Baseline Test",
	startDate: new Date("2024-01-01T00:00:00Z"),
	isActive: true,
	variants: [
		{
			name: "Variant A",
			percentage: 50,
			copy: {
				cta: "Get Started",
				pain_point: "Manual processes waste time.",
				solution: "Automate your outreach.",
				hope: "You recover your weekends.",
				fear: "Competitors outpace you.",
				whatsInItForMe: "Less effort, more deals.",
				highlighted_words: ["automate"],
			},
		},
		{
			name: "Variant B",
			percentage: 50,
			copy: {
				cta: "Scale Faster",
				pain_point: "Lack of visibility hurts revenue.",
				solution: "Get real-time analytics.",
				hope: "You know exactly what works.",
				fear: "You miss hidden bottlenecks.",
				whatsInItForMe: "Clarity on every campaign.",
				highlighted_words: ["analytics"],
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
	...overrides,
});

describe("diffAbTests", () => {
	it("returns no diffs when copy matches", () => {
		const baseline = buildTest();
		const diffs = diffAbTests(baseline, buildTest());
		expect(diffs).toHaveLength(0);
	});

	it("detects significant changes", () => {
		const baseline = buildTest();
		const updated = buildTest({
			variants: [
				{
					...baseline.variants[0],
					copy: {
						...baseline.variants[0].copy!,
						hope: "Your team trusts the system again.",
					},
				},
				...baseline.variants.slice(1),
			],
		});

		const diffs = diffAbTests(baseline, updated);
		expect(diffs).toHaveLength(1);
		expect(diffs[0].field).toBe("hope");
		expect(diffs[0].changeLevel).not.toBe("none");
	});
});


