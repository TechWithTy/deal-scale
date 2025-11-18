---
description: Implementation guide for enabling a Vite-based preview pipeline alongside the existing Next.js/Webpack build.
authors: DealScale Architecture Guild
status: draft
lastUpdated: 2025-11-13
---

# Vite Forward Compatibility Plan

This guide details how to introduce Vite incrementally without impacting the primary Next.js 15.2.4 build. Work through the shared prerequisites in [`build-tool-forward-compatibility.md`](mdc:_docs/_development/build-tool-forward-compatibility.md) before tackling the steps below.

## Objectives

- Offer a fast dev/build pipeline using Vite while keeping Next.js primary.
- Enable optional `pnpm run dev:vite` and `pnpm run build:vite` commands.
- Ship a component preview sandbox powered by Vite for rapid UI iteration.

## Implementation Steps

1. **Proof-of-Concept Workspace (`/tools/vite-preview`)**
   - Scaffold a Vite + React + TS app importing components via the shared `@` alias.
   - Reuse Tailwind and PostCSS config by importing the root `tailwind.config.ts` and `postcss.config.js`.
   - Gate the preview server behind a `FEATURE_VITE_PREVIEW` env flag so the main app remains untouched.
2. **Create Vite Config (`vite.config.ts`)**
   - Use `@vitejs/plugin-react-swc` for consistency with Next.js’ SWC pipeline.
   - Mirror Next aliases by reading `tsconfig.paths.json` or a generated `scripts/build/aliases.ts`.
   - Bundle only client-safe modules; provide shims for `server-only`, `next/*`, and other SSR-only helpers.
3. **Data/Env Adapters**
   - Mock or wrap server-side fetchers (e.g., `@/lib/strapi`, analytics loaders) to avoid direct API calls during previews.
   - Load `.env.development` via Vite `loadEnv` and validate with Zod using the existing env schema from `tools/checks`.
4. **CI Experiment**
   - Add an optional GitHub Actions job running `pnpm run build:vite`; mark it `continue-on-error` until stable.
   - Upload bundle stats (JS/CSS size, module count) for comparison with the canonical Next build.
5. **Gradual Adoption**
   - Encourage component-focused teams to iterate via `pnpm run dev:vite`.
   - Collect DX metrics (HMR latency, rebuild times) and track incompatible modules.
   - Once parity confidence is high, evaluate using the Vite output for marketing microsites or embedding in design reviews.

## Risk Mitigation

- Keep the Vite build read-only (no deploy artifacts) until parity metrics pass.
- Add lint or commit hooks reminding contributors that Next.js remains the production source of truth.
- Document modules that require stubbing or alternative implementations when running under Vite.

## Success Indicators

- Vite preview compiles the shared component library without manual patching.
- CI job for `pnpm run build:vite` succeeds consistently and reports bundle regressions <5%.
- Developers can toggle Vite usage via environment variables without code churn.
















