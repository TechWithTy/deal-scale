import { Redis } from "@upstash/redis";

export type FileMeta = {
  name: string;
  url: string;
  kind?: "image" | "video" | "other";
  ext?: string;
  expiry?: string;
};

export type LinkTreeItem = {
  slug: string;
  title: string;
  destination: string;
  description?: string;
  details?: string;
  iconEmoji?: string;
  linkTreeEnabled?: boolean;
  imageUrl?: string;
  category?: string;
  pinned?: boolean;
  videoUrl?: string;
  files?: FileMeta[];
};

function coerceBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  if (typeof v === "number") return v !== 0;
  return false;
}

async function fetchFromRedis(): Promise<LinkTreeItem[]> {
  const redis = Redis.fromEnv();
  const keys = await redis.keys("campaign:*");
  const items: LinkTreeItem[] = [];

  for (const key of keys) {
    const slug = key.replace("campaign:", "");
    const data = await redis.hgetall<Record<string, unknown>>(key);
    if (!data) continue;
    const enabled = coerceBool((data as any).linkTreeEnabled);
    if (!enabled) continue;

    const destination = String((data as any).destination ?? "");
    if (!destination) continue;

    const title = (data as any).title ? String((data as any).title) : slug;
    const description = (data as any).description
      ? String((data as any).description)
      : undefined;
    const details = (data as any).details
      ? String((data as any).details)
      : undefined;
    const iconEmoji = (data as any).iconEmoji
      ? String((data as any).iconEmoji)
      : undefined;
    let imageUrl = (data as any).imageUrl
      ? String((data as any).imageUrl)
      : undefined;
    const category = (data as any).category
      ? String((data as any).category)
      : undefined;
    const pinned = coerceBool((data as any).pinned);
    let videoUrl = (data as any).videoUrl
      ? String((data as any).videoUrl)
      : undefined;
    let files: FileMeta[] | undefined;
    const filesRaw = (data as any).files;
    if (Array.isArray(filesRaw)) {
      files = filesRaw as FileMeta[];
    } else if (typeof filesRaw === "string") {
      try {
        files = JSON.parse(filesRaw) as FileMeta[];
      } catch {
        /* ignore */
      }
    }
    // derive fallbacks from files
    if (!imageUrl && files && files.length) {
      const firstImage = files.find((f) => f.kind === "image") || files.find((f) => (f.ext ?? "").match(/^(jpg|jpeg|png|gif|webp|avif|svg)$/i));
      if (firstImage) imageUrl = firstImage.url;
    }
    if (!videoUrl && files && files.length) {
      const firstVideo = files.find((f) => f.kind === "video") || files.find((f) => (f.ext ?? "").match(/^(mp4|webm|ogg|mov|m4v)$/i));
      if (firstVideo) videoUrl = firstVideo.url;
    }

    items.push({
      slug,
      title,
      destination,
      description,
      details,
      iconEmoji,
      imageUrl,
      category,
      pinned,
      videoUrl,
      files,
      linkTreeEnabled: true,
    });
  }

  return items;
}

