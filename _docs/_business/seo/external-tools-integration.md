# SOP: Integrating External SEO Pages Into the App

**Last Updated:** 2025-11-13  
**Primary Audience:** Deal Scale engineers shipping SEO/AEO-ready landing surfaces.

---

## 1. Experience Definition & Authentication Rules

- Capture hero copy, CTA hierarchy, and conversion flow in the associated feature brief (`_docs/_business/seo/plan.md` owns the roadmap).
- Decide authentication behavior before coding the route:
  - `public`: anyone can browse; add upsell CTAs pointing to `/signin`.
  - `optional`: anonymous by default, allow `?auth=required` to enforce sign-in.
  - `required`: gate every visit by redirecting unauthenticated users.
- Note required analytics events (pixels, UTM passthrough, PostHog traits) and add them to the feature brief so instrumentation happens with the initial launch.

---

## 2. App File Placement & Structure

- Page entry lives at `src/app/external-tools/<slug>/page.tsx`. Keep the file under 250 lines.
- Shared metadata helpers belong in `src/utils/seo/externalTools.ts` (create if missing). Export:
  - `getExternalToolSeo(slug: string)` → returns `SeoMeta`.
  - `buildExternalToolJsonLd(config)` → returns validated schema payload.
- Reusable visual fragments live under `src/components/external/<Slug>/**`. Keep UI files ≤ 250 lines and colocate styles.
- Persist static content or dataset snippets in `src/data/external-tools/<slug>.ts`.

---

## 3. Static SEO Essentials

- Every route must export `generateMetadata` and pipe through `mapSeoMetaToMetadata`.
- Maintain canonical entries inside `src/utils/seo/staticSeo.ts`:
  - Add `STATIC_SEO_META["/external-tools/<slug>"]`.
  - When the canonical experience lives at `app.leadorchestra.com/<slug>`, set the canonical URL to that domain while keeping the marketing slug for routing.
  - Wire into `staticSeoMeta` map with priority + change frequency.
- Reference the route from primary navigation, footer, and relevant resource hubs to ensure crawl depth.
- Provide an OG/Twitter image – reuse constants from `src/utils/seo/seo.ts` when possible.

---

## 4. Structured Data (Dynamic SEO)

- Inject JSON-LD via `<SchemaInjector schema={...} />` from `src/utils/seo/schema`.
- Supported schema builders for external tools:
  - `FAQPage` – for high-intent Q&A content.
  - `HowTo` – for calculators or workflow guides.
  - `Product` / `Service` – when highlighting a Deal Scale plan or feature tier.
- Store schema builder utilities in `src/utils/seo/externalTools.ts` and cover them with Vitest in `src/utils/__tests__/seo/externalTools.test.ts`.

---

## 5. Auth-Aware Rendering

- Resolve the user session inside the server component:
  ```ts
  import { auth } from "@/authOptions";
  import { redirect } from "next/navigation";
  import { requiresAuth } from "@/utils/auth/requiresAuth";

  const session = await auth();
  if (requiresAuth(searchParams?.auth) && !session) {
    redirect("/signin?next=/external-tools/<slug>");
  }
  ```
- Expose differentiated content blocks for guests versus signed-in users (e.g., gated download modules, saved progress messaging).
- Document any new auth helper added under `src/utils/auth/**` in `_docs/_business/seo/schema-inventory.md`.

---

## 6. Sitemap & Robots

- Update `src/app/sitemap.ts`:
  - Append `/external-tools/<slug>` with accurate `changeFrequency` and `priority`.
  - Exclude `?auth=required` variants from the sitemap (canonical only).
- Confirm robots directives (from `src/app/robots.ts`) allow indexing unless the page is explicitly private.
- After deployment, resubmit the sitemap in Google Search Console and Bing Webmaster per `_docs/_deploy/README.md`.

---

## 7. QA & Testing

- Add Vitest coverage at `src/__tests__/app/external-tools/<slug>/metadata.test.tsx`:
  - Snapshot `generateMetadata`.
  - Validate JSON-LD payloads via `validateSchema` helper.
  - Mock `auth()` and `redirect()` to exercise auth gating branches.
- Run `pnpm test --filter "external-tools"` before opening a PR.
- Execute Lighthouse (target ≥ 90 SEO score) and validate structured data with Google Rich Results Tester.

---

## 8. Launch Checklist

- Verify analytics events fire for anonymous + authenticated sessions.
- Update `src/app/layout.tsx` navigation, `src/components/footer/Footer.tsx`, and relevant resource hubs with internal links.
- Record the release in `_docs/_deploy/README.md` (include new query parameters).
- Monitor Search Console for index coverage and schema enhancements; log findings in `_docs/_business/seo/audit-log.md`.

---

## 9. Cross-Team Signals

- Coordinate with AEO owners (`_docs/_business/aeo/plan.md`) to align FAQ content and schema coverage.
- If the page exposes net-new product claims, notify the compliance channel and attach supporting evidence in `_docs/_business/_business/discoverability`.
- Capture retro outcomes in `_docs/_business/seo/schema-inventory.md` so future external tools reuse proven patterns.

---

Following this SOP ensures every external tool page matches Deal Scale’s authentication model, SEO obligations, and structured-data strategy while integrating cleanly with the existing Next.js architecture.

