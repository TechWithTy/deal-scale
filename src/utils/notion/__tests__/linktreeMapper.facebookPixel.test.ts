/**
 * Test Facebook Pixel field extraction from Notion pages
 */

import { mapNotionPageToLinkTree } from "../linktreeMapper";
import type { NotionPage } from "../notionTypes";

describe("linktreeMapper Facebook Pixel extraction", () => {
	const createNotionPage = (
		facebookPixelEnabled: boolean,
		facebookPixelSource?: string,
		facebookPixelIntent?: string,
	): NotionPage => {
		const props: Record<string, unknown> = {
			Slug: {
				type: "rich_text",
				rich_text: [{ plain_text: "test-slug" }],
			},
			Title: {
				type: "rich_text",
				rich_text: [{ plain_text: "Test Title" }],
			},
			Destination: {
				type: "url",
				url: "https://example.com/target",
			},
			"Link Tree Enabled": {
				type: "select",
				select: { name: "True" },
			},
			"Facebook Pixel Enabled": facebookPixelEnabled
				? {
						type: "select",
						select: { name: "True" },
					}
				: {
						type: "select",
						select: { name: "False" },
					},
		};

		if (facebookPixelSource) {
			props["Facebook Pixel Source"] = {
				type: "select",
				select: { name: facebookPixelSource },
			};
		}

		if (facebookPixelIntent) {
			props["Facebook Pixel Intent"] = {
				type: "rich_text",
				rich_text: [{ plain_text: facebookPixelIntent }],
			};
		}

		return {
			id: "test-page-id",
			properties: props,
			icon: null,
			cover: null,
		} as NotionPage;
	};

	test("extracts Facebook Pixel Enabled when set to True", () => {
		const page = createNotionPage(true, "Meta campaign", "Launch");
		const mapped = mapNotionPageToLinkTree(page);

		expect(mapped.facebookPixelEnabled).toBe(true);
		expect(mapped.facebookPixelSource).toBe("Meta campaign");
		expect(mapped.facebookPixelIntent).toBe("Launch");
	});

	test("extracts Facebook Pixel Enabled as false when set to False", () => {
		const page = createNotionPage(false);
		const mapped = mapNotionPageToLinkTree(page);

		expect(mapped.facebookPixelEnabled).toBe(false);
	});

	test("handles missing Facebook Pixel fields gracefully", () => {
		const page = createNotionPage(false);
		delete (page.properties as Record<string, unknown>)[
			"Facebook Pixel Source"
		];
		delete (page.properties as Record<string, unknown>)[
			"Facebook Pixel Intent"
		];

		const mapped = mapNotionPageToLinkTree(page);

		expect(mapped.facebookPixelEnabled).toBe(false);
		expect(mapped.facebookPixelSource).toBeUndefined();
		expect(mapped.facebookPixelIntent).toBeUndefined();
	});
});
