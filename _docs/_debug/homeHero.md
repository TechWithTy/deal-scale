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

## 2025-02-17 – Mobile Hero Padding Alignment

- **Context:** The hero card still felt visually off-center on mobile because the container was clamped to `calc(100vw - 2rem)` while the navbar and sticky beta banner use 1.5 rem side padding. This mismatch left the card shifted relative to the chrome.
- **Method:** Matched the hero container and carousel wrappers to a `calc(100vw - 3rem)` clamp, removed the extra base `px-6` to avoid double padding under 640 px, updated Jest assertions, and manually spot-checked responsive behavior at 320 px, 360 px, and 768 px viewports.
- **Result:** Hero content now lines up with the navbar/beta banner edges while still shrink-wrapping below 360 px and expanding to the existing md/lg breakpoints without reintroducing horizontal clipping.
- **Notes:** Jest integration suite still requires SendGrid/Next request mocks; relevant hero tests were updated and pass locally when those suites are skipped.
