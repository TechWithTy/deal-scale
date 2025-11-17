# DealScale RSS & Video Feeds

DealScale exposes three RSS endpoints so marketing, search crawlers, and AI agents can consume content directly from our domain. Each proxy normalizes upstream feeds, enforces consistent caching, and is linked from the sitemap to help discoverability.

## Feed Overview

| Endpoint | Source | Description | Cache-Control |
| --- | --- | --- | --- |
| `https://dealscale.io/rss.xml` | Beehiiv | Mirrors the Beehiiv newsletter feed through our domain. Content type: `application/rss+xml`. | `s-maxage=3600, stale-while-revalidate=86400` |
| `https://dealscale.io/rss/youtube.xml` | YouTube Channel | Proxies the YouTube channel feed so video updates are attributed to dealscale.io. Content type: `application/atom+xml`. | `s-maxage=900, stale-while-revalidate=3600` |
| `https://dealscale.io/rss/hybrid.xml` | Beehiiv + YouTube | Combines blog posts and videos into a single RSS 2.0 channel sorted by publish date. Each item includes a `<source>` tag indicating `DealScale Blog` or `DealScale YouTube`. | `s-maxage=900, stale-while-revalidate=3600` |

All three feeds are implemented as serverless API routes under `src/pages/api/rss/*.xml.ts`. They fetch upstream content with custom user-agent headers to avoid rate limiting, gracefully handle upstream outages (returning a minimal fallback RSS response), and are reverse-proxied via `next.config.ts` redirects so the canonical URLs are short and stable.

### Hybrid Feed Item Shape

The hybrid feed follows standard RSS semantics with enriched entries:

- `<title>` & `<description>` mirror the upstream title/summary.
- `<guid>` is a permalink for Beehiiv posts and a synthetic `youtube-{videoId}` for videos.
- `<category>` values come from Beehiiv tags or YouTube keywords.
- `<source>` identifies the origin feed and links to the canonical source.
- `<pubDate>` is normalized to RFC 822 format.

This format enables CRMs, Zapier-type automations, and search crawlers to ingest both blog and video updates from one subscription URL.

## Video Sitemap

In addition to the feeds, we maintain a first-party video sitemap at `https://dealscale.io/videos/sitemap.xml`. It is generated from the YouTube RSS feed via:

```bash
pnpm run sitemap:videos
```

This script lives in `scripts/video/generate-video-sitemap.ts`, uses `fast-xml-parser`, and writes to `public/videos/sitemap.xml`. The sitemap includes `video:video` metadata (thumbnail, publication date, duration, tags) so Google and Bing can surface rich video snippets tied to the dealscale.io domain.

## Discoverability & Submission

- `src/app/sitemap.ts` adds the three feed URLs and the video sitemap to the global sitemap so crawlers discover the resources automatically.
- In addition to organic discovery, submit the endpoints to Google Search Console and Bing Webmaster Tools (especially after launch or major changes).
- The new feeds appear in our JSON-LD `sameAs` array (`buildSocialProfiles`) to reinforce entity alignment with Google’s Knowledge Graph.

## Local Testing

```bash
# Start the dev server
pnpm dev

# Verify each feed
curl http://localhost:3000/rss.xml
curl http://localhost:3000/rss/youtube.xml
curl http://localhost:3000/rss/hybrid.xml
```

Feeds return XML; expect a 502 response when upstream services are unreachable (the proxy logs the failure and returns a minimal fallback payload).

## Maintenance Notes

- Beehiiv or YouTube schema changes: update the relevant parser logic under `src/pages/api/rss`.
- Cache durations: tweak `CACHE_CONTROL` constants in each handler if the update cadence changes.
- Hybrid feed categories: YouTube keywords are split on commas; adjust `resolveKeywords` in `hybrid.xml.ts` if alternate tagging is needed.
- Video sitemap: schedule `pnpm run sitemap:videos` (e.g., CI step or cron) to stay synchronized with new uploads.

By keeping all RSS and video surfaces under dealscale.io, we strengthen domain authority, simplify partner integrations, and provide reliable machine-readable content to search engines and AI agents.









