# Performance Optimization Priorities - Nov 2025

Based on the Nov 1, 2025 Lighthouse audit, here are the prioritized optimization opportunities.

## 🔥 Critical (High Impact, Quick Wins)

### 1. Defer Third-Party Analytics Scripts
**Impact:** ~200ms TBT improvement, ~133 KiB JS savings

**Current Issues:**
- Google Tag Manager: 239 KiB (106 KiB unused)
- Facebook Pixel: 84 KiB (27 KiB unused)
- Microsoft Clarity: ~80 KiB

**Implementation:**
```typescript
// Load analytics only after page load or user interaction
useEffect(() => {
  // Wait for page to be fully interactive
  if (document.readyState === 'complete') {
    loadAnalytics();
  } else {
    window.addEventListener('load', loadAnalytics, { once: true });
  }
}, []);
```

**Expected Results:**
- TBT: 310ms → ~210ms
- Unused JS: -133 KiB
- Performance Score: 94 → 95-96

---

### 2. Implement Proper Cache Headers
**Impact:** 134 KiB savings, faster repeat visits

**Implementation in `next.config.ts`:**
```typescript
async headers() {
  return [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

**Expected Results:**
- Cache efficiency: +134 KiB
- Repeat visit performance: +30-40%

---

### 3. Remove Unused CSS
**Impact:** 20-22 KiB savings

**Current:** `3b29224403c4f1b7.css` - 20.3 KiB unused out of 25.5 KiB

**Implementation:**
1. Audit Tailwind usage with `@tailwindcss/cli`
2. Enable CSS purging in production
3. Split CSS by route

**Expected Results:**
- Bundle size: -20 KiB
- Parse time: -50ms

---

## ⚡ High Priority (Significant Impact)

### 4. Code Splitting & Unused JavaScript Removal
**Impact:** ~120-350 KiB savings

**Top Offenders:**
- `chunks/dc112a36-18909a95e93ec969.js`: 67.9 KiB unused
- `chunks/6734-e0aed99ae6c58d99.js`: 30.5 KiB unused
- `chunks/6545-9f89bcadfdd9d03c.js`: 21.9 KiB unused

**Implementation:**
```typescript
// Dynamic imports for below-the-fold components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // If not needed for SSR
});

// Route-based code splitting (automatic in Next.js)
// Verify pages are properly split
```

**Tools:**
- Next.js Bundle Analyzer
- Webpack Bundle Analyzer
- Lighthouse unused JavaScript audit

**Expected Results:**
- Bundle size: -120-350 KiB
- LCP: 12.7s → ~10s (mobile)
- Performance Score: 94 → 96-97

---

### 5. Critical CSS Extraction (Mobile)
**Impact:** 550ms render blocking improvement

**Implementation:**
```typescript
// Inline critical CSS in _document.tsx or layout.tsx
const criticalCSS = `
  /* Above-the-fold styles only */
  .hero { ... }
  .navbar { ... }
`;

// Defer non-critical CSS
<link
  rel="preload"
  href="/styles/non-critical.css"
  as="style"
  onLoad="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link rel="stylesheet" href="/styles/non-critical.css" />
</noscript>
```

**Alternative:**
- Use `next/dynamic` with CSS imports
- Use `media="print"` trick for non-critical CSS

**Expected Results:**
- Render blocking: -550ms
- FCP: 3.3s → ~2.5s
- LCP: 12.7s → ~11s

---

### 6. Image Optimization
**Impact:** 35-101 KiB savings

**Implementation:**
```typescript
// Use Next.js Image component with optimization
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority // For above-the-fold
  format="webp"
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Actions:**
1. Convert all images to WebP/AVIF
2. Implement responsive `sizes` attribute
3. Use `priority` only for LCP elements
4. Lazy load below-the-fold images

**Expected Results:**
- Image payload: -35-101 KiB
- LCP: 12.7s → ~11.5s
- Network transfer: -5-10%

