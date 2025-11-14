---
title: Persona-Adaptive Home Experience
description: Notes on wiring home modules and SEO to the shared persona store.
---

# Persona-Adaptive Home Experience

## Summary
- Home experience now shares persona/goal context across the Quick Start hero, AI Outreach Studio module, and analytics section.
- SEO metadata and JSON-LD schemas highlight adaptive outreach and persona wording (e.g., “Turn conversations into conversions automatically” and “We orchestrate every deal touchpoint so your … stay in deal mode.”).
- Regression tests validate persona-specific copy renders for testimonials, outreach studio, and activity feed modules.

## Modules Updated
- `CallDemoShowcase` (AI Outreach Studio)
  - Pulls current persona/goal from `usePersonaStore`.
  - Displays persona badge beside main heading.
  - Session Monitor copy references the active goal.
- `FeatureSectionActivity`
  - Uses store-driven persona label and benefit to craft headline/subhead.
  - Persona badge reflects the selected persona (“Agents”, “Investors”, etc.).
- Tests (`CallDemoShowcase`, `CallDemoShowcase.textScroll`, `FeatureSectionActivity`)
  - Reset persona store before each run.
  - Assert that persona and goal text render from the store.

## SEO & Schema Changes
- Added Outreach Studio tagline and persona promise to landing-page keyword and description sets.
- `heroServiceSchema`, `aiOutreachServiceSchema`, and `activityFeedSchema` descriptions blend static copy with persona-aware phrasing.
- Feature list JSON-LD anchors the tagline and persona promise for consistency with UI.

## Testing Notes
- Run targeted Vitest suites (workspace requires local CLI):  
  `pnpm exec vitest run src/components/home/__tests__/CallDemoShowcase.test.tsx src/components/home/__tests__/CallDemoShowcase.textScroll.test.tsx src/components/home/__tests__/FeatureSectionActivity.test.tsx`
- Confirm end-to-end behaviour manually (persona switcher → Outreach Studio copy).

## Follow-Up Opportunities
- Consider wiring additional sections (FAQ hero card, Client Bento) to the persona store.
- Evaluate server-side persona persistence for SEO-critical surfaces if dynamic variants should appear in prerendered HTML.



