export function appendScriptOnce(id: string, src: string, attrs: Record<string, string | boolean> = {}) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.src = src
  Object.entries(attrs).forEach(([k, v]) => {
    if (typeof v === 'boolean') {
      if (v) (s as any)[k] = true
    } else {
      s.setAttribute(k, String(v))
    }
  })
  document.head.appendChild(s)
}

export function loadFacebookPixel(pixelId: string) {
  if (typeof window === 'undefined') return
  if (!pixelId) return
  if ((window as any).fbq) return
  // Avoid on localhost by default
  if (location.hostname === 'localhost') return
  ;(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return
    n = f.fbq = function () {
      n!.callMethod ? n!.callMethod.apply(n, arguments) : n!.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = true
    t.src = 'https://connect.facebook.net/en_US/fbevents.js'
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 0)
  ;(window as any).fbq('init', pixelId)
}

export function loadClarity(tag: string) {
  if (typeof window === 'undefined') return
  if (!tag) return
  appendScriptOnce('clarity-js', `https://www.clarity.ms/tag/${tag}`)
}

export function loadZohoSalesIQ(widgetSrc: string) {
  if (typeof window === 'undefined') return
  if (!widgetSrc) return
  appendScriptOnce('zoho-salesiq', widgetSrc)
}

