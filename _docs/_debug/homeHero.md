# Home Hero Responsive Debug Log

## 2025-02-14 – Hero Session Monitor Centering Verification

- **Context:** Adjusted `HeroSessionMonitor` layout to use mobile-first max-width utilities so the hero content no longer stretches edge-to-edge on narrow viewports.
- **Method:** Ran `pnpm dev` locally and inspected the hero in browser dev tools across the following breakpoints:
  - 320 px viewport width (mobile)
  - 768 px viewport width (tablet)
  - 1024 px viewport width (small desktop)
- **Result:** The hero section now stays centered with consistent spacing and no hydration shifts. The session monitor card shrink-wraps correctly at 320 px while preserving the existing tablet/desktop two-column layout.
- **Notes:** Google Fonts were unavailable in the local container environment, so fallbacks rendered instead; this did not affect layout verification.

## 2025-02-15 – Carousel Wrapper Shrink-Wrap Verification

- **Context:** Updated nested wrappers around the session monitor carousel to drop base `w-full` usage so the card respects the new mobile-first container sizing.
- **Method:** Ran `pnpm dev` and used Playwright-driven Chromium to capture the home hero at 320 px, 768 px, and 1024 px viewports.
- **Result:** The carousel now shrink-wraps within the centered grid on sub-360 px widths while scaling back to the full two-column layout on tablet/desktop without layout shifts.
- **Notes:** Google Fonts and Beehiiv API fetches continued to fail inside the container environment; both fall back gracefully and did not influence layout behavior.

## 2025-02-16 – Hero Card Viewport Clamp Verification

- **Context:** Introduced viewport-based `max-w` clamps on the session monitor carousel wrappers to eliminate the residual horizontal clipping reported on narrow devices.
- **Method:** Launched `pnpm dev` locally, resized Chromium dev tools to 320 px, 768 px, and 1024 px widths, and confirmed that the card remains fully visible without horizontal scrolling or clipping.
- **Result:** The hero card now respects the viewport width at 320 px, while preserving the existing sm/md breakpoint behavior and the large-screen two-column layout.
- **Notes:** Fonts and remote data fallbacks remain unchanged from previous runs; no hydration mismatches observed.

## 2025-02-17 – Carousel Auto-Width Regression Investigation

- **Context:** User feedback indicated the hero card was still clipping on ultra-narrow devices, so the carousel wrappers were updated to rely on intrinsic widths at the base breakpoint while retaining `md:w-full` for the larger layouts.
- **Method:** Ran `pnpm dev` and inspected the hero in Chromium dev tools at 320 px, 375 px, 768 px, and 1024 px widths, focusing on horizontal overflow and scroll behavior while toggling between both hero variants.
- **Result:** The session monitor card now shrink-wraps without forcing full-bleed width below 375 px, and no horizontal scrollbars appear while moving between hero variants. Tablet and desktop breakpoints continue to honor the two-column layout.
- **Notes:** Remote font and newsletter API fallbacks persist; they do not affect the observed layout.
