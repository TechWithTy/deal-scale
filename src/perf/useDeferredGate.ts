'use client'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_MAX_WAIT_MS = 5000
const DEFAULT_IDLE_TIMEOUT_MS = 2000

export type DeferredGateOptions =
  | number
  | {
      requireInteraction?: boolean
      timeout?: number
      idleAfterMs?: number
    }

/**
 * useDeferredGate
 * - requireInteraction: waits for user input before allowing load
 * - idleAfterMs: allows load after page idle (fallback timer if no rIC)
 * - timeout: absolute cap to allow load regardless
 */
export function useDeferredGate(options: DeferredGateOptions = DEFAULT_MAX_WAIT_MS) {
  const parsed =
    typeof options === 'number'
      ? { requireInteraction: false, timeout: options, idleAfterMs: DEFAULT_IDLE_TIMEOUT_MS }
      : {
          requireInteraction: !!options.requireInteraction,
          timeout:
            typeof options.timeout === 'number' && options.timeout > 0
              ? options.timeout
              : DEFAULT_MAX_WAIT_MS,
          idleAfterMs:
            typeof options.idleAfterMs === 'number' && options.idleAfterMs >= 0
              ? options.idleAfterMs
              : DEFAULT_IDLE_TIMEOUT_MS,
        }

  const [canLoad, setCanLoad] = useState(false)
  const doneRef = useRef(false)
  const idleId = useRef<number | null>(null)
  const capId = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (doneRef.current || canLoad) return

    const mark = () => {
      if (doneRef.current) return
      doneRef.current = true
      setCanLoad(true)
      cleanup()
    }

    const onInteract = () => mark()

    const listeners: Array<[
      string,
      EventListenerOrEventListenerObject,
      AddEventListenerOptions
    ]> = [
      ['pointerdown', onInteract, { passive: true }],
      ['keydown', onInteract, { passive: true }],
      ['touchstart', onInteract, { passive: true }],
      ['wheel', onInteract, { passive: true }],
      ['scroll', onInteract, { passive: true }],
    ]

    const cleanup = () => {
      listeners.forEach(([type, handler, opts]) =>
        window.removeEventListener(type, handler as any, opts)
      )
      if (typeof (window as any).cancelIdleCallback === 'function' && idleId.current != null) {
        ;(window as any).cancelIdleCallback(idleId.current)
      }
      if (capId.current) clearTimeout(capId.current)
    }

    if (parsed.requireInteraction) {
      listeners.forEach(([type, handler, opts]) =>
        window.addEventListener(type, handler as any, opts)
      )
    } else {
      if (typeof (window as any).requestIdleCallback === 'function') {
        idleId.current = (window as any).requestIdleCallback(
          () => !doneRef.current && mark(),
          { timeout: parsed.idleAfterMs }
        )
      } else {
        // Fallback short timer
        capId.current = setTimeout(() => {
          if (!doneRef.current) mark()
        }, parsed.idleAfterMs)
      }
    }

    // Absolute cap to prevent never-loading
    capId.current = setTimeout(() => {
      if (!doneRef.current) mark()
    }, parsed.timeout)

    return cleanup
  }, [parsed.requireInteraction, parsed.timeout, parsed.idleAfterMs, canLoad])

  return canLoad
}

