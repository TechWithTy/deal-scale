# Zustand Data-Store Integration Action Plan

Use this action plan to track the migration from direct data imports to the standardized manifest-driven Zustand workflow. Update the **Progress** column as each scope advances.

| Scope | File(s) & Lines | Current Implementation | Planned Replacement | Rationale | Progress |
| --- | --- | --- | --- | --- | --- |
| Home landing RSC | `src/app/page.tsx` L15-L117 | Imports `caseStudies`, `faqItems`, pricing/testimonial datasets, and company logos directly, then renders them synchronously in the server component. | Import `dataModules` from `@/data/__generated__/modules`, destructure the needed exports (e.g., `dataModules['caseStudy/caseStudies']`) during render, and pass the resolved payloads into child props before returning JSX. | Keeps server routes on the manifest contract so swapping static modules for API-backed loaders is transparent. | ✅ Completed |
| Pricing server entry | `src/app/pricing/page.tsx` L1-L32 | Pulls `PricingPlans` and `leadGenFAQ` directly from static modules inside the server component. | Use `dataModules['service/slug_data/pricing']` and `dataModules['service/slug_data/faq']` to obtain pricing data and FAQ lists, ensuring schema generation consumes manifest-backed content. | Aligns SSR data access with generated loaders and avoids bypassing the store layer. | ✅ Completed |
| Features server entry | `src/app/features/page.tsx` L1-L31 | Imports `faqItems` statically and slices them inside the server component. | Replace with `dataModules['faq/default']` (or a dedicated features FAQ module) and read the FAQ array from the manifest module before building schemas. | Unifies FAQ sourcing and prepares the page for API-driven data. | ✅ Completed |
| Marketing feature clients | `src/app/features/ServiceHomeClient.tsx` L1-L102; `src/components/home/ClientBento.tsx` L1-L18 | Client components import `MainBentoFeatures`, `leadGenIntegrations`, and timelines directly from `/data`, assuming synchronous availability. | Switch to `useDataModule` for `bento/main`, `service/slug_data/integrations`, and `features/feature_timeline`, rendering loading states until stores report `ready`; keep props available for overrides. | Ensures client routes hydrate through shared Zustand caches and allows future API-backed loaders without touching UI logic. | ✅ Completed |
| Services catalog | `src/components/home/Services.tsx` L7-L138 | Reads `services` and helper functions from `/data/service/services`, then filters the in-memory object directly. | Hydrate the module with `useDataModule('service/services')`, memoize `services` and `getServicesByCategory` from store state, and guard against `loading`/`error` before rendering filters. | Centralizes service metadata via stores, enabling cache invalidation and lazy loading workflows. | ✅ Completed |
| Case studies grid | `src/components/case-studies/CaseStudyGrid.tsx` L9-L145 | Imports `caseStudyCategories` statically and feeds them to `useCategoryFilter`. | Load categories through `useDataModule('caseStudy/caseStudies')`, deriving category lists from the loaded data (or a dedicated module) within the store-managed state. | Maintains consistency with generated module access while preserving filtering logic. | ✅ Completed |
| About page components | `src/components/about/AboutHero.tsx` L3-L28; `AboutTeam.tsx` L2-L19; `AboutTimeline.tsx` L2-L21 | Default props source hero copy, team members, and timeline milestones from static data modules. | Replace defaults with selectors from `useDataModule('about/hero' \| 'about/team' \| 'about/timeline')`, providing optional prop overrides while guarding for `loading` states. | Keeps marketing sections in sync with manifest-backed content and removes implicit coupling to static fixtures. | ✅ Completed |
| Newsletter experience | `src/app/newsletter/NewsletterClient.tsx` L1-L48 | Imports testimonials and trusted company logos directly into a client component. | Hydrate both datasets via `useDataModule('service/slug_data/testimonials')` and `useDataModule('service/slug_data/trustedCompanies')`, surfacing skeleton/error states before rendering scroller/testimonials. | Shares cached data with other routes and preps the newsletter page for API-sourced testimonials. | ✅ Completed |
| Trusted-by scroller | `src/components/contact/utils/TrustedByScroller.tsx` L1-L146 | Imports type definitions from the data module and expects synchronous dictionaries. | Introduce dedicated type exports (e.g., `src/types/service/trusted-companies.ts`) and feed the scroller via `useDataModule`-hydrated props; stop importing types from `/data`. | Decouples UI types from data implementations, easing the swap to remote loaders and keeping typing stable. | ✅ Completed |

