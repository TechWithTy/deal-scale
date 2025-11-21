import { render } from "@testing-library/react";

import { SchemaInjector } from "@/utils/seo/schema";

describe("SchemaInjector", () => {
	it("renders a sanitized JSON-LD script when provided a schema", () => {
		const { container } = render(
			<SchemaInjector
				schema={{
					"@context": "https://schema.org",
					"@type": "TestSchema",
					description: "</script><script>alert('xss')</script>",
				}}
			/>,
		);

		const script = container.querySelector(
			"script[type='application/ld+json']",
		);

		expect(script).not.toBeNull();
		expect(script?.innerHTML).toBe(
			'{"@context":"https://schema.org","@type":"TestSchema","description":"\\u003C/script\\u003E\\u003Cscript\\u003Ealert(\'xss\')\\u003C/script\\u003E"}',
		);
		expect(script?.innerHTML).not.toContain("</script>");
	});
});
