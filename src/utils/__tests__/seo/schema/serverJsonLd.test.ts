import { getServerSideJsonLd } from "@/utils/seo/schema";

describe("getServerSideJsonLd", () => {
	it("serializes builder output into a sanitized JSON string", () => {
		const builder = jest.fn(() => ({
			"@context": "https://schema.org",
			"@type": "TestSchema",
			description: "</script><script>alert('xss')</script>",
		}));

		const result = getServerSideJsonLd({
			builder,
			input: { slug: "test" },
		});

		expect(builder).toHaveBeenCalledWith({ slug: "test" });
		expect(result.ok).toBe(true);
		if (!result.ok) return;

		expect(result.json).toBe(
			'{"@context":"https://schema.org","@type":"TestSchema","description":"\\u003C/script\\u003E\\u003Cscript\\u003Ealert(\'xss\')\\u003C/script\\u003E"}',
		);
		expect(result.json).not.toContain("</script>");
	});

	it("returns the same precomputed schema without invoking a builder", () => {
		const schema = [
			{
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "Deal Scale",
			},
		];

		const result = getServerSideJsonLd({ schema });

		expect(result.ok).toBe(true);
		if (!result.ok) return;

		expect(result.schema).toBe(schema);
		expect(result.json).toBe(
			'[{"@context":"https://schema.org","@type":"Organization","name":"Deal Scale"}]',
		);
	});

	it("captures builder errors instead of throwing", () => {
		const builder = jest.fn(() => {
			throw new Error("builder exploded");
		});

		const result = getServerSideJsonLd({
			builder,
			input: {},
		});

		expect(result.ok).toBe(false);
		if (result.ok) return;

		expect(result.error).toBeInstanceOf(Error);
		expect(result.error.message).toBe("builder exploded");
	});
});
