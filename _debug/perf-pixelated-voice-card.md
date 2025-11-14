# Pixelated Voice Clone Card Performance Debug Log

## Context
- Component: `PixelatedVoiceCloneCard` (home hero section)
- Issue: Canvas re-rendering whenever `HeroHeadline` flips, causing visual reset and heavy work on each cycle.
- Trigger: Hero headline carousel emits frequent state updates; previously lightweight child content hid the cost, new pixelated canvas exposes it.

## Reproduction Notes
1. Load the home page with `npm run dev` (Fast Refresh enabled).
2. Observe console logs (`HeroHeadline flip state`) firing on a timer.
3. Notice canvas resets in sync with the headline text even without direct interaction.

## Experiments & Outcomes

| Attempt | Description | Result |
|---------|-------------|--------|
| Lazy load via `next/dynamic` | Loaded the card with a skeleton placeholder. | Reduced initial load cost but canvas still re-rendered on hero flips. |
| IntersectionObserver + placeholder | Deferred canvas mount until in-view and kept it mounted afterward. | Stopped disappearance on scroll, but parent re-renders still ran canvas effect. |
| Audio preload "none" + explicit `load()` | Reduced audio cost; no impact on canvas re-renders. |
| `React.memo` | Memoized card to avoid prop-based rerenders. | Ineffective; parent still remounts the subtree because state lives above the memo boundary. |
| Dev Fast Refresh disable (manual test) | Temporary env change to mimic prod. | Confirms re-render frequency drops, but hero flip updates remain. |

## Root Cause
- `HeroHeadline` shares the same React tree as the pixelated card.
- Each flip in `HeroHeadline` triggers a render of `CallDemoShowcase`, recreating the dynamic import child.
- Memoization is insufficient because the parent still re-instantiates the component; the canvas effect re-initializes.

## Proposed Fixes
1. **Isolate component**: Move `PixelatedVoiceCloneCard` outside the hero carousel subtree (sibling section or portal). Keeps hero flips independent from canvas lifecycle.
2. **Imperative mount**: Convert canvas logic to run only on mount (store draw state in refs) so re-renders don’t rebuild the sample grid. Requires refactor to separate props from canvas creation or memoize expensive work.
3. **Global provider**: Mount card once in a provider or layout and toggle visibility via context so hero updates don’t touch the canvas.

## Next Steps
- Prototype option (1): render the card in a sibling `section` outside `CallDemoShowcase` or use `ReactDOM.createPortal`.
- If that fails, evaluate option (2) by caching the draw pipeline with refs and skipping re-computation unless src/props change.

## Risks & Edge Cases
- Moving the component may affect layout spacing; ensure CSS adjustments line up with design.
- Portals must preserve z-index and pointer events for the interactive canvas.
- Imperative canvas caching must handle prop changes (e.g., different `src` or tint colors) with explicit invalidation.

## References
- Source files: `src/components/ui/pixelated-voice-clone-card.tsx`, `src/components/home/CallDemoShowcase.tsx`, `src/components/ui/pixelated-canvas.tsx`.
- Related console logs: `HeroHeadline flip state`, `[useDataModule] COMPLETE for key: "bento/main"`.

---

### 2025-11-12 – Additional Investigation

- **Overlay memoization & telemetry**  
  Wrapped `PixelatedVoiceOverlay` in `React.memo` and added a development-only render counter (`console.debug`). Early local testing shows the overlay no longer re-renders on every hero flip; logs now appear only on first mount and every 25th render, confirming memoization is effective.

- **CTA layout stabilization**  
  Restructured the CTA buttons into a stacked layout (primary CTA row + “Real Estate Investor Cuts” chips). This eliminated width oscillation that previously nudged the canvas and contributed to perceived flicker during renders.

- **Prop-diff logging**  
  Added a dev-only diff logger that prints whenever overlay props change (`isInteractive`, `isPlaying`, `hasCustomImage`, `imageUploadError`). This should make it easier to correlate render spikes with state changes coming from the parent card.

