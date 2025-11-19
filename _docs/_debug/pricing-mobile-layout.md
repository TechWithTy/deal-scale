# Pricing Section Mobile Layout Issue

## Problem
On mobile devices, the pricing cards are stacking/overlapping over the monthly/annual plan type toggle (PlanTypeToggle component). This creates a poor user experience where users cannot clearly see or interact with the toggle buttons.

## Current Structure
- **Location**: `src/components/home/Pricing.tsx`
- **Toggle Component**: `src/components/home/pricing/PlanTypeToggle.tsx`
- **Card Component**: `src/components/home/pricing/PricingCard.tsx`

### Current Layout (lines 193-217 in Pricing.tsx):
```tsx
<div className="mb-16 text-center">
  <Header title={title} subtitle={subtitle} size="lg" />
  <div className="mt-8 flex flex-col items-center">
    <PlanTypeToggle ... />
  </div>
</div>

{filteredPlans.length > 0 ? (
  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
    {filteredPlans.map((plan) => (
      <PricingCard ... />
    ))}
  </div>
) : ...}
```

## Root Cause
The issue likely stems from:
1. Insufficient margin/padding between the toggle section and the cards grid on mobile
2. The `mb-16` on the header container may not be enough on mobile
3. Potential z-index or positioning issues causing overlap
4. The AnnualDiscountBadge in PlanTypeToggle uses absolute positioning (`-top-7` or `-top-5`) which might affect layout calculations

## Proposed Fix

### Option 1: Increase Mobile Spacing
Add responsive margin-bottom that's larger on mobile:
```tsx
<div className="mb-16 md:mb-16 text-center">
  // or
<div className="mb-12 sm:mb-16 text-center">
```

### Option 2: Add Explicit Mobile Padding
Add padding-top to the cards grid on mobile:
```tsx
<div className="grid grid-cols-1 gap-8 pt-4 md:pt-0 md:grid-cols-3">
```

### Option 3: Adjust Toggle Container
Ensure the toggle container has proper bottom margin on mobile:
```tsx
<div className="mt-8 mb-6 sm:mb-8 flex flex-col items-center">
```

### Option 4: Fix AnnualDiscountBadge Positioning
The badge uses absolute positioning that might be causing layout issues. Consider:
- Adding padding-top to the toggle container to account for the badge
- Using relative positioning instead
- Adding margin-bottom when badge is present

## Recommended Solution
Combine Option 1 and Option 3:
1. Increase bottom margin on the header container for mobile
2. Add explicit bottom margin to the toggle container
3. Ensure the cards grid has adequate top spacing

## Testing Checklist
- [ ] Test on mobile viewport (375px, 414px widths)
- [ ] Verify toggle buttons are fully visible and clickable
- [ ] Check that cards don't overlap with toggle
- [ ] Test with annual discount badge visible
- [ ] Verify spacing looks good on tablet breakpoints
- [ ] Test with different numbers of plans (1, 2, 3+)

## Files to Modify
- `src/components/home/Pricing.tsx` - Adjust spacing in header section
- `src/components/home/pricing/PlanTypeToggle.tsx` - Potentially adjust badge positioning

## Priority
Medium - Affects mobile UX but doesn't break functionality


