# Rspack Testing Cheatsheet

Even though Vitest handles the bulk of our unit/regression coverage, we expose `rsbuild`-powered scripts when we need to verify the preview surface with the same bundler that powers Rspack dev builds. This document shows you how to run each test target and how to troubleshoot common issues.

---

## Quick Commands

| Command | Purpose |
| --- | --- |
| `pnpm run test` | Runs the default Vitest suite (no preview flags). |
| `pnpm run test:critical` | Runs the curated critical Vitest subset for pre-commit. |
| `pnpm run test:rspack` | Seeds `.env.preview.local` with the `rspack:test` flag, then runs the standard Vitest suite so components pick up Rspack preview settings. |

> `test:rspack` does **not** invoke a separate runner; it simply ensures the preview env variables (set by `scripts/bundlers/ensure-preview-flag.ts`) match what the Rspack dev server uses.

---

## When to Use `test:rspack`

- Validating that shared components still render correctly when the preview env is active (e.g., imports resolved through `@app`, preview-specific shims).
- Investigating bugs that appear only in `pnpm run dev:rspack` but not in the default Next.js server.
- Running CI steps that should mimic the preview environment without booting a real browser.

If you just need the fastest unit suite, stick with `pnpm run test` or `pnpm run test:critical`.

---

## Environment Details

Running `pnpm run test:rspack` does the following:

1. Executes `pnpm exec tsx scripts/bundlers/ensure-preview-flag.ts rspack:test`.
   - Ensures `.env.preview.local` exists.
   - Sets `NEXT_PUBLIC_PREVIEW_BUNDLER=rspack:test` and `NEXT_PUBLIC_ENV=preview`.
2. Executes `pnpm run test:vitest` so every test reads the preview env via `envDir` hooks in our configs.

Because the runner is still Vitest, coverage reports, reporters, and CLI args behave exactly the same as the main `test` script.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| `Cannot resolve ../../src/index.css` | Legacy import paths from pre-app directory | Update the component/test to import `@app/globals.css` or the correct CSS module |
| `window.matchMedia is not a function` | DOM APIs missing in jsdom | Mock `matchMedia` in the test (see `_tests/setup/dom-mocks.ts`) |
| `[nuqs] adapter required` | nuqs hooks need a provider | Wrap the component with the nuqs adapter or mock the hook |
| `Test timed out in 5000ms` | Async hook never resolved | Increase Vitest timeout for that test or stub the async dependency |

If the issue only reproduces with `test:rspack`, check `.env.preview.local` for unexpected overrides.

---

## Related Docs

- `docs/RSPACK_PREVIEW.md`  How to run dev/build previews.
- `docs/CI-CD_SETUP.md`  Where `test:rspack` fits into the pipeline.
- `_tests/README.md` (if present)  Project-wide testing conventions.

