# Dynamic Hero Module

Shared React utilities for building reusable hero sections with configurable video content and persona-driven copy.

## Exports

- `HeroVideoDialog` — modal video dialog with configurable entrance animations.
- `HeroVideoPreview` — stylized video preview card with progressive blur layers.
- `DEFAULT_HERO_VIDEO` — sensible default `HeroVideoConfig`.
- `heroVideoConfigSchema`, `HeroVideoConfig` — Zod schema and type for video metadata.
- `resolveHeroCopy` — helper to sanitize and template hero copy definitions.
- `heroCopySchema`, related types — shared schema for copy configuration.
- `resolveHeroThumbnailSrc`, `resolveHeroVideoSrc` — helpers for media URLs.

## HeroHeadline styling system

The `HeroHeadline` component separates structure from theme so rotating copy stays readable across personas and themes.

### Feature-scoped tokens

`HeroHeadline` sets CSS custom properties that can be overridden by consumers:

```css
:root {
  --hero-accent-persona: linear-gradient(90deg, #ef4444, #f87171);
  --hero-accent-action: linear-gradient(90deg, #38bdf8, #2563eb);
  --hero-accent-risk: linear-gradient(90deg, #facc15, #f97316);
  --hero-tag-persona-bg: rgba(59, 130, 246, 0.9);
  --hero-tag-persona-text: rgba(255, 255, 255, 0.95);
  --hero-tag-persona-border: rgba(59, 130, 246, 0.4);
}
```

### Structural classes (CSS module)

- `heroHeadline` — clamps font size, centers copy, enables balanced wrapping.
- `heroHeadlineBlock` — stacked rows (`Stop`, `Start`, `Before`).
- `heroHeadlineAccent*` — gradient text spans driven by the tokens.
- `tag`, `tagSecondary`, `tagPersona` — standardized persona chips.

Override the tokens or extend the classes if a new persona needs custom branding.

## Usage

```tsx
import {
	HeroVideoPreview,
	resolveHeroCopy,
} from "@external/dynamic-hero";

const copy = resolveHeroCopy(heroCopyDefinition, {
	fallbackSecondaryChip: { label: personaTitle, variant: "outline" },
});

<HeroVideoPreview
	video={heroCopyDefinition.video}
	thumbnailAlt="Watch the product tour"
/>;
```

> Note: This package is private to the monorepo and assumes the shared design system (Tailwind tokens, Radix primitives, and motion). Ensure these dependencies are present in any consumer application.

