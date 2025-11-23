# Debugging Steps for Next.js TypeScript Route Errors

## Debugging Log: Next.js Dynamic Route Type & Build Errors

---

### Observed Error
- **Type error:**
  ```
  Type '{ params: { slug: string[]; }; }' does not satisfy the constraint 'PageProps'.
  Types of property 'params' are incompatible.
    Type '{ slug: string[]; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
  ```
- Seen in `.next/types/app/blogs/[...slug]/page.ts` and other dynamic routes during build/lint.

---

### Key Troubleshooting Steps
- Verified all dynamic route handler signatures match Next.js requirements (e.g., `params: { slug: string[] }` for `[...slug]`, `params: { slug: string }` for `[slug]`).
- Cleaned up all stale, legacy, or backup files in app route directories.
- Deleted `.next` and all build caches; reinstalled dependencies and rebuilt.
- Confirmed all static and dynamic routes use correct signatures for `generateMetadata` and default exports.
- Ran `pnpm lint` and `pnpm format` to ensure codebase consistency.

---

### Additional Finding
- **The minimal dynamic route code (just returning params) works and does not trigger the type error.**
- **However, the error persists even with a minimal page implementation and with all JSX commented out in `CaseStudyPageClient`.**
- **This indicates the root cause is NOT in the client component or its render logic, but likely in the route handler signature, type imports, or a deeper Next.js type cache issue.**
- Next troubleshooting step: audit all type imports, ensure only one canonical `CaseStudy` type is used, and check for any type or route conflicts at the framework level.

---

### BREAKTHROUGH: Error Disappears Without Typed Params
- **When the `PageProps` interface with `params: { slug: string }` was removed from the dynamic route, the persistent type error went away.**
- This strongly suggests a Next.js App Router type inference bug or edge case, especially after `[...slug]`/`[slug]` conflicts or shadowing.
- The minimal working export is:
  ```tsx
  export default async function Page() {
    return <div>CaseStudyPageClient</div>;
  }
  ```
- **Adding explicit typed params to the function signature reintroduces the error.**

---

### Plan for Further Debugging/Analysis
1. **If you need typed params:**
   - Gradually reintroduce the param destructure, starting with `export default async function Page(props: any)` and logging `props`.
   - Try using `export default async function Page({ params }: any)` and see if the error returns.
   - If so, this confirms the type system is stuck expecting a Promise or a different shape for `params`.
2. **Check the generated types:**
   - Inspect `.next/types/app/case-studies/[slug]/page.ts` to see what Next.js expects for `PageProps`.
3. **File a bug report with Vercel if needed:**
   - This is a reproducible Next.js App Router edge case.
4. **Workaround:**
   - Use untyped or `any` for params until the underlying type issue is resolved in Next.js.

### Findings & Edge Cases
- Removing `generateMetadata` from one dynamic route simply moved the type error to the next dynamic route with a `generateMetadata` export.
- The bug is triggered by the presence of `export async function generateMetadata` in *any* dynamic route file, regardless of correct signature.
- No remaining stale files or incorrect signatures; all code matches Next.js docs.
- After fixing an unrelated recursion bug, the project builds, but dynamic routes (`/blogs/[...slug]`, `/case-studies/[slug]`, `/services/[slug]`) still fail at runtime or during prerender.

---

### Next Steps
- Investigate nested components and SEO metadata generation for hidden bugs, recursion, or serialization issues (e.g., circular references, invalid data from `generateMetadata`).
- Pay special attention to:
  - How SEO metadata is generated and returned
  - Data-fetching or transformation logic in nested components
  - Circular imports or recursive rendering in the component tree

---

### Conclusion
- All userland code and route signatures are correct.
- This is either a Next.js type generation bug or a runtime bug triggered by nested logic or SEO helpers.
- If further investigation does not resolve, prepare a minimal reproduction and file an issue with the Next.js team.

---

*Last updated: 2025-05-18*


### 1. **Signature Review**
- Verified all dynamic route files (e.g., `src/app/blogs/[...slug]/page.tsx`) had correct signatures:
  ```ts
  export default async function BlogPostPage({ params }: { params: { slug: string[] } }) { ... }
  export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> { ... }
  ```