## Action Tracks

### Refactor server routes to consume manifest-driven modules
- [x] In `src/app/page.tsx`, `src/app/pricing/page.tsx`, and `src/app/features/page.tsx`, replace direct `/data/**` imports with `import { dataModules } from '@/data/__generated__/modules';`.
- [x] Within each component, destructure the required exports from the appropriate `dataModules[...]` entries and propagate them to child props or schema builders.
- [x] Remove unused legacy imports (e.g., `MainBentoFeatures` on the home page) and ensure TypeScript types reflect the module namespace.
- [x] Verify render paths handle the loaded objects synchronously (server modules resolve immediately) and that metadata builders source data from the manifest payloads.

### Adopt useDataModule across marketing client components
- [x] Import `useDataModule` (and `createDataModuleStore` where prefetching helps) into `ServiceHomeClient`, `ClientBento`, `Services`, `CaseStudyGrid`, `AboutHero`, `AboutTeam`, `AboutTimeline`, and `NewsletterClient`.
- [x] Replace direct `/data/**` usage with store selectors, showing loading or fallback UI until `status === 'ready'`; propagate hydrated data through existing props.
- [x] Memoize derived values (e.g., category lists, feature arrays) to avoid recomputation on re-renders, and share selectors for nested props where appropriate.
- [x] When props permit overriding (e.g., optional `features` arrays), retain the override path while defaulting to store-backed data.
- [x] After refactors, update Storybook/consumer usage to provide data via props or rely on the same stores for consistency.

### Decouple TrustedByScroller types from data module implementation
- [x] Create `src/types/service/trusted-companies.ts` (or reuse an existing domain types file) with exported interfaces for `CompanyPartner` and `CompanyLogoDict`.
- [x] Update `TrustedByScroller` to import these types from the new types file and accept its `items` prop via callers hydrated through `useDataModule`.
- [x] Adjust any other consumers that referenced the data module for typing to use the new shared types.
- [x] Confirm ESLint/Biome pass and that the component still renders with manifest-fed props.

### Regenerate data manifest and validate targeted suites
- [x] Run `pnpm run generate:data` from the repo root to refresh `src/data/__generated__/manifest.ts`, `modules.ts`, and `src/stores/__generated__/dataStores.ts`.
- [x] Execute `pnpm exec jest src/data/__tests__/generate-data-manifest.test.ts src/stores/__tests__/useDataModuleStore.test.ts --runInBand` to verify manifest/store behaviour across platforms.
- [x] Commit regenerated artifacts alongside source updates to keep CI deterministic.

### Idle/loading guard convention
- Treat both `status === "idle"` and `status === "loading"` as non-rendering phases for any UI that depends on store-provided data. Render skeleton text or placeholder surfaces until the store resolves to `"ready"`.
- When `status === "error"`, log a namespaced console error (e.g., `[ComponentName] Failed to load …`) and surface a friendly message instead of attempting to render the data-dependent component.
- For `status === "ready"` without data, render an "coming soon"-style placeholder so prerendering never attempts to access undefined collections. This keeps marketing surfaces deterministic during manifest cache warm-ups.
- Reuse the pattern introduced in `NewsletterClient`, `ClientBento`, and the contact experience (hero/info/newsletter) to ensure future `useDataModule` consumers align with the guard checklist.

Update progress checkpoints as scopes advance to maintain shared visibility across the team.
