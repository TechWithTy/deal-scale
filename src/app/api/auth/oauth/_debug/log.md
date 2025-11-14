# OAuth Debug Log

This document captures every major attempt to integrate LinkedIn OAuth via Supabase during the 2025-09-25/26 debugging session. Each entry records the context, actions taken, observed results, and outstanding follow-ups so future runs can reproduce or extend the work quickly.

---

## 1. Initial Flow (2025-09-25T20:25-21:15)
- **Environment:** Local `http://localhost:3000`
- **Goal:** Replace NextAuth social login with Supabase (`signInWithOAuth`) for LinkedIn and Facebook.
- **Key changes:**
  - Updated `src/app/signIn/page.tsx` to call `supabase.auth.signInWithOAuth()` with custom `redirectTo` pointing at `api/auth/supabase/callback`.
  - Added server-side callback handler at `src/app/api/auth/supabase/callback/route.ts` to exchange the code, encrypt tokens, and forward them to DealScale API.
  - Created service-role Supabase client helper in `src/lib/supabase/server.ts`.
- **Result:** Supabase returned `server_error` / `invalid_client` because the LinkedIn app was not yet configured for OIDC.
- **Resolution:** Enabled “Sign in with LinkedIn using OpenID Connect” in the LinkedIn developer dashboard and set the credentials inside Supabase.

## 2. PKCE Exchange Failures (2025-09-25T21:15-21:32)
- **Symptoms:** Supabase logs `invalid request: both auth code and code verifier should be non-empty`. Callback threw `TypeError: nextCookies.get is not a function`.
- **Root cause:** Callback used the service-role client; Supabase helper expected the PKCE cookies created by the browser flow.
- **Fixes Applied:**
  - Switched to `createRouteHandlerClient<Database>` from `@supabase/auth-helpers-nextjs`.
  - Awaited `cookies()` before instantiating the client (Next.js 15 requires this).
  - Added detailed logging in `route.ts` to inspect `code_verifier` cookies and Supabase error payloads.
- **Outcome:** Next.js warning resolved, but runtime still failed (`nextCookies.get is not a function`) because the helper received a synchronous cookie store.

## 3. Cookie Handling Adjustments (2025-09-25T21:32-21:42)
- **Actions:**
  - Added helper logic to inspect PKCE cookies (`sb-<project>-auth-token-code-verifier` and `.0`).
  - Wrapped the cookie store in a promise (`Promise.resolve(cookieStore)`) and later cast to the expected type for Supabase so it can access cookies synchronously.
  - Created `_docs/_debug/supabase-oauth.md` to track attempts and assumptions.
- **Observation:** Supabase still reported missing verifier cookies; browser likely blocked them.
- **Mitigation:** Cleared cookies, disabled blocking extensions, ensured URL used exact origin `http://localhost:3000`.

## 4. Successful PKCE Exchange (2025-09-26T10:32:27Z)
- **Evidence:** Supabase `/token` log shows `status=200` with grant type `pkce`; `exchangeCodeForSession` succeeded.
- **Redirect:** `/settings/integrations?status=error&message=credential_sync_failed&detail=Method%20Not%20Allowed`.
- **New failure point:** DealScale credential persistence endpoint rejects POST (405). Supabase portion confirmed working.

## 5. Current State (2025-09-26T10:35Z)
- **Supabase:** PKCE flow reliable; `code_verifier` cookie observed in logs.
- **Callback handler:** `src/app/api/auth/supabase/callback/route.ts` now includes:
  - Project ref derivation for logging.
  - PKCE cookie presence logging via `console.debug`.
  - Return of `detail` query param to report Supabase error messages.
- **DealScale API:** `POST /api/v1/auth/oauth/credentials` returns 405. Need backend confirmation whether route should be `POST`, `PUT`, `PATCH`, or if additional headers/body fields are required.
- **Debug artifacts:**
  - `_docs/_debug/supabase-oauth.md` (general run log).
  - `src/app/api/auth/oauth/_debug/log.md` (this file).

---

## Action Items
- **Validate DealScale credentials endpoint:**
  - Confirm expected HTTP method.
  - Ensure payload matches schema (`provider`, encrypted `access_token`, optional `refresh_token`, `expires_at`, `user_id`).
  - Verify `Authorization` header uses `session.dsTokens.access_token`.
- **Clean-up logging once stable:**
  - Remove or demote `console.debug`/`console.error` statements when integration is confirmed.
- **Address lint warnings:**
  - Sort Tailwind classes in `src/app/settings/integrations/page.tsx`.
  - Specify types in `src/utils/__tests__/linktree/linkResolution.test.ts` to clear `Unexpected any` warning.
- **Future monitoring:** Repeat the OAuth flow after backend adjustments and append new results to this log.
