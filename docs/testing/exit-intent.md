---
title: Exit Intent Coverage
description: Behavioural tests and configuration notes for the Deal Scale exit intent modal.
---

# Exit Intent Boundary Tests

- The exit intent logic is centralised in `src/components/exit-intent/ExitIntentBoundary.tsx`. It wraps designated routes (`/`, `/contact`, `/contact-pilot`, `/affiliate`, `/pricing`, `/products/[slug]`) and registers trigger/unsubscribe handlers with the vendored `use-exit-intent` hook (`@external/use-exit-intent`).
- Vitest + React Testing Library coverage lives in `src/components/exit-intent/__tests__/ExitIntentBoundary.test.tsx`.
  - Each variant asserts the correct headline/body copy and CTA labels.
  - `Keep exploring` closes the dialog and calls `resetState()` to re-arm the hook.
  - Secondary CTAs trigger `unsubscribe()` which persists the `deal-scale-exit-intent` cookie and suppresses future prompts.
- Targeted pages import the boundary directly so server and client components continue to render as before while gaining the exit intent behaviour.

# Cookie & Handler Expectations

- The boundary boots the hook with a shared cookie key (`deal-scale-exit-intent`) and variant-specific desktop delays. `@external/use-exit-intent` manages the persistence; tests verify that `unsubscribe()` is invoked, ensuring the cookie is written.
- Handlers are registered with explicit contexts:
  - `exit-intent-{variant}-trigger` listens on `onTrigger`, `onDesktop`, and `onMobile`.
  - `exit-intent-{variant}-unsubscribe` listens on `onUnsubscribe` to close the modal when the cookie check short-circuits future triggers.

# Adding New Variants

- Extend `EXIT_INTENT_COPY` and (optionally) `VARIANT_SETTINGS` in `ExitIntentBoundary.tsx`.
- Add route-level integration by wrapping the page/client component in `ExitIntentBoundary`.
- Update the Vitest suite to include the new variant to guarantee copy, handler, and cookie behaviour remain covered.




