# GPU-Accelerated Layout Artifacts & Mitigation Plan

White gaps or seams between sections can appear when GPU-promoted layers (`transform: translateZ(0)`, `will-change: transform`) misalign pixels across browsers. This doc summarizes what we’ve seen in the field and how we plan to harden the experience without assuming a single browser bug.

## Signals from the Community

- **Sub-pixel seams**—Designers report that forcing transforms to the GPU can cause fractional pixel rendering, especially in Firefox, leading to thin white lines between sections. Recommendation: only promote layers that truly need it and verify per browser.[^medium]
- **Layout jank from non-composited animations**—Large layout shifts or “random white boxes” show up when animations run on the main thread or when `will-change` is overused, impacting multiple engines, not just Firefox.[^kwebby]
- **Cross-browser rendering glitches**—Random white boxes have been observed across browsers, reinforcing the need for telemetry + automated detection instead of UA heuristics.[^uma]

[^medium]: https://medium.com/design-bootcamp/addressing-sub-pixel-rendering-and-pixel-alignment-issues-in-web-development-cf4adb6ea6ac
[^kwebby]: https://kwebby.com/blog/avoid-large-layout-shifts/
[^uma]: https://umatechnology.org/random-white-box-shows-up-on-screen/

## DealScale Action Plan

1. **Instrument & Confirm**
   - Ship a lightweight “Report spacing issue” button on GPU-intensive sections (hero, FeatureSectionActivity, Testimonials, TrustedByScroller).
   - When triggered, log UA, DPR, section ID, and whether GPU hints were enabled to Sentry / `_debug` feed.

2. **Dynamic Detection Hook**
   - Build `useGpuAutoFallback({ ref })` that, post-paint, compares `scrollHeight` vs `clientHeight` and looks for >1px seams.
   - If a gap is detected, remove GPU classes and persist the preference (localStorage + context) so reloads stay stable.

3. **Per-Surface Tuning**
   - Push `transform-gpu` down to inner animated nodes; keep outer wrappers free of GPU hints unless measurement proves the need.
   - Where we need hardware acceleration, make it opt-in via props (e.g., `<ConnectAnythingHero gpu="auto" />`) to aid testing.

4. **Regression Tests**
   - Extend `useGpuOptimizations` tests to cover the auto-fallback path.
   - Add Playwright visual snapshots (Chrome + Firefox ESR) for the affected sections; fail the build if seams appear.

## Next Steps

- [ ] Implement telemetry hook + reporting CTA.
- [ ] Prototype `useGpuAutoFallback` and roll it out to the hero section first.
- [ ] Add browser matrix visual tests before re-enabling full GPU hints by default. 


