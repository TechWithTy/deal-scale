# Debug Log – useDataModule selector thrashing

## Context
- Environment: local Next.js dev server + production build (`pnpm run build`).
- Surface: `src/components/home/Services.tsx` using the `service/services` data module.
- Error signature: `The result of getServerSnapshot should be cached to avoid an infinite loop` followed by React `Maximum update depth exceeded` crashes.

## Findings
1. The telemetry traces confirmed the services selector kept emitting guard transitions without network retries, implying the issue was local state churn.
2. Profiling showed `useStoreWithEqualityFn` returning new selector objects on every render because our hook forwarded the raw selection directly.
3. When React re-ran `getServerSnapshot` during hydration, it received a new object each time and retriggered the fallback guard, leading to an infinite loop.

## Fix Summary
- Cache the last stable selector value inside `useDataModule` and only swap it when the provided equality function reports a genuine change.
- Extend the `useDataModule` regression suite to assert the cached snapshot is reused after passive re-renders.

## Verification
- `pnpm exec jest src/stores/__tests__/useDataModuleStore.test.tsx --runInBand`
