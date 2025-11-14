import type { CompanyLogoDictType } from "@/data/service/slug_data/trustedCompanies";
import { buildPartnersItemListSchema } from "@/lib/partners/schemaBuilders";

describe("partner schema builder", () => {
	const partners: CompanyLogoDictType = {
		alpha: {
			name: "Alpha Partner",
			logo: "https://example.com/logo.png",
			link: "https://alpha.example.com",
			description: "Alpha description",
		},
		beta: {
			name: "Beta Partner",
			logo: "https://example.com/beta.png",
			description: "Beta description",
		},
	};

	test("produces an ItemList referencing each partner organization", () => {
		const schema = buildPartnersItemListSchema(partners);

		expect(schema["@type"]).toBe("ItemList");
		expect(schema.itemListElement).toHaveLength(2);
		expect(schema.itemListElement[0]).toEqual(
			expect.objectContaining({
				position: 1,
				item: expect.objectContaining({
					"@type": "Organization",
					name: "Alpha Partner",
				}),
			}),
		);
		expect(schema.itemListElement[1].item.url).toBe(
			"https://dealscale.io/partners#beta",
		);
	});
});
