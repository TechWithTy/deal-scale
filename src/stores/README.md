# Data module stores

The `generate-data-manifest` script keeps `src/data` modules and Zustand stores in sync.

- Run `pnpm run generate:data` (internally executes `pnpm exec tsx tools/data/generate-data-manifest.ts`) whenever files inside `src/data` are added, renamed, or removed.
- The generator ignores modules whose filename starts with `_`, normalizes `index.ts(x)` files to their parent folder key, and emits updated outputs in:
  - `src/data/__generated__/manifest.ts`
  - `src/data/__generated__/modules.ts`
  - `src/stores/__generated__/dataStores.ts`
- Both outputs are committed to the repository so production builds can statically import the modules without using the filesystem.
- Generated stores call `createDataModuleStore` from `src/stores/useDataModuleStore.ts`, which handles memoization, loading state, and error propagation.

When working on tests, import and call `clearDataModuleStores()` to reset memoized stores between cases.
