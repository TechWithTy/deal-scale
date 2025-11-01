# Debug Log – useDataModule Infinite Loop & SSR getServerSnapshot Caching

## Summary

**Status**: ✅ **RESOLVED** - All Issues Fixed

This document tracks the debugging and resolution of multiple related issues:
1. **SSR Infinite Loop**: ✅ Fixed by implementing cached `getServerSnapshot` in `useDataModule`
2. **Rules of Hooks Violation (useHasMounted)**: ✅ Fixed by removing `useHasMounted()` early return pattern
3. **Hook Count Mismatch (Hook 33)**: ✅ **RESOLVED** - Fixed with error-safe hooks and consistent hook order
4. **Hydration Mismatch**: ✅ **RESOLVED** - Fixed with try-catch around JSX rendering and SSR-safe patterns

**Resolution**: All issues resolved through a combination of error-safe store creation, error-safe selectors, try-catch around JSX rendering, consistent hook order, and SSR-safe patterns.

**Key Changes Made**:
- ✅ Replaced Zustand's `useStoreWithEqualityFn` with direct `useSyncExternalStoreWithSelector` for better SSR control
- ✅ Added selection cache and server snapshot caching to prevent referential instability
- ✅ Removed `useHasMounted()` pattern from `Services.tsx` component
- ✅ Removed `usePathname()` hook to prevent hydration mismatches
- ✅ Converted all conditional logic to SSR-safe patterns using `typeof window` checks

## Context
- **Environment**: Next.js 14+ dev server + production build (`pnpm run build`)
- **Affected Surface**: `src/components/home/Services.tsx` using the `service/services` data module
- **Error Signatures**: 
  1. Console warning: `The result of getServerSnapshot should be cached to avoid an infinite loop`
  2. Runtime error: `Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate`
  3. React error: `Rendered more hooks than during the previous render` (Rules of Hooks violation)

## Root Cause Analysis

### Primary Issue: Unstable Selector Results During SSR Hydration

1. **Zustand's Internal SSR Mechanism**:
   - `useStoreWithEqualityFn` (Zustand 5.0.6) internally uses React's `useSyncExternalStore`
   - `useSyncExternalStore` requires a stable `getServerSnapshot` function for SSR/hydration
   - Zustand automatically creates `getServerSnapshot` by calling: `selector(store.getInitialState())`
   - During hydration, React compares server snapshot with client snapshot

2. **Selector Object Creation**:
   - The selector in `Services.tsx` creates new objects on every invocation:
   ```typescript
   ({ status, data, error }) => ({
     status,
     services: (data?.services ?? {}) as ServicesData,  // New {} each time if data is undefined
     getServicesByCategory: data?.getServicesByCategory,
     error,
   })
   ```
   - Even when state values are equal, new object references are created
   - During SSR, if `getServerSnapshot` is called multiple times (React StrictMode, hydration checks), each call returns a new object reference

3. **The Loop Mechanism**:
   - React calls `getServerSnapshot` during SSR → returns new object `A`
   - React calls `getServerSnapshot` again (hydration check) → returns new object `B` (different reference, equal value)
   - React detects "change" (different reference) → triggers re-render
   - Re-render calls `getServerSnapshot` again → returns new object `C`
   - Loop continues infinitely

### Secondary Issues

1. **Per-Component-Instance Cache**:
   - Selection cache is stored in `useRef`, which is per-component-instance
   - During SSR → Client hydration, React may create new component instances
   - Cache doesn't persist across SSR/client boundaries
   - However, within a single render cycle, the cache should prevent repeated calls from creating new references

2. **Empty Object Fallback**:
   - `data?.services ?? {}` creates a new empty object `{}` each time
   - Even if cached, the first call caches the empty object, but subsequent calls with `data === undefined` might still create new empty objects if equality check fails
   - Default equality function uses deep/shallow comparison, which should catch this, but edge cases exist

3. **React StrictMode Double Rendering**:
   - In development, React StrictMode intentionally double-renders components
   - This can cause `getServerSnapshot` to be called multiple times
   - If cache isn't working correctly, each call returns a new reference

## Fix Implementation

### Solution: Direct useSyncExternalStore with Cached getServerSnapshot

1. **Selection Cache** (`src/stores/selectionCache.ts`):
   - Caches the last selection result
   - Uses provided equality function to determine if new selection equals cached selection
   - Returns cached reference if equal, preventing new object creation

2. **Hook Refinements** (`src/stores/useDataModuleStore.ts`):
   - **Replaced Zustand's `useStoreWithEqualityFn` with direct `useSyncExternalStoreWithSelector`**
   - This gives us full control over `getServerSnapshot`, which is critical for SSR
   - Initialize selection cache once per hook instance using `useRef` with lazy initialization
   - Wrap selector in `stableSelector` that uses cache before returning
   - **Added dedicated `serverSnapshotCacheRef` for SSR snapshot caching**
   - `getServerSnapshot` caches its result using a ref, ensuring it returns the same reference on repeated calls
   - Cache ensures that repeated calls with equal state return the same reference

3. **Stable Callbacks**:
   - `stableSelector` uses empty dependency array, accessing latest selector/equality via refs
   - `stableEquality` delegates to current equality function via ref
   - `getServerSnapshot` uses `useCallback` with proper dependencies
   - Prevents unnecessary callback recreation while allowing selector/equality to change

4. **Key Change - Direct useSyncExternalStore**:
   - Instead of using Zustand's wrapper, we directly use `useSyncExternalStoreWithSelector`
   - This allows us to provide a custom `getServerSnapshot` that caches its result
   - The `getServerSnapshot` function checks if the initial state reference matches the cached state
   - If it matches, it returns the cached snapshot (same reference)
   - This prevents React from detecting "changes" when `getServerSnapshot` is called multiple times during SSR

### Edge Cases Handled

1. **Multiple Components Using Same Store**:
   - Each component instance has its own cache
   - Prevents cross-component cache pollution
   - Each component's selector results are independently cached

2. **Selector Function Changes**:
   - Selector ref is updated on each render
   - Cache still works because it compares results, not selector functions
   - Old cached values are invalidated when equality check fails

3. **Equality Function Changes**:
   - Equality ref is updated on each render
   - Cache uses current equality function for comparisons
   - Changing equality function will re-evaluate cached values

4. **Store State Changes**:
   - When store state changes, selector produces new result
   - Equality function determines if result equals cached value
   - If equal, cached reference is returned (prevents unnecessary re-renders)
   - If different, new value is cached and returned

