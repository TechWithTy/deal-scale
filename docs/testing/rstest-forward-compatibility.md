# Rstest Forward Compatibility Plan

This document captures the strategy for introducing **@rstest/core** alongside our existing Vitest infrastructure. The aim is to make the repository “rstest-ready” without disrupting the current Vitest/Jest workflows, then graduate the suites once parity is reached.

---

## 1. Goals & Non-goals

**Goals**
- Ensure developers can opt in to Rstest while Vitest remains the primary runner.
- Provide a drop-in story for Jest-to-Rstest migrations (mirrors the work we did when enabling Vitest).
- Keep configuration, helpers, and documentation aligned so we can run either runner per suite while the migration is in flight.

**Non-goals**
- Replacing Vitest immediately. We will run both test runners until Rstest coverage and stability match Vitest.
- Re-introducing the legacy Jest adapter. The forward-compatibility work should reuse the existing test helpers and mocks.

---

## 2. High-level Roadmap

| Phase | Objective | Key Deliverables |
| ----- | --------- | ---------------- |
| Phase 1 | **Bootstrap Rstest** | Install dependencies, add baseline config/scripts, document dual-runner workflow. |
| Phase 2 | **Share Foundations** | Reuse Vitest setup (polyfills, mocks, helpers) by abstracting per-runner differences. |
| Phase 3 | **Pilot Suites** | Convert a small slice of tests to Rstest, verify CLI parity, add guardrails (debugging, profiling). |
| Phase 4 | **Gradual Migration** | Expand coverage, add CI entry point, keep docs/tests consistent, monitor flakiness. |

---

## 3. Phase 1 – Bootstrap Rstest

1. **Dependencies & Scripts**
   - `pnpm add -D @rstest/core`
   - Update `package.json`:
     ```json
     {
       "scripts": {
         "test:rstest": "rstest run",
         "test:rstest:watch": "rstest watch",
         "test:rstest:list": "rstest list"
       }
     }
     ```
   - Keep existing Vitest scripts; Rstest is an additive path.

2. **Starter Config**
   - Add `rstest.config.ts`:
     ```ts
     import { defineConfig } from "@rstest/core";

     export default defineConfig({
       globals: true,
       include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
       exclude: [
         "**/node_modules/**",
         "**/dist/**",
         "**/.{git,cache,temp,idea}/**",
         "**/.taskmaster/**"
       ],
       testEnvironment: "jsdom",
     });
     ```
   - Mirror important Jest/Vitest aliases via `resolve.alias` (see Phase 2).

3. **Docs & Onboarding**
   - Update `docs/testing/README.md` (or equivalent) with instructions:
     - `pnpm run test:rstest`
     - How to use watch/List/Run commands.
     - Mention Node 18+ requirement per upstream guide.

---

## 4. Phase 2 – Share Foundations

1. **Unify Setup Files**
   - Extract shared polyfills (fetch, Request, Headers), global React exposure, analytics stubs into `src/testHelpers/runtime/common.ts`.
   - Create runner-specific entry points:
     - `vitest.setup.ts` imports common helpers + Vitest-specific bits (`vi.mock`, timers).
     - `rstest.setup.ts` imports common helpers + Rstest equivalents (`rstest.mock`, `rstest.fn`, etc.).
   - Register `setupFiles` in both configs:
     ```ts
     // rstest.config.ts
     export default defineConfig({
       globals: true,
       setupFiles: ["./rstest.setup.ts"],
       // ...
     });
     ```

2. **Alias Shared Stubs**
   - Reuse the stub files created for Vitest:
     - `tests/stubs/server-only.ts`
     - `tests/stubs/plausible.ts`
     - `tests/stubs/posthog.ts`
   - Add to `rstest.config.ts`:
     ```ts
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
         "server-only": path.resolve(__dirname, "./tests/stubs/server-only.ts"),
         "@plausible-analytics/tracker": path.resolve(__dirname, "./tests/stubs/plausible.ts"),
         "posthog-js": path.resolve(__dirname, "./tests/stubs/posthog.ts"),
       },
     }
     ```

3. **Testing Library / DOM Environment**
   - Ensure `@testing-library/jest-dom` is imported inside `rstest.setup.ts`.
   - Confirm jsdom is set via `testEnvironment: "jsdom"` for DOM-based suites.

---

## 5. Phase 3 – Pilot Suites

1. **Choose Candidate Suites**
   - Start with light-weight unit tests (utilities, stores) before targeting component tests that rely on heavy mocks.
   - Add `pnpm run test:rstest -- project-name-or-pattern` to run the pilot suite only.