async function fetchFromNotion(): Promise<LinkTreeItem[]> {
  const NOTION_API_KEY = process.env.NOTION_KEY;
  const NOTION_DB = process.env.NOTION_REDIRECTS_ID;
  if (!NOTION_API_KEY || !NOTION_DB) return [];

  const resp = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DB}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 100 }),
      // Edge note: keep simple for server runtime
    },
  );
  if (!resp.ok) return [];
  const data = await resp.json();

  const results: LinkTreeItem[] = [];
  for (const page of data.results ?? []) {
    const props = page.properties ?? {};
    const slug = props?.Slug?.title?.[0]?.plain_text as string | undefined;
    const destination = props?.Destination?.rich_text?.[0]?.plain_text as
      | string
      | undefined;
    const titleFromTitle = props?.Title?.title?.[0]?.plain_text as
      | string
      | undefined;
    const title = titleFromTitle || slug || "";
    const description = props?.Description?.rich_text?.[0]?.plain_text as
      | string
      | undefined;
    const details = props?.Details?.rich_text?.[0]?.plain_text as
      | string
      | undefined;
    const iconEmoji = page?.icon?.emoji as string | undefined;

    // Image from explicit props or cover
    let imageUrl: string | undefined;
    const imageProp = (props as any)?.Image || (props as any)?.Thumbnail;
    if (imageProp?.type === "url") imageUrl = imageProp.url as string | undefined;
    if (!imageUrl && imageProp?.type === "rich_text") imageUrl = imageProp.rich_text?.[0]?.plain_text as string | undefined;
    if (!imageUrl && (page as any)?.cover?.external?.url) imageUrl = (page as any).cover.external.url as string;

    // Link Tree Enabled can be a checkbox or a select with values like "True"/"Yes"/"Enabled"
    let linkTreeEnabled = false;
    const lte = props?.["Link Tree Enabled"] as any;
    if (lte?.type === "checkbox") {
      linkTreeEnabled = Boolean(lte.checkbox);
    } else if (lte?.type === "select") {
      const name = (lte.select?.name ?? "").toString().toLowerCase();
      linkTreeEnabled = name === "true" || name === "yes" || name === "enabled";
    } else if (props?.Type?.select?.name === "LinkTree") {
      linkTreeEnabled = true;
    }

    // Optional metadata
    const category = props?.Category?.select?.name as string | undefined;
    const pinned = Boolean(
      (props?.Pinned?.checkbox as boolean | undefined) ||
        (props?.Pinned as any)?.select?.name?.toString().toLowerCase() ===
          "true",
    );
    let videoUrl = (props as any)?.Video?.url as string | undefined;
    // Files (support Notion files property named "Media" or "Files")
    let files: FileMeta[] | undefined;
    const filesProp = (props as any)?.Media || (props as any)?.Files;
    const inferKind = (nameOrUrl: string): { kind: "image" | "video" | "other"; ext?: string } => {
      try {
        const m = /\.([a-z0-9]+)(?:$|\?|#)/i.exec(nameOrUrl);
        const ext = m ? m[1].toLowerCase() : undefined;
        const img = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];
        const vid = ["mp4", "webm", "ogg", "mov", "m4v"];
        if (ext && img.includes(ext)) return { kind: "image", ext };
        if (ext && vid.includes(ext)) return { kind: "video", ext };
        return { kind: "other", ext };
      } catch {
        return { kind: "other" } as const;
      }
    };
    if (filesProp?.type === "files" && Array.isArray(filesProp.files)) {
      files = filesProp.files
        .map((f: any) => {
          if (f.type === "file") {
            const url = f.file?.url as string;
            const meta = inferKind(f.name || url);
            return { name: f.name as string, url, kind: meta.kind, ext: meta.ext, expiry: f.file?.expiry_time as string | undefined };
          }
          if (f.type === "external") {
            const url = f.external?.url as string;
            const meta = inferKind(f.name || url);
            return { name: f.name as string, url, kind: meta.kind, ext: meta.ext };
          }
          return undefined;
        })
        .filter(Boolean) as FileMeta[];
    }
    // derive fallbacks from files if explicit image/video not present
    if (!imageUrl && files && files.length) {
      const firstImage = files.find((f) => f.kind === "image") || files.find((f) => (f.ext ?? "").match(/^(jpg|jpeg|png|gif|webp|avif|svg)$/i));
      if (firstImage) imageUrl = firstImage.url;
    }
    if (!videoUrl && files && files.length) {
      const firstVideo = files.find((f) => f.kind === "video") || files.find((f) => (f.ext ?? "").match(/^(mp4|webm|ogg|mov|m4v)$/i));
      if (firstVideo) videoUrl = firstVideo.url;
    }

    if (slug && destination && linkTreeEnabled) {
      results.push({
        slug,
        title: title || slug,
        destination,
        description,
        details,
        iconEmoji,
        category,
        pinned,
        imageUrl,
        videoUrl,
        files,
        linkTreeEnabled,
      });
    }
  }

  return results;
}

/**
 * Preferred source: Notion.
 *
 * We keep this function name for backward compatibility, but it no longer
 * reads from Redis. This avoids UI drift/staleness and centralizes LinkTree
 * as a pure Notion-driven feature. Redis usage remains for legacy callers
 * via fetchFromRedis() if explicitly invoked elsewhere.
 */
export async function fetchLinkTreeItems(): Promise<LinkTreeItem[]> {
  return fetchFromNotion();
}

export function withUtm(url: string, slug: string): string {
  try {
    const u = new URL(url, "http://dummy.base");
    // Internal path: do not alter
    if (!/^https?:/i.test(url)) return url;

    // Determine site host in a deterministic way for SSR + CSR to avoid hydration mismatches.
    // Use a single source of truth that is embedded at build time on the client.
    // Set NEXT_PUBLIC_SITE_HOST="localhost:3000" in dev, and "www.dealscale.io" in prod.
    const sourceHost = process.env.NEXT_PUBLIC_SITE_HOST || "dealscale.ai";

    if (!u.searchParams.get("utm_source"))
      u.searchParams.set("utm_source", sourceHost);
    if (!u.searchParams.get("utm_campaign"))
      u.searchParams.set("utm_campaign", slug);
    return u.toString();
  } catch {
    return url;
  }
}