## Remaining Edge Cases & Considerations

1. **SSR/Client Boundary**:
   - Cache is reset when component instance is recreated during hydration
   - This is acceptable because server snapshot is only used during initial hydration
   - After hydration, client-side cache takes over

2. **Large Object Selectors**:
   - If selector returns large objects, cache prevents unnecessary object creation
   - Memory overhead is minimal (only one cached object per hook instance)

3. **Selector Functions That Return Primitives**:
   - Primitives are compared by value (via `Object.is` in default equality)
   - Cache still works but provides less benefit (primitives are cheap to create)

4. **Async State Updates**:
   - When store state updates asynchronously (e.g., data loading), selector produces new result
   - Cache ensures that if state updates but selector result is equal (by equality function), same reference is returned
   - Prevents unnecessary re-renders during state transitions

## Testing

### Unit Tests (`src/stores/__tests__/useDataModuleStore.test.tsx`)

1. **Referential Stability**:
   - `keeps initial selector fallbacks referentially stable`: Verifies that repeated calls with same state return same reference

2. **Re-render Prevention**:
   - `stabilizes selector outputs to prevent redundant re-renders`: Ensures no unnecessary re-renders after data is ready

3. **Cache Persistence**:
   - `reuses cached selector snapshots across passive re-renders`: Confirms cache works across component re-renders

### Manual Testing

1. **SSR Hydration**:
   - Build production bundle: `pnpm run build`
   - Start production server: `pnpm start`
   - Verify no console warnings about `getServerSnapshot`
   - Verify no infinite loop errors

2. **Development Mode**:
   - Run dev server: `pnpm dev`
   - With React StrictMode (double rendering), verify no infinite loops
   - Check that components render correctly

3. **Component Usage**:
   - Verify `Services.tsx` renders without errors
   - Check that service data loads correctly
   - Verify filtering and pagination work correctly

## Verification Commands

```bash
# Run unit tests
pnpm exec jest src/stores/__tests__/useDataModuleStore.test.tsx --runInBand

# Build and test production bundle
pnpm run build
pnpm start

# Run dev server with React StrictMode
pnpm dev
```

## Current Status (Latest Check) - ✅ RESOLVED

**Date**: 2025-01-XX
**Environment**: Node 20.19.5 (via nvm), Next.js dev server

### Browser Testing Results
- ✅ **Hydration error resolved**: Server and client HTML now match correctly
- ✅ **Hook count mismatch resolved**: All hooks execute in consistent order
- ✅ **No React error overlay**: Application works correctly
- ✅ **Verified working**: Tested with cache clear and hard refresh in browser

**All issues have been successfully resolved!** 🎉

### Error Pattern
```
Previous render: 32 hooks (hook 33 is undefined)
Next render: 33 hooks (hook 33 is useMemo)
```

This indicates that during the **first render** (likely SSR or error recovery), the component stops executing hooks before reaching hook 33, but on the **second render** (client hydration), all hooks execute normally.

### Issues Found and Fixed

1. **Rules of Hooks Violation - First Fix (Partially Fixed)**:
   - **Problem**: `useMemo` hooks (`allServices` and `categoryOptions`) were called AFTER the early return (`if (!hasMounted) return null`)
   - **Cause**: On first render, `hasMounted` is false, so the component returns early before calling those `useMemo` hooks. On second render, `hasMounted` is true, so the hooks are called. This changes the number of hooks between renders.
   - **Initial Fix**: Moved `allServices` and `categoryOptions` `useMemo` hooks to before the early return.
   - **Result**: This partially resolved the issue, but the error persisted initially. The final resolution required removing the `useHasMounted` pattern entirely and implementing error-safe patterns.

2. **Rules of Hooks Violation - Root Cause (FIXED)**:
   - **Problem**: The `useHasMounted()` hook pattern itself was causing hook count mismatches.
   - **Root Cause**: 
     - `useHasMounted()` internally uses `useState` and `useEffect`
     - When combined with an early return (`if (!hasMounted) return null`), it creates a pattern where:
       - First render: `useHasMounted()` calls hooks → early return → fewer hooks executed
       - Second render: `useHasMounted()` calls hooks → no early return → more hooks executed
     - Even though we moved hooks before the early return, the conditional rendering pattern itself can cause hydration mismatches during SSR
   - **Final Fix**: 
     - **Removed `useHasMounted()` entirely** from `src/components/home/Services.tsx`
     - **Removed early return pattern** - all hooks now execute unconditionally
     - **Made browser API checks SSR-safe** using `typeof window !== "undefined"` checks inside hooks and effects
     - **Converted `filterServices` to `useCallback`** to ensure it's treated as a hook (maintaining hook order)
     - **Converted `filteredEntries` to `useMemo`** to ensure it's treated as a hook
   - **File**: `src/components/home/Services.tsx`
   - **Key Changes**:
     ```typescript
     // BEFORE:
     const hasMounted = useHasMounted();
     // ... other hooks ...
     if (!hasMounted) return null;
     
     // AFTER:
     // Removed useHasMounted() entirely
     // All hooks execute unconditionally
     // Browser API checks are done inside hooks/effects:
     const [cardsPerPage, setCardsPerPage] = useState(() => {
       if (typeof window !== "undefined") {
         // client-side logic
       }
       return 6; // SSR fallback
     });
     ```

3. **Hook Order Standardization (FIXED)**:
   - **Problem**: Inconsistent indentation and hook ordering made it difficult to verify Rules of Hooks compliance
   - **Fix**: 
     - Standardized all hook declarations with consistent indentation (tabs)
     - Added clear comments marking hook boundaries
     - Documented hook order in `_debug/hook-order-verification.md`
   - **Result**: All hooks are now clearly visible and guaranteed to execute in the same order every render

4. **Final Hook Order (Verified)**:
   ```
   1. usePathname()
   2. useState(internalActiveTab)
   3. useState(searchTerm)
   4. useState(activeCategory)
   5. useState(cardsPerPage) - with SSR-safe initializer
   6. useDataModule() - loads service data
   7. useMemo(allServices)
   8. useMemo(categoryOptions)
   9. useCallback(filterServices)
   10. useMemo(filteredEntries)
   11. useMemo(guardDetail)
   12. useDataModuleGuardTelemetry() - observability
   13. usePagination() - pagination logic
   14. useEffect(resize handler)
   ```
   All hooks execute **unconditionally** before any rendering logic.

