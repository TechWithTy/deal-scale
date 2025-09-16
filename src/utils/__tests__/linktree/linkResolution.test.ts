import { resolveLink } from "@/components/linktree/tree/linkResolution";
import type { LinkTreeItem } from "@/utils/linktree-redis";

describe("resolveLink", () => {
  const base: LinkTreeItem = {
    slug: "demo",
    title: "Demo",
    destination: "",
  } as any;

  test("absolute external stays and opens new tab", () => {
    const item = { ...base, destination: "https://example.com/x" } as LinkTreeItem;
    const r = resolveLink(item);
    expect(r.dest).toBe("https://example.com/x");
    expect(r.isExternal).toBe(true);
  });

  test("protocol-relative becomes https and is external", () => {
    const item = { ...base, destination: "//example.com/x" } as LinkTreeItem;
    const r = resolveLink(item);
    expect(r.dest).toBe("https://example.com/x");
    expect(r.isExternal).toBe(true);
  });

  test("bare host prepends https and is external", () => {
    const item = { ...base, destination: "example.com/x" } as LinkTreeItem;
    const r = resolveLink(item);
    expect(r.dest).toBe("https://example.com/x");
    expect(r.isExternal).toBe(true);
  });

  test("internal path remains and is internal", () => {
    const item = { ...base, destination: "/signup" } as LinkTreeItem;
    const r = resolveLink(item);
    expect(r.dest).toBe("/signup");
    expect(r.isExternal).toBe(false);
  });

  test("/api/redirect?to= external marks external", () => {
    const item = { ...base, destination: "/api/redirect?to=https%3A%2F%2Ffoo.com%2Fa" } as LinkTreeItem;
    const r = resolveLink(item);
    expect(r.isExternal).toBe(true);
  });

  test("redirectExternal flag forces external", () => {
    const item = { ...base, destination: "/internal", redirectExternal: true } as LinkTreeItem;
    const r = resolveLink(item);
    expect(r.dest).toBe("/internal");
    expect(r.isExternal).toBe(true);
  });
});
