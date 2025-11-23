# Reactivate Campaign Component - Full Implementation Plan

This document provides a complete guide for implementing the Reactivate Campaign component in another app with the same codebase structure.

## Overview

The Reactivate Campaign component is a hero section feature that allows users to:
- Upload CSV/Excel files with contact data
- Enter workflow requirements via an animated search input
- Toggle contact enrichment
- Automatically activate contacts via API
- View success metrics in animated badges
- Redirect to the app after successful activation

## Component Architecture

### Files Created/Modified

```
src/
├── components/
│   ├── home/
│   │   ├── ReactivateCampaignInput.tsx      # Main component
│   │   └── ReactivateCampaignBadges.tsx     # Badge display component
│   └── ui/
│       └── typing-animation.tsx             # Animated placeholder (if not exists)
├── utils/
│   └── csvParser.ts                         # CSV/Excel parser utility
└── app/
    └── api/
        └── campaigns/
            └── reactivate/
                └── route.ts                 # API endpoint for activation
```

## Dependencies

### Required NPM Packages

```json
{
  "dependencies": {
    "papaparse": "^5.4.1",           // CSV parsing
    "xlsx": "^0.18.5",                // Excel parsing
    "framer-motion": "^10.x.x",       // Animations
    "lucide-react": "^0.x.x",         // Icons
    "sonner": "^1.x.x",               // Toast notifications
    "next-themes": "^0.x.x"           // Theme management
  }
}
```

### UI Components Required (shadcn/ui)

- `Button`
- `Input`
- `Switch`
- `Label`
- `Badge`
- `Popover`
- `PopoverContent`
- `PopoverTrigger`

### Additional Components

- `Particles` (from `@magicui/particles` or shadcn)
- `TypingAnimation` (custom component)

## Step-by-Step Implementation

### Step 1: Install Dependencies

```bash
pnpm add papaparse xlsx framer-motion lucide-react sonner next-themes
pnpm add -D @types/papaparse
```

### Step 2: Create CSV Parser Utility

**File: `src/utils/csvParser.ts`**

```typescript
import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ContactData {
	email?: string;
	name?: string;
	phone?: string;
	address?: string;
	[key: string]: string | undefined;
}

export interface ParseResult {
	contacts: ContactData[];
	errors: string[];
}

// Implementation details in actual file
// Key features:
// - Parses CSV and Excel files
// - Normalizes column names (email, phone, name, address)
// - Accepts any row with data (flexible validation)
// - Returns contacts array and errors array
```

### Step 3: Create Badge Component

**File: `src/components/home/ReactivateCampaignBadges.tsx`**

```typescript
"use client";

import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BadgeMetrics {
	dollarAmount: number;
	timeSavedHours: number;
	contactsActivated: number;
	hobbyTimeHours: number;
}

// Features:
// - Animated badge entrance
// - Four metric badges (dollar, time, deals, hobby time)
// - Theme-aware colors
// - Responsive layout
```

### Step 4: Create Main Input Component

**File: `src/components/home/ReactivateCampaignInput.tsx`**

**Key Features:**
- Animated typing placeholder (cycles through 6 options)
- File upload (CSV/Excel)
- Example CSV download button
- Enrich toggle with info popover
- Search input for workflow requirements
- Badge display (demo + real metrics)
- API integration for activation
- Auto-redirect after success

**State Management:**
```typescript
const [searchValue, setSearchValue] = useState("");
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [contacts, setContacts] = useState<ContactData[]>([]);
const [skipTrace, setSkipTrace] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const [metrics, setMetrics] = useState<BadgeMetrics | null>(null);
const [isFocused, setIsFocused] = useState(false);
```

**Key Functions:**
- `handleFileSelect` - Parses uploaded file
- `handleRemoveFile` - Clears file and contacts
- `handleActivate` - Calls API to activate contacts
- `handleDownloadExample` - Downloads sample CSV

### Step 5: Create API Route

**File: `src/app/api/campaigns/reactivate/route.ts`**

