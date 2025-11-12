# Dynamic Hero Animation Control

## Overview

The dynamic hero on the DealScale landing page features rotating copy for the **problem**, **solution**, and **fear** phrases. Continuous rotation when the hero is off-screen wastes resources and can be visually distracting when the user returns to the hero mid-rotation. This document describes the implementation that pauses phrase animations when the hero scrolled out of view and resumes them once the section re-enters the viewport.

The primary responsibilities are split across:

- `LiveDynamicHeroDemoPage` – determines whether the hero is currently visible.
- `HeroHeadline` – renders the rotating copy and accepts an `isAnimating` flag.
- `useRotatingIndex` – shared hook that maintains the active index for each phrase track.

## LiveDynamicHeroDemoPage Visibility Tracking

Location: `src/components/home/heros/live-dynamic-hero-demo/page.tsx`

Key responsibilities:

1. Attach a `ref` (`heroRef`) to the hero container (`#investor-hero-top`).
2. Use `useInView` from `motion/react` to observe the intersection state with the viewport. The options ensure we treat the hero as “visible” while at least 35 % of it is on-screen and relax the bottom margin so the animation pauses slightly before the hero leaves the viewport:

   ```tsx
   const isHeroInView = useInView(heroRef, {
     amount: 0.35,
     margin: "0px 0px -20% 0px",
   });
   ```

3. Store the resolved value in local state (`isHeroAnimating`) where `undefined` defaults to `true` (SSR-safe).
4. Pass the flag to `HeroHeadline` through the `isAnimating` prop:

   ```tsx
   <HeroHeadline
     copy={LIVE_COPY}
     socialProof={LIVE_SOCIAL_PROOF}
     reviews={LIVE_SOCIAL_PROOF.reviews}
     personaLabel={PERSONA_LABEL}
     personaDescription={PERSONA_LABEL}
     isAnimating={isHeroAnimating}
   />
   ```

> **SSR note:** `useInView` only runs in the browser. Initial render still passes `true` so the server output is deterministic and avoids hydration mismatches.

## HeroHeadline API

File: `src/components/dynamic-hero/src/components/hero-headline.tsx`

`HeroHeadline` now supports a new optional prop:

```ts
interface HeroHeadlineProps {
  readonly isAnimating?: boolean; // defaults to true
}
```

The prop is forwarded to the hook that drives each rotation slot. The rest of the headline (chips, social proof, CTA copy) remains untouched, so existing consumers can adopt the change incrementally.

## Rotation Hook Behaviour

The `useRotatingIndex` hook encapsulates the timer logic for rotating through phrase arrays. Enhancements include:

- A third argument (`isActive`) that disables timers when `false`.
- Automatic timer cleanup whenever `isActive` toggles or the rotation array changes.
- Guard clauses that prevent modulo operations on empty arrays.
- State normalization when deactivated so the currently displayed index stays consistent.

### Implementation

```ts
export function useRotatingIndex(
  items: readonly string[],
  interval: number,
  isActive: boolean = true,
): number {
  const [index, setIndex] = useState(0);
  const length = items.length;

  useEffect(() => setIndex(0), [items]);

  useEffect(() => {
    if (length <= 1 || !isActive) {
      return;
    }
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % length),
      interval,
    );
    return () => clearInterval(timer);
  }, [interval, items, length, isActive]);

  useEffect(() => {
    if (!isActive) {
      setIndex((current) => current % Math.max(length, 1));
    }
  }, [isActive, length]);

  return length === 0 ? 0 : index % length;
}
```

## Testing Strategy

Two layers of Jest coverage guarantee the behaviour never regresses:

1. **Component-level test** – `HeroHeadline` is rendered with `isAnimating={false}` and `isAnimating={true}` while spying on `setInterval` to confirm timers are only scheduled in the latter case.
2. **Hook harness** – Renders a tiny component that exposes the current value of `useRotatingIndex`. Fake timers ensure the index stays static when `isActive` is `false` and resumes rotation once toggled to `true`.

All tests live in `src/components/dynamic-hero/src/components/__tests__/hero-headline.test.tsx` and are runnable with:

```bash
pnpm exec jest src/components/dynamic-hero/src/components/__tests__/hero-headline.test.tsx
```

## Manual Verification Guide

1. Start the Next.js dev server (`pnpm dev`).
2. Load `/` and observe the hero:
   - Watch the phrases rotate automatically.
   - Scroll the hero completely out of view; wait a few seconds for the animation to pause.
   - Scroll back until the hero is mostly visible; rotation should resume on the next interval.
3. Open DevTools’ “Performance” panel to confirm no timers are firing while the hero is paused (optional, for deeper audits).

## Extensibility Considerations

- **Alternative triggers:** The `isAnimating` prop can be toggled by other events (e.g., focus/hover states or reduced motion preferences) without touching the rotation hook.
- **Server rendering:** Keep the prop defaulted to `true` on the server to avoid mismatch warnings.
- **Multiple heroes:** For pages rendering more than one hero, create separate refs and pass unique visibility flags to each `HeroHeadline` instance.
- **Accessibility:** Pausing off-screen animations supports reduced motion preferences indirectly. Future work can combine this with `prefers-reduced-motion` checks to disable rotation entirely when requested.

## Summary

The new animation control ensures the dynamic hero remains performant and predictable. Visibility tracking keeps intervals idle when the hero is off-screen, the headline accepts a simple prop to respect that state, and the extraction of behavour into `useRotatingIndex` keeps the logic reusable and well-tested. Developers integrating the dynamic hero elsewhere can opt into the same behaviour by wiring up their own visibility guard and passing `isAnimating` accordingly.

