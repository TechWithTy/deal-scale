# Strapi + Zustand Data Module Integration Plan

## Overview

This plan extends the existing Zustand data module system to support fetching data from Strapi CMS while maintaining the same type-safe patterns, code generation workflow, and component integration patterns.

**Goal**: Replace static TypeScript data files with dynamic Strapi API calls while preserving:
- Type safety via Zod schemas
- Code generation pipeline
- Consistent `useDataModule` hook usage
- SSR/hydration compatibility
- Error handling and observability

## Existing Strapi Infrastructure

The codebase already has some Strapi integration infrastructure:
- **Seeding utilities**: `scripts/strapi/strapi-utils.ts` - Helper functions for posting data to Strapi
- **Landing content config**: `src/data/landing/strapiLandingContent.ts` - Type definitions for landing page content
- **Environment variables**: Support for `STRAPI_URL`, `STRAPI_TOKEN`, etc.

This plan extends the existing infrastructure to integrate with the Zustand data module system.

## Current System Architecture

### Existing Zustand Data Module Flow

```
src/data/**/*.ts
    ↓ (generate-data-manifest.ts)
src/data/__generated__/manifest.ts
src/data/__generated__/modules.ts
src/stores/__generated__/dataStores.ts
    ↓
useDataModule('module/key') → Zustand Store → Dynamic Import → Static Data
```

### Proposed Strapi-Enhanced Flow

```
Strapi CMS (Content Types)
    ↓ (REST/GraphQL API)
API Routes (/api/strapi/**)
    ↓ (Zod Validation + Transformation)
src/data/strapi/**/*.ts (API Loaders)
    ↓ (generate-data-manifest.ts)
src/data/__generated__/manifest.ts (Updated with Strapi loaders)
src/data/__generated__/modules.ts
src/stores/__generated__/dataStores.ts
    ↓
useDataModule('strapi/landing-hero') → Zustand Store → API Call → Strapi Data
```

## Implementation Strategy

### Phase 1: Foundation - Strapi Client & Types

#### 1.1 Strapi API Client (`src/lib/strapi/client.ts`)

Create a centralized Strapi client with:
- Authentication token support
- Base URL configuration
- Error handling
- Request/response logging
- Type-safe request methods

```typescript
// src/lib/strapi/client.ts
import type { StrapiResponse } from './types';

/**
 * Strapi API Client
 * 
 * Extends existing Strapi utilities (scripts/strapi/strapi-utils.ts) for use
 * in the Zustand data module system. Handles authentication, error handling,
 * and type-safe requests.
 */
export class StrapiClient {
  private baseUrl: string;
  private token?: string;

  constructor(config: { baseUrl: string; token?: string }) {
    // Reuse existing env var pattern from strapi-utils.ts
    this.baseUrl = (config.baseUrl || 
      process.env.NEXT_PUBLIC_STRAPI_URL || 
      process.env.STRAPI_URL || 
      'http://localhost:1337').replace(/\/$/, '');
    this.token = config.token || 
      process.env.STRAPI_API_TOKEN ||
      process.env.STRAPI_TOKEN ||
      process.env.STRAPI_EXTERNAL_KEY;
  }

  async fetchSingleType<T>(
    contentType: string,
    options?: { populate?: string | string[] }
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseUrl}/api/${contentType}?${this.buildQuery(options)}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async fetchCollection<T>(
    contentType: string,
    options?: { 
      populate?: string | string[];
      filters?: Record<string, unknown>;
      pagination?: { page?: number; pageSize?: number };
      sort?: string | string[];
    }
  ): Promise<StrapiResponse<T[]>> {
    // Similar implementation for collections
  }

  private buildQuery(options?: Record<string, unknown>): string {
    // Build query string from options
  }
}

export const strapiClient = new StrapiClient({
  baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  token: process.env.STRAPI_API_TOKEN,
});
```

#### 1.2 Strapi Type Definitions (`src/lib/strapi/types.ts`)

Define base Strapi response types:

```typescript
// src/lib/strapi/types.ts
export interface StrapiResponse<T> {
  data: T | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
  // ... other Strapi fields
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
      // ... other media fields
    };
  } | null;
}
```

