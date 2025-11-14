# Supabase OAuth Debug Log

## Latest test (LinkedIn OIDC)
- **Timestamp:** 2025-09-25T21:42:00-06:00 (local)
- **Environment:** `localhost`
- **Callback route:** `src/app/api/auth/supabase/callback/route.ts`

## Observed behaviour
- Supabase logs: `invalid request: both auth code and code verifier should be non-empty`.
- Next.js runtime throws: `TypeError: nextCookies.get is not a function` when the callback attempts to exchange the auth code for a session.
- Redirect: `/settings/integrations?status=error&message=unexpected_error`.
- Credential sync request to DealScale API is not triggered (exchange never completes).

## Relevant cookies captured
- `sb-qmunpzmthgpekebwjazo-auth-token`: present when initiating the OAuth flow.
- `sb-qmunpzmthgpekebwjazo-auth-token-code-verifier`: **missing** after Supabase redirects back, which prevents PKCE exchange.

## Current mitigation steps
1. Await `cookies()` in the route handler to satisfy Next.js 15.
2. Pass the cookie store into `createRouteHandlerClient<Database>()` while logging the derived project ref and cookie presence.
3. Surface enhanced error logging (code, message, detail) when the exchange or credential persistence fails.

## Action items
- [ ] Verify the `code_verifier` cookie is set in the browser immediately before the callback.
- [ ] Investigate why `createRouteHandlerClient` still throws `nextCookies.get is not a function` (Supabase helper expects synchronous access).
- [ ] Confirm DealScale `/api/v1/auth/oauth/credentials` accepts POST from the callback once exchange succeeds.
