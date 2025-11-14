import { resolveLink } from "@/components/linktree/tree/linkResolution";
import type { LinkTreeItem } from "@/utils/linktree-redis";

const createItem = (overrides: Partial<LinkTreeItem> = {}): LinkTreeItem => ({
	slug: "demo",
	title: "Demo",
	destination: "",
	...overrides,
});

describe("resolveLink", () => {
	test("absolute external routes through slug but opens new tab", () => {
		const item = createItem({ destination: "https://example.com/x" });
		const r = resolveLink(item);
		expect(r.dest).toBe("/demo");
		expect(r.isExternal).toBe(true);
	});

	test("protocol-relative destination keeps protocol-relative href", () => {
		const item = createItem({ destination: "//example.com/x" });
		const r = resolveLink(item);
		expect(r.dest).toBe("//example.com/x");
		expect(r.isExternal).toBe(true);
	});

	test("bare host resolves to slug and is external", () => {
		const item = createItem({ destination: "example.com/x" });
		const r = resolveLink(item);
		expect(r.dest).toBe("/demo");
		expect(r.isExternal).toBe(true);
	});

	test("internal path remains and is internal", () => {
		const item = createItem({ destination: "/signup" });
		const r = resolveLink(item);
		expect(r.dest).toBe("/signup");
		expect(r.isExternal).toBe(false);
	});

	test("/api/redirect?to= external marks external", () => {
		const item = createItem({
			destination: "/api/redirect?to=https%3A%2F%2Ffoo.com%2Fa",
		});
		const r = resolveLink(item);
		expect(r.isExternal).toBe(true);
	});

	test("redirectExternal flag forces external", () => {
		const item = createItem({
			destination: "/internal",
			redirectExternal: true,
		});
		const r = resolveLink(item);
		expect(r.dest).toBe("/internal");
		expect(r.isExternal).toBe(true);
	});
});