#### 1.3 Zod Schemas for Strapi Content Types (`src/lib/strapi/schemas/`)

Create Zod schemas that match Strapi content types:

```typescript
// src/lib/strapi/schemas/landing-hero.ts
import { z } from 'zod';

export const StrapiLandingHeroSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  ctaLabel: z.string(),
  ctaLink: z.string().url(),
  highlightWords: z.array(z.object({
    word: z.string(),
    gradient: z.string(),
  })),
  badge: z.string().optional(),
});

export type StrapiLandingHero = z.infer<typeof StrapiLandingHeroSchema>;
```

### Phase 2: Data Module Loaders for Strapi

#### 2.1 Strapi Data Loader Pattern (`src/data/strapi/**/*.ts`)

Create loader modules that fetch from Strapi, validate, and transform:

```typescript
// src/data/strapi/landing-hero.ts
import { strapiClient } from '@/lib/strapi/client';
import { StrapiLandingHeroSchema, type StrapiLandingHero } from '@/lib/strapi/schemas/landing-hero';
import type { LandingHero } from '@/types/landing';

/**
 * Fetches landing hero content from Strapi and transforms it to app format
 */
export async function loadLandingHero(): Promise<LandingHero> {
  try {
    const response = await strapiClient.fetchSingleType<StrapiLandingHero>(
      'landing-hero',
      { populate: '*' }
    );

    if (!response.data) {
      throw new Error('Landing hero data not found in Strapi');
    }

    // Validate Strapi response with Zod
    const validated = StrapiLandingHeroSchema.parse(response.data.attributes);

    // Transform Strapi format to app format
    return {
      copy: {
        headline: validated.headline,
        subheadline: validated.subheadline,
      },
      cta: {
        label: validated.ctaLabel,
        link: validated.ctaLink,
      },
      highlights: validated.highlightWords.map(hw => ({
        word: hw.word,
        gradient: hw.gradient,
      })),
      badge: validated.badge,
    };
  } catch (error) {
    console.error('[loadLandingHero] Failed to fetch from Strapi:', error);
    throw error;
  }
}

// Export default for code generation
export default loadLandingHero;
```

#### 2.2 API Route Layer (Optional, for Server-Side Caching)

Create Next.js API routes for server-side caching and request deduplication:

```typescript
// src/app/api/strapi/landing-hero/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { strapiClient } from '@/lib/strapi/client';
import { StrapiLandingHeroSchema } from '@/lib/strapi/schemas/landing-hero';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const response = await strapiClient.fetchSingleType(
      'landing-hero',
      { populate: '*' }
    );

    if (!response.data) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    // Validate before returning
    const validated = StrapiLandingHeroSchema.parse(response.data.attributes);

    return NextResponse.json(validated);
  } catch (error) {
    console.error('[API] Strapi fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Phase 3: Code Generation Enhancement

#### 3.1 Update Generator to Support Strapi Loaders

Modify `tools/data/generate-data-manifest.ts` to:
1. Detect Strapi loader files (e.g., `src/data/strapi/**/*.ts`)
2. Generate manifest entries with API loader functions
3. Mark modules as "strapi" type for special handling
4. Support both static and Strapi modules in same manifest

```typescript
// Enhanced manifest entry type
interface ManifestEntry {
  key: string;
  loader: () => Promise<unknown>;
  type: 'static' | 'strapi'; // New field
  importPath: string;
  relativePath: string;
}
```

#### 3.2 Generator Output Example

```typescript
// Generated: src/data/__generated__/manifest.ts
export const dataManifest = {
  // Existing static modules
  'service/services': {
    key: 'service/services',
    type: 'static',
    loader: () => import('@/data/service/services').then(m => m.default),
    // ...
  },
  // New Strapi modules
  'strapi/landing-hero': {
    key: 'strapi/landing-hero',
    type: 'strapi',
    loader: () => import('@/data/strapi/landing-hero').then(m => m.default),
    // ...
  },
} as const;
```

### Phase 4: Component Integration

#### 4.1 Using Strapi Data Modules

Components use the same `useDataModule` hook - no changes needed:

```typescript
// src/components/home/heros/HeroSessionMonitorClient.tsx
'use client';

