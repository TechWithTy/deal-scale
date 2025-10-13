# Hero Offering Debug Log

## Context
We are tracking ongoing attempts to prevent the HeroOffering section from stretching edge-to-edge on narrow devices while maintaining SSR/CSR markup parity and respecting the landing page container system.

## Attempt History

### Attempt 1 — Remove `useIsMobile` hook (Commit: remove mobile hook)
- **Change:** Replaced the runtime `useIsMobile` check with Tailwind responsive spacing classes.
- **Result:** Hydration mismatch resolved, but hero still expanded to the full viewport width on mobile.

### Attempt 2 — Responsive padding refinements
- **Change:** Added explicit responsive padding/min-height Tailwind utilities to align SSR and CSR markup.
- **Result:** Layout remained stretched on narrow screens; padding adjustments alone were insufficient.

### Attempt 3 — Constrain wrapper width with responsive `max-w-*`
- **Change:** Introduced responsive `max-w` utilities on the hero wrapper to mirror other sections.
- **Result:** Desktop layout matched expectations, but mobile devices still rendered the hero at full viewport width.

### Attempt 4 — Instrument layout metrics
- **Change:** Added refs to the container/media/image wrappers and development-only `console.debug` output capturing widths, heights, and viewport dimensions. Updated Jest coverage accordingly.
- **Result:** Metrics confirm the container respects `max-w-screen-xl`, yet on devices <=360px the image wrapper still scales to the viewport. Further investigation needed into surrounding layout context (e.g., parent flex/grid constraints).

### Attempt 5 — Trace parent chain & computed styles
- **Change:** Expanded the debug payload with computed style snapshots (box sizing, margins, padding, `max-width`) and a parent chain audit so each ancestor's width and padding can be compared against the hero container at runtime. Timestamped log entries for easier correlation with screenshots.
- **Result:** Early console output still shows 100% width propagation from upstream layout nodes. Awaiting fresh mobile captures to isolate which parent is forcing the stretch.

### Attempt 6 — Narrow base container max-width
- **Change:** Reduced the hero container's base `max-width` to `max-w-[18rem]` while keeping wider breakpoints for tablets/desktops so the section centers on small screens without stretching edge-to-edge.
- **Result:** Mobile devices still rendered the hero full-bleed despite the tighter `max-width`, indicating upstream flex alignment was overriding the constraint.

### Attempt 7 — Adjust flex alignment to prevent stretching
- **Change:** Removed the default `w-full` stretch by switching the wrapper to `w-auto` on mobile, adding `self-center`, and only re-introducing `md:w-full` so the hero can shrink to its intrinsic width on narrow screens while filling space on larger breakpoints.
- **Result:** Mobile capture still shows the hero card stretched to the viewport edges. The parent flex column appears to enforce a 100% width despite the wrapper's intrinsic sizing.

### Attempt 8 — Introduce `w-fit` / `max-w-full` sizing strategy (Current change)
- **Change:** Reworked the hero container, media wrapper, and image wrappers to use `w-fit` + `max-w-full` so they shrink-wrap their contents on mobile, while promoting to `md:w-full` and `md:max-w-none` for tablet/desktop. Image sizing now relies on `w-auto` with progressive `max-w-*` caps.
- **Result:** Pending—requires fresh device validation to confirm the inline-fit approach finally prevents the full-width stretch.

## Next Steps
- Capture live screenshots (mobile & tablet) to correlate visual output with logged metrics.
- Audit parent layout styles to determine whether upstream containers force full-width stretching.
- Monitor updated layout to confirm the narrower base `max-width` resolves the stretching; if issues persist, continue auditing ancestor containers.

