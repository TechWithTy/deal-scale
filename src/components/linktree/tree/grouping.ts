import type { LinkTreeItem } from "@/utils/linktree-redis";

export type Grouped = {
  highlightedLabeled: Array<[string, LinkTreeItem[]]>;
  normalEntries: Array<[string, LinkTreeItem[]]>;
};

export function groupItems(items: LinkTreeItem[]): Grouped {
  const copy = [...items].sort((a, b) => {
    const ha = a.highlighted ? 0 : 1;
    const hb = b.highlighted ? 0 : 1;
    if (ha !== hb) return ha - hb;
    const pa = a.pinned ? 0 : 1;
    const pb = b.pinned ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return a.title.localeCompare(b.title);
  });

  const highlightMap = new Map<string, LinkTreeItem[]>();
  const normalMap = new Map<string, LinkTreeItem[]>();

  for (const it of copy) {
    const key = it.category || "Other";
    const target = it.highlighted ? highlightMap : normalMap;
    const list = target.get(key);
    if (list) list.push(it);
    else target.set(key, [it]);
  }

  const sortCats = (entries: Array<[string, LinkTreeItem[]]>) => {
    entries.sort(([a], [b]) => {
      const aIsOther = a.toLowerCase() === "other";
      const bIsOther = b.toLowerCase() === "other";
      if (aIsOther && !bIsOther) return 1;
      if (!aIsOther && bIsOther) return -1;
      return a.localeCompare(b);
    });
    for (const [, list] of entries) {
      list.sort((a, b) => {
        const pa = a.pinned ? 0 : 1;
        const pb = b.pinned ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return a.title.localeCompare(b.title);
      });
    }
  };

  const highlightedEntries = Array.from(highlightMap.entries());
  const normalEntries = Array.from(normalMap.entries());
  sortCats(highlightedEntries);
  sortCats(normalEntries);

  const highlightedLabeled = highlightedEntries.map(([cat, list]) => [
    `Highlighted - ${cat}`,
    list,
  ] as [string, LinkTreeItem[]]);

  return { highlightedLabeled, normalEntries };
}
