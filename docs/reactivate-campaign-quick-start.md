# Reactivate Campaign Component - Quick Start Checklist

## Prerequisites
- [ ] Next.js app with TypeScript
- [ ] shadcn/ui components installed
- [ ] NextAuth configured
- [ ] Theme provider set up

## Installation Steps

### 1. Install Dependencies
```bash
pnpm add papaparse xlsx framer-motion lucide-react sonner next-themes
pnpm add -D @types/papaparse
```

### 2. Copy Files
Copy these files to your project:
- [ ] `src/utils/csvParser.ts`
- [ ] `src/components/home/ReactivateCampaignInput.tsx`
- [ ] `src/components/home/ReactivateCampaignBadges.tsx`
- [ ] `src/app/api/campaigns/reactivate/route.ts`

### 3. Verify UI Components
Ensure these shadcn/ui components exist:
- [ ] `Button`
- [ ] `Input`
- [ ] `Switch`
- [ ] `Label`
- [ ] `Badge`
- [ ] `Popover`
- [ ] `PopoverContent`
- [ ] `PopoverTrigger`

### 4. Install Additional Components
```bash
# Particles (if using Magic UI)
pnpm dlx shadcn@latest add @magicui/particles --yes

# Or use your existing particles component
```

### 5. Create Typing Animation Component
If not exists, create `src/components/ui/typing-animation.tsx` (check existing codebase)

### 6. Create Mobile Hook
If not exists, create `src/hooks/use-mobile.ts`:
```typescript
import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
```

### 7. Integrate into Hero
Add to your hero component:
```typescript
import { ReactivateCampaignInput } from "@/components/home/ReactivateCampaignInput";
import { Particles } from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

// Add particles background
// Add ReactivateCampaignInput component
```

### 8. Configure Environment
Add to `.env`:
```env
DEALSCALE_API_BASE=https://api.dealscale.io
```

### 9. Update API Endpoints
Modify `route.ts` to match your API structure:
- Contact search endpoint
- Contact creation endpoint
- Activation endpoint
- Enrichment endpoint (optional)

### 10. Test
- [ ] File upload works
- [ ] Parsing works
- [ ] API calls succeed
- [ ] Badges display
- [ ] Redirect works
- [ ] Particles visible
- [ ] Responsive on mobile

## Key Customization Points

1. **API Base URL:** Update `DEALSCALE_API_BASE` in route.ts
2. **Redirect URL:** Change in `handleActivate` function
3. **Metrics Calculation:** Adjust constants in route.ts
4. **Badge Labels:** Modify in ReactivateCampaignBadges.tsx
5. **Placeholder Options:** Update array in ReactivateCampaignInput.tsx

## Common Issues

**Particles not visible?**
- Check z-index
- Increase size/opacity
- Verify theme color

**Parse errors?**
- Check file format
- Verify column names
- Check console for details

**API errors?**
- Verify authentication
- Check endpoint URLs
- Verify token format

See full documentation: `reactivate-campaign-component-implementation.md`



