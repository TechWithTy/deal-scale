# Next.js Build Error: File is not a module (Missing Default Export)

## Problem
When running a Next.js build, you may encounter the following error:

```
Type error: File '.../CaseStudiesClient.tsx' is not a module.
```

## Cause
This error occurs when the referenced file does not have a default export. Next.js expects a default export for client/server components and pages.

## Solution
Ensure the file has a default export. For example:

```tsx
// ❌ This will cause the error:
// function CaseStudiesClient() { ... }
//
// export { CaseStudiesClient };

// ✅ This will fix the error:
export default function CaseStudiesClient() {
  // ...component code
}
```

**In this project:**
- The error was resolved by adding `export default function CaseStudiesClient() { ... }` to `CaseStudiesClient.tsx`.

---

> Always check for a default export in any file imported as a module in Next.js app/page/client/server component trees.
