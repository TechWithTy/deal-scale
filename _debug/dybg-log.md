# Debug Log

## Summary
- Tracking Vercel build regressions for branch `codex/update-type-inference-in-usedatamodulestore`.
- Both recorded attempts completed dependency installation and Next.js compilation but failed during type checking in `src/stores/useDataModuleStore.ts`.

## What Worked
- `pnpm install --no-frozen-lockfile` executed successfully during cache restore and build phases for both attempts.
- Next.js `next build` compiled application bundles without runtime compilation errors before type checking.
- Jest unit suite (`pnpm exec jest src/stores/__tests__/useDataModuleStore.test.ts`) passed locally, confirming runtime store behavior under mocked manifest entries.

## What Didn't Work
- **Attempt 1 – Commit e14dbb6 (04:36 UTC build window):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:53:31`. Casting `dataManifest[key]` to `DataManifestEntry<K>` widened the `key` literal to unrelated entries, breaking assignability.
- **Attempt 2 – Commit b756f92 (07:17 UTC build window):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:67:45`. The loader result remained typed as `typeof import("/src/data/medium/post")`, which TypeScript refused to assign to `DataModuleModule<K>` while updating the store in the `.then` branch.
- **Attempt 3 – Commit d2d0516 (11:29 UTC build window):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:72:47`. Even after narrowing the manifest entry, the resolved module still surfaced as `typeof import("/src/data/medium/post")` when stored, leaving the Zustand `set` call unable to accept it as `DataModuleModule<K>`.
- **Attempt 4 – Commit 3f6cd5d (latest report):** TypeScript type checking failed with TS2322 at `src/stores/useDataModuleStore.ts:37:9` while returning from the `loadModule` helper. Although the loader was typed, the awaited module value widened to the specific import and could not satisfy `DataModuleModule<K>`.
- **Attempt 5 – Working tree (current run):** Build progressed past type-checking after restructuring the loader handling but failed when Next.js attempted to download Google Fonts (`JetBrains Mono`, `Manrope`) in the restricted environment.

## Follow-up Actions
- Replace the direct cast on `dataManifest[key]` with a helper that returns `DataManifestEntry<K>` to preserve key-specific loader types.
- Ensure the loader's resolved value is inferred as `DataModuleModule<K>` before passing it into Zustand's `set` callback.
- Re-run `pnpm run build` after applying the fixes to confirm type checking passes.
