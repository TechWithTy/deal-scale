# Plan: External App Structure Integration

**Last Updated:** 2025-11-13  
**Owners:** Web Platform + Growth Engineering  
**Related SOP:** [`external-tools-integration`](mdc:_docs/_business/seo/external-tools-integration.md)

---

## 1. Objectives
- Mirror the structure of externally hosted experiences inside the primary Next.js app without duplicating business logic.
- Guarantee every external page inherits Deal Scale SEO guarantees (metadata, JSON-LD, sitemap, analytics).
- Maintain clear separation between externally managed content and internal services.

---

## 2. Scope & Assumptions
- External “app” surfaces expose read-only marketing or calculator flows. Authentication remains optional per route.
- Source-of-truth assets live outside the repo (e.g., Supademo, Notion, Strapi). We ingest configuration only.
- No backend mutation or state persistence is required; data flows server→client only.

Out-of-scope: Migrating the external experience into our monorepo or proxying authenticated APIs.

---

## 3. Architecture Alignment
1. **Route Skeleton**
   - Create mirrored routes under `src/app/external-tools/<slug>/page.tsx`.
   - Use server components for fetching config; hydrate client modules only for interactive segments.
2. **Content Mapping**
   - Store ingestible config in `src/data/external-tools/<slug>.ts`.
   - For remote CMS, add fetchers under `src/lib/external-tools/<provider>.ts` with caching.
3. **UI Composition**
   - Place reusable fragments in `src/components/external/<Slug>/`.
   - Apply 250-line limit per component by splitting large sections (Hero, FAQ, HowTo steps).

---

## 4. SEO Metadata Strategy
1. **Static Metadata**
   - Extend `STATIC_SEO_META["/external-tools/<slug>"]` and `staticSeoMeta` in `src/utils/seo/staticSeo.ts`.
   - Set canonical URLs to the authoritative app domain (`https://app.dealscale.io/<slug>`) while keeping the marketing slug for routing.
2. **Dynamic Enhancements**
   - Add `getExternalToolSeo(slug)` helper in `src/utils/seo/externalTools.ts` returning `SeoMeta`.
   - Cover helper with tests under `src/utils/__tests__/seo/externalTools.test.ts`.
3. **Navigation Exposure**
   - Update header/footer modules and resource hubs to surface internal links for crawl depth.

---

## 5. JSON-LD & Structured Data
1. **Schema Builders**
   - Introduce builder utilities (`buildExternalToolFaq`, `buildExternalToolHowTo`, `buildExternalToolProduct`) in `src/utils/seo/externalTools.ts`.
   - Leverage shared validation helpers from `src/utils/seo/schema`.
2. **Injection Pattern**
   - In each route, construct schema payloads server-side and inject via `<SchemaInjector schema={...} />`.
   - Reflect dynamic query parameters (e.g., calculator defaults) inside the JSON-LD where possible.
3. **Testing**
   - Add snapshot + validation tests in `src/utils/__tests__/seo/externalTools.schema.test.ts`.
   - Include route-level tests under `src/__tests__/app/external-tools/<slug>/metadata.test.tsx`.

---

## 6. Sitemap & Robots Integration
1. **Sitemap**
   - Append new routes to `src/app/sitemap.ts` with accurate `changeFrequency`/`priority`.
   - If data is remote, consider `revalidate` intervals to keep last-modified signals fresh.
2. **Robots**
   - Review `src/app/robots.ts` to confirm no disallow conflicts.
   - Avoid exposing `?auth=required` variants; enforce canonical only.
3. **Post-Deploy Ops**
   - Trigger sitemap re-submission (Google/Bing) via deployment runbook `_docs/_deploy/README.md`.

---

## 7. Implementation Phases
1. **Discovery (1–2 days)**
   - Inventory external routes, data sources, auth expectations.
   - Document copy/CTA requirements in the feature brief.
2. **Foundation (2–3 days)**
   - Scaffold directories, SEO helpers, schema builders, and data modules.
   - Add placeholder tests and baseline sitemap entries.
3. **Feature Build-Out (per route: 1–2 days)**
   - Implement UI fragments, structured data, and auth-aware logic.
   - Wire analytics events (PostHog/Plausible) per Growth specs.
4. **QA & Launch (1 day)**
   - Run Vitest suites, Lighthouse, and Rich Results validation.
   - Update navigation, release notes, and monitoring dashboards.

---

## 8. Risks & Mitigations
- **Remote Config Drift:** Cache-bust via incremental revalidation; add alerts if fetch fails.
- **Structured Data Regression:** CI gate for schema tests (`pnpm test --filter "seo"`).
- **Analytics Gaps:** Coordinate with Growth to smoke-test events across auth states.
- **Accessibility Debt:** Run automated axe checks before release; annotate follow-up tasks in `_docs/_business/seo/audit-log.md`.

---

## 9. Next Actions
- [ ] Create `externalTools` helper module with metadata + schema builders.
- [ ] Prioritize first slug (`/external-tools/roi-simulator`) and draft detailed feature brief.
- [ ] Schedule QA window for SEO/Lighthouse validation prior to launch.

---

This plan keeps external experiences decoupled while ensuring the primary app delivers consistent SEO, JSON-LD, and sitemap coverage.

