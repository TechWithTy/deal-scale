---
description: Forward compatibility strategy for introducing Vite and Rspack without disrupting the existing Next.js/Webpack build.
authors: DealScale Architecture Guild
status: draft
lastUpdated: 2025-11-13
---

# Build Tool Forward Compatibility Plan

This document provides the shared context and baseline actions required to support alternative bundlers alongside the existing Next.js 15.2.4 build (Webpack 5/Turbopack). Detailed execution guides for each experimental bundler live in:

- [`vite-forward-compatibility.md`](mdc:_docs/_development/vite-forward-compatibility.md)
- [`rspack-forward-compatibility.md`](mdc:_docs/_development/rspack-forward-compatibility.md)

## Guiding Principles

- Maintain parity with the production Next.js build output at each step.
- Keep the build tool choice behind environment-driven feature flags.
- Automate compatibility checks in CI before marking any alternative pipeline as stable.
- Avoid duplicating configuration; centralize shared aliases, env handling, and test adapters.

## Current State Snapshot

- Bundler: Next.js default (`next build` → Webpack 5, optional Turbopack via `next dev --turbopack`).
- Testing: Jest (legacy) and Vitest (configured but optional).
- Tooling: Biome for lint/format; pnpm for package management.
- Codebase relies on Next.js conventions (app router, file-system routing) and custom env loaders in `tools/checks/*`.

---

## Phase 0 – Baseline Readiness (Shared for Vite & Rspack)

1. **Inventory Build Assumptions**
   - Document all implicit Webpack loaders, aliases, `next.config.ts` tweaks.
   - Capture env usage via `tools/checks/check-analytics-env.ts`.
2. **Abstract Shared Config**
   - Extract aliases into `tsconfig.json` paths + `scripts/build/aliases.ts` for reuse.
   - Ensure CSS/Tailwind config exports reusable values (already in `tailwind.config.ts`).
3. **Harden Test Matrix**
   - Expand Vitest coverage to critical routes/components (ensures alternative bundles render).
   - Add Playwright smoke tests targeting pre-rendered pages (verifies HTML parity).
4. **CI Guardrails**
   - Introduce matrix jobs for `BUNDLE_TARGET=webpack|vite|rspack` (initially webpack only, others allowed to fail).
   - Capture build stats artifacts for diffing bundle size/runtime.

## Documentation & Communication

- Update onboarding docs to mention alternative bundlers are experimental.
- Create changelog entries when enabling/disabling feature flags.
- Host regular build-health reports comparing Webpack, Vite, Rspack metrics.
- Document the opt-in environment flags (`FEATURE_VITE_PREVIEW`, `FEATURE_RSPACK_PREVIEW`) alongside the corresponding `pnpm run dev:*` / `pnpm run build:*` commands.

---

## Success Criteria

- Vite preview pipeline builds successfully in CI and serves component sandbox with <5% bundle regression vs Webpack.
- Rspack experimental build completes for designated packages without blocking Next build.
- Developers can opt-in/out via environment variables without touching code paths.

---

## Next Actions Checklist

- [ ] Finalize shared alias & env abstraction module.
- [ ] Scaffold Vite preview workspace and document usage.
- [ ] Add CI matrix jobs (experimental allowed to fail).
- [ ] Prototype Rsbuild config for non-critical bundle.
- [ ] Schedule quarterly review of Rspack ecosystem maturity.


