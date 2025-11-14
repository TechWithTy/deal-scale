---
description: Implementation guide for experimenting with Rspack/Rsbuild while maintaining the current Next.js/Webpack pipeline.
authors: DealScale Architecture Guild
status: draft
lastUpdated: 2025-11-13
---

# Rspack Forward Compatibility Plan

This guide outlines how to evaluate Rspack (via Rsbuild) alongside the existing Next.js 15.2.4 build. Complete the shared preparation tasks in [`build-tool-forward-compatibility.md`](mdc:_docs/_development/build-tool-forward-compatibility.md) before starting.

## Objectives

- Prepare for a potential migration from Webpack to Rspack/Rsbuild for faster builds.
- Ensure bundler choice remains toggleable via package.json scripts.
- Reuse the abstraction work completed for the Vite initiative (aliases, env handling, test adapters).

## Implementation Steps

1. **Dependency Setup (Canary-ready)**
   - Add `@rspack/core`, `@rspack/cli`, and `@rsbuild/core` as dev dependencies within an isolated feature branch.
   - Provide commented pnpm overrides for installing canary packages when testing unreleased fixes.
2. **Minimal Rsbuild Config (`rsbuild.config.ts`)**
   - Target React + TypeScript with SWC compilation.
   - Inject `DefinePlugin`-style constants for public Next.js env vars so runtime logic matches the production build.
   - Alias `@` to `src` and stub Next-specific entry points (`next/image`, `next/link`, `server-only`) similar to the Vite config.
3. **Hybrid Serve Command**
   - Introduce `pnpm run dev:rspack` to start an Rsbuild-powered component sandbox.
   - Ensure hot module replacement works for shared UI packages while keeping the Next dev server dedicated to SSR testing.
4. **Incremental Migration Path**
   - Start by bundling standalone tooling (e.g., scripts under `tools/` or static marketing bundles) to validate the pipeline.
   - Build a `diff-build` script comparing Rsbuild outputs against `next build` (HTML snapshots, bundle sizes, module counts).
5. **Full App Feasibility Study**
   - Track the Next.js community roadmap for Rspack integrations (e.g., official plugins, experimental adapters).
   - Document blockers (SSR routing, image optimization, edge runtimes) and maintain a go/no-go decision log each quarter.

## Risk Mitigation

- Keep Rspack dependencies scoped to experimental branches or opt-in installations until CI stability is proven.
- Provide rollback instructions (`pnpm remove @rspack/*` and delete Rsbuild config files) in commit messages and docs.
- Monitor Node runtime compatibility (Rspack ≥ Node 18.12.0) before rolling changes into shared environments.

## Success Indicators

- Rsbuild can bundle designated non-critical packages without manual polyfills.
- Experimental CI job running `pnpm run build:rspack` passes consistently with measurable performance wins over Webpack.
- Decision logs show clear criteria for expanding or pausing the Rspack initiative.

## Running the Preview Workspace

- Opt in explicitly before running any command:
  - Bash: `FEATURE_RSPACK_PREVIEW=true pnpm run dev:rspack`
  - PowerShell: `$env:FEATURE_RSPACK_PREVIEW = "true"; pnpm run dev:rspack`
- Build artifacts land in `dist/rspack-preview`; clean by removing that directory.
- The preview shares the Vite sandbox UI, so component additions automatically appear in both pipelines once imported from `src/components`.

Refer to the official migration guidance for deeper integration steps: [https://rspack.rs/guide/start/quick-start#migrating-from-existing-projects](https://rspack.rs/guide/start/quick-start#migrating-from-existing-projects)

## References

- Rspack official quick start and migration guidance: [https://rspack.rs/guide/start/quick-start#migrating-from-existing-projects](https://rspack.rs/guide/start/quick-start#migrating-from-existing-projects)

