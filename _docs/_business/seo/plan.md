# DealScale SEO Implementation Plan

## Objectives
1. Establish authoritative entity signals across all public properties.
2. Improve crawl efficiency and structured data coverage for high-intent routes.
3. Launch scalable workflows for ongoing SEO experimentation and validation.

## Roadmap Overview

### Phase 1 – Infrastructure Hardening (Weeks 1-2)
- [x] Update `robots.ts` with explicit allow/disallow rules and bot-specific directives. *(2025-02-14)*
- [x] Extend `sitemap.ts` to cover `/events`, `/partners`, and case-study slugs with priority metadata; `/careers` remains excluded while it redirects to Zoho Recruit. *(2025-02-14, updated 2025-02-15)*
- [x] Introduce automated sitemap submission hooks within deployment scripts. *(2025-02-14)*
- [x] Add regression tests in `src/utils/__tests__/metadata/static` to snapshot robots and sitemap outputs. *(2025-02-14)*

### Phase 2 – Schema Core & Global Entity (Weeks 2-3)
- Create `src/utils/seo/schema` module exporting JSON-LD builders and `SchemaInjector` component.
- Implement Organization + WebSite schema injection in the root head component with canonical `@id` and `sameAs` references.
- Add Jest tests for each schema builder (Organization, WebSite, Service, Product).

### Phase 3 – Route Upgrades (Weeks 3-5)
- **/events**
  - Build ISR-backed index page with server data fetcher and ItemList schema.
  - Create slug pages rendering metadata, canonical tags, and Event schema per entry.
  - Provide fallbacks for offline fetch scenarios.
- **/partners**
  - Render partner list server-side and inject ItemList schema referencing organization nodes.
- **/careers**
  - Integrate Zoho Recruit API via `/api/jobs`, normalize data, and render JobPosting schema.
  - Document required environment variables and caching strategy.

### Phase 4 – Content Schema Expansion (Weeks 5-6)
- Extend case-study pages with CreativeWork + Review schema.
- Add FAQPage schema modules for `/features` and `/pricing` where Q&A sections exist.
- Coordinate with Beehiiv to embed Blog/BlogPosting schema referencing the main Organization `@id`.

### Phase 5 – Validation & QA (Weeks 6-7)
- Run Rich Results tests for all schema types, capturing evidence in `_docs/_business/seo/validation.md`.
- Execute Lighthouse audits ensuring SEO ≥ 95 and Performance ≥ 90; log outcomes in `_docs/_business/seo/metrics.md`.
- Perform bot fetch snapshots using curl with Googlebot user agent to verify SSR output.

### Phase 6 – Analytics & Iteration (Ongoing)
- Wire schema injection events to PostHog/Plausible with metrics: `schema_injected`, `route_type`, `validation_status`.
- Monitor Google Search Console for sitemap indexing, job posting health, and Core Web Vitals.
- Prioritize backlog experiments based on traffic, conversion impact, and engineering effort.

## Dependencies & Risks
- **Zoho Recruit API Access:** Requires valid API key and rate-limit considerations.
- **Content Team Coordination:** Needed for FAQ copy, partner bios, and job descriptions.
- **Analytics Provisioning:** Ensure PostHog/Plausible keys available per environment before instrumentation work begins.

## Success Metrics
- +30% organic sessions to `/events` and `/partners` within 90 days of launch.
- 100% schema validation pass rate in automated regression suite.
- Reduction of crawl errors and duplicate content warnings in Search Console.