---

## 🎯 Medium Priority (Polish & Optimization)

### 7. Legacy JavaScript Cleanup
**Impact:** 24 KiB savings

**Implementation:**
```javascript
// next.config.ts
module.exports = {
  compiler: {
    // Modern JavaScript output
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Update browserslist for modern targets
};
```

**Actions:**
1. Update `browserslist` to modern targets
2. Remove unnecessary polyfills
3. Use ES2020+ features

**Expected Results:**
- Bundle size: -24 KiB
- Parse time: -30ms

---

### 8. Long Task Splitting
**Impact:** TBT reduction to < 200ms

**Current:** 12 long tasks on mobile, 7 on desktop

**Implementation:**
```typescript
// Split heavy computations
const processData = async (data: LargeDataset) => {
  // Use requestIdleCallback for non-critical work
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Heavy processing
      processInChunks(data);
    });
  } else {
    setTimeout(() => processInChunks(data), 0);
  }
};

// Defer non-critical work
useEffect(() => {
  const timer = setTimeout(() => {
    // Non-critical initialization
    initAnalytics();
  }, 2000);
  return () => clearTimeout(timer);
}, []);
```

**Expected Results:**
- TBT: 310ms → < 200ms
- Interactive time: -100ms

---

### 9. Reduce Forced Reflows
**Impact:** Smoother animations, reduced layout thrashing

**Implementation:**
```typescript
// ❌ Bad: Causes forced reflow
element.style.height = 'auto';
const height = element.offsetHeight;

// ✅ Good: Batch operations
const height = element.offsetHeight;
element.style.height = `${height}px`;

// ✅ Use CSS transforms for animations
.element {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

// Instead of:
.element {
  left: 0;
  transition: left 0.3s ease;
}
```

**Expected Results:**
- Layout thrashing: -50%
- Animation smoothness: +30%

---

## 📊 Optimization Impact Summary

| Optimization | Mobile Impact | Desktop Impact | Priority | Effort |
|-------------|---------------|----------------|----------|--------|
| Defer Analytics | High | Medium | 🔥 Critical | Low |
| Cache Headers | High | High | 🔥 Critical | Low |
| Unused CSS | Medium | Medium | 🔥 Critical | Medium |
| Code Splitting | Very High | Medium | ⚡ High | Medium |
| Critical CSS | Very High | Low | ⚡ High | High |
| Image Optimization | High | High | ⚡ High | Medium |
| Legacy JS | Low | Low | 🎯 Medium | Low |
| Long Tasks | Medium | Low | 🎯 Medium | Medium |
| Reflows | Low | Low | 🎯 Medium | Medium |

---

## 🎯 Target Metrics After All Optimizations

### Mobile
- **Performance Score:** 94 → **97-98**
- **LCP:** 12.7s → **< 3s**
- **FCP:** 3.3s → **< 1.8s**
- **TBT:** 310ms → **< 200ms**
- **CLS:** 0 → **0** (maintain)
- **SI:** 7.1s → **< 4s**

### Desktop
- **Performance Score:** 89 → **92-94**
- **TBT:** 210ms → **< 200ms**
- All other metrics already excellent

---

## 📅 Implementation Timeline

### Week 1 (Nov 1-7)
- [ ] Defer analytics scripts
- [ ] Implement cache headers
- [ ] Remove unused CSS (audit + cleanup)

### Week 2 (Nov 8-14)
- [ ] Code splitting audit and implementation
- [ ] Image optimization (WebP conversion)
- [ ] Legacy JavaScript cleanup

### Week 3 (Nov 15-21)
- [ ] Critical CSS extraction
- [ ] Long task optimization
- [ ] Reflow fixes

### Week 4 (Nov 22-28)
- [ ] Re-audit and verify improvements
- [ ] Fine-tune based on results
- [ ] Document changes

---

*Last Updated: Nov 1, 2025*
*Based on Lighthouse 13.0.1 audit*

