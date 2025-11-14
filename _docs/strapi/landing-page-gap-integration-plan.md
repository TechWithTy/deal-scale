# Landing Page Strapi Integration Plan (Gap Closure)

## Goal
Replace the remaining hard-coded landing-page copy with Strapi-driven data and wire the Next.js frontend to fetch the new single types/collections.

## Target Components & Files
| Section | Frontend file(s) | Current issue |
| --- | --- | --- |
| Hero | `src/components/home/heros/HeroSessionMonitorClientWithModal.tsx`, `src/components/home/heros/HeroSessionMonitor.tsx` | Literal headline, badge, CTA copy, highlight words, and modal behavior baked into component. |
| Trusted By | `src/components/contact/utils/TrustedByScroller.tsx` | Marquee header locked to "Beta Testers" with no prop override. |
| Services framing | `src/components/home/Services.tsx`, `src/app/page.tsx` | Component-level defaults and page-level strings diverge from data layer. |
| Upcoming features | `src/components/home/FeatureVote.tsx` | Section header/subheader literals. |
| Case studies preview | `src/components/case-studies/CaseStudyGrid.tsx`, `src/app/page.tsx` | Component defaults supply live copy; landing relies on fallback. |
| Testimonials | `src/components/home/Testimonials.tsx`, `src/app/page.tsx` | Component ignores passed props and renders hard-coded strings. |
| FAQ CTA | `src/components/faq/index.tsx` | Beta tester CTA paragraph/button embedded in JSX. |
| Pricing header | `src/components/home/Pricing.tsx`, `src/app/page.tsx` | Section title/subtitle literals and CTA metadata inside pricing cards. |
| About section | `src/components/about/AboutUsSection.tsx` | Entire layout static. |
| Bento highlight | `src/components/home/ClientBento.tsx` | Title/subtitle defaults. |
| Blog preview | `src/components/home/BlogPreview.tsx`, `src/app/page.tsx` | Title fallback vs. inline override mismatch. |
| Contact form header | `src/components/contact/form/ContactForm.tsx` | Header copy hard-coded within form container. |

## Strapi Content Types (Single Types)
1. `landing-hero`
2. `trusted-by-band`
3. `landing-services`
4. `feature-vote-header`
5. `case-studies-preview`
6. `testimonials-header`
7. `faq-cta`
8. `pricing-header`
9. `about-highlight`
10. `bento-header`
11. `blog-preview`
12. `beta-form-header`

Each single type stores the minimal fields (headline, subheadline, CTA component, gradients). Reuse components defined for the export plan.

## Integration Steps
1. **Data Fetching Layer**
   - Add `getLandingContent()` to `src/lib/strapi/landing.ts` (new server utility) that performs parallel Strapi REST calls for the above single types using `Promise.all`.
   - Implement Zod schemas matching Strapi responses in `src/lib/strapi/schemas/landing.ts` to validate API payloads before returning typed data.
2. **Page Loader Updates**
   - In `src/app/page.tsx`, convert to a server component that awaits `getLandingContent()` and passes the resolved props into hero, services, pricing, testimonials, etc.
   - Maintain graceful fallbacks by defaulting to existing literals when Strapi returns empty values.
3. **Component Refactors**
   - Update each target component to accept the new props, ensuring the interface remains <250 lines.
   - Remove hard-coded text where props exist; ensure `Testimonials` uses `title` and `subtitle` parameters rather than inline strings.
   - Extract CTA rendering into smaller subcomponents if needed to stay within file size limits.
4. **Modal + CTA Handling**
   - For `HeroSessionMonitorClientWithModal`, drive CTA labels/links and highlight words from Strapi; keep modal toggles intact.
   - Represent highlight words in Strapi as a repeatable component with `word` + `gradient` fields.
5. **Edge Cases & Fallbacks**
   - When Strapi is unreachable, log the error server-side and render the current static copy to avoid blank sections.
   - For optional assets (e.g., About image), guard Next `<Image />` usage until a URL exists.
6. **API Endpoints**
   - Ensure `/api/features/*` and `/api/testers/apply` continue to work with Strapi-managed copy; no schema changes expected.
   - Add Strapi access token support via `STRAPI_API_TOKEN` env var stored in `.env.local`.
7. **Testing**
   - Write integration tests in `src/__tests__/landing-content-fetch.test.ts` mocking Strapi responses and asserting the page renders dynamic copy via React Testing Library.
   - Unit-test Zod schemas to guarantee required fields exist.
8. **Deployment Checklist**
   - Sync Strapi single-type entries with initial content from export plan.
   - Configure ISR/SSG revalidation (e.g., 15-minute) for hero/services/promo sections.
   - Document manual override process in `_docs/strapi/content-mapping.md`.

## Deliverables
- New server utility + schemas.
- Updated Next.js landing page with dynamic props.
- Automated tests confirming fallback + dynamic behavior.
- Documentation linking Strapi entries to frontend components.