**Endpoint:** `POST /api/campaigns/reactivate`

**Request Body:**
```typescript
{
  contacts: ContactData[];
  skipTrace?: boolean;
  workflowRequirements?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  metrics: {
    dollarAmount: number;
    timeSavedHours: number;
    contactsActivated: number;
    hobbyTimeHours: number;
  };
  activated: number;
  failed: number;
  errors?: string[];
}
```

**Implementation Details:**
- Requires authentication (session check)
- Optional skip trace enrichment
- Batch activates contacts via `/api/v1/ai/activate/[contact_id]`
- Calculates metrics based on activated contacts
- Handles errors gracefully

### Step 6: Integrate into Hero Component

**File: `src/components/home/heros/live-dynamic-hero-demo/HeroSideBySide.tsx`**

**Integration Points:**
1. Import components:
```typescript
import { ReactivateCampaignInput } from "@/components/home/ReactivateCampaignInput";
import type { BadgeMetrics } from "@/components/home/ReactivateCampaignBadges";
import { Particles } from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
```

2. Add particles background:
```typescript
const { resolvedTheme } = useTheme();
const isMobile = useIsMobile();
const [particleColor, setParticleColor] = useState("#ffffff");

useEffect(() => {
  setParticleColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
}, [resolvedTheme]);

const particleQuantity = isMobile ? 40 : 80;
```

3. Add Particles component in background:
```typescript
<Particles
  className="absolute inset-0 z-[1]"
  quantity={particleQuantity}
  ease={80}
  staticity={50}
  size={1.2}
  color={particleColor}
  vx={0}
  vy={0}
/>
```

4. Add ReactivateCampaignInput in hero content:
```typescript
{/* Reactivate Campaign Search Input */}
<div className="mt-4 w-full max-w-4xl">
  <ReactivateCampaignInput
    onActivationComplete={(metrics: BadgeMetrics) => {
      console.log("Activation complete with metrics:", metrics);
    }}
  />
</div>
```

**Position:** Between description and CTA buttons

## Configuration

### Environment Variables

```env
DEALSCALE_API_BASE=https://api.leadorchestra.com
```

### API Endpoints Required

1. **Contact Search:** `GET /api/v1/contacts/search?email={email}`
2. **Contact Creation:** `POST /api/v1/contacts`
3. **Contact Activation:** `POST /api/v1/ai/activate/{contact_id}`
4. **Data Enrichment:** `POST /api/v1/data_enrichment/contacts` (optional)

### Authentication

The API route requires:
- NextAuth session
- `session.dsTokens.access_token` for API calls

## Styling & Theming

### Color Scheme
- Primary: Sky blue (`sky-500`, `sky-400`)
- Background: Semi-transparent white/dark with backdrop blur
- Text: White with opacity variations
- Borders: Sky blue with opacity

### Responsive Design
- Mobile: Reduced particle count (40)
- Desktop: Full particle count (80)
- Flexible max-width containers
- Responsive text sizes

## Animation Details

### Typing Animation
- **Options:** 6 placeholder texts that cycle
- **Speed:** 80ms type, 40ms delete
- **Pause:** 2000ms between cycles
- **Loop:** Infinite

### Badge Animation
- **Entrance:** Staggered fade-in with scale
- **Delay:** 0.1s per badge
- **Duration:** 0.4s
- **Easing:** Cubic bezier `[0.4, 0, 0.2, 1]`

### Particles
- **Size:** 1.2px base
- **Opacity:** 0.3-0.7 range
- **Quantity:** 40-80 based on device
- **Interaction:** Mouse magnetism
- **Theme:** White (dark mode) / Black (light mode)

## Error Handling

### File Upload Errors
- Invalid file type → Toast error
- Parse errors → Warning toast + console log
- No contacts found → Error toast

### API Errors
- Unauthorized → 401 response
- Missing contacts → 400 response
- Activation failures → Logged, partial success allowed
- Network errors → Error toast

