# Generated Data Modules & Zustand Stores

This guide explains how Deal Scale's code-generation pipeline surfaces the content that lives under `src/data/**` and how to consume it through the shared Zustand tooling. Keep this document nearby whenever you add, rename, or remove files in `src/data`.

## Key Artifacts

The generator (`pnpm run generate:data`) produces three TypeScript entry points:

| File | Purpose |
| --- | --- |
| `src/data/__generated__/manifest.ts` | Authoritative list of allowed data modules. Each key exposes a typed `loader()` that performs a dynamic `import(...)`. |
| `src/data/__generated__/modules.ts` | Synchronously imported module namespaces. Helpful for build-time scripts, migrations, or Storybook fixtures that cannot await a loader. |
| `src/stores/__generated__/dataStores.ts` | Pre-wired Zustand stores that wrap every manifest entry by calling `createDataModuleStore(key)`. |

> *All three files must remain checked into git so PRs review regenerated output alongside source changes.*

## Regeneration Workflow

1. Modify or create any file in `src/data/**` whose basename does **not** start with `_`.
2. Run `pnpm run generate:data` from the repo root. This command executes `tools/data/generate-data-manifest.ts` via `tsx` so path resolution works on macOS, Linux, and Windows.
3. Commit the updated generated files together with your source edits.
4. Execute `pnpm exec jest src/data/__tests__/generate-data-manifest.test.ts src/stores/__tests__/useDataModuleStore.test.ts --runInBand` to confirm the manifest and store behaviours still pass on your platform.

> ! If you skip the regeneration step, Next.js will crash at runtime because `createDataModuleStore` refuses to load unknown keys.

## Typical Usage Patterns

### 1. Lazy client-side data (default)
Use the manifest-driven stores for UI that should load data when a component renders on the client.

```tsx
import { useDataModule } from '@/stores/useDataModuleStore';

function Hero() {
  const { status, data, error } = useDataModule('about/hero');

  if (status === 'loading') return <Skeleton />;
  if (status === 'error') return <ErrorState details={error} />;
  return <HeroSection {...data} />;
}
```

`useDataModule` automatically kicks off `loader()` the first time the component mounts and memoises the Zustand store between re-renders.

### 2. Server-side or build-time data
The synchronous map exported by `modules.ts` is ideal for scripts, seeders, or build steps that cannot run inside React hooks.

```ts
import { dataModules } from '@/data/__generated__/modules';

const heroModule = dataModules['about/hero'];
console.log(heroModule.copy.headline);
```

Because every module is imported statically, bundlers can tree-shake and type-check the content without awaiting promises.

### 3. Custom selectors & derived state
`useDataModule` accepts an optional selector to keep re-renders scoped to the data you need.

```tsx
const headline = useDataModule('about/hero', (state) => state.data?.copy.headline ?? '');
```

Combine selectors with equality functions if you need fine-grained memoisation.

### 4. Manual cache management
If you edit data during runtime (e.g., inside Storybook controls) call `clearDataModuleStores()` to destroy memoised stores before reloading a story.

```ts
import { clearDataModuleStores } from '@/stores/useDataModuleStore';

clearDataModuleStores();
```

## Edge Cases & Safeguards

- **Unknown Keys:** `createDataModuleStore` throws a descriptive error when the key does not exist in `dataManifest`. This protects against stale imports.
- **Duplicate Filenames:** The generator fails fast if two files collapse to the same manifest key (e.g., `foo/index.ts` and `foo.ts`). Resolve conflicts before rerunning.
- **Underscore Prefix:** Files starting with `_` are ignored intentionally so you can keep WIP data without polluting production builds.
- **Concurrent Loads:** Zustand caches the in-flight promise, so multiple components requesting the same module share one network/disk fetch.

## Idle/loading guard checklist

- Treat both `status === "idle"` and `status === "loading"` as non-rendering phases. Show skeletons or placeholder copy until the store resolves to `"ready"`.
- When `status === "error"`, log a namespaced console error (e.g., `[CaseStudyGrid] Failed to load …`), surface a friendly message, and avoid reading from `state.data`.
- For `status === "ready"` without data, render a “coming soon” placeholder so prerendered routes never crash on undefined collections.
- Emit telemetry for these fallbacks by calling `useDataModuleGuardTelemetry({ key, surface, status, hasData, error })`. The hook reports into `/api/internal/data-guards`, enabling dashboards to spot chronic loading or error states in production.
- Include stable `detail` fields (like `{ segment: "trusted-companies" }`) when reporting so downstream alerts can filter by surface.

## Contributing Checklist

- [ ] Update or add data files under `src/data/**`.
- [ ] Run `pnpm run generate:data`.
- [ ] Commit regenerated `manifest.ts`, `modules.ts`, and `dataStores.ts`.
- [ ] Re-run the targeted Jest suites.
- [ ] Document any non-obvious module shapes in `_docs/_business/zustand`.

Maintaining this workflow keeps the data layer deterministic across local development, CI, and production deployments.
