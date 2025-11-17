import { timelineSummary } from "@/data/about/timelineSummary";

import { buildManifestoSchema } from "../manifesto";

describe("buildManifestoSchema", () => {
	it("creates a CreativeWorkSeries with list items and anchors", () => {
		const schema = buildManifestoSchema(timelineSummary, {
			url: "/about",
			name: "DealScale Manifesto",
			description: "Refined manifesto for automation driven wealth.",
		});

		expect(schema["@type"]).toBe("CreativeWorkSeries");
		expect(schema.hasPart).toHaveLength(timelineSummary.length);
		expect(schema.itemListElement).toHaveLength(timelineSummary.length);
		expect(schema.hasPart?.[0]).toMatchSnapshot("manifesto-first-part");
		expect(schema.itemListElement?.[0]).toMatchSnapshot(
			"manifesto-first-list-item",
		);
	});
});