## Metrics Calculation

```typescript
const COST_PER_CONTACT = 25; // dollars
const TIME_PER_CONTACT_HOURS = 0.25; // 15 minutes

const metrics = {
  dollarAmount: contactsActivated * COST_PER_CONTACT,
  timeSavedHours: contactsActivated * TIME_PER_CONTACT_HOURS,
  contactsActivated: successfulActivations.length,
  hobbyTimeHours: contactsActivated * TIME_PER_CONTACT_HOURS,
};
```

## Badge Labels

1. **Dollar Amount:** `+$${amount} this month`
2. **Time Saved:** `${hours} hours saved month`
3. **Deals Closed:** `${count} deals closed`
4. **Hobby Time:** `+${hours} hours hobby time by the week`

## Example CSV Format

```csv
name,email,phone,address
John Doe,john.doe@example.com,+1-555-0123,123 Main St, Denver, CO 80202
Jane Smith,jane.smith@example.com,+1-555-0124,456 Oak Ave, Boulder, CO 80301
Bob Johnson,bob.johnson@example.com,+1-555-0125,789 Pine Rd, Colorado Springs, CO 80903
```

## Testing Checklist

- [ ] File upload (CSV)
- [ ] File upload (Excel)
- [ ] Example CSV download
- [ ] File parsing with various formats
- [ ] Enrich toggle functionality
- [ ] Popover info display
- [ ] Search input typing animation
- [ ] Activation API call
- [ ] Metrics calculation
- [ ] Badge display (demo + real)
- [ ] Redirect after success
- [ ] Error handling
- [ ] Responsive design (mobile/desktop)
- [ ] Theme switching (dark/light)
- [ ] Particles visibility

## Customization Points

### Badge Metrics
Modify calculation constants in `route.ts`:
- `COST_PER_CONTACT`
- `TIME_PER_CONTACT_HOURS`

### Placeholder Options
Update `PLACEHOLDER_OPTIONS` array in `ReactivateCampaignInput.tsx`

### Badge Labels
Modify badge array in `ReactivateCampaignBadges.tsx`

### Redirect URL
Change in `handleActivate` function:
```typescript
window.location.href = "https://app.leadorchestra.com";
```

### Particle Settings
Adjust in hero component:
- `quantity`
- `size`
- `ease`
- `staticity`

## Performance Optimizations

1. **Particles:** Reduced count on mobile
2. **File Parsing:** Client-side, non-blocking
3. **API Calls:** Batched (10 contacts per batch)
4. **Animations:** GPU-accelerated via framer-motion
5. **Canvas:** Uses `desynchronized` hint for particles

## Security Considerations

1. **File Validation:** Type checking before parsing
2. **Authentication:** Required for API calls
3. **Input Sanitization:** Handled by parser
4. **Rate Limiting:** 500ms delay between batches
5. **Error Messages:** Don't expose sensitive data

## Future Enhancements

- [ ] Drag & drop file upload
- [ ] Progress bar for batch activation
- [ ] Real-time contact count updates
- [ ] Export activation results
- [ ] Support for more file formats
- [ ] Advanced filtering options
- [ ] Batch operation history

## Troubleshooting

### Particles Not Visible
- Check z-index layering
- Verify theme color is set correctly
- Increase particle size/opacity
- Check canvas rendering

### File Parse Errors
- Verify file format (CSV/Excel)
- Check column names match expected format
- Ensure file isn't corrupted
- Check browser console for details

### API Errors
- Verify authentication token
- Check API endpoint URLs
- Verify network connectivity
- Check API response format

### Animation Issues
- Verify framer-motion is installed
- Check for CSS conflicts
- Verify component is client-side (`"use client"`)

## Support Files Reference

All implementation files are located in:
- Components: `src/components/home/`
- Utils: `src/utils/csvParser.ts`
- API: `src/app/api/campaigns/reactivate/`
- UI Components: `src/components/ui/`

For questions or issues, refer to the actual implementation files for complete code examples.




