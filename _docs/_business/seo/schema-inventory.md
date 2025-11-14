# Schema Injector Inventory

This document catalogs every current usage of the `SchemaInjector` component across the app
routes and shared layouts. For each route we capture the JSON-LD builder that feeds the
injector along with the origin of the underlying data so we can map future SSR migration
requirements.

| Route / Surface | File | Builder(s) | Data Inputs |
| --- | --- | --- | --- |
| Global layout | `src/app/layout.tsx` | `buildOrganizationSchema()`, `buildWebSiteSchema()` | Static builders invoked at module scope. No external data dependencies. |
| Document head | `src/app/head.tsx` | `buildOrganizationSchema()`, `buildWebSiteSchema()` | Static builders executed per render in head. |
| Blogs index | `src/app/blogs/page.tsx` | `buildBlogSchema({ ... })` | SEO metadata via `getStaticSeo("/blogs")`; blog posts from `getLatestBeehiivPosts({ perPage: 12 })`. |
| Partners | `src/app/partners/page.tsx` | `buildPartnersItemListSchema(companyLogos)` | Partner logos sourced from `@/data/service/slug_data/trustedCompanies`. |
| Products index | `src/app/products/page.tsx` | `buildProductListJsonLd(products)` | Product collection from dynamic import of `@/data/products` inside `fetchProducts()`. |
| Product detail | `src/app/products/[slug]/page.tsx` | `buildProductJsonLd(product)` | Individual product resolved from `mockProducts` dataset via `fetchProduct(slug)`. |
| Events index | `src/app/events/page.tsx` | `buildEventsItemListSchema(events)` | Events fetched from `fetchEvents()` (remote/ISR with `revalidate = 1800`). |
| Event detail | `src/app/events/[slug]/page.tsx` | `buildEventSchema(event)` | Event entity resolved from `fetchEvents()` after param validation through `resolveEventParams`. |
| Pricing | `src/app/pricing/page.tsx` | `buildFAQPageSchema({ ... })` | SEO metadata via `getStaticSeo("/pricing")`; FAQ items from `leadGenFAQ.faqItems`. |
| Features index | `src/app/features/page.tsx` | `buildFAQPageSchema({ ... })` | SEO metadata via `getStaticSeo("/features")`; FAQ data from `faqItems`. |
| Feature detail | `src/app/features/[slug]/page.tsx` | `buildServiceJsonLd(service)` | Service entity aggregated from `@/data/service/services` collections. |
| Case study detail | `src/app/case-studies/[slug]/page.tsx` | `buildCaseStudyCreativeWorkSchema(caseStudy, { ... })` | Case study resolved via `getCaseStudyBySlug`; related studies from `getAllCaseStudies()`; canonical derived using `getTestBaseUrl()`. |
| LinkTree | `src/app/linktree/page.tsx` | `buildLinkTreeItemListSchema(items)` | Link items fetched from `/api/linktree` (sources data from Notion database via `NOTION_REDIRECTS_ID`); revalidates every 300 seconds. |

## Notes

- All current injections happen in server components but rely on a client-side `SchemaInjector`
  that serializes within React during render. Migrating to server-side JSON-LD requires
  ensuring the same builders remain accessible in the new helper API.
- Routes that pull remote data (`/events`, `/blogs`) will need SSR-safe data fetching paths
  when JSON-LD generation moves to the server response. The existing functions already run
  server-side but may require memoization or caching during render to avoid duplicate work.
