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

  // Inspect internal redirect wrapper and unwrap display href
  try {
    if (/^\/api\/redirect\b/.test(dest)) {
      const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
      const u = new URL(dest, base);
      const to = u.searchParams.get("to") ?? "";
      const decoded = to.startsWith("%2F") ? decodeURIComponent(to) : to;
      const looksExternal = /^(https?:)\/\//i.test(decoded) || /^\/\//.test(decoded) || (!decoded.startsWith("/") && decoded.length > 0);
      if (looksExternal) {
        isExternal = true;
      }
      // For display, if decoded looks like a usable target, unwrap it so <a href> is clean
      if (decoded && decoded.length > 0) {
        if (decoded.startsWith("/")) {
          dest = decoded;
        } else if (/^\/\//.test(decoded)) {
          dest = `https:${decoded}`;
        } else if (/^(https?:)\/\//i.test(decoded)) {
          dest = decoded;
        } else if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(decoded)) {
          dest = `https://${decoded}`;
          isExternal = true;
        }
      }
    }
  } catch {}

  // Notion override
  if (item.redirectExternal) isExternal = true;

  return { dest, isExternal };
}
