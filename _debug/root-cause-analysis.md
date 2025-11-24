# Root Cause Analysis - Hook Count Mismatch

## The Problem
- **Error**: "Rendered more hooks than during the previous render"
- **Hook 33**: `useMemo` at line 174 (`guardDetail`) is `undefined` in first render, present in second
- **Hook Count**: 32 hooks in first render, 33 hooks in second render

## Critical Discovery

### Issue 1: `createDataModuleStore` Called Inside Hook

Looking at `useDataModule` in `src/stores/useDataModuleStore.ts`:

```typescript
export function useDataModule<K extends DataModuleKey, S = DataModuleState<K>>(
	key: K,
	selector?: (state: DataModuleState<K>) => S,
	equality?: (a: S, b: S) => boolean,
): S {
	const store = createDataModuleStore(key);  // ← Called INSIDE hook on every render
	// ... rest of hooks
}
```

**Problem**: `createDataModuleStore(key)` is called as a regular function call INSIDE the hook, before any React hooks are called. While it's cached globally, if this function:
1. Throws an error during SSR
2. Has side effects that differ between SSR/client
3. Takes different code paths during SSR vs client

Then React might catch the error, skip subsequent hooks during error recovery, and then on the next render (client), all hooks execute normally.

### Issue 2: Store Initial State Creation

`createDataModuleStore` creates a Zustand store with `create()`. During SSR, this might behave differently than on the client, especially if:
- There are any browser-only APIs being accessed
- The store creation has side effects
- The initial state differs between server and client

### Issue 3: Error Boundary Recovery

When a hydration mismatch occurs, React's error boundary might cause the component to re-render in a way that skips some hooks during error recovery, then execute them all on the next normal render.

## The Real Root Cause

**Hypothesis**: During SSR, something in the component tree or data flow causes an error or early return BEFORE hook 33 (`guardDetail` useMemo) is reached. This could be:

1. **Hydration mismatch causing error boundary to trigger** - When React detects the mismatch (server rendered `<Separator>`, client expected `<section>`), it might catch the error and re-render, skipping some hooks
2. **`createDataModuleStore` throwing during SSR** - If the store creation has any issues during SSR, it could cause hooks to be skipped
3. **Selector throwing during SSR** - The selector in `useDataModule` might throw if `data` is undefined during SSR, causing error recovery that skips hooks

## Edge Cases

1. **SSR vs Client Data Loading**:
   - Server: `servicesData` is likely `{}` or `undefined` (idle state)
   - Client: After hydration, data might load, causing different code paths
   - This could cause the selector to behave differently

2. **Empty Object Fallback**:
   ```typescript
   services: (data?.services ?? {}) as ServicesData
   ```
   - Creates new `{}` object each time if `data?.services` is undefined
   - During SSR, this creates one empty object
   - On client, might create a different empty object
   - Even with caching, the initial render might differ

3. **Error Recovery Pattern**:
   - When React encounters a hydration error, it:
     1. Catches the error
     2. Logs it
     3. Re-renders the component
     4. During error recovery, might skip hooks or render differently
   - This explains why first render has fewer hooks than second

## Solution Strategy

The fix needs to ensure:
1. All hooks are called BEFORE any code that could throw or cause errors
2. Store creation is stable and doesn't throw during SSR
3. Selectors handle undefined/null gracefully without throwing
4. No conditional rendering based on SSR/client differences until AFTER all hooks

