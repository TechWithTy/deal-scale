'use client'
import { useEffect, useRef, useState } from 'react'
import { useDeferredGate } from './useDeferredGate'

type Props = {
  minHeight?: number
  className?: string
  children: React.ReactNode
  requireInteraction?: boolean
  idleAfterMs?: number
  timeout?: number
}

/**
 * Render children only when visible (IO) and after deferred gate allows.
 * Keeps a fixed-height placeholder to avoid CLS.
 */
export default function DeferredVisible({
  minHeight = 360,
  className,
  children,
  requireInteraction = false,
  idleAfterMs = 2000,
  timeout = 5000,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const canLoad = useDeferredGate({ requireInteraction, idleAfterMs, timeout })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true)
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {visible && canLoad ? children : null}
    </div>
  )
}

