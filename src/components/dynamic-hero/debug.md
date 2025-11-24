# Dynamic Hero Flip Phrase Debug Log

_Last updated: 2024-11-17_

## Context

- Environment: `app/test-external/dynamic-hero-demo`
- Component under test: `external/dynamic-hero/src/components/hero-headline.tsx`
- Issue observed: First rotating phrase (“Stop …”) intermittently renders as whitespace even after capsule styling updates.
- Current branch: `master` (local edits)

## Reproduction Steps

1. Load `/test-external/dynamic-hero-demo`
2. Watch the hero rotation for ~10 seconds
3. Occasionally the “Stop …” capsule shows no text for a single frame before repainting

## Hypothesized Root Cause(s)

- Inconsistent `key` values when the rotation loops back to the first string
- `AnimatePresence` exit/enter overlap combined with the pill container causing a brief blank state
- Potential whitespace/duplicate values in `copy.rotations.problems`

## Investigation Notes

- Added normalized rotation arrays (`trim()`) earlier; blinking persisted
- Quick Start hero uses plain `<motion.span>` without pill styling and does not exhibit the issue
- Implemented new capsule using `motion.span layout`, unique keys (`${index}-${text}`), and `AnimatePresence` with `mode="sync" initial={false}` to reduce overlap
- Added `console.debug("[HeroHeadline] flip state", ...)` logging when `NODE_ENV !== "production"` to trace values
- Latest change: normalization filters duplicates/empty entries to ensure `problems` array always contains unique, non-empty strings
- Replaced the destructive phrase implementation with the exact Quick Start fade animation wrapped in a destructive highlight capsule to match behaviour while keeping the Aceternity styling
- Updated `HeroVideoDialog` to render thumbnails through `next/image` with SVG/GIF support via the new `shouldBypassImageOptimization` helper, allowing animated/vector previews to display as intended
- Applied capitalization safeguard so the destructive phrase always renders with an uppercase leading character, matching the Quick Start visual rhythm
- Restored a crisp `<Image>` for the thumbnail with an opacity-based bottom gradient while keeping the preview button mounted (it fades out and disables pointer events when the modal opens). Wrapped the preview in an explicit `aspect-video` container so the layout stays stable when the preview fades away. Added `images.unsplash.com` to the Next.js remote image allow list so the new thumbnail URL resolves correctly.
- Introduced `onOpenChange` plumbing so `HeroVideoPreview` can drop all decorative blurs when the modal is open, eliminating the residual blur during playback.
- Adjusted the destructive phrase capsule to use CSS variable fallbacks (`--hero-problem-*`) so it renders outside the app theme; text color, border, and glow are now customizable with defaults to maintain readability. Added a bright red gradient fallback to keep contrast high even if host tokens are missing.

## Next Actions

- Compare demo copy vs Quick Start persona data to ensure no duplicate/blank strings
- Capture console output during a full rotation to confirm indices/values
- Evaluate whether the pill needs fixed width/height to prevent layout collapse
- Re-test after adjustments; remove debug logging once resolved

