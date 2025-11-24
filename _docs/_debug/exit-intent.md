---
description: Track issues related to exit-intent modals and gating logic
globs: src/hooks/useExitIntent.ts, src/components/ui/intent-modal.tsx
alwaysApply: false
---

- **Exit Intent UI Clipping**
	- The original implementation of `useExitIntent` caused odd viewport clipping and lazy-loaded sections to jump when the modal mounted.
	- The fix is to gate exit-intent detection behind the `NEXT_PUBLIC_ENABLE_EXIT_INTENT` flag (defaults to `false`) so the hook does not attach listeners unless explicitly enabled.
	- When enabling the feature, QA the modal in conjunction with lazy-loaded content to confirm there is no clipping regression.
	- Keep the modal tone/overlay consistent with the new `IntentModal` UX to reduce perceived layout flicker.
	- A short snooze window can be configured via `NEXT_PUBLIC_EXIT_INTENT_SNOOZE_MS` (milliseconds) to prevent the modal from reopening immediately after dismissal.
	- Turn on `NEXT_PUBLIC_EXIT_INTENT_DEBUG=true` to surface full console logging from the boundary and the vendored hook when diagnosing edge cases.


