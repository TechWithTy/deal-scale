import type { LinkTreeItem } from "@/utils/linktree-redis";
import { buildAbsoluteUrl } from "@/utils/seo/schema/helpers";
import { SCHEMA_CONTEXT } from "@/utils/seo/schema/helpers";

/**
 * Builds an ItemList schema for the linktree page.
 * This helps search engines understand the structure of the linktree
 * and enables rich results for navigation/search queries.
 */
export function buildLinkTreeItemListSchema(
	items: LinkTreeItem[],
	baseUrl: string = "https://dealscale.io/linktree",
): {
	"@context": typeof SCHEMA_CONTEXT;
	"@type": "ItemList";
	name: string;
	description?: string;
	itemListOrder: string;
	itemListElement: Array<{
		"@type": "ListItem";
		position: number;
		url: string;
		name: string;
		description?: string;
		item?: {
			"@type": "WebPage" | "CreativeWork";
			name: string;
			url: string;
			description?: string;
		};
	}>;
} {
	const base = baseUrl.replace(/\/$/, "");

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "ItemList",
		name: "DealScale Link Tree",
		description:
			"Quick access to DealScale's most important links, resources, and pages. Browse our products, services, events, blog posts, and more.",
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		itemListElement: items.map((item, index) => {
			// Resolve the actual destination URL
			// For external URLs, use them directly; for internal, build absolute URL
			let itemUrl = item.destination;
			if (itemUrl && !itemUrl.startsWith("http")) {
				itemUrl = buildAbsoluteUrl(itemUrl);
			}

			const listItem: {
				"@type": "ListItem";
				position: number;
				url: string;
				name: string;
				description?: string;
				item?: {
					"@type": "WebPage" | "CreativeWork";
					name: string;
					url: string;
					description?: string;
				};
			} = {
				"@type": "ListItem",
				position: index + 1,
				url: itemUrl || `${base}#${item.slug || index}`,
				name: item.title || item.slug || `Link ${index + 1}`,
			};

			// Add description if available
			if (item.description) {
				listItem.description = item.description;
			}

			// Add nested item for richer schema
			if (itemUrl) {
				listItem.item = {
					"@type": "WebPage",
					name: item.title || item.slug || `Link ${index + 1}`,
					url: itemUrl,
					...(item.description && { description: item.description }),
				};
			}

			return listItem;
		}),
	};
}

