# Roadmap: Ensuring Client-Side Only Loading for Document-Dependent Components

## Context
Some components (such as Newsletter, NewsletterFooter, NewsletterSidebar, Navbar, and Sidebar) may depend on browser-specific APIs (e.g., `window`, `document`, or `localStorage`) that are not available during server-side rendering (SSR). Loading these on the server can cause hydration errors or runtime crashes.

## Goals
- Prevent SSR errors and hydration mismatches by ensuring browser-dependent code only runs on the client.
- Improve user experience and maintainability.

## Steps (Updated per Next.js/Vercel Prerender Documentation)

### 1. Audit Components and File Structure
- **Files to check:**
  - [ ] `src/components/contact/newsletter/NewsletterFooter.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/contact/newsletter/NewsletterSidebar.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/layout/Navbar.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/ui/sidebar.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/contact/newsletter/Newsletter.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/app/blogs/[slug]/page.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/app/services/page.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/case-studies/CaseStudyDetailHeader.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/checkout/CheckoutForm.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/contact/form/ContactForm.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/home/BlogPreview.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/home/Pricing.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/home/Projects.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/home/Services.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - [ ] `src/components/ui/spline-model.tsx` <!-- Refactored: browser logic gated, SEO content SSR -->
  - ...and any others using browser APIs
- **Action:**
  - Identify all usages of `window`, `document`, `localStorage`, or any browser-specific API.
  - Ensure no browser-only code runs at the top-level, in data-fetching methods, or during SSR.
  - Confirm that only page files are in `pages/` (if using Pages Router); colocate components in `app/` if using App Router.

> **SEO Best Practice:**
> When refactoring for client-only/browser APIs, only guard the browser-dependent logic (e.g., event handlers, dynamic widgets) with `useHasMounted` or dynamic import `{ ssr: false }`. Do **not** return `null` for the entire component if it contains SEO-critical or static content. Always render SEO-relevant content on the server for proper indexing and previews.

### 2. Refactor for Client-Only Loading
- **Approach:**
  - **A. useHasMounted Hook:**
    - Use the `useHasMounted` hook to ensure browser-only logic only runs after hydration.
    - Example:
      ```tsx
      import { useHasMounted } from "@/hooks/useHasMounted";
      const hasMounted = useHasMounted();
      if (!hasMounted) return null;
      // Safe to use window/document here
      ```
  - **B. Dynamic Import (Next.js):**
    - For entire components that are browser-only, use dynamic imports with `{ ssr: false }`:
      ```tsx
      import dynamic from 'next/dynamic';
      const ClientOnlyComponent = dynamic(() => import('./ClientOnlyComponent'), { ssr: false });
      ```
  - **C. useEffect/useLayoutEffect:**
    - Move all browser-dependent logic inside `useEffect` or `useLayoutEffect`.
    - Example:
      ```tsx
      useEffect(() => {
        // Safe browser-only logic
      }, []);
      ```
  - **D. Guarded Access:**
    - Use `if (typeof window !== 'undefined')` or `if (typeof document !== 'undefined')` for inline browser API access.

> **Best Practice:**
> Only guard client-only/browser-dependent logic (e.g., code using `window`, `document`, `navigator`, etc.) with `useHasMounted` or dynamic import `{ ssr: false }`. Do **not** return `null` for the entire component if it contains SEO-critical or static content. Always render SEO-relevant content on the server for proper indexing and previews.

### 3. Handle Data and Fallbacks
- Ensure all data-fetching methods (`getStaticProps`, `getStaticPaths`) handle missing/undefined props and fallback states.
- For dynamic routes, use `router.isFallback` to render loading states as needed.

### 4. Test Thoroughly
- Test all affected pages/components in both development and production builds.
- Check for hydration warnings or errors in the browser console and during `next build`/Vercel deploys.

### 5. Document and Review
- Add comments explaining why certain logic is client-only.
- Update this roadmap as changes are made.
- Review after implementation and update documentation.

## Edge Cases
- Avoid moving all logic to the client if only a small part requires it. Use guards like `typeof window !== 'undefined'`.
- If third-party libraries require the DOM, dynamically import them client-side.

## Next Steps
- Assign owners for each component.
- Track progress in this file or an issue tracker.
- Review after implementation and update documentation.

---

## React Hooks Usage: Required Practice

### 🚨 Never Call Hooks Conditionally

React hooks (`useState`, `useEffect`, custom hooks, etc.) **must always be called at the top level of your component**—never inside conditionals, loops, or after an early return. This is enforced by `eslint-plugin-react-hooks` and is critical for correct rendering.

**Required Practice:**
1. **Declare all hooks before any return or conditional logic.**
   - Place all hooks at the very top of your component.
2. **Do not call hooks after an early return or inside `if`/`else` blocks.**
3. **Fix violations immediately** if you see errors like:
   - `React Hook "useEffect" is called conditionally.`
   - `React Hook "useState" is called conditionally.`

**Correct Example:**
```tsx
function MyComponent() {
  const hasMounted = useHasMounted();
  const [foo, setFoo] = useState(false);
  if (!hasMounted) return null;
  // ...rest of component
}
```

**Incorrect Example:**
```tsx
function MyComponent() {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null; // ❌ Hooks below this line are invalid!
  const [foo, setFoo] = useState(false);
  // ...rest of component
}
```

**Checklist:**
- [ ] Audit all components for conditional hook calls
- [ ] Move all hooks to the top before any returns
- [ ] Fix missing dependencies in `useEffect`
- [ ] Run `eslint` and ensure no `react-hooks/rules-of-hooks` violations remain

**References:**
- [Rules of Hooks – React](https://reactjs.org/docs/hooks-rules.html)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

---

**References:**
- [Next.js Prerender Error Docs](https://nextjs.org/docs/messages/prerender-error)
- [Dynamic Imports with No SSR](https://nextjs.org/docs/pages/building-your-application/optimizing/dynamic-imports#with-no-ssr)
- [React useLayoutEffect on the Server](https://react.dev/reference/react/useLayoutEffect#uselayouteffect-on-the-server)
