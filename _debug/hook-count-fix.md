# Hook Count Fix - Services.tsx

## Issue
- **Error**: "Rendered more hooks than during the previous render"
- **Hook 33**: `useMemo` at line 174 was `undefined` in previous render but present in next render
- **Total hooks**: 32 in first render, 33 in second render

## Root Cause

### Primary Issue: `usePathname()` Hook Causing Hydration Mismatch
1. `usePathname()` from Next.js can return different values during SSR vs client
2. This caused conditional rendering based on `currentPathname !== "/features"`
3. The conditional rendering caused hydration mismatch (server rendered different HTML than client expected)
4. The hydration error may have been causing React to skip some hooks during error recovery

### Secondary Issue: Conditional Rendering Based on Pathname
- Line 443: `{currentPathname !== "/features" && (...)}`
- This conditional can differ between server and client renders
- Server might render one thing, client another, causing hydration mismatch

## Fix Applied

1. **Removed `usePathname()` hook entirely**
   - Removed `const currentPathname = usePathname();` from line 50
   - Removed import: `import { usePathname } from "next/navigation";`

2. **Removed conditional rendering based on pathname**
   - Removed: `{currentPathname !== "/features" && (...)}`
   - Changed to: Always render the "Explore All Services" link
   - This ensures server and client render the same HTML

## New Hook Order (33 hooks total, all unconditional)

1. `useState(internalActiveTab)` - line 52
2. `useState(searchTerm)` - line 56
3. `useState(activeCategory)` - line 57
4. `useState(cardsPerPage)` - line 60 (with SSR-safe initializer)
5. `useDataModule()` - line 72 (internally uses multiple hooks)
6. `useMemo(allServices)` - line 90
7. `useMemo(categoryOptions)` - line 101
8. `useCallback(filterServices)` - line 119
9. `useMemo(filteredEntries)` - line 163
10. `useMemo(guardDetail)` - line 168 (line 174 in error - now line 168 after removing usePathname)
11. `useDataModuleGuardTelemetry()` - line 177
12. `usePagination()` - line 187
13. `useEffect(resize)` - line 207

## Testing
1. Clear `.next` cache
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R)
4. Verify:
   - ✅ No hydration errors
   - ✅ No hook count mismatch errors
   - ✅ Services section renders correctly

