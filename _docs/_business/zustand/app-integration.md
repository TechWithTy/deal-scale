# App Integration Recipes

This reference focuses on wiring the generated data stores into the existing Next.js app. Each section covers a common scenario so product teams can reuse the same primitives consistently.

## 1. Rendering data inside server components

Server components cannot call Zustand hooks directly. Use the synchronous `dataModules` map to fetch raw module exports at render time, then pass the data into a client component.

```tsx
// app/(marketing)/about/page.tsx
import { dataModules } from '@/data/__generated__/modules';
import { AboutHero } from './_components/about-hero';

export default function AboutPage() {
  const hero = dataModules['about/hero'];

  return (
    <>
      <AboutHero copy={hero.copy} media={hero.media} />
      {/* Pass other module data to client components as props */}
    </>
  );
}
```

Because `dataModules` performs static imports, it is safe for RSC usage and keeps bundle splits deterministic.

## 2. Hydrating client components with `useDataModule`

Client components can call the shared hook to benefit from lazy loading, caching, and error reporting.

```tsx
'use client';

import { useDataModule } from '@/stores/useDataModuleStore';

export function DynamicTestimonials() {
  const state = useDataModule('caseStudy/slugDetails/testimonials');

  if (state.status !== 'ready') {
    return <TestimonialsSkeleton status={state.status} error={state.error} />;
  }

  return <TestimonialsCarousel slides={state.data.testimonials} />;
}
```

Pair this with suspense or skeletons to keep UX smooth while the loader resolves.

## 3. Prefetching data during route transitions

For routes that should be instant, trigger `.load()` in a router event, then render the hook normally. The store memoises requests, so components will reuse the prefetched module.

```tsx
import { createDataModuleStore } from '@/stores/useDataModuleStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function PrefetchProductsLink() {
  const router = useRouter();

  useEffect(() => {
    const store = createDataModuleStore('products/hero');
    void store.getState().load();
  }, []);

  return (
    <button type="button" onClick={() => router.push('/products')}>
      View Products
    </button>
  );
}
```

## 4. Error boundaries & observability

`createDataModuleStore` writes thrown values into `state.error` and switches the status to `error`. Couple your components with an error boundary or reporting hook to escalate failures.

```tsx
if (state.status === 'error') {
  reportFrontendError({ scope: 'data-module', key: state.key, error: state.error });
  return <FallbackError />;
}
```

Downstream tooling (Sentry, Datadog, etc.) can use the `key` to isolate failing modules quickly.

## 5. Storybook & design reviews

Storybook stories often need deterministic data without waiting on async loaders. Import from `dataModules` to hydrate stories, and call `clearDataModuleStores()` after interactive edits.

```tsx
import { Meta, StoryObj } from '@storybook/react';
import { dataModules } from '@/data/__generated__/modules';
import { DynamicTestimonials } from './DynamicTestimonials';
import { clearDataModuleStores } from '@/stores/useDataModuleStore';

const meta: Meta<typeof DynamicTestimonials> = {
  title: 'Marketing/Testimonials',
  component: DynamicTestimonials,
  decorators: [
    (Story) => {
      clearDataModuleStores();
      const data = dataModules['caseStudy/slugDetails/testimonials'];
      return <Story args={{ initialData: data }} />;
    },
  ],
};

export default meta;
```

## 6. CMS or admin tooling

When building internal dashboards, reuse the generated manifest to iterate through available modules.

```ts
import { dataManifest } from '@/data/__generated__/manifest';

const moduleList = Object.values(dataManifest).map(({ key, importPath }) => ({ key, importPath }));
```

Use this list to drive dropdowns or validation when editors pick which content block to edit.

---

Keep these recipes in sync with production code. If you introduce new workflows (SSR caching, streaming, etc.), document them here so every squad follows the same integration blueprint.
