import { groupItems } from "@/components/linktree/tree/grouping";
import type { LinkTreeItem } from "@/utils/linktree-redis";

describe("groupItems", () => {
	const make = (over: Partial<LinkTreeItem> = {}): LinkTreeItem =>
		({
			slug: over.slug ?? "a",
			title: over.title ?? "A",
			destination: over.destination ?? "/x",
			category: over.category,
			highlighted: over.highlighted,
			pinned: over.pinned,
		}) as LinkTreeItem;

	test("splits highlighted and normal, labels highlighted", () => {
		const items = [
			make({ slug: "h1", title: "H1", category: "Cat", highlighted: true }),
			make({ slug: "n1", title: "N1", category: "Cat" }),
		];
		const r = groupItems(items);
		expect(r.highlightedLabeled.length).toBe(1);
		expect(r.highlightedLabeled[0][0]).toMatch(/^Highlighted - /);
		expect(r.highlightedLabeled[0][1][0].slug).toBe("h1");
		expect(r.normalEntries.length).toBe(1);
		expect(r.normalEntries[0][1][0].slug).toBe("n1");
	});

	test("category sorting places 'Other' last", () => {
		const items = [
			make({ slug: "o", title: "O", category: "Other" }),
			make({ slug: "b", title: "B", category: "Blog" }),
		];
		const r = groupItems(items);
		// 'Blog' should come before 'Other'
		expect(r.normalEntries[0][0]).toBe("Blog");
		expect(r.normalEntries[1][0]).toBe("Other");
	});

	test("pinned outranks title sort within category", () => {
		const items = [
			make({ slug: "z", title: "Z", category: "Cat", pinned: false }),
			make({ slug: "a", title: "A", category: "Cat", pinned: true }),
		];
		const r = groupItems(items);
		const cat = r.normalEntries.find(([c]) => c === "Cat");
		expect(cat).toBeTruthy();
		expect(cat?.[1][0].slug).toBe("a");
	});
});