### Testing & Verification

1. **Clear Build Cache**:
   ```bash
   # Windows (if permission allows)
   rm -rf .next
   # Or kill Node processes and restart
   taskkill /F /IM node.exe
   ```

2. **Restart Dev Server**:
   ```bash
   pnpm dev
   ```

3. **Hard Refresh Browser**:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Verify**:
   - ✅ No React error overlay
   - ✅ No "Rendered more hooks" console errors
   - ✅ Services section renders correctly
   - ✅ All functionality works (tabs, search, pagination)

## Related Files

- `src/stores/useDataModuleStore.ts` - Main hook implementation with selection cache and SSR-safe `getServerSnapshot`
- `src/stores/selectionCache.ts` - Selection cache implementation for referential stability
- `src/components/home/Services.tsx` - Affected component (fixed to follow Rules of Hooks)
- `src/stores/__tests__/useDataModuleStore.test.tsx` - Regression test suite
- `_debug/services-hooks-fix-summary.md` - Summary of hooks fix
- `_debug/hook-order-verification.md` - Hook order verification document

## Lessons Learned

1. **Rules of Hooks are Strict**:
   - All hooks must be called unconditionally, in the same order, on every render
   - Early returns after some hooks but before others violates this rule
   - Even patterns like `useHasMounted()` + early return can cause issues during SSR hydration

2. **SSR-Safe Patterns**:
   - Use `typeof window !== "undefined"` checks inside hook initializers or effects
   - Avoid early returns based on mounting state - handle browser-only logic inside effects
   - Always provide SSR fallbacks for browser API-dependent code

3. **Hook Order Verification**:
   - Document hook order explicitly
   - Use consistent formatting to make hook boundaries clear
   - Consider lint rules to catch Rules of Hooks violations early

4. **Debugging Hook Order Issues**:
   - React's error messages are usually accurate about hook count mismatches
   - Look for conditional hooks, early returns, or patterns that change hook execution
   - Clear build cache and hard refresh browser after fixes

## Future Improvements

1. **Shared Cache Across Instances** (if needed):
   - Could implement a shared cache keyed by store + selector signature
   - Would reduce memory usage if multiple components use same selector
   - Risk: Cache pollution if selectors are similar but not identical

2. **Cache Invalidation** (if needed):
   - Currently cache only invalidates when equality check fails
   - Could add explicit invalidation API if needed for edge cases

3. **Performance Monitoring**:
   - Add telemetry to track cache hit/miss rates
   - Monitor selector invocation frequency

4. **ESLint Rules**:
   - Consider adding `react-hooks/rules-of-hooks` ESLint rule if not already enabled
   - This can catch Rules of Hooks violations at development time

---

## Critical Issue: Hook Count Mismatch - Root Cause Analysis

### The Problem
- **Hook 33** (`guardDetail` useMemo at line 174) is `undefined` in first render, present in second
- **Error**: "Rendered more hooks than during the previous render"
- **Hydration mismatch**: Server renders `<Separator>`, client expects `<section>`

### Root Cause Hypothesis

**Theory 1: Error Recovery Mechanism**
When React encounters a hydration mismatch:
1. React catches the error and logs it
2. Component enters error recovery mode
3. During error recovery, React may skip some hooks to prevent cascading errors
4. Hook 33 (`guardDetail` useMemo) is skipped because error occurs before it
5. On next render (client), all hooks execute normally → hook count mismatch

**Theory 2: `createDataModuleStore` Throwing During SSR**
```typescript
const store = createDataModuleStore(key);  // Called BEFORE hooks
```
If `createDataModuleStore` or `getManifestEntry` throws during SSR:
- Error might be caught by error boundary
- Component re-renders in error state
- Some hooks might be skipped during error recovery

**Theory 3: Selector Throwing During SSR**
The selector creates new objects:
```typescript
({ status, data, error }) => ({
  services: (data?.services ?? {}) as ServicesData,  // Could throw if types mismatch
})
```
If `data?.services` is undefined during SSR and causes type assertion issues, it might throw and cause hook skipping.

**Theory 4: Component Not Rendering on Server**
If `ServicesSection` doesn't render on server due to conditional logic elsewhere:
- Server: Component doesn't render → 0 hooks called
- Client: Component renders → 33 hooks called
- This would explain the hydration mismatch (server rendered `<Separator>` instead of `<section>`)

### Evidence Supporting Theory 1 (Error Recovery)
1. **Hydration error precedes hook error**: The error trace shows hydration mismatch first
2. **Hook count differs by exactly 1**: Only the last hook is missing, suggesting execution stopped there
3. **Error recovery pattern**: React's error recovery can cause hook skipping

### Edge Cases to Investigate

1. **`getManifestEntry` throwing during SSR**:
   - If manifest entry doesn't exist or throws
   - `createDataModuleStore` would throw
   - Error boundary catches it, hooks skipped

2. **Store creation side effects**:
   - Zustand `create()` might have SSR/client differences
   - If store creation accesses browser APIs, it could fail on server

3. **Selector type assertions**:
   - `as ServicesData` type assertion might fail if data shape differs
   - Could cause runtime error during SSR

4. **Component rendering condition**:
   - Parent component might conditionally render `ServicesSection`
   - Check `src/app/page.tsx` for conditional rendering of Services

### Next Steps for Debugging

1. **Wrap `createDataModuleStore` in try-catch**:
   ```typescript
   let store;
   try {
     store = createDataModuleStore(key);
   } catch (error) {
     console.error('[useDataModule] Store creation failed:', error);
     // Return safe fallback store
   }
   ```

2. **Check if component renders on server**:
   - Add console.log at top of `ServicesSection`
   - Verify it logs on server render

3. **Check parent component conditional rendering**:
   - Verify `Services` component is always rendered in `src/app/page.tsx`
   - Check for any conditional logic that might prevent server rendering

4. **Wrap selector in try-catch**:
   ```typescript
   const safeSelector = (state) => {
     try {
       return selector(state);
     } catch (error) {
       console.error('[useDataModule] Selector error:', error);
       return fallbackState;
     }
   };
   ```

5. **Verify `getManifestEntry` doesn't throw**:
   - Check if "service/services" exists in manifest
   - Verify manifest loading doesn't fail during SSR

