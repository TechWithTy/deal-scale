# Magic UI iPhone Layout Regression

## Summary
- **Issue:** The phone shell inside `CallDemoShowcase` intermittently disappeared or flashed, especially on larger breakpoints.
- **Impact:** The hero section lost its primary visual cue; the embedded video/text demo felt broken and unclickable.
- **Fix:** Reintroduced a persistent wrapper (`PhoneShell`) with deterministic sizing, aligned marketing copy across components, and eliminated placeholder overlays.

## Timeline
1. Users reported the phone frame flashing or staying invisible after a deployment.
2. Inspection of the DOM revealed that the `PhoneShell` wrapper classes were missing in production builds, leaving only the dark SVG frame from `Iphone`.
3. A fallback thumbnail (`/placeholder.svg`) continued to render underneath the phone despite `showThumbnails={false}`.
4. The inner `<Iphone>` relied on `max-w-[26rem]`, but without an outer width constraint the element collapsed to `0 × 0` during hydration.
5. Implemented wrapper width constraints, switched `Iphone` to `className="w-full"`, and reused outreach copy constants to avoid drift.
6. Re-ran unit tests and verified in browser—phone now renders instantly with consistent halo.

## Root Cause Analysis
- Tailwind’s purge stripped custom classes such as `rounded-[3.25rem]` and `shadow-[0_35px_80px_rgba(15,23,42,0.55)]` because they only lived in `PhoneShell`. Without that wrapper the dark SVG frame blended into the hero gradient.
- The `LayoutGrid` card forced `baseCardClassName="bg-transparent"`, removing the default glass panel intended to highlight the frame.
- The phone column lacked an explicit width, so hydration started at zero width until layout stabilized. This manifested as flicker or complete invisibility depending on timing.
- A legacy thumbnail layer (`/placeholder.svg`) still mounted beneath the phone, causing a white flash during reflow.

## Fix Implementation
- Updated `PhoneShell`:
  - `className="relative w-full max-w-[22rem] … md:max-w-[26rem] …"`
  - Preserved halo, shadow, and ring classes so the phone stands out even on dark backgrounds.
- Adjusted all `<Iphone>` usages to `className="w-full"` so the wrapper governs width.
- Ensured `LayoutGrid` call uses `showThumbnails={false}` and retains `baseCardClassName="bg-transparent"` with proper formatting.
- Synced hero copy with `AI_OUTREACH_STUDIO_*` constants to prevent mismatched text between sections.

## Testing & Verification
- `pnpm exec jest src/components/home/__tests__/CallDemoShowcase.test.tsx`
  - Confirms renders, mode switching, and timed animations still pass.
- Manual QA (desktop + mobile):
  - Reload page → phone frame persists from first paint.
  - Call/Text toggles operate inside the phone without flicker.
  - No `/placeholder.svg` network requests.

## Follow-up Recommendations
- Safelist critical Tailwind classes (e.g., `rounded-[3.25rem]`, `shadow-[0_35px_80px_rgba(15,23,42,0.55)]`) in `tailwind.config` to avoid future purges.
- Consider extracting `PhoneShell` into a shared UI module so multiple sections can reuse it and tests can target a single component.
- Add a visual regression test for the hero section to catch future layout regressions automatically.















