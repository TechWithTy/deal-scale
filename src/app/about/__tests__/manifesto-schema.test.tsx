import { render } from "@testing-library/react";

import { timelineSummary } from "@/data/about/timelineSummary";
import { SchemaInjector, buildManifestoSchema } from "@/utils/seo/schema";

describe("About manifesto schema injection", () => {
	it("renders JSON-LD script with manifesto data", () => {
		const schema = buildManifestoSchema(timelineSummary, { url: "/about" });
		const { container } = render(<SchemaInjector schema={schema} />);

		const script = container.querySelector(
			'script[type="application/ld+json"]',
		);
		expect(script).not.toBeNull();
		expect(script?.textContent).toContain("CreativeWorkSeries");
		expect(script?.textContent).toContain("DealScale Blue Ocean Manifesto");
	});
});