2. **Port Test APIs**
   - Replace per-file imports:
     ```diff
     - import { describe, it, expect, vi } from "vitest";
     + import { describe, it, expect, rstest } from "@rstest/core";
     ```
   - Introduce helper functions in `src/testHelpers/runtime/rstest.ts`:
     ```ts
     export const mock = rstest.mock;
     export const spyOn = rstest.spyOn;
     export const fn = rstest.fn;
     ```

3. **Address API Differences**
   - `jest.setTimeout` equivalent → `rstest.setConfig({ testTimeout: ... })`.
   - Remove `done` callbacks; rely on `async/await`.
   - Update timers: `jest.useFakeTimers` → `rstest.useFakeTimers`.

4. **Debugging & Profiling**
   - Document debug mode (`DEBUG=rstest pnpm run test:rstest`).
   - Provide `.vscode/launch.json` snippet (from official guide) for debugging individual files.
   - Include Rsdoctor profiling instructions (see Section 8 below).

---

## 6. Phase 4 – Gradual Migration

1. **Dual-runner Strategy**
   - For each suite migrated to Rstest, keep the Vitest version runnable until stability is confirmed.
   - Track progress in Taskmaster (create new subtasks per suite/module).

2. **CI Integration**
   - Add a CI job `pnpm run test:rstest` with `--passWithNoTests` initially, so it passes while coverage is partial.
   - Increase scope by directory patterns once suites convert.

3. **Docs & Training**
   - Update `docs/testing/vitest-forward-compatibility.md` with Rstest cross-links.
   - Host a paired list of common API swaps and config differences (see Appendix A below).

4. **Remove Redundancy**
   - Once all suites run under Rstest, decide whether Vitest should remain as secondary runner or be phased out.
   - Update `package.json` scripts, docs, and CI accordingly.

---

## 7. Tooling Enhancements

- **Debug Mode**: Encourage `DEBUG=rstest pnpm run test:rstest` when investigating build issues; note the generated files under `dist/.rsbuild/`.
- **VS Code Debugging**: Provide ready-made launch configuration (as documented above).
- **Filter commands**: Document `rstest list`, `rstest watch`, `rstest run` to mirror developer expectations from Jest/Vitest.

---

## 8. Profiling & Rsdoctor

1. **Enable Rsdoctor**:
   ```json
   {
     "scripts": {
       "test:rsdoctor": "cross-env RSDOCTOR=true rstest run"
     },
     "devDependencies": {
       "cross-env": "^7.0.0",
       "@rsdoctor/rspack-plugin": "^<latest>"
     }
   }
   ```
   - Running `pnpm run test:rsdoctor` opens the build analysis page.

2. **CPU Profiling (Samply)**
   - Document the official command for macOS/Linux:
     ```bash
     samply record -- node --perf-prof --perf-basic-prof --interpreted-frames-native-stack node_modules/@rstest/core/bin/rstest.js run
     ```
   - Mention Node.js 22.16+ requirement on macOS for Node-side profiling.

---

## 9. Appendix A – Jest ↔ Rstest Quick Reference

| Jest API / Config | Rstest Equivalent |
| ----------------- | ----------------- |
| `jest.fn()` | `rstest.fn()` |
| `jest.mock()` | `rstest.mock()` |
| `jest.spyOn()` | `rstest.spyOn()` |
| `jest.useFakeTimers()` | `rstest.useFakeTimers()` |
| `jest.setTimeout()` | `rstest.setConfig({ testTimeout: ... })` |
| `setupFilesAfterEnv` | `setupFiles` |
| `moduleNameMapper` | `resolve.alias` |
| `collectCoverage` | `coverage.enabled` |

For full mappings, consult the official [Migrating from Jest](https://rstest.rs/guide/start/quick-start#migrating-from-jest) guide.

---

## 10. Taskmaster Tracking Suggestions

- `TM-001`: Bootstrap Rstest (deps, scripts, base config, docs).
- `TM-002`: Extract shared setup (common polyfills, analytics mocks, alias parity).
- `TM-003`: Pilot migration (select 3 suites across utils/components/tests).
- `TM-004`: Enable Rstest in CI (non-blocking initially).
- `TM-005`: Convert remainder of suites and deprecate Vitest if/when appropriate.

---

By following the phased approach above, we maintain testing continuity while gaining access to Rstest’s Rstack ecosystem, multi-project support, and Rsdoctor integration—all without regressing the stability we achieved with the Vitest forward-compatibility work. Adjust the scope per sprint, and keep documentation synchronized so future migrations stay frictionless.



