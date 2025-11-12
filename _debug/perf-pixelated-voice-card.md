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