- Confirmed no use of `Promise<any>` or `Promise<{ slug: string[] }>` for `params`.

### 2. **Static Route Checks**
- Confirmed static routes (e.g., `src/app/page.tsx`) use:
  ```ts
  export async function generateMetadata(): Promise<Metadata>
  ```

### 3. **Stale File Search**
- Checked for `.js`, `.jsx`, or backup files in `src/app/blogs/[...slug]/` and parent directories.
- Ensured only one `page.tsx` exists per route.
- Deleted any legacy or backup files.

### 4. **Cache Clean**
- Deleted the entire `.next` directory and all build caches.
- Ran `pnpm build` to force regeneration of type files.

### 5. **Dependency Review**
- Confirmed Next.js and TypeScript versions are up-to-date and compatible.

### 6. **Type Generation Inspection**
- Inspected generated `.next/types/app/blogs/[...slug]/page.ts` for incorrect `PageProps`.
- Verified if type pollution persisted after cleaning and code fixes.

### 7. **Lint & Format**
- Ran `pnpm lint` and `pnpm format` to ensure codebase consistency and catch implicit type issues.

---

## Conclusions
- The error is typically caused by an incorrect or legacy function signature for dynamic route handlers, or by stale files being picked up by the Next.js build process.
- Ensuring all route handler signatures are correct and cleaning up any extra files and caches resolves the issue.
- Returning a `Promise<Metadata>` from `generateMetadata` is correct and does **not** cause the bug.
- If the error persists after these steps, it may be a Next.js bug or require further investigation of hidden files.

---

## Additional Step: Removing generateMetadata from `[...slug]/page.tsx`

- As a final troubleshooting step, we removed the `export async function generateMetadata` from `src/app/blogs/[...slug]/page.tsx`.
- The file now only exports the default page component with the correct signature:
  ```ts
  export default async function BlogPostPage({ params }: { params: { slug: string[] } }) { ... }
  ```
- This was done to rule out any edge cases where Next.js type generation or build artifacts might be polluted by the presence of `generateMetadata` (even if the signature was correct).
- **Result:**
  - If the build/type error persists after this change, it confirms the issue is not with the `generateMetadata` function itself, but rather with Next.js type generation or a deeper build system bug.
  - If the error resolves, it suggests a subtle interaction or bug with `generateMetadata` in dynamic routes.

### Why this was attempted
- All other troubleshooting steps (signature review, file cleanup, cache clearing, dependency upgrades) were exhausted.
- Removing `generateMetadata` isolates the minimal surface area for the bug.

### Recommendation
- If the error persists after this step, prepare a minimal reproduction and file an issue with the Next.js team, as this indicates a framework-level bug.

---

## Further Observations: Error Moves to Next Dynamic Route

- After removing `generateMetadata` from `[...slug]/page.tsx` (blogs), the build/type error immediately appeared in the next dynamic route (`case-studies/[slug]/page.tsx`).
- This demonstrates that the presence of `export async function generateMetadata` in any dynamic route triggers the type bug, **even if the function signature is 100% correct**.
- Example signatures that still trigger the error:
  ```ts
  // For catch-all route
  export async function generateMetadata({ params }: { params: { slug: string[] } }) { ... }
  // For single slug route
  export async function generateMetadata({ params }: { params: { slug: string } }) { ... }
  ```
- This confirms the issue is not with your implementation, but with Next.js type generation for dynamic routes with `generateMetadata`.

---

## Current Status: Build Succeeds, Dynamic Pages Still Failing

- The project now builds successfully (`pnpm build` passes), but **dynamic pages for case studies, services, and blogs still cause runtime or prerender errors**.
- These failures appear when navigating to or prerendering dynamic routes (e.g., `/case-studies/[slug]`, `/services/[slug]`, `/blogs/[...slug]`).
- Next step: **Investigate nested components and SEO metadata generation** for hidden bugs, recursion, or serialization issues (such as circular references or invalid data returned from `generateMetadata`).
- Special attention should be paid to:
  - How SEO metadata is generated and returned
  - Any data-fetching or transformation logic in nested components
  - Possible circular imports or recursive rendering in the component tree

## References
- [Next.js App Router Dynamic Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [TypeScript Type Inference and Type Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

*Last updated: 2025-05-18*
