# Guide: Creating New Landing Pages & Components

**Purpose:** Step-by-step guide for creating new landing pages and components following DealScale's architecture, conventions, and best practices.

**Last Updated:** Nov 1, 2025

---

## 📚 Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [Creating a New Static Page](#creating-a-new-static-page)
3. [Creating Dynamic Routes](#creating-dynamic-routes)
4. [Creating Reusable Components](#creating-reusable-components)
5. [SEO Integration](#seo-integration)
6. [Data Management (Zustand Modules)](#data-management)
7. [Performance Optimization](#performance-optimization)
8. [Styling Conventions](#styling-conventions)
9. [Testing Your Work](#testing-your-work)
10. [Quick Reference Checklist](#quick-reference-checklist)

---

## 🏗️ Understanding the Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (/)
│   ├── about/             # Static route (/about)
│   │   └── page.tsx
│   └── features/[slug]/   # Dynamic route (/features/:slug)
│       └── page.tsx
├── components/            # Reusable React components
│   ├── home/             # Home page specific components
│   ├── common/           # Shared components (Header, Footer, etc.)
│   └── ui/               # Base UI components (shadcn/ui)
├── data/                 # Static data & Zustand data modules
│   ├── constants/        # Static constants
│   └── __generated__/    # Auto-generated data module files
├── lib/                  # Utility functions & helpers
├── types/                # TypeScript type definitions
└── utils/                # Utility functions (SEO, validation, etc.)
```

### Key Principles

1. **Server Components First:** Default to Server Components (async functions)
2. **Client Components When Needed:** Use `"use client"` only when necessary
3. **Code Splitting:** Lazy load below-the-fold components
4. **Type Safety:** Full TypeScript coverage
5. **SEO First:** Every page needs proper metadata
6. **Performance:** Optimize for Core Web Vitals

---

## 📄 Creating a New Static Page

### Step 1: Create Page File

Create a new file in `src/app/` directory:

**Example:** Creating `/services` page

```bash
# Create directory
mkdir src/app/services
```

### Step 2: Create `page.tsx`

**File:** `src/app/services/page.tsx`

```typescript
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

// SEO Metadata (required for every page)
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/services");
	return mapSeoMetaToMetadata(seo);
}

// Server Component (default)
export default async function ServicesPage() {
	// Fetch data on server if needed
	// const data = await fetchData();
	
	return <ServicesPageClient />;
}
```

### Step 3: Create Client Component (if needed)

**File:** `src/app/services/ServicesPageClient.tsx`

```typescript
"use client";

import { ViewportLazy } from "@/components/common/ViewportLazy";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

// Above-the-fold: Eager load
import ServicesHero from "@/components/services/ServicesHero";

// Below-the-fold: Lazy load with dynamic imports
const ServicesGrid = dynamic(
	() => import("@/components/services/ServicesGrid"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);

export default function ServicesPageClient() {
	return (
		<>
			{/* Above-the-fold: No ViewportLazy */}
			<ServicesHero />
			
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			
			{/* Below-the-fold: Wrap in ViewportLazy + dynamic import */}
			<ViewportLazy>
				<ServicesGrid />
			</ViewportLazy>
		</>
	);
}
```

### Step 4: Add SEO Metadata

**File:** `src/data/constants/seo.ts`

```typescript
export const STATIC_SEO_META = {
	// ... existing entries
	"/services": {
		title: "Services | Deal Scale",
		description: "Comprehensive services to grow your real estate business.",
		canonical: "https://dealscale.io/services",
		keywords: ["services", "real estate", ...DEFAULT_SEO.keywords],
		image: DEFAULT_SEO.image,
	},
};
```

**File:** `src/utils/seo/staticSeo.ts`

```typescript
export const staticSeoMeta: Record<string, SeoMeta> = {
	// ... existing entries
	"/services": {
		title: STATIC_SEO_META["/services"].title,
		description: STATIC_SEO_META["/services"].description,
		canonical: STATIC_SEO_META["/services"].canonical,
		image: STATIC_SEO_META["/services"].image,
		keywords: STATIC_SEO_META["/services"].keywords,
		priority: 0.9,
		changeFrequency: "weekly",
		siteName: DEFAULT_SEO.siteName,
		type: DEFAULT_SEO.type,
	},
};
```

### Step 5: Add to Sitemap (Optional but Recommended)

**File:** `src/app/sitemap.ts`

```typescript
const staticPaths = [
	"/",
	"/about",
	"/services", // ✅ Add new page
	// ... other paths
];
```

---

## 🔀 Creating Dynamic Routes

### Example: `/features/[slug]`

### Step 1: Create Directory Structure

```bash
mkdir -p src/app/features/[slug]
```

### Step 2: Create Page with Dynamic Metadata

**File:** `src/app/features/[slug]/page.tsx`

```typescript
import { getFeatureBySlug, getAllFeatures } from "@/lib/features/features";
import { getSeoMetadataForFeature } from "@/utils/seo/dynamic/features";
import { SchemaInjector, buildFeatureJsonLd } from "@/utils/seo/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeaturePageClient from "./FeaturePageClient";

// Next.js 15+ Dynamic Route Compatibility
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	return getSeoMetadataForFeature(slug);
}

// Generate static params for SSG (optional but recommended)
export async function generateStaticParams() {
	const features = await getAllFeatures();
	return features.map((feature) => ({
		slug: feature.slug,
	}));
}

export default async function FeaturePage(props: unknown) {
	const { params } = props as { params: Promise<{ slug: string }> };
	const resolvedParams = await params;
	
	const feature = await getFeatureBySlug(resolvedParams.slug);
	
	if (!feature) {
		return notFound();
	}
	
	const featureSchema = buildFeatureJsonLd(feature);
	
	return (
		<>
			<SchemaInjector schema={featureSchema} />
			<FeaturePageClient feature={feature} />
		</>
	);
}
```

### Step 3: Create Client Component

**File:** `src/app/features/[slug]/FeaturePageClient.tsx`

```typescript
"use client";

import type { Feature } from "@/types/feature";

interface FeaturePageClientProps {
	feature: Feature;
}

export default function FeaturePageClient({ feature }: FeaturePageClientProps) {
	return (
		<main>
			<h1>{feature.title}</h1>
			{/* Your component content */}
		</main>
	);
}
```

---

## 🧩 Creating Reusable Components

### Component Organization

Components are organized by **feature/domain**:

```
components/
├── home/              # Home page components
├── services/          # Service-related components
├── about/             # About page components
├── common/            # Shared across pages
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── CTASection.tsx
└── ui/                # Base UI components (shadcn/ui)
```

### Component Template

**File:** `src/components/services/ServicesHero.tsx`

```typescript
"use client"; // Only if you need client-side features

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServicesHeroProps {
	title?: string;
	subtitle?: string;
	className?: string;
}

/**
 * ServicesHero Component
 * 
 * Hero section for the services page.
 * 
 * @example
 * ```tsx
 * <ServicesHero 
 *   title="Our Services"
 *   subtitle="Comprehensive solutions for your business"
 * />
 * ```
 */
export default function ServicesHero({
	title = "Our Services",
	subtitle,
	className,
}: ServicesHeroProps) {
	return (
		<section
			className={cn(
				"container mx-auto px-4 py-16",
				className
			)}
		>
			<h1 className="text-4xl font-bold">{title}</h1>
			{subtitle && <p className="mt-4 text-lg">{subtitle}</p>}
		</section>
	);
}
```

### Component Best Practices

1. **TypeScript:** Always type props with interfaces
2. **Default Props:** Provide sensible defaults
3. **JSDoc Comments:** Document component purpose and usage
4. **Composition:** Break into smaller, reusable pieces
5. **Performance:** Use `React.memo()` if component renders frequently
6. **Accessibility:** Include proper ARIA labels and semantic HTML

---

## 🔍 SEO Integration

### Required: Every Page Needs SEO

#### 1. Static SEO (for static pages)

```typescript
// In page.tsx
export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/your-page");
	return mapSeoMetaToMetadata(seo);
}
```

#### 2. Dynamic SEO (for dynamic routes)

```typescript
// In page.tsx
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	return getSeoMetadataForYourEntity(slug);
}
```

#### 3. Structured Data (Schema.org)

**For dynamic content:**

```typescript
import { SchemaInjector, buildYourEntityJsonLd } from "@/utils/seo/schema";

export default async function YourPage({ data }) {
	const schema = buildYourEntityJsonLd(data);
	
	return (
		<>
			<SchemaInjector schema={schema} />
			{/* Your page content */}
		</>
	);
}
```

**Common Schema Types:**
- `Organization` - Company info
- `WebPage` - Basic page info
- `Article` - Blog posts
- `Product` - Products
- `Service` - Services
- `FAQPage` - FAQ sections

---

## 💾 Data Management

### Using Zustand Data Modules

If you need data that's shared across components, use the Zustand data module system:

#### 1. Create Data Module (if needed)

**File:** `src/data/services/services.ts`

```typescript
export const servicesData = {
	services: [
		{
			id: "1",
			title: "Service 1",
			description: "Description...",
		},
		// ... more services
	],
};
```

#### 2. Add to Data Manifest

**File:** `src/data/manifest.ts`

```typescript
export const dataManifest = {
	// ... existing entries
	"services/list": {
		module: () => import("./services/services"),
		key: "servicesData",
	},
};
```

#### 3. Use in Component

```typescript
"use client";

import { useDataModule } from "@/stores/useDataModuleStore";

export default function ServicesList() {
	const { data, status } = useDataModule("services/list");
	
	if (status === "loading") return <div>Loading...</div>;
	if (status === "error") return <div>Error loading services</div>;
	
	return (
		<div>
			{data.services.map((service) => (
				<div key={service.id}>{service.title}</div>
			))}
		</div>
	);
}
```

### Alternative: Direct Import (for static data)

```typescript
import { servicesData } from "@/data/services/services";

export default function ServicesPage() {
	return (
		<div>
			{servicesData.services.map((service) => (
				<div key={service.id}>{service.title}</div>
			))}
		</div>
	);
}
```

---

## ⚡ Performance Optimization

### Code Splitting Strategy

#### Above-the-Fold Components (Eager Load)

```typescript
// Direct import - loads immediately
import HeroSection from "@/components/home/HeroSection";

export default function Page() {
	return <HeroSection />;
}
```

#### Below-the-Fold Components (Lazy Load)

```typescript
import dynamic from "next/dynamic";
import { ViewportLazy } from "@/components/common/ViewportLazy";

// Dynamic import for code splitting
const BelowFoldComponent = dynamic(
	() => import("@/components/home/BelowFoldComponent"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);

export default function Page() {
	return (
		<>
			<HeroSection /> {/* Eager load */}
			<ViewportLazy>
				<BelowFoldComponent /> {/* Lazy load */}
			</ViewportLazy>
		</>
	);
}
```

### Performance Checklist

- [ ] Above-the-fold components use direct imports
- [ ] Below-the-fold components use `dynamic()` imports
- [ ] Below-the-fold components wrapped in `<ViewportLazy>`
- [ ] Loading states provided for dynamic imports
- [ ] Images use `next/image` with proper `sizes` attribute
- [ ] LCP images use `priority` prop
- [ ] Heavy calculations use `useMemo()`
- [ ] Event handlers use `useCallback()`

---

## 🎨 Styling Conventions

### Tailwind CSS Classes

Use Tailwind utility classes with our design system:

```typescript
import { cn } from "@/lib/utils";

export default function Component({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"container mx-auto px-4 py-16", // Base styles
				"bg-background text-foreground", // Theme colors
				className // Allow override
			)}
		>
			{/* Content */}
		</div>
	);
}
```

### Common Patterns

**Container:**
```typescript
className="container mx-auto px-4 max-w-7xl"
```

**Section Spacing:**
```typescript
className="mx-auto my-16 max-w-7xl"
```

**Separators:**
```typescript
<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
```

**Theme-Aware Colors:**
```typescript
className="bg-background text-foreground border-border"
```

### Using shadcn/ui Components

Import from `@/components/ui/`:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
```

---

## 🧪 Testing Your Work

### Manual Testing Checklist

- [ ] Page loads without errors
- [ ] SEO metadata appears in `<head>`
- [ ] Page is accessible (keyboard navigation, screen readers)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Performance: Use React DevTools Profiler
- [ ] Code splitting: Check Network tab for chunk loading

### Performance Testing

1. **Open React DevTools Profiler**
2. **Record initial page load**
3. **Check:**
   - Render time < 100ms
   - Below-the-fold components not in first commit
   - No unnecessary re-renders

### SEO Testing

1. **View Page Source** - Check metadata in `<head>`
2. **Use Schema.org Validator** - Validate structured data
3. **Lighthouse SEO Audit** - Check SEO score

---

## 📋 Quick Reference Checklist

### Creating a New Page

- [ ] Create `src/app/your-page/page.tsx`
- [ ] Add `generateMetadata()` function
- [ ] Add SEO config in `src/data/constants/seo.ts`
- [ ] Add SEO config in `src/utils/seo/staticSeo.ts`
- [ ] Add to sitemap (`src/app/sitemap.ts`)
- [ ] Create client component if needed (`YourPageClient.tsx`)
- [ ] Use code splitting for below-the-fold components
- [ ] Test page loads correctly
- [ ] Verify SEO metadata
- [ ] Check performance with Profiler

### Creating a New Component

- [ ] Create component file in appropriate directory
- [ ] Type all props with TypeScript interface
- [ ] Add JSDoc comments
- [ ] Use Tailwind classes with `cn()` utility
- [ ] Make responsive (mobile-first)
- [ ] Add proper accessibility attributes
- [ ] Use `React.memo()` if component renders frequently
- [ ] Test component in isolation
- [ ] Export component properly

### Creating a Dynamic Route

- [ ] Create `[slug]` or `[id]` directory
- [ ] Add `generateMetadata()` with dynamic params
- [ ] Add `generateStaticParams()` for SSG (optional)
- [ ] Handle `notFound()` for missing routes
- [ ] Create dynamic SEO helper function
- [ ] Add structured data schema
- [ ] Test all possible route variations

---

## 🎯 Example: Complete Landing Page

Let's create a complete `/resources` landing page as an example:

### Step 1: Create Page Structure

```bash
mkdir src/app/resources
touch src/app/resources/page.tsx
touch src/app/resources/ResourcesPageClient.tsx
```

### Step 2: Page File

**File:** `src/app/resources/page.tsx`

```typescript
import { mapSeoMetaToMetadata } from "@/utils/seo/mapSeoMetaToMetadata";
import { getStaticSeo } from "@/utils/seo/staticSeo";
import { SchemaInjector, buildWebPageSchema } from "@/utils/seo/schema";
import type { Metadata } from "next";
import ResourcesPageClient from "./ResourcesPageClient";

export async function generateMetadata(): Promise<Metadata> {
	const seo = getStaticSeo("/resources");
	return mapSeoMetaToMetadata(seo);
}

export default async function ResourcesPage() {
	const seo = getStaticSeo("/resources");
	const schema = buildWebPageSchema({
		title: seo.title || "Resources",
		description: seo.description || "Helpful resources for your business",
		url: seo.canonical || "https://dealscale.io/resources",
	});
	
	return (
		<>
			<SchemaInjector schema={schema} />
			<ResourcesPageClient />
		</>
	);
}
```

### Step 3: Client Component

**File:** `src/app/resources/ResourcesPageClient.tsx`

```typescript
"use client";

import { ViewportLazy } from "@/components/common/ViewportLazy";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

// Above-the-fold
import ResourcesHero from "@/components/resources/ResourcesHero";
import ResourcesGrid from "@/components/resources/ResourcesGrid";

// Below-the-fold
const ResourcesFAQ = dynamic(
	() => import("@/components/resources/ResourcesFAQ"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);

const ResourcesCTA = dynamic(
	() => import("@/components/resources/ResourcesCTA"),
	{
		loading: () => (
			<div className="flex h-96 items-center justify-center">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
			</div>
		),
	},
);

export default function ResourcesPageClient() {
	return (
		<main>
			<ResourcesHero />
			<ResourcesGrid />
			
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			
			<ViewportLazy>
				<ResourcesFAQ />
			</ViewportLazy>
			
			<Separator className="mx-auto my-16 max-w-7xl border-white/10" />
			
			<ViewportLazy>
				<ResourcesCTA />
			</ViewportLazy>
		</main>
	);
}
```

### Step 4: SEO Configuration

**File:** `src/data/constants/seo.ts`

```typescript
export const STATIC_SEO_META = {
	// ... existing
	"/resources": {
		title: "Resources | Deal Scale",
		description: "Helpful resources, guides, and tools for real estate professionals.",
		canonical: "https://dealscale.io/resources",
		keywords: ["resources", "guides", "tools", ...DEFAULT_SEO.keywords],
		image: DEFAULT_SEO.image,
	},
};
```

**File:** `src/utils/seo/staticSeo.ts`

```typescript
export const staticSeoMeta: Record<string, SeoMeta> = {
	// ... existing
	"/resources": {
		title: STATIC_SEO_META["/resources"].title,
		description: STATIC_SEO_META["/resources"].description,
		canonical: STATIC_SEO_META["/resources"].canonical,
		image: STATIC_SEO_META["/resources"].image,
		keywords: STATIC_SEO_META["/resources"].keywords,
		priority: 0.8,
		changeFrequency: "weekly",
		siteName: DEFAULT_SEO.siteName,
		type: DEFAULT_SEO.type,
	},
};
```

### Step 5: Add to Sitemap

**File:** `src/app/sitemap.ts`

```typescript
const staticPaths = [
	"/",
	"/about",
	"/resources", // ✅ Add new page
	// ... other paths
];
```

---

## 🚀 Next Steps

1. **Review Existing Pages:** Look at `src/app/page.tsx` and `src/app/about/page.tsx` for reference
2. **Check Component Library:** Browse `src/components/` to see reusable components
3. **Follow Patterns:** Match the structure and patterns you see in existing code
4. **Test Thoroughly:** Use React DevTools Profiler and Lighthouse
5. **Get Feedback:** Have team review before merging

---

## 📚 Related Documentation

- [Performance Optimization Guide](../_debug/build/performance/react-profiler-guide.md)
- [SEO Implementation Plan](../../_business/seo/plan.md)
- [Zustand Data Modules](../../_business/zustand/app-integration.md)
- [Component Best Practices](../../front_end_best_practices/README.md)

---

**Questions?** Check existing code examples or reach out to the team!

























