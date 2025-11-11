# PR Summary – External Dynamic Hero Enhancements

## What changed
- Restored the Quick Start headline animation while keeping the destructive capsule styling, ensuring the rotating phrase renders consistently.
- Added automatic capitalization for the destructive rotation copy to match the rest of the headline.
- Updated `HeroVideoDialog` to use `next/image` with intelligent bypass for SVG/GIF thumbnails so animated/vector posters render correctly.
- Allowed Persona CTA buttons to wrap text and maintain layout in horizontal mode.
- Documented the integration process and hand-off checklist for importing `external/dynamic-hero` into other projects (`_docs/external/modules/dynamic-hero-integration.md`).

## Testing
- Reloaded `/test-external/dynamic-hero-demo` and verified:
  - Headline phrases fade smoothly and stay visible through rotations.
  - Persona CTA cards wrap their descriptions without expanding the container.
  - Video thumbnail renders when using GIF/SVG assets and opens the dialog as expected.



