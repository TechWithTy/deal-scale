import { withUtm } from "@/utils/linktree-redis";
import type { LinkTreeItem } from "@/utils/linktree-redis";

export function resolveLink(item: LinkTreeItem): { dest: string; isExternal: boolean } {
  const raw0 = withUtm(item.destination, item.slug);
  let dest = raw0;
  const isAbsolute = /^(https?:)\/\//i.test(raw0);
  const isProtoRelative = /^\/\//.test(raw0);
  const isRelativePath = raw0.startsWith("/");
  let isExternal = false;

  if (isAbsolute) {
    isExternal = true;
  } else if (isProtoRelative) {
    dest = `https:${raw0}`;
    isExternal = true;
  } else if (!isRelativePath) {
    dest = `https://${raw0}`;
    isExternal = true;
  }

  // Inspect internal redirect wrapper
  try {
    if (/^\/api\/redirect\b/.test(dest)) {
      const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const u = new URL(dest, base);
      const to = u.searchParams.get("to") ?? "";
      const decoded = to.startsWith("%2F") ? decodeURIComponent(to) : to;
      if (/^(https?:)\/\//i.test(decoded) || /^\/\//.test(decoded) || (!decoded.startsWith("/") && decoded.length > 0)) {
        isExternal = true;
      }
    }
  } catch {}

  // Notion override
  if (item.redirectExternal) isExternal = true;

  return { dest, isExternal };
}
