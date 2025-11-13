# Vitest Forward Compatibility Notes

## Context
- Jest-only globals (e.g. `jest.mock`, `jest.requireMock`, `jest.setTimeout`) caused Vitest to throw during environment setup.
- The previous bridge lived in `tests/setup/test-framework-adapter.ts`, pulled in CommonJS helpers, and crashed under Vitest with `ReferenceError: modulePath/specifier`.
- Component tests also lacked JSX transforms, so any file that `render()`ed JSX failed with `React is not defined` once Vitest started running.

## What Changed
- Deleted the Jest/Vitest shim at `tests/setup/test-framework-adapter.ts`.
- Replaced it with a lightweight adapter inside `vitest.setup.ts`:
  - Imports `vi`, `expect`, and other helpers from Vitest directly.
  - Wraps `vi.mock` so it records factory results and keeps `jest.requireMock()` working.
  - Provides no-op fallbacks for `jest.setTimeout` and other timer helpers while deferring to Vitest when available.
  - Leaves `jest.requireActual` unsupported (tests should import modules directly under Vitest).
- Enabled the React SWC plugin in `vitest.config.ts` (`plugins: [react()]`) so JSX compiles without a global `React` import.
- Raised the default Vitest timeout to 30s to match suites that previously called `jest.setTimeout(20000)`.

## Current Status
- Vitest now boots and executes tests instead of crashing during setup.
- Suites still fail where Jest-only APIs remain or where external integrations lack Vitest-aware mocks (e.g. SendGrid, Stripe, Cloudinary).
- JSX-related failures disappeared after enabling the React plugin.

## Follow-Up Checklist
- Replace `jest.doMock`, `jest.mocked`, and other unsupported helpers with their Vitest equivalents (`vi.doMock`, `vi.mocked`) or extend the shim further if absolutely necessary.
- Rework integration tests to stub external services without live network calls (SendGrid/Blogger/Stripe).
- Ensure modules flagged as `server-only` are only imported in server-side test contexts or mocked appropriately.
- Delete or update obsolete snapshots reported by Vitest.

---

# Migrating Jest Suites to the Vitest Configuration

The remainder of this guide documents the end-to-end process used to migrate the repository from Jest to Vitest. It is safe to apply the same checklist if new suites still rely on Jest helpers or if a feature branch re-introduces Jest dependencies.

## 1. Tooling & Dependencies

1. Remove the Jest toolchain from `package.json` (`jest`, `jest-environment-jsdom`, `ts-jest`, `@types/jest`, `jest-transform-stub`, and any Jest-only scripts).
2. Add Vitest dependencies if they are not already present: `vitest`, `@vitest/ui` (optional), `@vitejs/plugin-react-swc`, and `@testing-library/jest-dom` (still used for matchers).
3. Update the project scripts to point at Vitest:
   - `test:vitest`: `vitest run`
   - `test:watch`: `vitest watch`
   - Remove or repoint any `pnpm test` scripts that previously called `jest`.

## 2. Shared Test Configuration

1. Create `vitest.config.ts` at the repo root with the following baseline:
   ```ts
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react-swc";
   import path from "node:path";

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: "jsdom",
       setupFiles: ["./vitest.setup.ts"],
       testTimeout: 30_000,
       include: ["**/?(*.)+(spec|test).{js,ts,jsx,tsx}"],
       coverage: { provider: "v8" },
     },
     resolve: {
       alias: [
         { find: "@", replacement: path.resolve(__dirname, "./src") },
         {
           find: "server-only",
           replacement: path.resolve(__dirname, "./tests/stubs/server-only.ts"),
         },
         {
           find: "@plausible-analytics/tracker",
           replacement: path.resolve(__dirname, "./tests/stubs/plausible.ts"),
         },
         {
           find: "posthog-js",
           replacement: path.resolve(__dirname, "./tests/stubs/posthog.ts"),
         },
       ],
     },
   });
   ```
   Adjust or extend the alias list if additional global mocks are required.