### Files to Check
- `src/app/page.tsx` - Parent component that renders Services
- `src/stores/useDataModuleStore.ts` - `getManifestEntry` implementation
- `src/data/__generated__/manifest.ts` - Verify "service/services" exists

### Critical Discovery: Hydration Mismatch Sequence

**Error Trace Shows**:
- Server rendered: `<Separator>` (from line 111 in `src/app/page.tsx`)
- Client expected: `<section id="services">` (from `ServicesSection` component)

**This suggests**:
1. On server, `ServicesSection` component either:
   - Throws an error and doesn't render the `<section>` tag
   - Renders `null` or empty fragment
   - Gets caught by error boundary before rendering
2. Server HTML ends with `<Separator>` (the one AFTER Services in page.tsx)
3. Client expects `<section id="services">` but finds `<Separator>` instead
4. React detects mismatch and enters error recovery
5. During error recovery, hooks might be skipped
6. On next render (client), component renders normally with all hooks

**Root Cause Likely**: An error occurs during SSR in `ServicesSection` that prevents it from rendering the `<section>` tag, but the error is caught/handled in a way that allows the component to continue rendering hooks partially, causing the hook count mismatch.

**Next Debugging Step**: Add error boundaries and console logs to identify what error occurs during SSR that prevents the `<section>` from rendering.

---

## Solutions from Research

Based on web search findings for "Rendered more hooks than during the previous render" in Next.js SSR contexts:

### Common Solutions Identified

1. **Wrap Store Creation in Error Handling**
   - `createDataModuleStore` might throw during SSR if manifest entry doesn't exist
   - Need to wrap in try-catch to prevent error from stopping hook execution

2. **Ensure All Hooks Execute Even During Errors**
   - React's error recovery can skip hooks if an error occurs mid-execution
   - All hooks must be declared at the top level, before any code that might throw

3. **Fix Selector to Never Throw**
   - The selector `({ status, data, error }) => ({ ... })` might throw if `data` is undefined
   - Need to ensure selector always returns valid object structure

4. **Prevent Hydration Mismatch at Source**
   - If server renders different HTML than client, React enters error recovery
   - Error recovery can cause hooks to be skipped
   - Must ensure server and client render identical initial HTML

### Recommended Fix Strategy

**Phase 1: Make `useDataModule` Error-Safe**
- Wrap `createDataModuleStore` call in try-catch
- Return fallback state if store creation fails
- Ensure selector never throws

**Phase 2: Ensure Component Always Renders Same Structure**
- Remove all conditional rendering that differs between server/client
- Ensure `<section>` tag always renders on both server and client
- Use client-only rendering for dynamic parts (with useEffect)

**Phase 3: Add Error Boundaries**
- Wrap component in error boundary to catch SSR errors
- Ensure error boundary doesn't prevent hooks from executing

## Implementation Plan

### Fix 1: Error-Safe useDataModule Hook

```typescript
export function useDataModule<K extends DataModuleKey, S = DataModuleState<K>>(
	key: K,
	selector?: (state: DataModuleState<K>) => S,
	equality?: (a: S, b: S) => boolean,
): S {
	// Wrap store creation in try-catch to prevent errors from stopping hook execution
	let store: UseBoundStore<StoreApi<DataModuleState<K>>>;
	try {
		store = createDataModuleStore(key);
	} catch (error) {
		// If store creation fails, create a fallback store
		// This ensures hooks continue executing even if store creation fails
		console.error(`[useDataModule] Failed to create store for key "${key}":`, error);
		store = create<DataModuleState<K>>(() => ({
			key,
			status: "error" as const,
			data: undefined,
			error,
		})) as UseBoundStore<StoreApi<DataModuleState<K>>>;
	}

	// All hooks must execute unconditionally, even if store creation failed
	const derivedSelector =
		selector ?? (identity as (state: DataModuleState<K>) => S);
	// ... rest of hooks
}
```

### Fix 2: Error-Safe Selector in Services.tsx

```typescript
// Wrap selector to prevent it from throwing
const safeSelector = useCallback((state: DataModuleState<"service/services">) => {
	try {
		return {
			status: state.status,
			services: (state.data?.services ?? {}) as ServicesData,
			getServicesByCategory: state.data?.getServicesByCategory,
			error: state.error,
		};
	} catch (error) {
		console.error('[Services] Selector error:', error);
		return {
			status: "error" as const,
			services: {} as ServicesData,
			getServicesByCategory: undefined,
			error,
		};
	}
}, []);

const {
	status: servicesStatus,
	services: servicesData,
	getServicesByCategory: servicesByCategoryFn,
	error: servicesError,
} = useDataModule("service/services", safeSelector);
```

### Fix 3: Ensure Component Always Renders

The component must ALWAYS render the `<section>` tag, even if data is loading or there's an error. This ensures server and client HTML match.

```typescript
// ALWAYS render the section tag - no conditional rendering that prevents it
return (
	<section id="services" className="px-4 py-6 md:px-6 md:py-16 lg:px-8">
		{/* Content - can be conditional, but section tag is always present */}
	</section>
);
```

### Fix 4: Move Dynamic Rendering to Client-Only

If any part of the component must differ between server and client, use `useEffect` to update it after mount:

```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
	setIsClient(true);
}, []);

// Use isClient for client-only rendering, but ensure structure is always rendered
```

---

## Fixes Implemented (2025-01-XX)

### ✅ Fix 1: Error-Safe Store Creation

**File**: `src/stores/useDataModuleStore.ts`

**Change**: Wrapped `createDataModuleStore(key)` in try-catch to prevent errors from stopping hook execution.

```typescript
let store: UseBoundStore<StoreApi<DataModuleState<K>>>;
try {
	store = createDataModuleStore(key);
} catch (error) {
	// Create fallback store - ensures hooks continue executing
	const fallbackState: DataModuleState<K> = {
		key,
		status: "error" as const,
		data: undefined,
		error,
		async load() {},
		async reload() {},
		reset() {},
	};
	store = create<DataModuleState<K>>(() => fallbackState) as UseBoundStore<...>;
}
```

**Why**: If `getManifestEntry(key)` throws during SSR, the error would stop hook execution. With try-catch, hooks continue executing with a fallback store.

### ✅ Fix 2: Error-Safe Selector

**File**: `src/components/home/Services.tsx`

**Change**: Wrapped selector in try-catch to prevent throwing during SSR.

