import { buildLinkTreeItemListSchema } from "@/lib/linktree/schemaBuilders";
import type { LinkTreeItem } from "@/utils/linktree-redis";

describe("linktree schema builder", () => {
	const mockItems: LinkTreeItem[] = [
		{
			slug: "/products",
			title: "Products",
			destination: "/products",
			description: "Browse our products",
			category: "main",
			highlighted: false,
			pinned: false,
		},
		{
			slug: "/blogs",
			title: "Blog",
			destination: "https://blog.leadorchestra.com",
			description: "Read our latest blog posts",
			category: "content",
			highlighted: true,
			pinned: false,
		},
		{
			slug: "/contact",
			title: "Contact Us",
			destination: "/contact",
			// No description for this one
			category: "main",
			highlighted: false,
			pinned: true,
		},
	];

	test("produces an ItemList schema with correct structure", () => {
		const schema = buildLinkTreeItemListSchema(mockItems);

		expect(schema["@context"]).toBe("https://schema.org");
		expect(schema["@type"]).toBe("ItemList");
		expect(schema.name).toBe("DealScale Link Tree");
		expect(schema.description).toContain("Quick access to DealScale's");
		expect(schema.itemListOrder).toBe(
			"https://schema.org/ItemListOrderAscending",
		);
		expect(schema.itemListElement).toHaveLength(3);
	});

	test("maps items to ListItem elements with correct positions", () => {
		const schema = buildLinkTreeItemListSchema(mockItems);

		expect(schema.itemListElement[0]).toEqual(
			expect.objectContaining({
				"@type": "ListItem",
				position: 1,
				name: "Products",
				url: expect.stringContaining("/products"),
			}),
		);
		expect(schema.itemListElement[1].position).toBe(2);
		expect(schema.itemListElement[2].position).toBe(3);
	});

	test("handles internal and external URLs correctly", () => {
		const schema = buildLinkTreeItemListSchema(mockItems);

		// Internal URL should be converted to absolute
		expect(schema.itemListElement[0].url).toMatch(/^https:\/\//);

		// External URL should remain as-is
		expect(schema.itemListElement[1].url).toBe("https://blog.leadorchestra.com");
	});

	test("includes descriptions when available", () => {
		const schema = buildLinkTreeItemListSchema(mockItems);

		expect(schema.itemListElement[0].description).toBe("Browse our products");
		expect(schema.itemListElement[1].description).toBe(
			"Read our latest blog posts",
		);
		expect(schema.itemListElement[2].description).toBeUndefined();
	});

	test("includes nested WebPage items for richer schema", () => {
		const schema = buildLinkTreeItemListSchema(mockItems);

		expect(schema.itemListElement[0].item).toEqual(
			expect.objectContaining({
				"@type": "WebPage",
				name: "Products",
				url: expect.stringContaining("/products"),
				description: "Browse our products",
			}),
		);

		expect(schema.itemListElement[2].item).toEqual(
			expect.objectContaining({
				"@type": "WebPage",
				name: "Contact Us",
				url: expect.stringContaining("/contact"),
			}),
		);
		// Should not have description if item doesn't have one
		expect(schema.itemListElement[2].item?.description).toBeUndefined();
	});

	test("handles items without destination URLs", () => {
		const itemsWithoutUrl: LinkTreeItem[] = [
			{
				slug: "test-slug",
				title: "Test Item",
				// No destination
				category: "test",
				highlighted: false,
				pinned: false,
			},
		];

		const schema = buildLinkTreeItemListSchema(itemsWithoutUrl);

		expect(schema.itemListElement[0].url).toContain("#test-slug");
		expect(schema.itemListElement[0].item).toBeUndefined(); // No nested item if no URL
	});

	test("uses fallback names for items without titles", () => {
		const itemsWithoutTitle: LinkTreeItem[] = [
			{
				slug: "test-slug",
				// No title
				destination: "/test",
				category: "test",
				highlighted: false,
				pinned: false,
			},
		];

		const schema = buildLinkTreeItemListSchema(itemsWithoutTitle);

		expect(schema.itemListElement[0].name).toBe("test-slug");
	});

	test("handles empty array", () => {
		const schema = buildLinkTreeItemListSchema([]);

		expect(schema["@type"]).toBe("ItemList");
		expect(schema.itemListElement).toHaveLength(0);
	});

	test("accepts custom baseUrl", () => {
		const customBaseUrl = "https://example.com/linktree";
		const schema = buildLinkTreeItemListSchema(mockItems, customBaseUrl);

		expect(schema.itemListElement[0].url).toContain("leadorchestra.com"); // Still uses buildAbsoluteUrl for internal
		// But items without URLs would use custom base
		const itemsWithoutUrl: LinkTreeItem[] = [
			{
				slug: "test",
				title: "Test",
				category: "test",
				highlighted: false,
				pinned: false,
			},
		];
		const schema2 = buildLinkTreeItemListSchema(itemsWithoutUrl, customBaseUrl);
		expect(schema2.itemListElement[0].url).toContain("example.com");
	});
});