- **Tilt transform off main React path**  
  Removed React state updates for the hero card tilt; transforms now apply via `requestAnimationFrame` directly on the DOM node. This should reduce overlay flicker when hovering because pointer movement no longer triggers full component re-renders.

- **Card render instrumentation**  
  Added matching render-count and diff logs to `PixelatedVoiceCloneCard` so we can see when upstream state toggles (e.g., text reveal hover, audio playback) still cause the entire card to render. Use these logs alongside overlay telemetry to detect remaining flicker sources.

- **Isolated debug route**  
  Added `/debug/components/pixelated-voice-clone-card` so we can profile the component without the hero carousel. Use this route to gather baseline render counts and compare behavior with the main home page.

- **Audio hosting fix**  
  Switched default before/after sources to the local `/calls/example-call-yt.mp3` asset so playback no longer fails due to CORS. Replace these with production clips when available.

- **Remaining hypothesis**  
  Canvas still repaints when props mutate (e.g., switching to interactive mode or custom images). Hovering the text-reveal card above the clone may also toggle shared state that bubbles down. Need to confirm whether hero flips or text reveal hover still trigger repaint by watching the new render logs.

- **Next debugging steps**  
  1. Capture a session recording while `HeroHeadline` rotates and while hovering the text reveal card to compare render logs. Home route in private window still flickers (debug route is stable), so capture both contexts.  
  2. If logs still spike, pursue Option (1) from earlier notes (isolate the card from the hero tree)—likely required for the home route.  
  3. Investigate caching within `PixelatedCanvas` so pointer effects persist across renders even if the parent re-renders.  
  4. Evaluate memoizing `TextRevealCard` usage or hoisting its hover state if logs show it is the primary trigger.  
  5. Profile home page in Performance tab to confirm whether hero carousel state or other layout shifts (e.g., text reveal hover) correlate with the flicker seen only on the root route.

---

### 2025-11-12 – Debug Route Playback Verification

- **Sequential audio hand-off confirmed**  
  Using `/debug/components/pixelated-voice-clone-card`, latest console trace shows `[PixelatedVoiceCloneCard] before track ended, starting after track` followed by the after-track completion message and the expected `stopPlayback` logs. Both `<audio>` elements now reuse the bundled `/calls/example-call-yt.mp3` source without CORS issues.

- **Overlay/card state stability**  
  `PixelatedVoiceOverlay` render counter remains at 25 with only `isPlaying` toggling, confirming the overlay stays memoized during comparison playback. Matching card telemetry reports `isInteractive`/`isLoadingAudio` transitions only once per playback cycle.

- **Next actions**  
  1. Replicate the same comparison flow on the home hero to verify no extra renders occur when the carousel is active.  
  2. Add a quick smoke test to ensure sequential playback continues to function if we swap the default MP3s.  
  3. Keep logging enabled until the home route stops flickering; use the debug route logs here as the “known good” baseline.

### 2025-11-12 – Home Route Flicker Fix

- **Dynamic import stabilized**  
  Relocating the `next/dynamic` call for `PixelatedVoiceCloneCard` to module scope prevented the card from being re-instantiated on every `CallDemoShowcase` render. Carousel copy updates (e.g., `HeroHeadline` flips, typing animation ticks) now leave the pixelated canvas mounted.

- **Regression guard**  
  Added `CallDemoShowcase.pixelated.test.tsx`, which mocks the heavy phone/typing subsystems and advances the text demo timer. The test now confirms the card render count stays constant, so future changes won't reintroduce the flicker.

- **Outstanding telemetry**  
  The home hero still emits numerous render warnings in tests due to timer-driven typing/monitor components (see `act` warnings above). These don’t affect the clone card anymore, but we should capture a production profile to double-check overall hero performance once we tame the testing noise.
