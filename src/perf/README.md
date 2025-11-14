Performance utilities (non-invasive)

What’s included
- useDeferredGate: hook to defer work until interaction/idle/timeout
- DeferredVisible: wrapper to render heavy components only when visible + gated
- ThirdPartyGate: consent + deferred loader for Pixel, Clarity, Zoho
- thirdPartyLoaders: safe script injectors (idempotent)

Why
- Reduce TBT/TTI/Speed Index by deferring third-parties and heavy UI
- Avoid CLS by reserving space and loading hero media lazily
- Keep changes additive to avoid overwriting in-flight work

How to wire (minimal changes)
1) Gate analytics/pixels in app/layout.tsx
   import ThirdPartyGate from '@/perf/ThirdPartyGate'
   <ThirdPartyGate
     consentGranted={consent === 'granted'}
     requireInteraction={true}
     maxWaitMs={5000}
     facebookPixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID}
     clarityTag={process.env.NEXT_PUBLIC_CLARITY_TAG}
     zohoSrc={process.env.NEXT_PUBLIC_ZOHO_SIQ_URL}
   />

2) Defer heavy hero subcomponents
   import DeferredVisible from '@/perf/DeferredVisible'
   <DeferredVisible minHeight={360} idleAfterMs={2000} timeout={5000}>
     <HeroVideo />
   </DeferredVisible>

3) Shrink shared chunks
   - Cherry-pick imports (lodash/date-fns/icons) or enable modularizeImports in next.config.js
   - Move heavy libs out of shared layout/providers; dynamic-import per route

4) Environment
   NEXT_PUBLIC_FB_PIXEL_ID=...
   NEXT_PUBLIC_CLARITY_TAG=...
   NEXT_PUBLIC_ZOHO_SIQ_URL=https://salesiq.zohopublic.com/widget?... (optional)

Caveats
- ThirdPartyGate is disabled on localhost and non-production builds via loaders
- Scripts are injected once by id to avoid duplicates