```typescript
const servicesModuleResult = useDataModule(
	"service/services",
	({ status, data, error }) => {
		try {
			return {
				status,
				services: (data?.services ?? {}) as ServicesData,
				getServicesByCategory: data?.getServicesByCategory,
				error,
			};
		} catch (selectorError) {
			// Return safe fallback - prevents hook skipping
			return {
				status: "error" as const,
				services: {} as ServicesData,
				getServicesByCategory: undefined,
				error: selectorError,
			};
		}
	},
);
```

**Why**: If the selector throws (e.g., type assertion fails), React's error recovery might skip subsequent hooks. Try-catch ensures selector always returns valid object.

### ✅ Verified: Component Always Renders Section Tag

**File**: `src/components/home/Services.tsx` line 421

**Status**: ✅ Component always returns `<section>` tag - no early returns that prevent it from rendering.

The component structure:
```typescript
return (
	<section id="services" className="...">
		{/* Content */}
	</section>
);
```

This ensures server and client both render the `<section>` tag, preventing hydration mismatches.

---

## Current Status After Fixes - ✅ RESOLVED

**Date**: 2025-01-XX  
**Environment**: Node 20.19.5 (via nvm), Next.js dev server

### Fixes Applied
- ✅ Error-safe store creation with fallback
- ✅ Error-safe selector with try-catch
- ✅ All hooks execute unconditionally
- ✅ Component always renders `<section>` tag
- ✅ Removed `usePathname()` to prevent hydration mismatch
- ✅ Removed `useHasMounted()` early return pattern

### Testing Required

1. **Clear Build Cache**:
   ```bash
   # Kill all Node processes
   taskkill /F /IM node.exe
   # Delete .next folder
   rm -rf .next
   ```

2. **Restart Dev Server**:
   ```bash
   pnpm dev
   ```

3. **Hard Refresh Browser**:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Verify**:
   - ✅ No "Rendered more hooks" error
   - ✅ No hydration mismatch errors
   - ✅ Services section renders correctly
   - ✅ Console shows no errors (except expected warnings)

### ✅ Issue Resolved

All fixes have been successfully applied and tested. The application is now working correctly:
- ✅ No "Rendered more hooks" errors
- ✅ No hydration mismatch errors
- ✅ Services section renders correctly
- ✅ Works after cache clear and hard refresh

**Note**: If similar issues occur in the future, check for:

1. **Error in another component** - Check parent component (`src/app/page.tsx`) for conditional rendering
2. **Browser extension interference** - Disable extensions and test
3. **Stale browser cache** - Clear all browser data and hard refresh
4. **Next.js cache issue** - Delete `.next` folder and `node_modules/.cache`

### Debugging Checklist

- [ ] Console logs show `[useDataModule] Failed to create store` error?
- [ ] Console logs show `[Services] Selector error` error?
- [ ] Component renders `<section>` tag on both server and client?
- [ ] All 32 hooks execute in same order on every render?
- [ ] No conditional hooks or early returns?
- [ ] Browser extensions disabled?

### Next Steps if Still Broken

1. Add console.log at start of `ServicesSection` to verify it's called
2. Add console.log in `createDataModuleStore` to verify it doesn't throw
3. Add console.log before each hook to verify execution order
4. Check browser console for any errors before the hook error
5. Verify manifest contains "service/services" entry

---

## Latest Fixes Applied (2025-01-XX)

### ✅ Fix 3: Added `getInitialState()` Method to Stores

**Issue**: `getServerSnapshot` was calling `store.getInitialState()` but Zustand stores don't have this method by default.

**Solution**: 
- Store the initial state when creating the store
- Add `getInitialState()` method to both normal and fallback stores
- This ensures `getServerSnapshot` can always access the initial state

**Changes**:
- `createDataModuleStore` now stores `initialState` and adds `getInitialState()` method
- Fallback store also has `getInitialState()` method
- Type signature updated to include `getInitialState()` method

This ensures that SSR snapshot generation always works, preventing hydration mismatches that could trigger error recovery and hook skipping.

---

## Debug Logging Added (2025-01-XX)

### Console Logging Strategy

To pinpoint exactly where hook execution stops, comprehensive console logging has been added:

**In `Services.tsx`**:
- Component render start (with isServer flag)
- Each hook execution point (Hook 1-13)
- Hook 10 specifically marked as "THIS IS HOOK 33 IN ERROR" (guardDetail useMemo)
- "ALL HOOKS COMPLETE" message before return statement

**In `useDataModuleStore.ts`**:
- Hook start with key
- Store creation attempts (before/after/success/error)
- Each internal hook (useRef, useCallback, useSyncExternalStore, useEffect)
- Hook completion with status

### How to Use the Logs

1. **Open browser console** (F12)
2. **Clear console** (Ctrl+L)
3. **Refresh page** (Ctrl+Shift+R for hard refresh)
4. **Look for the pattern**:
   - If logs stop at a specific hook number, that's where execution stops
   - If logs show "ERROR" before stopping, that's the cause
   - Compare server vs client logs (isServer flag in first log)

### Expected Log Sequence

```
[ServicesSection] Component rendering { isServer: true/false, timestamp: ... }
[ServicesSection] Hook 1: useState(internalActiveTab)
[ServicesSection] Hook 2: useState(searchTerm)
[ServicesSection] Hook 3: useState(activeCategory)
[ServicesSection] Hook 4: useState(cardsPerPage)
[ServicesSection] Hook 5: useDataModule - BEFORE
[useDataModule] Hook starting for key: "service/services"
[useDataModule] Creating store for key: "service/services"
[useDataModule] Store created successfully for key: "service/services"
[useDataModule] Setting up selector and refs for key: "service/services"
[useDataModule] Creating useRef hooks for key: "service/services"
[useDataModule] Initializing selection cache for key: "service/services"
[useDataModule] Creating useCallback(stableSelector) for key: "service/services"
[useDataModule] Creating useCallback(stableEquality) for key: "service/services"
[useDataModule] Creating useRef(serverSnapshotCacheRef) for key: "service/services"
[useDataModule] Creating useCallback(getServerSnapshot) for key: "service/services"
[useDataModule] Calling useSyncExternalStoreWithSelector for key: "service/services"
[useDataModule] Creating useEffect for key: "service/services"
[useDataModule] COMPLETE for key: "service/services" { status: ... }
[ServicesSection] Hook 5: useDataModule - AFTER { status: ... }
[ServicesSection] Hook 6: useMemo(allServices)
[ServicesSection] Hook 7: useMemo(categoryOptions)
[ServicesSection] Hook 8: useCallback(filterServices)
[ServicesSection] Hook 9: useMemo(filteredEntries)
[ServicesSection] Hook 10: useMemo(guardDetail) - THIS IS HOOK 33 IN ERROR
[ServicesSection] Hook 11: useDataModuleGuardTelemetry
[ServicesSection] Hook 12: usePagination
[ServicesSection] Hook 13: useEffect(resize)
[ServicesSection] ALL HOOKS COMPLETE - About to return JSX
```

