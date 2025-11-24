# Landing Page Strapi Export Plan

## Goal
Build a repeatable pipeline that converts the current landing-page content living under `src/data` into Strapi collections/single-types so the CMS becomes the single source of truth before deployment.

## Scope
- Existing JSON/TS data powering the landing experience (services, testimonials, pricing, FAQs, partners, etc.).
- Navigation copy and CTAs that already live in data modules.
- Strapi environment running locally (Docker) with export scripts located in `scripts/`.

## Source Data Inventory
| Area | Source file(s) | Notes |
| --- | --- | --- |
| Services catalogue | `src/data/service/services/index.ts`, `src/data/service/services/*.ts` | Complex nested structures (plans, categories, CTA targets) already normalized. |
| Pricing plans | `src/data/service/slug_data/pricing.ts` | Includes monthly/annual matrices and feature flags needed for plan type toggles. |
| Testimonials | `src/data/service/slug_data/testimonials.ts` | Contains multiple testimonial groups used across the site. |
| Partner logos | `src/data/service/slug_data/trustedCompanies.ts` | Logo metadata and partner descriptions. |
| Case studies | `src/data/caseStudy/caseStudies.ts` | Contains large bodies of copy, stats, and images for grid and detail pages. |
| FAQ content | `src/data/faq/default.ts` | Question/answer sets used by `<FAQ />`. |
| Bento features | `src/data/bento/main.tsx` (UI), `src/data/bento/landingSnapshot.ts` (export seed) | Titles, body copy, CTA labels, and media references. |
| Landing copy gaps | `src/data/landing/strapiLandingContent.ts` | Centralizes hero, services header, CTA, and section copy used as Strapi seeds. |
| Blog metadata | `src/data/medium/posts.ts` (fallback) | Serves as seed content if Beehiiv fetch fails. |
| Contact form schemas | `src/data/contact/formFields.ts` | Field definitions, dropdown options, copy. |
| SEO defaults | `src/data/constants/seo.ts` | Landing metadata consumed via `getStaticSeo`. |

## Strapi Content Model Mapping
1. **Single Types** for landing-only copy (hero, services header, feature-vote header, pricing hero, testimonials header, FAQ CTA, blog preview header, beta form header, about highlight, trusted-by band).
2. **Collection Types** for reusable datasets already structured in modules:
   - `services`, `serviceCategories`, `servicePlans`
   - `testimonials`
   - `pricingPlans`
   - `caseStudies`
   - `faqItems`
   - `bentoFeatures`
   - `companyLogos`
   - `formOptions` (pain points, wanted features, etc.)
3. **Components** for repeated shapes (CTA, gradient highlight word, pricing tiers) referencing the TypeScript interfaces in `src/types`.

## Export Workflow
1. **Prepare Strapi schemas**
   - Translate the above mapping into Strapi builder definitions.
   - Commit schema JSON to the Strapi repo under `src/api/*`.
2. **Extend export script**
   - Use `tools/strapi/export-landing.ts` (invoked via `pnpm run export:landing`) to:
     - Traverse the `src/data` modules listed above.
     - Flatten nested records into the structure expected by Strapi importers.
     - Emit JSON into `content/strapi-export/landing/*` grouped by entity.
   - Accept optional CLI flags (for example `--outDir`) passed through the runner to isolate landing content if needed.
3. **Normalize IDs**
   - Reuse the existing hash-based dedupe logic described in `_docs/strapi-export-guide.md`.
   - Ensure slug consistency (e.g., `caseStudies` already exposes `slug`).
4. **Relationship stitching**
   - For each export, build arrays of relation IDs (e.g., plan → service, testimonial → category) mirroring Strapi schema.
   - Persist dependency maps in `content/strapi-export/landing/meta/*.json` for troubleshooting.
5. **Validation**
   - Add Vitest suite under `__tests__/strapi/export-landing.test.ts` asserting:
     - Every exported entity has required fields.
     - Relationship IDs correspond to actual objects.
     - File count matches expectation (snapshot).
6. **Automation**
   - Leverage the committed `pnpm run export:landing` script in `package.json`.
   - Hook into CI (GitHub Actions) to ensure exports stay in sync with data commits.

## Migration Checklist
- [ ] Finalize Strapi content types/components for landing data.
- [ ] Implement dedicated landing export script and tests.
- [ ] Run export locally and verify JSON parity with TypeScript modules.
- [ ] Import into Strapi using the bulk upload plugin or custom bootstrap.
- [ ] Record Strapi IDs/slugs in `_docs/strapi/content-mapping.md` (new file).
- [ ] Remove redundant TypeScript data modules once Strapi is authoritative.

## Success Criteria
- Landing data in Strapi mirrors current site with no copy drift.
- Export command runs cleanly in CI and produces deterministic artifacts.
- Content editors can view/edit landing entries in Strapi immediately after import.
