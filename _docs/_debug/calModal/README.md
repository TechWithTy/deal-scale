# Calendly Modal Integration Debugging & Remediation Plan

## Problem Summary
Attempts to integrate Calendly modal (using both CalButton and custom handler approaches with @calcom/embed-react) have failed:
- **CalButton approach**: The modal does not open when the button is clicked, despite correct usage per documentation.
- **Custom handler approach**: Using `getCalApi()` and `cal('open', ...)` either throws errors or does not open the modal as expected.
- **Legacy data attributes (`data-cal-link`, `data-cal-config`)**: These do not work with the current embed package or Next.js setup.

## Observed Symptoms
- Button renders, but no modal appears on click.
- No errors in the console, or errors related to iframe/modal lifecycle.
- Attempts to use refs or `useCal` hook do not resolve the issue.

## Root Causes (Suspected)
- **SSR/CSR mismatch**: Calendly embed scripts may not be initializing correctly in Next.js App Router (React 18+), especially with SSR/CSR boundaries.
- **Script loading order**: The Calendly embed script may not be loaded before the button is clicked.
- **Container/iframe not present**: The required DOM node or iframe is not present or not correctly targeted.
- **Version mismatch or breaking changes**: The @calcom/embed-react package may have breaking changes or require additional setup not covered by docs.
- **Conflict with Next.js Fast Refresh or strict mode**.

---

## Remediation Plan

### 1. **Research & Confirm Working Integration**
- Review latest @calcom/embed-react documentation and issues.
- Check for breaking changes, required peer dependencies, or Next.js-specific caveats.
- Find a minimal working example (in plain React and in Next.js).

### 2. **Script Loading Debug**
- Ensure Calendly embed script is loaded **once** and before any API calls or button clicks.
- If necessary, load the script manually in a custom `_app.tsx` or via `next/head`.

### 3. **SSR/CSR Boundary Isolation**
- Move all Calendly-related code into a dynamic import with `ssr: false` to guarantee client-only execution.
- Example: `const ScheduleMeeting = dynamic(() => import('./ScheduleMeeting'), { ssr: false })`

### 4. **Minimal Working Example**
- Create a new page/component using only the minimal CalButton (or inline embed) in isolation.
- Test outside of the main app shell to rule out layout or context issues.

### 5. **Error Logging & Diagnostics**
- Add explicit error logging for all Calendly API calls, script loads, and button clicks.
- Use browser dev tools to confirm the presence of the Calendly script and iframe.

### 6. **Fallback/Alternative**
- If the official embed package is broken, consider using the vanilla Calendly embed script (as per their official docs) via a custom `<script>` tag and manual modal invocation.

---

## Next Steps (Action Items)
1. [ ] Create a minimal, client-only component using CalButton and test with dynamic import (`ssr: false`).
2. [ ] If still broken, try loading the Calendly script manually and invoking the modal via window.Calendly.
3. [ ] Document findings and update this file with working code and/or issues discovered.
4. [ ] If a workaround is found, refactor the main ScheduleMeeting component to use the working approach.

---

## References
- [@calcom/embed-react GitHub](https://github.com/calcom/embed)
- [Calendly Embed Docs](https://help.cal.com/en/articles/7868472-embed-cal-com-in-your-website)
- [Next.js Dynamic Imports](https://nextjs.org/docs/pages/building-your-application/optimizing/dynamic-imports)

---

*This file will be updated as debugging progresses. See code comments and commit history for more details.*
