// Advanced SEO + Routing Middleware for Cloudflare Pages Functions
// Bindings (configure in Cloudflare Pages project):
// - KV Namespace: META_KV (optional) for per-path meta overrides
// Environment vars (in Pages): CF_PAGES_BRANCH, CF_PAGES_URL, CF_PAGES_COMMIT_SHA

export const onRequest = async (context: any) => {
  const request = context.request as Request;
  const url = new URL(request.url);

  const branch = (context.env?.CF_PAGES_BRANCH || context.env?.BRANCH || '').toString();
  const isPreview = branch && branch !== 'main';

  // 1) Canonical host: drop www.
  if (url.hostname.startsWith('www.')) {
    const redirectTo = `https://${url.hostname.replace('www.', '')}${url.pathname}${url.search}`;
    return Response.redirect(redirectTo, 301);
  }

  // 2) Trailing slash normalization (keep slash only for root)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    return Response.redirect(url.toString(), 301);
  }

  // 3) UTM persistence (30 days)
  if (url.searchParams && url.searchParams.toString()) {
    context.cookies.set('utm', url.searchParams.toString(), {
      path: '/',
      maxAge: 86400 * 30,
      httpOnly: false,
      sameSite: 'Lax',
    });
  }

  // 4) A/B cookie (simple 50/50 split)
  const ab = context.cookies.get('ab')?.value;
  if (!ab) {
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    context.cookies.set('ab', variant, { path: '/', maxAge: 86400 * 30 });
  }

  // 5) Country-aware header pass-through (no redirect by default)
  const country = (request as any)?.cf?.country;

  // 6) Edge cache for GET/HEAD HTML responses
  const method = request.method.toUpperCase();
  const cacheable = method === 'GET' || method === 'HEAD';
  const cacheKey = new Request(url.toString(), request);
  if (cacheable) {
    const cached = await context.caches.default.match(cacheKey);
    if (cached) return maybeMarkNoindex(cached, isPreview);
  }

  // 7) Run downstream and capture response
  let response = await context.next();

  // 8) Inject SEO meta overrides from KV (if available) using HTMLRewriter
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    try {
      const kv = context.env?.META_KV;
      if (kv) {
        const key = url.pathname === '/' ? '/index' : url.pathname;
        const metaJson = await kv.get(`meta:${key}`, { type: 'json' });
        if (metaJson && typeof metaJson === 'object') {
          const rewriter = new HTMLRewriter()
            .on('head', {
              element(el) {
                // canonical
                if (metaJson.canonical) {
                  el.append(`<link rel="canonical" href="${metaJson.canonical}" />`, { html: true });
                }
                // description
                if (metaJson.description) {
                  el.append(`<meta name="description" content="${escapeHtml(metaJson.description)}" />`, { html: true });
                }
                // OG basics
                if (metaJson.ogTitle) {
                  el.append(`<meta property="og:title" content="${escapeHtml(metaJson.ogTitle)}" />`, { html: true });
                }
                if (metaJson.ogDescription) {
                  el.append(`<meta property="og:description" content="${escapeHtml(metaJson.ogDescription)}" />`, { html: true });
                }
                if (metaJson.ogImage) {
                  el.append(`<meta property="og:image" content="${escapeHtml(metaJson.ogImage)}" />`, { html: true });
                }
                if (metaJson.twitterCard) {
                  el.append(`<meta name="twitter:card" content="${escapeHtml(metaJson.twitterCard)}" />`, { html: true });
                }
              },
            });
          response = rewriter.transform(response);
        }
      }
    } catch (_) {
      // ignore injection failures
    }
  }

  // 9) Cache the final response
  if (cacheable) {
    try { await context.caches.default.put(cacheKey, response.clone()); } catch (_) {}
  }

  // 10) Noindex on preview branches
  return maybeMarkNoindex(response, isPreview, country);
};

function maybeMarkNoindex(res: Response, isPreview: boolean, country?: string): Response {
  if (!isPreview) return res;
  const newHeaders = new Headers(res.headers);
  newHeaders.set('X-Robots-Tag', 'noindex, nofollow');
  if (country) newHeaders.set('X-Visitor-Country', country);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: newHeaders });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