import { useDataModule } from '@/stores/useDataModuleStore';

export function HeroSessionMonitorClient() {
  // Same hook, different key prefix
  const { status, data, error } = useDataModule('strapi/landing-hero');

  if (status === 'loading' || status === 'idle') {
    return <HeroSkeleton />;
  }

  if (status === 'error') {
    console.error('[Hero] Failed to load:', error);
    return <HeroFallback />;
  }

  return (
    <HeroSection
      headline={data.copy.headline}
      subheadline={data.copy.subheadline}
      cta={data.cta}
      highlights={data.highlights}
    />
  );
}
```

#### 4.2 Server Component Usage (SSR)

For server components, use the generated modules map or fetch directly:

```typescript
// src/app/page.tsx
import { dataModules } from '@/data/__generated__/modules';
import { HeroSessionMonitorClient } from '@/components/home/heros/HeroSessionMonitorClient';

export default async function HomePage() {
  // Option 1: Use generated modules (synchronous, build-time)
  // const heroData = dataModules['strapi/landing-hero']; // Won't work for async Strapi data
  
  // Option 2: Fetch directly in server component
  const { loadLandingHero } = await import('@/data/strapi/landing-hero');
  const heroData = await loadLandingHero();

  return (
    <HeroSessionMonitorClient initialData={heroData} />
  );
}
```

### Phase 5: Migration Strategy

#### 5.1 Gradual Migration Plan

1. **Phase 5.1**: Add Strapi loaders alongside static modules
   - Keep existing static modules working
   - Add new Strapi modules with `strapi/` prefix
   - Test both types coexist

2. **Phase 5.2**: Migrate high-priority content types
   - Landing page content (hero, services, testimonials)
   - Marketing pages
   - Blog content

3. **Phase 5.3**: Migrate remaining content types
   - Product/service details
   - Case studies
   - FAQ content

4. **Phase 5.4**: Deprecate static modules (optional)
   - Keep as fallback
   - Or remove if Strapi becomes sole source

#### 5.2 Fallback Strategy

Implement fallbacks for when Strapi is unavailable:

```typescript
// src/data/strapi/landing-hero.ts
import { loadLandingHero } from './loadLandingHero';
import { staticLandingHero } from '@/data/static/landing-hero-fallback';

export default async function loadLandingHeroWithFallback() {
  try {
    return await loadLandingHero();
  } catch (error) {
    console.warn('[loadLandingHero] Strapi unavailable, using fallback:', error);
    return staticLandingHero; // Static fallback
  }
}
```

## Environment Configuration

### Required Environment Variables

```bash
# .env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here

# Production
NEXT_PUBLIC_STRAPI_URL=https://cms.leadorchestra.com
STRAPI_API_TOKEN=${STRAPI_API_TOKEN_SECRET}
```

### Strapi Content Type Setup

1. Create content types in Strapi matching Zod schemas
2. Configure API permissions (public vs. authenticated)
3. Set up media upload handling
4. Configure populate relations

## Testing Strategy

### Unit Tests

```typescript
// src/lib/strapi/__tests__/client.test.ts
import { strapiClient } from '../client';
import { server } from '@/mocks/server';
import { rest } from 'msw';

describe('StrapiClient', () => {
  it('fetches single type correctly', async () => {
    server.use(
      rest.get('*/api/landing-hero', (req, res, ctx) => {
        return res(ctx.json({
          data: {
            id: 1,
            attributes: {
              headline: 'Test Headline',
              // ...
            },
          },
        }));
      })
    );

    const result = await strapiClient.fetchSingleType('landing-hero');
    expect(result.data?.attributes.headline).toBe('Test Headline');
  });
});
```

### Integration Tests

```typescript
// src/data/strapi/__tests__/landing-hero.test.ts
import { loadLandingHero } from '../landing-hero';

describe('loadLandingHero', () => {
  it('transforms Strapi data to app format', async () => {
    const result = await loadLandingHero();
    expect(result).toMatchObject({
      copy: {
        headline: expect.any(String),
      },
    });
  });
});
```

### E2E Tests

Test full flow from component to Strapi:

```typescript
// src/components/home/__tests__/Hero.e2e.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { HeroSessionMonitorClient } from '../heros/HeroSessionMonitorClient';

