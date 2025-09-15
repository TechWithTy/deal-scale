import { Redis } from '@upstash/redis';

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
  files?: Array<{ name: string; url: string }>;
};

function coerceBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  if (typeof v === 'number') return v !== 0;
  return false;
}

async function fetchFromRedis(): Promise<LinkTreeItem[]> {
  const redis = Redis.fromEnv();
  const keys = await redis.keys('campaign:*');
  const items: LinkTreeItem[] = [];

  for (const key of keys) {
    const slug = key.replace('campaign:', '');
    const data = await redis.hgetall<Record<string, unknown>>(key);
    if (!data) continue;
    const enabled = coerceBool((data as any).linkTreeEnabled);
    if (!enabled) continue;

    const destination = String((data as any).destination ?? '');
    if (!destination) continue;

    const title = (data as any).title ? String((data as any).title) : slug;
    const description = (data as any).description ? String((data as any).description) : undefined;
    const details = (data as any).details ? String((data as any).details) : undefined;
    const iconEmoji = (data as any).iconEmoji ? String((data as any).iconEmoji) : undefined;
    const imageUrl = (data as any).imageUrl ? String((data as any).imageUrl) : undefined;
    const category = (data as any).category ? String((data as any).category) : undefined;
    const pinned = coerceBool((data as any).pinned);
    const videoUrl = (data as any).videoUrl ? String((data as any).videoUrl) : undefined;
    let files: Array<{ name: string; url: string }> | undefined;
    const filesRaw = (data as any).files;
    if (Array.isArray(filesRaw)) {
      files = filesRaw as any;
    } else if (typeof filesRaw === 'string') {
      try { files = JSON.parse(filesRaw); } catch { /* ignore */ }
    }

    items.push({ slug, title, destination, description, details, iconEmoji, imageUrl, category, pinned, videoUrl, files, linkTreeEnabled: true });
  }

  return items;
}

async function fetchFromNotion(): Promise<LinkTreeItem[]> {
  const NOTION_API_KEY = process.env.NOTION_KEY;
  const NOTION_DB = process.env.NOTION_REDIRECTS_ID;
  if (!NOTION_API_KEY || !NOTION_DB) return [];

  const resp = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
    // Edge note: keep simple for server runtime
  });
  if (!resp.ok) return [];
  const data = await resp.json();

  const results: LinkTreeItem[] = [];
  for (const page of data.results ?? []) {
    const props = page.properties ?? {};
    const slug = props?.Slug?.title?.[0]?.plain_text as string | undefined;
    const destination = props?.Destination?.rich_text?.[0]?.plain_text as string | undefined;
    const titleFromTitle = props?.Title?.title?.[0]?.plain_text as string | undefined;
    const title = titleFromTitle || slug || '';
    const description = props?.Description?.rich_text?.[0]?.plain_text as string | undefined;
    const details = props?.Details?.rich_text?.[0]?.plain_text as string | undefined;
    const iconEmoji = page?.icon?.emoji as string | undefined;

    // Link Tree Enabled can be a checkbox or a select with values like "True"/"Yes"/"Enabled"
    let linkTreeEnabled = false;
    const lte = props?.['Link Tree Enabled'] as any;
    if (lte?.type === 'checkbox') {
      linkTreeEnabled = Boolean(lte.checkbox);
    } else if (lte?.type === 'select') {
      const name = (lte.select?.name ?? '').toString().toLowerCase();
      linkTreeEnabled = name === 'true' || name === 'yes' || name === 'enabled';
    } else if (props?.Type?.select?.name === 'LinkTree') {
      linkTreeEnabled = true;
    }

    // Optional metadata
    const category = props?.Category?.select?.name as string | undefined;
    const pinned = Boolean(
      (props?.Pinned?.checkbox as boolean | undefined) ||
      ((props?.Pinned as any)?.select?.name?.toString().toLowerCase() === 'true')
    );
    const videoUrl = (props as any)?.Video?.url as string | undefined;
    // Files (Notion files property named "Files")
    let files: Array<{ name: string; url: string }> | undefined;
    const filesProp = (props as any)?.Files;
    if (filesProp?.type === 'files' && Array.isArray(filesProp.files)) {
      files = filesProp.files
        .map((f: any) => {
          if (f.type === 'file') return { name: f.name as string, url: f.file?.url as string };
          if (f.type === 'external') return { name: f.name as string, url: f.external?.url as string };
          return undefined;
        })
        .filter(Boolean) as Array<{ name: string; url: string }>;
    }

    if (slug && destination && linkTreeEnabled) {
      results.push({ slug, title: title || slug, destination, description, details, iconEmoji, category, pinned, videoUrl, files, linkTreeEnabled });
    }
  }

  return results;
}

export async function fetchLinkTreeItems(): Promise<LinkTreeItem[]> {
  try {
    const fromRedis = await fetchFromRedis();
    if (fromRedis.length > 0) return fromRedis;
  } catch (err) {
    // fall through to Notion
  }
  return fetchFromNotion();
}

export function withUtm(url: string, slug: string): string {
  try {
    const u = new URL(url, 'http://dummy.base');
    // Internal path: do not alter
    if (!/^https?:/i.test(url)) return url;

    // Determine site host as source (no "linktree" branding)
    const sourceHost = typeof window !== 'undefined'
      ? window.location.host
      : (process.env.NEXT_PUBLIC_SITE_HOST || 'dealscale.ai');

    if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', sourceHost);
    if (!u.searchParams.get('utm_campaign')) u.searchParams.set('utm_campaign', slug);
    return u.toString();
  } catch {
    return url;
  }
}
