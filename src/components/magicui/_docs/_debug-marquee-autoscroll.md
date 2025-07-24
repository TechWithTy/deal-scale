# Marquee Auto-Scrolling Debug Log

## Issue Summary
The Marquee component is designed to auto-scroll its children horizontally (or vertically) with a smooth animation. However, the auto-scrolling animation was not visible or not working as expected during integration.

---

## Troubleshooting Steps & Attempts

### 1. **CSS Variable Propagation**
- **Tried:** Passing `[--duration:20s]` as a className to the Marquee and propagating it to the animated child div.
- **Result:** No visible animation. Suspected Tailwind arbitrary property or variable scoping issue.

### 2. **Inline Style for Animation Duration**
- **Tried:** Switched to using an inline style (`style={{ animationDuration: duration }}`) on the animated div, with a `duration` prop.
- **Result:** No visible animation. Confirmed that the style was applied, but animation still not triggered.

### 3. **Keyframes and Animation Classes in CSS**
- **Tried:** Verified that `@keyframes marquee` and `.animate-marquee` were defined in `global.css`. Initially these were inside an `@theme inline {}` block.
- **Result:** Animation did not work, likely because `@theme inline` is not processed by Tailwind/PostCSS pipeline.

### 4. **Moved Keyframes & Variables to Global Scope**
- **Tried:** Moved all keyframes and animation variable definitions out of `@theme inline` into `:root` and global CSS.
- **Result:** Animation still did not work.

### 5. **Content Overflow**
- **Tried:** Increased the `repeat` prop to 8 to guarantee the marquee's children overflow the container.
- **Result:** If content does not overflow, animation is not visible. With high repeat, animation should be visible if CSS is correct.

### 6. **DevTools Inspection**
- **Tried:** Inspected `.animate-marquee` element in browser DevTools for computed `animation-name`, `animation-duration`, and `transform`.
- **Result:** (Pending user feedback on computed styles)

---

## What Didn't Work
- Relying on Tailwind arbitrary properties for animation duration.
- Using `@theme inline` for keyframes and animation variables.
- Only a few child elements (insufficient overflow).

## What Did Work (or is Required)
- Keyframes and animation classes **must** be in global CSS, not inside `@theme inline`.
- The content inside the marquee **must** overflow the container for the animation to be visible.
- Animation duration can be set via inline style or via a CSS variable, as long as the animation is correctly defined.

---

## Next Steps
1. **DevTools Check:** Confirm in browser DevTools that `.animate-marquee` has the correct `animation-name`, `animation-duration`, and a changing `transform` property.
2. **Content Overflow:** Always ensure there are enough children (or high enough `repeat`) to overflow the container.
3. **CSS Build:** Confirm that your CSS build pipeline (Tailwind/PostCSS) is not stripping out keyframes or custom properties.
4. **SSR/CSR:** If using Next.js, ensure the CSS is loaded both on the server and client side.
5. **Minimal Repro:** Create a minimal example with just the Marquee and a few divs to isolate the issue.

---

## Notes
- This issue is a common pitfall with CSS animations that depend on content overflow and dynamic sizing.
- If animation is still not visible after all above, check for conflicting CSS, parent container restrictions, or JavaScript errors in the console.

---

*Last updated: 2025-05-25*
