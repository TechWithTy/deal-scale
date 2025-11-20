# DealScale RSS & Video Feeds

DealScale exposes four RSS endpoints so marketing, search crawlers, and AI agents can consume content directly from our domain. Each proxy normalizes upstream feeds, enforces consistent caching, and is linked from the sitemap to help discoverability.

## Feed Overview

| Endpoint | Source | Description | Cache-Control |
| --- | --- | --- | --- |
| `https://dealscale.io/rss.xml` | Beehiiv | Mirrors the Beehiiv newsletter feed through our domain. Content type: `application/rss+xml`. | `s-maxage=3600, stale-while-revalidate=86400` |
| `https://dealscale.io/rss/youtube.xml` | YouTube Channel | Proxies the YouTube channel feed so video updates are attributed to dealscale.io. Content type: `application/atom+xml`. | `s-maxage=900, stale-while-revalidate=3600` |
| `https://dealscale.io/rss/github.xml` | GitHub Activity | Proxies the GitHub organization activity feed (forks, pushes, etc.) so development activity is attributed to dealscale.io. Content type: `application/atom+xml`. | `s-maxage=900, stale-while-revalidate=3600` |
| `https://dealscale.io/rss/hybrid.xml` | Beehiiv + YouTube + GitHub | Combines blog posts, videos, and GitHub activity into a single RSS 2.0 channel sorted by publish date. Each item includes a `<source>` tag indicating `DealScale Blog`, `DealScale YouTube`, or `Deal-Scale GitHub`. | `s-maxage=900, stale-while-revalidate=3600` |

All four feeds are implemented as serverless API routes under `src/pages/api/rss/*.xml.ts`. They fetch upstream content with custom user-agent headers to avoid rate limiting, gracefully handle upstream outages (returning a minimal fallback RSS response), and are reverse-proxied via `next.config.ts` redirects so the canonical URLs are short and stable.

### Hybrid Feed Item Shape

The hybrid feed follows standard RSS semantics with enriched entries:

- `<title>` & `<description>` mirror the upstream title/summary.
- `<guid>` is a permalink for Beehiiv posts, a synthetic `youtube-{videoId}` for videos, and `github-{id}` for GitHub activity.
- `<category>` values come from Beehiiv tags, YouTube keywords, or GitHub event types (fork, push, activity).
- `<source>` identifies the origin feed and links to the canonical source.
- `<pubDate>` is normalized to RFC 822 format.

This format enables CRMs, Zapier-type automations, and search crawlers to ingest blog posts, video updates, and GitHub activity from one subscription URL.

## Video Sitemap

In addition to the feeds, we maintain a first-party video sitemap at `https://dealscale.io/videos/sitemap.xml`. It is generated from the YouTube RSS feed via:

```bash
pnpm run sitemap:videos
```

This script lives in `scripts/video/generate-video-sitemap.ts`, uses `fast-xml-parser`, and writes to `public/videos/sitemap.xml`. The sitemap includes `video:video` metadata (thumbnail, publication date, duration, tags) so Google and Bing can surface rich video snippets tied to the dealscale.io domain.

## Discoverability & Submission

- `src/app/sitemap.ts` adds the four feed URLs and the video sitemap to the global sitemap so crawlers discover the resources automatically.
- In addition to organic discovery, submit the endpoints to Google Search Console and Bing Webmaster Tools (especially after launch or major changes).
- The new feeds appear in our JSON-LD `sameAs` array (`buildSocialProfiles`) to reinforce entity alignment with Google’s Knowledge Graph.

## Local Testing

```bash
# Start the dev server
pnpm dev

# Verify each feed
curl http://localhost:3000/rss.xml
curl http://localhost:3000/rss/youtube.xml
curl http://localhost:3000/rss/github.xml
curl http://localhost:3000/rss/hybrid.xml
```

Feeds return XML; expect a 502 response when upstream services are unreachable (the proxy logs the failure and returns a minimal fallback payload).

## Maintenance Notes

- Beehiiv, YouTube, or GitHub schema changes: update the relevant parser logic under `src/pages/api/rss`.
- Cache durations: tweak `CACHE_CONTROL` constants in each handler if the update cadence changes.
- Hybrid feed categories: YouTube keywords are split on commas; GitHub events are categorized by type (fork, push, activity). Adjust parsing logic in `hybrid.xml.ts` if alternate tagging is needed.
- GitHub feed URL: The GitHub Atom feed URL can be configured via the `GITHUB_ATOM_FEED_URL` environment variable. If not set, it defaults to the Deal-Scale organization private feed.
- Video sitemap: schedule `pnpm run sitemap:videos` (e.g., CI step or cron) to stay synchronized with new uploads.

By keeping all RSS and video surfaces under dealscale.io, we strengthen domain authority, simplify partner integrations, and provide reliable machine-readable content to search engines and AI agents.










