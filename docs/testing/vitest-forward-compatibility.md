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
