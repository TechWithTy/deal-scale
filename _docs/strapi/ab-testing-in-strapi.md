# A/B testing in Strapi (v5) — Practical guide

Strapi doesn’t ship a built‑in A/B testing engine, but it’s great for managing experiment definitions and delivering variant configurations to your app. This guide shows a proven, maintainable pattern using content-types, deterministic bucketing, and analytics handoff.

## Goals

- Centralize experiments in Strapi (names, variants, rollout, targeting)
- Deterministically assign users to variants (stable across sessions)
- Expose active experiments to apps via API/GraphQL
- Track exposures and conversions in your analytics tool (GA4, Segment, etc.)
- Safely roll out, pause, and conclude experiments

## Content modeling in Strapi

Create a collection type `experiment` and a component `variant`.

- experiment (collection type)
  - key (UID, unique, e.g. "homepage-cta-2025q3")
  - name (string)
  - status (enum: draft | running | paused | concluded)
  - startAt (datetime), endAt (datetime, optional)
  - description (rich text)
  - targeting (JSON; e.g. country==US, role==buyer)
  - traffic (integer 0-100, overall % of traffic eligible)
  - variants (repeatable component: `shared.variant`)

- shared.variant (component)
  - key (UID; e.g. "control", "v1")
  - weight (integer; relative traffic split within eligible users)
  - payload (JSON; free-form config your app uses to render or switch behavior)

Tips:
- Keep keys short and immutable.
- Use `payload` to store variant-specific values (copy, ids, feature flags).

## Assignment strategy (deterministic bucketing)

- Input: stable user identifier (e.g. userId; fallback to cookie ID for anonymous).
- Compute hash = HMAC(userId, experiment.key) % 100.
- If hash < experiment.traffic → eligible, else assign "off" (no experiment).
- Within eligible users, map hash to a variant bucket using cumulative weights.

This guarantees stable assignments across sessions and deployments.

## Serving variants to clients

Choose one of these patterns:

- Minimal: expose experiments via REST `entityService` with server-side filtering (status=running, date window) and resolve variant assignment in the client using the algorithm above.
- Centralized: add a custom endpoint `GET /experiments/assignments?uid=<userId>` that returns the assigned variant per running experiment. Do the bucketing on the server and cache for 5-15 minutes.
- Config push: maintain a single-type `experiments-config` that Strapi builds by cron or on publish (webhook) to a CDN; clients fetch a small JSON map.

For Strapi v5 REST, prefer a custom controller/service for the centralized approach. Use `strapi.entityService.findMany('api::experiment.experiment', { filters, populate })` and post-process.

## Targeting rules

- Store simple rule sets as structured JSON in `experiment.targeting` (e.g., { country: ["US"], role: ["buyer"] }).
- Evaluate on the server (custom service) or client (if you serve rules directly). Keep rule evaluation deterministic and side‑effect free.

## Analytics and event tracking

- Track two events per experiment:
  - exposure: when a user is assigned and sees the variant
  - conversion: when the success metric occurs (e.g., signup)
- Forward to your analytics sink:
  - GA4: `gtag('event', 'experiment_exposure', { experiment_id, variant })`
  - Segment: `analytics.track('Experiment Exposure', { experiment, variant })`
- If you need server-side logging, add a lightweight endpoint `/experiments/track` that proxies to your analytics backend.

## Rollout workflow

- Draft: define experiment, variants, weights=0, test in preview.
- Running: set `status=running`, set `traffic` and `weights` (ensure sum of weights > 0); publish.
- Pause: switch `status=paused` (assignments should stop; clients treat as control/off).
- Conclude: mark winner → either
  - keep as always-on config outside of experiments, or
  - set winning variant weight=100 and `status=concluded` for audit trail.

## Governance and safety

- Permissions: limit create/update of `experiment` to admins only (Users & Permissions).
- Validation: add content-type validations (e.g., weights >= 0) and a lifecycle hook to ensure sum(weights) > 0 when status=running.
- Environments: use different experiment sets per env or an `environment` field; don’t run prod experiments in staging by mistake.

## Performance considerations

- Cache the computed assignments (per user) for a short TTL.
- Keep the experiment list small and time-bound; archive concluded experiments.
- Serve a compact payload for mobile/web (strip drafts, editors-only fields).

## Example API shape (centralized assignment)

Response from `GET /experiments/assignments?uid=123`:

```json
{
  "experiments": {
    "homepage-cta-2025q3": {
      "variant": "v1",
      "payload": { "ctaText": "Start free trial", "color": "#2d6cdf" }
    },
    "pricing-badge-2025q3": { "variant": "control", "payload": {} }
  },
  "meta": { "generatedAt": "2025-08-31T16:00:00Z", "ttl": 600 }
}
```

## Practical steps to implement in this repo

1) Model content-types
   - Create `experiment` collection type and `shared.variant` component as above.
2) Read experiments in a service
   - Filter by `status=running`, date window, and environment.
   - Compute assignments per user (deterministic hash + weights).
3) Expose an endpoint
   - `src/api/experiment/controllers/assignment.ts` with `findAssignments(ctx)` that reads `uid` and returns the map.
4) Frontend integration
   - Generate or read a stable userId (auth id or cookie ID) and call the endpoint.
   - Persist userId so assignments are stable.
5) Tracking
   - Fire exposure on first render per experiment+variant; fire conversions on target actions.
6) Operate
   - Use Strapi to adjust traffic split, pause, or conclude.

## Testing

- Unit test the bucketing function (hash, eligibility, weight mapping).
- Smoke test the endpoint with mock users to ensure desired split (e.g., 50/50 within tolerance).
- Validate that pausing removes assignments within cache TTL.

## References

- Strapi v5 Content API: https://docs.strapi.io
- Roles & Permissions: https://docs.strapi.io/cms/users-roles-permissions
- TypeScript services/controllers: https://docs.strapi.io/cms/developer-docs/latest/development/backend-customization.html