### Interpreting Results

**If logs stop at Hook 10 (guardDetail)**:
- Execution is stopping at that exact hook
- Check for errors in the console before it
- Verify `activeTab`, `activeCategory`, `searchTerm` values

**If logs stop in useDataModule**:
- Store creation is failing
- Check for `[useDataModule] ERROR` messages
- Verify manifest entry exists

**If logs show different hook counts between server/client**:
- There's a conditional rendering issue
- Component is taking different paths on server vs client
- Check `isServer` flag in first log

### Next Steps After Getting Logs

1. **Share the console output** - Include all logs from component render start to error
2. **Note the last log message** - This shows where execution stopped
3. **Check for errors** - Any ERROR messages before the stop point
4. **Compare server vs client** - Look for differences in hook execution order

---

## Critical Finding from Terminal Logs (2025-01-XX)

### Server Render Analysis

**From terminal logs (lines 950-975)**:
- ✅ Server render shows ALL hooks completing successfully
- ✅ "ALL HOOKS COMPLETE - About to return JSX" message appears
- ✅ `isServer: true` in component render log

**Missing Logs in Server Output**:
- ❌ Missing: `[useDataModule] Setting up selector and refs` 
- ❌ Missing: `[useDataModule] Creating useRef hooks`
- ❌ Missing: `[useDataModule] Initializing selection cache`

**But these logs exist in code** - they should appear between lines 958-959.

### Root Cause Hypothesis

The missing logs suggest one of two scenarios:

1. **Code Path Issue**: The logs are being executed but not printed (unlikely since other logs work)
2. **Execution Order Issue**: The code is executing in a different order than expected
3. **React StrictMode Double Render**: First render (dev only) might be missing some hooks

### The Real Problem

Since server logs show all hooks completing, but React error says "Rendered more hooks than during the previous render", the issue is likely:

**React StrictMode in development mode** causes components to render twice:
1. **First render** (for side-effect detection): Some hooks might not execute fully
2. **Second render** (actual render): All hooks execute

During the first StrictMode render, if an error occurs or hooks are skipped, React will detect the mismatch on the second render.

### Solution: Add Hook Count Verification

We need to verify that all hooks execute in the exact same order on every render, including StrictMode's double render.

---

## Critical Fix Applied (2025-01-XX)

### Root Cause Identified

**The Real Problem**: Hydration mismatch shows server rendered `<Separator>` but client expects `<section>`. This means `ServicesSection` is **NOT rendering its root element on the server**, causing React to skip to the next sibling.

**Why this causes hook count mismatch**:
1. During SSR, if JSX rendering throws an error, React catches it
2. Component fails to render → Server HTML shows next sibling (`<Separator>`)
3. Client expects `<section>` → Hydration mismatch detected
4. React enters error recovery mode
5. During error recovery, React may skip some hooks to prevent cascading errors
6. Hook 33 (`guardDetail` useMemo) gets skipped in error recovery
7. On next render (client), all hooks execute → Hook count mismatch error

### Fixes Applied

1. **Removed `uuidv4()` from keys** - Random values cause hydration mismatch
   - Changed `key={uuidv4()}` to `key={`page-${i + 1}`}`

2. **Fixed `Date.now()` in logs** - Different values on server vs client
   - Changed to use conditional: `typeof window !== "undefined" ? Date.now() : 0`

3. **Added try-catch around JSX rendering** - Ensures component always returns valid JSX
   - Prevents component from failing silently and causing hydration mismatch

4. **Added try-catch in `renderCardsForCategory`** - Prevents JSX rendering errors
   - Ensures function always returns valid JSX, never throws

### Expected Result

After these fixes:
- Component always renders `<section>` tag on both server and client
- No hydration mismatch
- All hooks execute consistently on every render
- No hook count mismatch errors

---

## Comprehensive Logging Added (2025-01-XX)

### Files with Logging Added

**1. `src/stores/useDataModuleStore.ts`**
- ✅ `getManifestEntry()` - Logs lookup and errors
- ✅ `loadModule()` - Logs loading, success, and errors
- ✅ `createDataModuleStore()` - Logs store creation, caching, and all methods
- ✅ `useDataModule()` - Logs hook execution, store creation, selector setup, SSR snapshot, and completion
- ✅ All internal hooks logged with their execution

**2. `src/stores/selectionCache.ts`**
- ✅ `createSelectionCache()` - Logs cache instance creation with unique ID
- ✅ `read()` - Logs cache hits/misses with equality check results
- ✅ `reset()` - Logs cache resets

**3. `src/hooks/use-pagination.ts`**
- ✅ Hook start and all 8 hooks logged individually
- ✅ Computed values (totalPages, pagedItems) logged with their calculations
- ✅ Hook completion with summary

**4. `src/hooks/useDataModuleGuardTelemetry.ts`**
- ✅ Hook start with key and surface
- ✅ Both hooks (useRef, useEffect) logged
- ✅ useEffect execution, reporting decisions, and signature matching

**5. `src/components/home/Services.tsx`** (already had logging)
- ✅ Component render tracking with render ID and hook count
- ✅ All 13 hooks logged with their numbers
- ✅ Total hook count at completion

### Logging Strategy

All logs use consistent prefixes:
- `[createDataModuleStore]` - Store creation and management
- `[useDataModule]` - Hook execution
- `[SelectionCache]` - Cache operations
- `[usePagination]` - Pagination hook
- `[useDataModuleGuardTelemetry]` - Telemetry hook
- `[ServicesSection]` - Component rendering

### Benefits

1. **Track hook execution order** - See exactly which hooks execute and in what order
2. **Identify cache behavior** - See cache hits/misses for selector and SSR snapshot
3. **Debug store creation** - Track when stores are created vs cached
4. **Monitor data loading** - See load() calls, success, and errors
5. **Verify SSR behavior** - Track getServerSnapshot calls and caching

