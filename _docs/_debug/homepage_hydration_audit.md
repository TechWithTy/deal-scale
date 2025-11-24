## Homepage Hydration Audit Playbook

Use this checklist to benchmark the homepage after the data-loading and `ViewportLazy` refactors. It focuses on the `LiveDynamicHero` and `CallDemoShowcase` client bundles, which currently drive most of the hydration cost.

### 1. Bundle size regressions
- Run `ANALYZE=true pnpm next build` to build and automatically open the Next.js bundle analyzer in your browser.
- Capture the size of `src/app/page.tsx` and the dynamic chunks generated for `LiveDynamicHero` and `CallDemoShowcase`.
- Compare against the previous build artifact (see `/out` or historical CI logs). Record the delta in this file.
- **Spline note:** January 2025 builds temporarily remove the `@splinetool/react-spline` bundle (≈1.9 MB) to avoid module-resolution conflicts. Expect the treemap to show only `SplinePlaceHolder` until the integration returns.

### 2. Lighthouse (CLS & INP)
- Start the dev server with `pnpm dev`.
- Open Chrome DevTools > Lighthouse.
- Emulate mobile, throttling to "Slow 4G" and "Mid-tier mobile".
- Run reports for Performance only, noting Cumulative Layout Shift (CLS) and Interaction to Next Paint (INP).
- Repeat after deploying to a preview environment to capture server-render metrics.

### 3. Hydration timeline (CPU & 3G throttling)
- In Chrome DevTools > Performance, enable CPU throttling at 4× and network throttling at "Slow 3G".
- Record a profile while loading the homepage.
- Identify the time to `First Contentful Paint`, `First Input Delay`, and the moment hydration completes (`commitRoot` markers).
- Note the duration of `LiveDynamicHero` and `CallDemoShowcase` script evaluation.

### 4. Follow-up actions
- If `LiveDynamicHero` evaluation exceeds 300 ms under throttling, plan to split rendering into a server-first shell with optional client effects activated via `requestIdleCallback`.
- For `CallDemoShowcase`, defer autoplay logic until the user interacts with the module or scrolls it into view.
- Document concrete tasks (e.g., "Convert hero metrics strip to server component", "Gate call demo timers behind `useEffect` on visibility").

> Log all measurements with timestamped entries in this file so we can track improvements over time.

---

### Temporary change log

- **2025-01-14** – Disabled `SplineModel` dynamic import. The component now renders `SplinePlaceHolder` only, removing the `@splinetool/react-spline` bundle until a scoped `nodenext` TypeScript setup is introduced.

