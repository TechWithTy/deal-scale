import { describe, expect, it } from "vitest";

import type { HeroCopy } from "../../types/copy";
import { resolveHeroCopy } from "../../utils/copy";

const BASE_COPY: HeroCopy = {
	values: {
		problem: "manual handoffs derail launches",
		solution: "guided hero launches stay aligned",
		fear: "your marketing pipeline stalls out",
		socialProof: "Teams launch faster with DealScale.",
		benefit: "Ship polished hero modules",
		time: "7",
	},
	rotations: {
		problems: [],
		solutions: [],
		fears: [],
	},
};

describe("resolveHeroCopy phrase constraints", () => {
	it("truncates lengthy rotation phrases to six words", () => {
		const copy: HeroCopy = {
			...BASE_COPY,
			rotations: {
				problems: [
					"losing track of lookalike off-market motivated sellers everywhere",
				],
				solutions: ["shipping polished hero modules in one sprint"],
				fears: ["watching your launch calendar slip endlessly"],
			},
		};

		const resolved = resolveHeroCopy(copy);

		expect(resolved.rotations.problems[0]).toBe(
			"losing track of lookalike off-market motivated",
		);
		expect(resolved.rotations.problems[0].split(" ")).toHaveLength(6);
	});

	it("drops short phrases and falls back to base values", () => {
		const copy: HeroCopy = {
			...BASE_COPY,
			rotations: {
				problems: ["short"],
				solutions: ["perfect length phrase"],
				fears: ["tiny"],
			},
		};

		const resolved = resolveHeroCopy(copy);

		expect(resolved.rotations.problems[0]).toBe(
			"manual handoffs derail launches",
		);
		expect(resolved.rotations.fears[0]).toBe(
			"your marketing pipeline stalls out",
		);
	});
});
