# DealScale Performance Audit – Sep 29, 2025

## Test Context
- **Capture time:** Sep 29, 2025, 11:10 AM MDT
- **Runtime:** Lighthouse 12.8.2 via HeadlessChromium 137.0.7151.119
- **Device profile:** Emulated Moto G Power
- **Network conditions:** Slow 4G throttling
- **Scenario:** Initial page load, single page session
- **Target URL:** `https://www.dealscale.io`

## Core Metrics
| Metric | Observed | Target (Mobile) | Gap |
| --- | --- | --- | --- |
| First Contentful Paint (FCP) | **1.9 s** | ≤ 1.8 s | Slight regression |
| Largest Contentful Paint (LCP) | **17.8 s** | ≤ 3.0 s | **Critical** |
| Total Blocking Time (TBT) | **1,400 ms** | ≤ 200 ms | **Critical** |
| Cumulative Layout Shift (CLS) | **0.999** | ≤ 0.10 | **Critical** |
| Speed Index | 9.6 s | ≤ 4.0 s | Major gap |

## Priority Issues & Actions

### 1. Catastrophic Layout Shift (`CLS 0.999`)
- **Observation:** Hero section container (`div.mx-auto.mt-16...`) shifts dramatically during load.
- **Impact:** Near-total loss of visual stability; fails Core Web Vitals.
- **Immediate actions:**
  - **Stabilize hero layout:** Pre-allocate height for hero media, lock typography sizing, and eliminate layout-affecting animations on load (`src/app/page.tsx`).
  - **Font loading:** Use `next/font` with `display: swap` or font metrics overrides to avoid late swaps.
  - **Image placeholders:** Ensure all `next/image` elements include `fill` with defined wrappers or `sizes` attributes to prevent reflow.

### 2. Largest Contentful Paint Delay (`LCP 17.8 s`)
- **Observation:** Hero paragraph (`<p class="mx-auto mb-6 max-w-md...">`) renders after ~5 s element delay; network dependency chain shows no preconnects.
- **Immediate actions:**
  - **Critical CSS:** Inline essential hero styles; defer non-critical CSS from `/_next/static/css/bc18c020bcedcb37.css`.
  - **Origin preconnects:** Add `<link rel="preconnect">` for `https://js.stripe.com`, `https://m.stripe.network`, and `https://js.zohocdn.com` in `src/app/layout.tsx`.
  - **Hero content priority:** Use `priority` on hero images, preload hero font(s), and trim above-the-fold DOM.

### 3. Excessive Main-Thread Work (`TBT 1,400 ms`)
- **Observation:** Long tasks up to 469 ms (`chunks/1684-6a96b1ee39b01a66.js`); script evaluation 3.9 s, layout 2.2 s.
- **Immediate actions:**
  - **Bundle audit:** Analyze `chunks/1684`, `6545`, `dc112a36` to identify heavy components; split or lazy-load non-critical sections (`src/app/page.tsx`, feature grids, animations).
  - **Minimize hydration cost:** Convert below-the-fold sections to static markup or use `suspense` with progressive hydration.
  - **Defer analytics:** Load Google Tag Manager and Microsoft Clarity after `load` event or via consent manager.

### 4. Third-Party Script Overhead (Stripe, GTM, Clarity)
- **Observation:** Stripe bundle alone contributes 200 KiB transfer / 286 ms main-thread time; GTM adds 137 KiB.
- **Immediate actions:**
  - **Conditional loading:** Gate Stripe Elements to checkout pages; use feature detection before injecting scripts.
  - **Server-side tag manager:** Offload GTM where possible; otherwise defer initialization.
  - **Clarity:** Confirm necessity; if required, load post-interaction.

### 5. Inefficient Caching & Network Setup
- **Observation:** Multiple third-party assets with TTL ≤ 5 minutes; no preconnect hints.
- **Immediate actions:**
  - **CDN configuration:** For self-hosted assets, extend cache headers to ≥ 30 days with fingerprinted filenames.
  - **Service worker audit:** Consider app shell caching for repeat visits if PWA scope allows.

### 6. Image Delivery (Est. Savings 122 KiB)
- **Observation:** Case study images requested at 750×397 but rendered at 362×197; partner logos oversized and uncompressed.
- **Immediate actions:**
  - **Responsive `next/image`:** Supply explicit `sizes` and correct target widths.
  - **Compression:** Re-export PNG/JPEG to WebP/AVIF; review `/_next/image` default quality (raise `q` only when needed).
  - **Lazy-load:** Set `loading="lazy"` or rely on Next.js defaults for below-the-fold imagery; ensure hero image retains `priority`.

### 7. Legacy & Unused JavaScript (Est. Savings 12 KiB + 281 KiB)
- **Observation:** Babel transpilation includes ES2015+ polyfills (`Array.prototype.at`, `.flatMap`, etc.) and unused chunks.
- **Immediate actions:**
  - **Next.js compilation target:** Enable modern output; adjust `browserslist` to exclude obsolete targets.
  - **Tree-shake:** Audit dynamic imports to ensure only required code ships to the landing page.

### 8. Render-Blocking CSS & DOM Size
- **Observation:** `/_next/static/css/bc18c020bcedcb37.css` (25.5 KiB) blocks render; DOM contains 4,355 elements with nested SVG defs (82 children).
- **Immediate actions:**
  - **Critical CSS extraction:** Inline minimal styles for above-the-fold, defer rest via `media="print"` swap or modular CSS splitting.
  - **DOM pruning:** Simplify decorative SVGs, reduce component nesting, and limit portal duplication in `src/components/`.

### 9. Forced Reflows & Layout Thrashing
- **Observation:** Forced reflow hot spot in `chunks/1684-6a96b1ee39b01a66.js:2:51381` (~224 ms) plus 101 ms in `app/layout`.
- **Immediate actions:**
  - **Code review:** Identify DOM reads (`offsetWidth`, `getBoundingClientRect`) chained after writes; batch reads/writes or use `requestAnimationFrame`.
  - **Animation audit:** Replace JS-driven layout animations with transform/opacity-based CSS transitions.

### 10. Offscreen Content Loading
- **Observation:** About section illustration and dual logo variants load eagerly despite being offscreen.
- **Immediate actions:**
  - **Intersection observers:** Ensure components lazily hydrate when near viewport.
  - **Asset strategy:** Merge dark/light logos into CSS `prefers-color-scheme` where feasible to avoid duplicate image loads.

## Remediation Backlog Snapshot
- **Week 1 (Stability First):** Hero layout stabilization, critical CSS extraction, preconnect hints, clamp third-party initialization.
- **Week 2 (Payload Reduction):** Bundle/code splitting, image resizing pipeline, polyfill pruning, analytics deferral.
- **Week 3 (Experience Polish):** DOM pruning, forced reflow fixes, sequential hydration safeguards, caching/CDN rollout.

## Follow-Up Checks
- Re-run Lighthouse (mobile + desktop) after Week 1 fixes to validate CLS/LCP improvement.
- Instrument Real User Monitoring (RUM) via `web-vitals` in production to capture live CWV.
- Track third-party script impact with Resource Timing API and adjust loading strategy accordingly.

## Appendix: Raw Highlights
- **Network dependency tree:** Maximum critical path latency 751 ms; no preconnected origins.
- **Long tasks:** 18 tasks > 50 ms; worst task 469 ms (`chunks/1684`).
- **User timing:** `stripe.js:init` mark at 1,773.9 ms; ensure this event only fires when payment flow is active.


