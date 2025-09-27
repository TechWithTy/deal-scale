# Supabase OAuth Integration Guide

## Purpose
This document explains how LinkedIn/Facebook OAuth flows are handled in the Supabase-backed auth stack, when the DealScale backend still needs social credentials, and how to wire everything together without breaking existing functionality.

## Why store credentials in our backend?
- **Existing DealScale services rely on them.** Features such as CRM sync, analytics, and job scheduling consume encrypted provider tokens stored in DealScale’s API. If we stop persisting tokens server-side, those workflows break.
- **Centralised revocation and auditing.** Keeping credentials in DealScale allows centralized rotation, revocation, and auditing instead of relying on a single Supabase project.
- **Multi-platform parity.** Mobile or third-party clients that authenticate via NextAuth tokens expect the backend to own the credentials and cannot read Supabase session cookies.

## High-level flow (LinkedIn example)
1. **Client:** `src/app/signIn/page.tsx` calls `supabase.auth.signInWithOAuth({ provider: "linkedin_oidc", options: { redirectTo } })`.
2. **Supabase:** Redirects to LinkedIn, receives callback, stores PKCE cookies (`sb-<ref>-auth-token-code-verifier`) and redirects back to our API route.
3. **Callback:** `src/app/api/auth/supabase/callback/route.ts` exchanges the code for a Supabase session using `createRouteHandlerClient({ cookies })`.
4. **DealScale sync:** On success, callback encrypts the provider tokens with `encryptOAuthToken()` and `POST`s them to `DEALSCALE_API_BASE/api/v1/auth/oauth/credentials` along with the current DealScale access token (`session.dsTokens.access_token`).
5. **Redirect:** User lands on `/settings/integrations` with a `status` query parameter describing success or failure.

## Implementation details
### Callback route (`src/app/api/auth/supabase/callback/route.ts`)
- Await `cookies()` first, then pass a synchronous getter into `createRouteHandlerClient<Database>({ cookies: () => cookieStore })`.
- Log project ref and PKCE cookie presence for easier debugging:
  ```ts
  console.debug("Supabase OAuth PKCE cookies", {
    projectRef,
    codeVerifierCookieNames,
    codeVerifierPresent: Boolean(codeVerifier),
  });
  ```
- On error, return `redirectWithParams(origin, redirectDestination, { status: "error", message })` so the UI can surface the status.
- For DealScale sync, send:
  ```json
  {
    "provider": "LINKEDIN",
    "access_token": "<encrypted>",
    "refresh_token": "<encrypted | null>",
    "expires_at": <unix_timestamp | null>,
    "user_id": "<DealScale user id>"
  }
  ```
  Include `Authorization: Bearer <session.dsTokens.access_token>`.

### DealScale API expectations
- Endpoint: `POST /api/v1/auth/oauth/credentials`
- Requires Bearer token (DealScale access token).
- Responds with `200 OK` on success. A `405` indicates the endpoint method doesn’t match (post vs put) or the route is disabled.
- Logs are available in the DealScale API console for traceability.

## Local testing checklist
- Use the same origin as Supabase cookies (`http://localhost:3000`).
- Confirm the following environment variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (only for server-side utilities)
  - `OAUTH_ENCRYPTION_KEY` (64 hex characters)
  - `DEALSCALE_API_BASE`
- Inspect cookies mid-flow (DevTools → Application → Cookies) to verify `sb-<ref>-auth-token-code-verifier` exists before the callback fires.
- Tail `pnpm dev` logs for `Supabase OAuth PKCE cookies` diagnostics and DealScale sync errors.

## Alternative approach (Supabase-managed credentials only)
If DealScale no longer needs provider tokens:
1. Remove the sync POST from `route.ts` and delete the `/api/auth/social-sign-in` endpoint.
2. Update backend jobs to fetch tokens directly from Supabase using the service role key.
3. Migrate encryption logic and token rotation into Supabase Edge Functions.
4. Review compliance implications (DealScale would rely entirely on Supabase for secure storage).

_Recommendation:_ keep the current DealScale persistence unless the backend team signs off on storing credentials solely in Supabase.