it('renders Strapi content correctly', async () => {
  render(<HeroSessionMonitorClient />);
  
  await waitFor(() => {
    expect(screen.getByText(/Test Headline/i)).toBeInTheDocument();
  });
});
```

## Observability & Error Handling

### Error Tracking

Extend existing `useDataModuleGuardTelemetry` to track Strapi-specific errors:

```typescript
// Enhanced telemetry
useDataModuleGuardTelemetry({
  key: 'strapi/landing-hero',
  surface: 'home/hero',
  status: 'error',
  error: error,
  detail: {
    source: 'strapi', // New field
    contentType: 'landing-hero',
    httpStatus: error.status, // If available
  },
});
```

### Caching & Performance

1. **Server-Side Caching**: Use Next.js revalidation
2. **Client-Side Caching**: Zustand store memoization (already handled)
3. **Request Deduplication**: Multiple components requesting same module share one API call (already handled by Zustand)

## File Structure

```
src/
├── lib/
│   └── strapi/
│       ├── client.ts              # Strapi API client
│       ├── types.ts               # Base Strapi types
│       └── schemas/
│           ├── landing-hero.ts    # Zod schemas per content type
│           ├── services.ts
│           └── ...
├── data/
│   ├── strapi/                    # NEW: Strapi loaders
│   │   ├── landing-hero.ts
│   │   ├── services.ts
│   │   └── ...
│   └── __generated__/
│       ├── manifest.ts            # Updated with Strapi entries
│       └── modules.ts
├── app/
│   └── api/
│       └── strapi/                # Optional: API routes for caching
│           └── [content-type]/
│               └── route.ts
└── stores/
    └── __generated__/
        └── dataStores.ts          # Auto-generated Zustand stores
```

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create `src/lib/strapi/client.ts`
- [ ] Create `src/lib/strapi/types.ts`
- [ ] Create Zod schemas for first content type (landing-hero)
- [ ] Set up environment variables
- [ ] Write unit tests for client

### Phase 2: Data Loaders
- [ ] Create `src/data/strapi/landing-hero.ts` loader
- [ ] Implement transformation logic
- [ ] Add error handling and fallbacks
- [ ] Write integration tests

### Phase 3: Code Generation
- [ ] Update `generate-data-manifest.ts` to detect Strapi modules
- [ ] Add `type` field to manifest entries
- [ ] Test generator with mixed static + Strapi modules
- [ ] Update generator tests

### Phase 4: Component Integration
- [ ] Update first component to use Strapi module
- [ ] Test SSR and client-side hydration
- [ ] Verify error states and loading states
- [ ] Add telemetry tracking

### Phase 5: Migration
- [ ] Migrate landing page content types
- [ ] Test in development
- [ ] Deploy to staging
- [ ] Monitor error rates
- [ ] Migrate remaining content types

## Success Criteria

1. ✅ Components use `useDataModule('strapi/...')` with same API
2. ✅ Type safety maintained via Zod schemas
3. ✅ Code generation continues to work
4. ✅ SSR and hydration work correctly
5. ✅ Error handling and fallbacks in place
6. ✅ Performance acceptable (caching, deduplication)
7. ✅ Tests passing
8. ✅ Documentation updated

## Future Enhancements

1. **GraphQL Support**: Add GraphQL client alongside REST
2. **Real-time Updates**: WebSocket subscriptions for live content updates
3. **Preview Mode**: Support Strapi preview drafts
4. **Localization**: Multi-language content support
5. **Content Versioning**: Track content changes over time
6. **Admin UI**: Visual content mapping in Next.js admin

---

**Related Documentation**:
- [`_docs/_business/zustand/README.md`](./README.md) - Zustand data modules
- [`_docs/_business/zustand/app-integration.md`](./app-integration.md) - Component integration
- [`_docs/strapi/landing-page-gap-integration-plan.md`](../strapi/landing-page-gap-integration-plan.md) - Landing page migration
- [`_docs/strapi/database-strategy.md`](../strapi/database-strategy.md) - Strapi database setup

