# Debugging Canonical Tags in Next.js Blog

## What We've Tried

- **Verified Code:**
  - Confirmed that `generateMetadata` in `src/app/blogs/[slug]/page.tsx` returns the correct `alternates.canonical` property.
  - Confirmed that the canonical URL is dynamically generated based on the blog post slug and site URL.
- **Inspected Page Source:**
  - Checked the live page source for `<link rel="canonical" ...>`, but it was missing from `<head>`.
- **Reviewed Next.js Version & Directory:**
  - Confirmed usage of the Next.js `app` directory and the new metadata API.
- **Reviewed Build/Deploy:**
  - No evidence of custom `_document.js` or conflicting head logic.
- **Jest/Testing Debug:**
  - Fixed Jest config to use Babel for React/TSX transformation (added `babel-jest` and `@babel/preset-typescript`).
  - Created `__mocks__/fileMock.js` to handle static asset imports in Jest.
  - Ensured `tsconfig.json` has `"jsx": "react-jsx"`.
  - Cleared Jest cache and re-ran tests.
  - Most SEO/metadata tests now pass, but the canonical tag test in `caonical/index.test.ts` fails due to Babel not stripping TypeScript types unless properly configured.
  - Updated `babel.config.js` to include `@babel/preset-typescript`.

## What We Should Try Next

1. **Production Build & Redeploy:**
   - Run `next build` and `next start` locally and check the canonical tag in the output.
   - Redeploy to hosting (Vercel/Netlify) after clearing build cache.
2. **Check Next.js Version:**
   - Ensure Next.js is v13.2+ (run `npm ls next`).
3. **Check for Head Overrides:**
   - Ensure no custom `<head>` logic or legacy `_document.js` interfering.
4. **Test Manual Canonical Tag:**
   - As a temporary workaround, add `<Head><link rel="canonical" href={pageUrl} /></Head>` in the blog post component.
5. **Babel/Jest Troubleshooting:**
   - Ensure `babel.config.js` exists at the project root and includes `@babel/preset-typescript`.
   - Make sure only one Jest config is present (`jest.config.js`).
   - If using `babel-jest`, confirm all Babel presets are installed and up to date.
   - If the test still fails, try running Jest with debug logs: `pnpm exec jest --detectOpenHandles --logHeapUsage --runInBand`.

---

**Current Blocker:**
- The canonical tag test fails in Jest due to Babel not stripping TypeScript types unless the correct preset is present in `babel.config.js`. All other metadata/SEO tests are passing.

**Notes:**
- This issue only affects the Jest/unit test environment. In production, canonical tags may still render correctly if the metadata API is configured properly.

---

**Update this file as you try more debugging steps or find a solution!**
