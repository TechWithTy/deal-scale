# Next.js `/_not-found` Prerender Error with `pageExtensions` — Debug & Fix Guide

## Problem Summary

When using custom `pageExtensions` (e.g., `['page.tsx', 'page.ts']`) in Next.js 14.2.x and above, you may encounter this error during build or Vercel deploy:

```
Error occurred prerendering page "/_not-found". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: Cannot read properties of undefined (reading 'clientModules')
```

This can happen even if you have **no custom not-found page**. The bug is related to how Next.js generates internal manifests for the not-found route, especially when using custom page extensions.

---

## Step-by-Step Solutions

### 1. **Add a Minimal `not-found.tsx` Page**
Create `src/app/not-found.tsx` (not `.page.tsx`) with:
```tsx
export default function NotFound() {
  return <div>Not Found</div>;
}
```
This helps Next.js resolve the internal manifest bug.

---
### 2. **Update `pageExtensions` in `next.config.js` (if needed)**
Make sure you include plain `"ts"` or `"tsx"` in addition to your custom extensions:
```js
module.exports = {
  pageExtensions: [
    "page.tsx",
    "page.ts",
    // Workaround for Next.js bug:
    "ts"
  ],
};
```
This allows Next.js to pick up `not-found.tsx` as a fallback.

---
### 3. **Switch Next.js Config to JavaScript (`next.config.js`)**
Some users have reported that simply renaming their config file from `next.config.ts` to `next.config.js` resolves the issue, especially on Vercel deploys. This is likely due to how Vercel/Next.js loads the config in production.

**How to do it:**
- Rename your `next.config.ts` to `next.config.js`.
- Convert any TypeScript-specific code to plain JS if needed (remove type annotations, etc).
- Example:
  ```js
  // next.config.js
  module.exports = {
    // your config here
  };
  ```

---
### 4. **Downgrade Next.js (if needed)**
If the above does not work, downgrade Next.js to `14.1.4` or earlier:
```json
"next": "14.1.4"
```
Then:
- Delete `node_modules` and your lockfile (`pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock`).
- Reinstall dependencies:
  ```bash
  npm install
  # or
  yarn install
  # or
  pnpm install
  ```
- Build and deploy again.

---
### 5. **Check for Circular Dependencies**
Circular imports can also trigger this error. Use [madge](https://www.npmjs.com/package/madge) or review your import structure.

---
### 6. **Try npm/yarn Instead of pnpm**
Some users report that switching from `pnpm` to `npm` or `yarn` for install/build resolves the issue:
```bash
rm -rf node_modules pnpm-lock.yaml
npm install
npm run build
```

---
### 7. **Other Tips**
- Avoid putting your `page.tsx` inside an `(index)` or similar folder.
- Try upgrading to the latest Next.js canary or stable version if stuck.
- If you use `useSearchParams`, wrap the provider with `<Suspense>` in your layout and ensure the provider file has `"use client"` at the top.

---

## References
- [GitHub Issue #65447](https://github.com/vercel/next.js/issues/65447)
- [Next.js Prerender Error Docs](https://nextjs.org/docs/messages/prerender-error)
- [Dynamic Imports with No SSR](https://nextjs.org/docs/pages/building-your-application/optimizing/dynamic-imports#with-no-ssr)

---

## TL;DR Table

| Step                | Action                                                    |
|---------------------|-----------------------------------------------------------|
| 1. Add not-found.tsx| Create minimal `src/app/not-found.tsx`                    |
| 2. pageExtensions   | Add `"ts"` to `pageExtensions` in next.config            |
| 3. Use JS config    | Rename `next.config.ts` to `next.config.js`               |
| 4. Downgrade Next.js| Set `"next": "14.1.4"`, reinstall, build                |
| 5. Check cycles     | Use madge or similar to find circular dependencies        |
| 6. Try npm/yarn     | Remove pnpm lockfile, use npm/yarn instead                |
| 7. Upgrade Next.js  | Try latest canary/stable if stuck                         |

---

If you follow these steps, you should be able to resolve the `/_not-found` prerender error and deploy successfully to Vercel.
