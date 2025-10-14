# DealScale SEO Vision & Opportunity Map

## Purpose
Capture strategic opportunities to elevate DealScale's organic visibility across www, blog, and app surfaces while aligning with technical capabilities.

## Guiding Principles
- **Entity-First Architecture:** All content should reinforce the canonical Organization graph node at `https://www.dealscale.io/#organization`.
- **Multi-Domain Cohesion:** Ensure messaging and metadata stay synchronized across www, blog, and app domains.
- **Incremental Delivery:** Ship schema coverage, crawl control, and content improvements in progressive slices tied to measurable KPIs.
- **Data-Informed Iteration:** Pair every SEO enhancement with analytics hooks and validation paths.

## Opportunity Themes

### 1. Crawl Management & Discoverability
- Expand `robots.txt` directives for priority crawlers (Googlebot, GPTBot, PerplexityBot, ClaudeBot).
- Establish XML sitemap segmentation for events, partners, careers, and cornerstone resources.
- Automate sitemap submission to Google Search Console during deployments.

### 2. Structured Data Foundation
- Consolidate JSON-LD builders inside a shared `seo-core` utility layer.
- Standardize schema usage for Organization, WebSite, Event, ItemList, Product/Service, CreativeWork, FAQPage, and JobPosting.
- Introduce schema regression testing to guard against accidental field removals.

### 3. Route-Level Enhancements
- Convert `/events` to ISR-backed pages with canonical metadata and event-specific JSON-LD.
- Add `/partners` gallery with ItemList schema referencing partner organizations.
- Launch `/careers` with Zoho Recruit integration, JobPosting schema, and long-tail job content.
- Enrich `/case-studies/[slug]` with CreativeWork + Review schema when testimonials exist.

### 4. Content & UX Synergy
- Publish evergreen content pillars (Features, Pricing, Case Studies) with FAQ sections for rich snippets.
- Integrate internal linking modules highlighting events, partners, and jobs to distribute link equity.
- Refresh on-page copy to emphasize target keywords and intent clusters discovered via competitor analysis.

### 5. Measurement & Feedback Loops
- Track SEO KPIs (organic sessions, CTR, schema validation success) through PostHog dashboards.
- Run quarterly Lighthouse audits targeting 95+ SEO and 90+ performance scores.
- Document QA flows for Google Rich Results, schema validation, and bot fetch snapshots.

## Experiment Backlog
1. **Dynamic FAQ Blocks:** Inject Zod-validated FAQ data into `/features` and `/pricing` pages.
2. **VideoObject Schema:** Tag product demos and webinars to surface in video SERPs.
3. **Site Search Action:** Add `potentialAction` to WebSite schema to improve sitelinks search box eligibility.
4. **Partner Co-Marketing Pages:** Spin up co-branded landing pages with reciprocal backlinks.
5. **Localized Landing Pages:** Evaluate region-specific variations once global expansion matures.
