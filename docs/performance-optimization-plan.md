# DealScale Performance Optimization Plan

This plan targets measurable improvements for Core Web Vitals and user-perceived smoothness. It prioritizes CLS reduction, eliminating scroll flashes, and ensuring predictable, fast visual completion.

## Objectives

- Reduce CLS on home page to < 0.1
- Improve perceived smoothness during fast scroll (no white gaps/clipping)
- Lower render-blocking impact and excessive paints
- Produce reliable Lighthouse runs (local + prod) to track progress

## Action Items (Phased)

### Phase 1 — Interaction Smoothness + CLS (Now)
- Persist lazy-reveal state so sections don’t flash placeholders on revisit (DONE)
- Gate animations/timers by visibility (in-view only) for heavy sections (PARTIAL)
- Promote animated layers to GPU, reduce repaints with `transform-gpu` + `will-change`
- Increase pre-reveal margins so content is ready before it’s visible
- Add `overflow-clip-margin` to rounded containers to avoid clipping on scroll

Deliverables:
- FeatureSectionActivity visibility gating + GPU promotion
- ConnectAnythingHero GPU promotion
- SectionWrapper earlier reveal (bigger `rootMargin`)

### Phase 2 — Image, Fonts, and LCP
- Audit all above-the-fold images for explicit sizing and correct `sizes`
- Ensure LCP asset is preloaded (or SSR where applicable)
- Keep `next/font` with `display: swap` (DONE) and preconnect if needed

### Phase 3 — Code Splitting & Chunk Warm-up
- Keep opportunistic chunk prefetch on idle/interaction (DONE)
- SSR safe presentational components (e.g., AboutUsSection) to remove client-only fallbacks

### Phase 4 — Render-Blocking + Server Response
- Verify critical CSS minimized; remove global blocking assets
- Confirm ISR and route `revalidate` settings; warm server prior to LH
- Consider moving large demo media off repo or to LFS/CDN (tracked in repo size audit)

## Metrics & Tooling

- Scripts (Node 20 compatible):
  - `pnpm run perf:lighthouse:local`
  - `pnpm run perf:lighthouse:prod`
- Report paths: `reports/lighthouse/local*` and `reports/lighthouse/prod*`
- Track: FCP, LCP, CLS, TBT/INP, Speed Index

## Rollback/Safety

- All changes isolated to UI wrappers and non-breaking styles
- Visibility gating only pauses animations offscreen (no data behavior changes)

## Status

- Husky prepare resolved for Vercel (inline prepare + SKIP_HUSKY)
- Lazy reveal persistence: COMPLETE
- Chunk prefetcher: COMPLETE
- FeatureSectionActivity visibility gating: COMPLETE
- This commit starts Phase 1 styling and SectionWrapper tuning

