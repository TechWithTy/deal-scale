'use client'
import { useEffect } from 'react'
import { useDeferredGate } from './useDeferredGate'
import { loadClarity, loadFacebookPixel, loadZohoSalesIQ } from './thirdPartyLoaders'

type Props = {
  consentGranted: boolean
  requireInteraction?: boolean
  maxWaitMs?: number
  idleAfterMs?: number
  facebookPixelId?: string
  clarityTag?: string
  zohoSrc?: string
  onAfterLoad?: () => void
}

/**
 * Gate third-party scripts behind user interaction/idle/timeout and consent.
 * Non-invasive: place once in layout when ready.
 */
export default function ThirdPartyGate({
  consentGranted,
  requireInteraction = true,
  maxWaitMs = 5000,
  idleAfterMs = 2000,
  facebookPixelId,
  clarityTag,
  zohoSrc,
  onAfterLoad,
}: Props) {
  const canLoad = useDeferredGate({
    requireInteraction,
    timeout: maxWaitMs,
    idleAfterMs,
  })

  useEffect(() => {
    if (!canLoad || !consentGranted) return
    if (process.env.NODE_ENV !== 'production') return
    try {
      if (facebookPixelId) loadFacebookPixel(facebookPixelId)
      if (clarityTag) loadClarity(clarityTag)
      if (zohoSrc) loadZohoSalesIQ(zohoSrc)
      onAfterLoad?.()
    } catch {
      // swallow
    }
  }, [canLoad, consentGranted, facebookPixelId, clarityTag, zohoSrc, onAfterLoad])

  return null
}

