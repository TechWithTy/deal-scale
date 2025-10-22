# Debug Log

## Summary
- Tracking Vercel build regressions for branch `codex/update-type-inference-in-usedatamodulestore`.
- Earlier builds failed during type checking in `src/stores/useDataModuleStore.ts`; the latest run clears type checks but still cannot download required Google Fonts during `next build`.

## What Worked
- `pnpm install --no-frozen-lockfile` executed successfully during cache restore and build phases for both attempts.
- Next.js `next build` compiled application bundles without runtime compilation errors before type checking.
- Jest unit suite (`pnpm exec jest src/stores/__tests__/useDataModuleStore.test.ts`) passed locally, confirming runtime store behavior under mocked manifest entries.
- Latest iterations clear TypeScript validation for `src/stores/useDataModuleStore.ts` locally before the font download failure occurs.

## What Didn't Work
- **Attempt 1 – Commit e14dbb6 (04:36 UTC build window):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:53:31`. Casting `dataManifest[key]` to `DataManifestEntry<K>` widened the `key` literal to unrelated entries, breaking assignability.
- **Attempt 2 – Commit b756f92 (07:17 UTC build window):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:67:45`. The loader result remained typed as `typeof import("/src/data/medium/post")`, which TypeScript refused to assign to `DataModuleModule<K>` while updating the store in the `.then` branch.
- **Attempt 3 – Commit d2d0516 (11:29 UTC build window):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:72:47`. Even after narrowing the manifest entry, the resolved module still surfaced as `typeof import("/src/data/medium/post")` when stored, leaving the Zustand `set` call unable to accept it as `DataModuleModule<K>`.
- **Attempt 4 – Commit 3f6cd5d (latest report):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:37:9` while returning from the `loadModule` helper. Although the loader was typed, the awaited module value widened to the specific import and could not satisfy `DataModuleModule<K>`.
- **Attempt 5 – Commit 267b5f0 (16:37 UTC build window):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:35:9`. Returning the loader promise directly preserved the literal import type (`typeof import("/src/data/medium/post")`), which the compiler still refused to treat as `DataModuleModule<K>`.
- **Attempt 6 – Working tree (current run):** Type checking now succeeds, but `next/font` cannot download Google Fonts (`JetBrains Mono`, `Manrope`) inside the build environment, causing `next build` to exit with webpack errors.
- **Attempt 7 – Working tree (subsequent run):** Loader typing remains stable, yet `next build` still aborts while trying to fetch the same Google Fonts, blocking the pipeline before post-build scripts run.

## Follow-up Actions
- Monitor the next Vercel build to confirm the loader typing helpers keep `DataModuleModule<K>` inference intact.
- Provide an offline fallback or mock for `next/font` Google Fonts downloads so `next build` can complete in restricted environments.