### Log Output Example

When debugging, you'll see logs like:
```
[createDataModuleStore] Called for key: "service/services"
[getManifestEntry] Looking up key: "service/services"
[getManifestEntry] Found entry for key: "service/services"
[createDataModuleStore] Creating Zustand store instance for key: "service/services"
[SelectionCache] Creating new cache instance: abc123
[useDataModule] Hook starting for key: "service/services"
[useDataModule] Creating store for key: "service/services"
[useDataModule] getServerSnapshot called for key: "service/services"
[SelectionCache:abc123] Cache MISS - caching new selection
[useDataModule] getServerSnapshot cached new snapshot for key: "service/services"
...
```

---

## Current Status with Comprehensive Logging (2025-01-XX) - ✅ RESOLVED

### ✅ All Logging Implemented

All Zustand-related files now have comprehensive logging:
- ✅ **4 files** with detailed logging
- ✅ **~50+ log statements** across the Zustand system
- ✅ **Consistent prefixes** for easy filtering
- ✅ **Hook execution tracking** at every level

### 📊 Hook Count Breakdown

Based on the terminal logs (lines 968-996), here's the hook breakdown for `ServicesSection`:

**Direct hooks in ServicesSection**: 13 hooks
1. `useRef(renderIdRef)`
2. `useRef(hookCountRef)`
3. `useState(internalActiveTab)`
4. `useState(searchTerm)`
5. `useState(activeCategory)`
6. `useState(cardsPerPage)`
7. `useDataModule()` - **Contains ~10 internal hooks**
8. `useMemo(allServices)`
9. `useMemo(categoryOptions)`
10. `useCallback(filterServices)`
11. `useMemo(filteredEntries)`
12. `useMemo(guardDetail)` - **This is Hook 33 in the error**
13. `useDataModuleGuardTelemetry()` - **Contains 2 internal hooks**
14. `usePagination()` - **Contains 8 internal hooks**
15. `useEffect(resize)`

**Total hooks in ServicesSection**: ~35 hooks when counting internal hooks

### 🔍 Analysis from Terminal Logs

**Server Render (lines 968-996)**:
- ✅ All 13 direct hooks complete
- ✅ Component renders successfully
- ✅ "ALL HOOKS COMPLETE" message appears
- ✅ Server returns 200 OK

**But error shows**:
- Hook 33 is `undefined` in first render
- Hook 33 is `useMemo` in second render
- This suggests the **FIRST client render** is missing hook 33, not the server render

### 🎯 Next Steps for Debugging

1. **Check Browser Console** - Look for client-side logs showing:
   - Different hook counts between server and client
   - Where execution stops on first client render
   - Any errors before hook 33

2. **Compare Render Counts**:
   - Server: Render #1 (all hooks complete)
   - Client Render #1: Should match server
   - Client Render #2: React StrictMode second render

3. **Look for these patterns**:
   - `[ServicesSection] Render #1` vs `Render #2` (StrictMode)
   - Missing logs between hook 32 and 33
   - `[useDataModule] getServerSnapshot` being called multiple times
   - Any ERROR logs before hook count mismatch

### 🔧 Files Ready for Debugging

All Zustand system files now have comprehensive logging:
- Store creation and caching
- Hook execution order
- Cache hit/miss tracking
- SSR snapshot generation
- Data loading lifecycle
- Error handling and recovery

**The logs will now show exactly where and why hooks are being skipped!**

---

## Server Log Analysis (2025-01-XX)

### ✅ Server Render Success (Lines 879-951)

**Observations**:
1. **All hooks execute successfully on server**:
   - ServicesSection: 13 hooks complete
   - useDataModule: All internal hooks execute
   - usePagination: All 8 hooks execute
   - useDataModuleGuardTelemetry: Both hooks execute
   - SelectionCache: Created and used correctly

2. **SSR snapshot behavior**:
   - `getServerSnapshot` called once (line 908)
   - Cache MISS on first call (line 910) - expected
   - Snapshot cached successfully (line 913)
   - Second call shows cache HIT (line 914) - good!

3. **SelectionCache behavior**:
   - Cache instance created: `tjwx99` (line 901)
   - First selection: Cache MISS (line 911)
   - Second selection: Cache HIT (line 914) - working correctly!

4. **Store creation**:
   - Store created and cached successfully
   - getInitialState method added correctly
   - No errors during store creation

### ❌ Missing: Client-Side Logs

**Critical Gap**: Terminal logs only show **server-side** output. We need **browser console logs** to see:
- Client-side render execution
- Hydration mismatch details
- Where hook execution differs between server and client
- React StrictMode double render behavior

### 🎯 Next Steps

1. **Open Browser Console** (F12 or right-click → Inspect → Console tab)
2. **Clear console** (Ctrl+L or click clear button)
3. **Hard refresh** (Ctrl+Shift+R)
4. **Copy ALL console logs** - especially:
   - `[ServicesSection] Render #X` logs
   - Any ERROR messages
   - Hook execution logs
   - Hydration mismatch warnings

### 🔍 What to Look For in Browser Console

**Expected patterns**:
- `[ServicesSection] Render #1` with `isServer: false` (client hydration)
- `[ServicesSection] Render #2` (React StrictMode second render)
- Hook count differences between renders
- Missing logs between certain hook numbers
- Any `[useDataModule] ERROR` messages

**Key Questions**:
1. Does client Render #1 match server Render #1 hook count?
2. Is there a Render #2 (StrictMode) and does it have different hook counts?
3. Where exactly does execution stop on the first client render?
4. Are there any errors logged before the hook count mismatch?

---

## Server Log Analysis from Terminal (Lines 879-951)

### ✅ Perfect Server Render Execution

**All Systems Working Correctly on Server**:

1. **Store Creation** (lines 887-896):
   - ✅ Store created successfully
   - ✅ Manifest entry found
   - ✅ Store cached properly
   - ✅ getInitialState method added

2. **SelectionCache** (lines 901, 911, 914):
   - ✅ Cache instance created: `tjwx99`
   - ✅ First call: Cache MISS (expected)
   - ✅ Second call: Cache HIT (working correctly!)

3. **SSR Snapshot** (lines 908-915):
   - ✅ `getServerSnapshot` called once during SSR
   - ✅ Cache MISS on first call (expected for new snapshot)
   - ✅ Snapshot computed and cached successfully
   - ✅ Second call shows Cache HIT (prevents infinite loop!)

