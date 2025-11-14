# Services.tsx Hooks Fix Summary

## Problem
"Rendered more hooks than during the previous render" error - React detected that hooks were being called in different orders or different numbers between renders.

## Root Cause
1. **Removed `useHasMounted()` early return pattern**: The `useHasMounted()` hook itself uses hooks (`useState`, `useEffect`), and having an early return after it but before other hooks could cause hook count mismatches during SSR/hydration.
2. **All hooks now unconditional**: All hooks are guaranteed to be called in the same order on every render, regardless of data loading state.

## Fixes Applied

### 1. Removed `useHasMounted` Pattern
- **Before**: Component used `useHasMounted()` and returned early if not mounted
- **After**: Removed the early return pattern entirely
- **Why**: Early returns after some hooks but before others violates Rules of Hooks

### 2. Standardized Hook Order
All hooks are now called unconditionally in this exact order:
1. `usePathname()`
2. `useState` hooks (internalActiveTab, searchTerm, activeCategory, cardsPerPage)
3. `useDataModule()` - loads service data
4. `useMemo` hooks (allServices, categoryOptions)
5. `useCallback` (filterServices)
6. `useMemo` hooks (filteredEntries, guardDetail)
7. `useDataModuleGuardTelemetry()` - observability
8. `usePagination()` - pagination logic
9. `useEffect` (resize handler)

### 3. SSR-Safe Initialization
- `cardsPerPage` uses a lazy initializer function that safely checks `typeof window !== "undefined"`
- `useEffect` for resize handler checks `typeof window === "undefined"` before accessing window

## Testing Steps
1. **Clear Next.js cache**: Stop dev server and delete `.next` folder (or restart dev server)
2. **Hard refresh browser**: Clear browser cache or do Ctrl+Shift+R (Cmd+Shift+R on Mac)
3. **Verify**: Page should load without React error overlay or console errors

## Notes
- The component follows the Zustand data module integration pattern from `_docs/_business/zustand/`
- All hooks maintain referential stability through proper memoization
- SSR/hydration is handled safely through the cached `getServerSnapshot` in `useDataModule`

