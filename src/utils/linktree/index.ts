import { Redis } from '@upstash/redis';

export type LinkTreeItem = {
  slug: string;
  title: string;
  destination: string;
  description?: string;
  iconEmoji?: string;
  linkTreeEnabled?: boolean;
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

    const title = String((data as any).title ?? slug);
    const description = (data as any).description ? String((data as any).description) : undefined;
    const iconEmoji = (data as any).iconEmoji ? String((data as any).iconEmoji) : undefined;

    items.push({ slug, title, destination, description, iconEmoji, linkTreeEnabled: true });
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
    const title = (props?.Title?.title?.[0]?.plain_text as string | undefined) || slug || '';
    const description = props?.Description?.rich_text?.[0]?.plain_text as string | undefined;
    const iconEmoji = page?.icon?.emoji as string | undefined;

    // Link Tree Enabled tickbox or Type == LinkTree
    const linkTreeEnabled = Boolean(
      (props?.['Link Tree Enabled']?.checkbox as boolean | undefined) ||
        (props?.Type?.select?.name === 'LinkTree')
    );

    if (slug && destination && linkTreeEnabled) {
      results.push({ slug, title: title || slug, destination, description, iconEmoji, linkTreeEnabled });
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
    if (!/^https?:/i.test(url)) {
      // likely internal path, return as-is
      return url;
    }
    if (!u.searchParams.get('utm_source')) u.searchParams.set('utm_source', 'linktree');
    if (!u.searchParams.get('utm_campaign')) u.searchParams.set('utm_campaign', slug);
    return u.toString();
  } catch {
    return url;
  }
}