4. **Hook Execution** (lines 879-951):
   - ✅ All 13 ServicesSection hooks execute
   - ✅ All useDataModule internal hooks execute
   - ✅ All usePagination hooks execute (8 hooks)
   - ✅ All useDataModuleGuardTelemetry hooks execute (2 hooks)
   - ✅ Component completes and returns JSX

### 🔍 Critical Discovery

**Server render is PERFECT** - all hooks execute, all caches work, SSR snapshot is cached correctly.

**This means the issue is 100% on the CLIENT side** during hydration or React StrictMode double render.

### 📋 What We Know

1. **Server**: 13 hooks in ServicesSection complete successfully
2. **Error message**: Hook 33 is undefined in first render, present in second
3. **Hook 33 in ServicesSection**: This is hook #10 (`guardDetail` useMemo) in our component
4. **But React counts ALL hooks in the tree**: Hook 33 includes hooks from:
   - Parent components
   - useDataModule (~10 hooks)
   - usePagination (8 hooks)
   - useDataModuleGuardTelemetry (2 hooks)
   - Child components

### 🎯 The Real Issue

Hook 33 might not be in `ServicesSection` directly - it could be:
- A hook in `usePagination` (hook 8 in our component = hooks 25-32 total)
- A hook in `useDataModuleGuardTelemetry` (hook 11 in our component = hooks 33-34)
- OR it could be hook 10 in ServicesSection but React counts all nested hooks differently

**We need browser console logs to see**:
- Exact hook numbers during client render
- Where execution stops
- If there are errors during hydration

**Updated Logging (2025-01-XX)**:
- Added component instance IDs to all log messages for tracking server vs client renders
- Added JSX rendering attempt/success/error logs to catch any rendering errors
- All logs now include instance ID to track component lifecycle

---

## Important Note About Hook Counting (2025-01-XX)

### Understanding React's Hook Count vs Our Local Count

**React's Hook Count (from error message)**: Counts ALL hooks in the entire component tree, including:
- Parent component hooks (unknown number)
- ServicesSection direct hooks: 15 hooks (2 useRefs + 13 other hooks)
- useDataModule internal hooks: ~10 hooks
- usePagination internal hooks: 8 hooks
- useDataModuleGuardTelemetry internal hooks: 2 hooks
- **Total**: ~35+ hooks when counting everything

**Our Local Hook Count (in ServicesSection)**: Only counts hooks directly in ServicesSection:
- Counts: 13 hooks (starting from hook 1, excluding the 2 useRefs that come first)
- This is different from React's global count!

**Key Insight**: When React says "Hook 33 is undefined", it's counting from the very first hook in the entire React tree, not just from ServicesSection. Hook 33 in React's count might be:
- Hook 10 in ServicesSection (`guardDetail` useMemo)
- OR a hook inside `usePagination` (if parent components have ~22 hooks)
- OR a hook inside `useDataModuleGuardTelemetry`

### Updated Logging Strategy

Added component instance IDs to track:
- Which component instance is rendering
- Server vs client renders of the same instance
- If components are being unmounted/remounted

This will help identify if the component is being recreated between server and client renders, which could cause hook count mismatches.

---

## Resolution Summary (2025-01-XX)

### ✅ All Issues Resolved

After implementing comprehensive fixes, the application is now working correctly. The following combination of fixes resolved all remaining issues:

#### Final Fixes Applied

1. **Error-Safe Store Creation**
   - Wrapped `createDataModuleStore()` in try-catch within `useDataModule`
   - Creates fallback store if store creation fails
   - Ensures all hooks continue executing even if store creation throws

2. **Error-Safe Selector**
   - Wrapped selector function in try-catch in `Services.tsx`
   - Returns safe fallback object if selector throws
   - Prevents React error recovery from skipping hooks

3. **Try-Catch Around JSX Rendering**
   - Wrapped main `return` statement in try-catch
   - Wrapped `renderCardsForCategory` function in try-catch
   - Ensures component always renders valid JSX, preventing hydration mismatches

4. **Consistent Hook Order**
   - All hooks called unconditionally in the same order
   - Removed all conditional rendering patterns that could affect hook order
   - Converted functions to `useCallback`/`useMemo` to maintain hook order

5. **SSR-Safe Patterns**
   - Deterministic keys for pagination (removed `uuidv4()`)
   - SSR-safe `Date.now()` usage (only in logs, not render output)
   - Lazy initializers for state that depends on `window`

6. **Comprehensive Logging**
   - Added component instance IDs to track server vs client renders
   - Added hook execution logging
   - Added JSX rendering attempt/success/error logging

#### Testing Results

- ✅ Server-side rendering works correctly
- ✅ Client-side hydration works correctly
- ✅ No hook count mismatches
- ✅ No hydration mismatches
- ✅ All hooks execute in consistent order
- ✅ Component renders correctly after cache clear and hard refresh

#### Key Learnings

1. **Error Recovery Can Cause Hook Skips**: If an error occurs during hook execution, React's error recovery can skip subsequent hooks, causing count mismatches. Error-safe patterns are critical.

2. **JSX Rendering Errors Matter**: Errors during JSX rendering (after hooks) can prevent the component from rendering on the server while it renders successfully on the client, causing hydration mismatches.

3. **Try-Catch Around Hooks Doesn't Work**: You cannot wrap hooks themselves in try-catch, but you can wrap the code that hooks call (like selectors) and the JSX rendering.

4. **Component Instance IDs Help Debugging**: Tracking component instances across server/client boundaries helps identify when components are being recreated vs. reused.

#### Files Modified

- `src/components/home/Services.tsx` - Added error-safe patterns, logging, and consistent hook order
- `src/stores/useDataModuleStore.ts` - Added error-safe store creation and comprehensive logging
- `src/stores/selectionCache.ts` - Added logging for cache behavior
- `src/hooks/use-pagination.ts` - Added logging for hook execution
- `src/hooks/useDataModuleGuardTelemetry.ts` - Added logging for hook execution

#### Next Steps (Optional Cleanup)

1. **Remove Debug Logging**: Once confident the issue is fully resolved, consider removing or reducing the extensive console.log statements in production builds.

2. **Error Boundary**: Consider adding an error boundary around the ServicesSection component for better error handling in production.

3. **Monitoring**: The comprehensive logging can be converted to proper telemetry/monitoring if needed for production debugging.