2. Ensure `tsconfig.tests.json` lists `vitest/globals` in its `types` property and references the Vitest config in the `files` array so TypeScript understands the test environment.

## 3. Global Test Setup

1. Move all framework bootstrapping into `vitest.setup.ts`:
   - Import `dotenv/config` if environment variables are required during tests.
   - Polyfill Node-only APIs (e.g. `fetch`, `Request`, `Response`, `Headers`) using `node-fetch`.
   - Expose `React` on the global object so legacy tests that assume the React 17 transform continue working.
   - Register shared mocks with `vi.mock` for analytics providers, `server-only`, or other SSR-only modules.
   - Clean up resources (e.g. destroy agent pools) inside a global `afterAll`.
2. Delete the old adapter (`tests/setup/test-framework-adapter.ts`) and remove any direct imports of it from test files. The new setup file runs automatically as part of the Vitest boot process.

## 4. Test Suite Updates

1. Replace Jest globals with Vitest equivalents:
   - `jest.fn` → `vi.fn`
   - `jest.spyOn` → `vi.spyOn`
   - `jest.mock`/`jest.doMock` → `vi.mock`/`vi.doMock`
   - `jest.requireActual` → `await vi.importActual` or direct ES imports
   - `jest.requireMock` → reuse mocked exports returned by `vi.mock`
   - `jest.clearAllMocks`, `jest.resetAllMocks`, `jest.restoreAllMocks` → `vi.clearAllMocks`, etc.
   - `jest.useFakeTimers`/`jest.useRealTimers`/`jest.advanceTimersByTime` → identical `vi.*` helper calls.
2. Ensure mocks are registered before the target module is imported. In ESM/Vitest this often means hoisting `vi.mock(...)` calls to the top of the file and replacing `require` with dynamic `await import(...)`.
3. When runtime mocking is unavoidable (e.g. dynamic imports keyed off configuration), use `vi.hoisted(() => { ... })` to preserve hoisting semantics.
4. For SSR-sensitive libraries (Framer Motion, server components, analytics SDKs), add targeted module factories that stub out `useLayoutEffect`, animations, or network calls to eliminate warnings and flakiness.
5. Replace `jest.setTimeout` with `vi.setConfig({ testTimeout: ... })` or per-suite overrides (`test.setTimeout(...)`).

## 5. Shared Helpers & Stubs

Create (or update) reusable helpers under `src/testHelpers/vitest/` so suites do not have to duplicate boilerplate. Examples include:

- `analytics.ts` — centralizes mocks for Plausible/Posthog and exposes ready-to-use spies for assertions.
- `server-only.ts`, `plausible.ts`, `posthog.ts` (under `tests/stubs/`) — provide no-op modules that satisfy SSR-only imports.
- IntersectionObserver/window stubs — colocate inside helper files so component suites can reuse them via `import`.

## 6. Finishing Touches

1. Run `pnpm run test:vitest` until all suites pass. Address remaining failures with the conversion techniques above.
2. Remove leftover snapshot files created by Jest (`__snapshots__/*.snap`) once Vitest reports them as obsolete or regenerates new versions.
3. Update developer documentation (including this file) and the project README to point at the Vitest commands.
4. Consider adding CI hooks or pre-push scripts that run `pnpm run test:vitest` to keep contributors on the Vitest path.

## Troubleshooting

- **`vi.mock` factories not hoisting:** wrap the factory in `vi.hoisted(() => { ... })` or move the `await import` below the mocks.
- **`useLayoutEffect` warnings during SSR tests:** alias `react` to a module that swaps `useLayoutEffect` → `useEffect`, or mock offending components (e.g. `motion/react`) on a per-suite basis.
- **Third-party analytics SDKs failing to resolve:** ensure aliases in `vitest.config.ts` point to local stubs that call `vi.fn()`.
- **Modules that run only on the server (`server-only`):** point the alias to an empty stub so client-focused tests can import without throwing.

Following the steps above reproduces the exact migration performed in this repository and keeps Vitest in sync with Jest-era expectations without reintroducing the deprecated adapter.
