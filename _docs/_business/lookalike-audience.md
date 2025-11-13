# Lookalike Audience Module (Relational + Vector)

## Overview
- **Goal:** Expand each tenant’s reach by finding leads whose embeddings align with high-performing “seed” audiences while enforcing strict multi-tenant isolation.
- **Scope:** Schema extensions, REST contracts, Kestra orchestration, and operational guardrails required to operationalize lookalike audiences on DealScale.
- **Key Principles:** Vector-first scoring via pgvector, deterministic filtering, export automation, measurable feedback, and recurring retraining.

---

## Data Model & Storage

### Core Tables
- `leads`  
  - `embedding vector(D)` (e.g., D ∈ {256, 384, 768}).  
  - `tenant_id uuid` (if absent, add).  
  - `is_seed boolean DEFAULT FALSE`.  
  - `similarity_score double precision` (latest computed score).  
  - Index: `CREATE INDEX IF NOT EXISTS idx_leads_embedding_hnsw ON leads USING hnsw (embedding vector_cosine_ops);`
- `lookalike_seed`  
  - Tracks seed lead metadata (`seed_id uuid PRIMARY KEY DEFAULT gen_random_uuid()`).  
  - `lead_id bigint REFERENCES leads(id)` (enforce same `tenant_id`).  
  - `label text` (e.g., “Closed Deal”).  
  - `created_at timestamptz DEFAULT now()`.
- `lookalike_candidate`  
  - Stores candidate leads plus similarity score for a given seed.  
  - `status text DEFAULT 'pending'` (`pending`, `accepted`, `exported`, `excluded`, `converted`).  
  - Add `(seed_id, lead_id)` unique constraint to prevent duplicates.
- `lookalike_audience`  
  - Represents audiences presented to users.  
  - `seed_set jsonb` (array of seed `lead_id`s).  
  - `rules jsonb` (filters, thresholds, exclusions).  
  - `metadata jsonb` (model version, source flow).  
  - `status text DEFAULT 'draft'` (`draft`, `published`, `retired`).
- `lookalike_audience_member`  
  - M:N bridge from audiences to candidates.  
  - PK: `(audience_id, candidate_id)`.
- `lookalike_conversion`  
  - Feedback loop capturing downstream events (clicks, deals, etc.).  
  - `metadata jsonb` for channel, campaign, UTM fields.


### Multi-Tenancy & Security
- Mandate `tenant_id uuid` on every table with `ALTER TABLE ... ADD COLUMN tenant_id uuid NOT NULL`.
- Enable RLS aligning `tenant_id` with the caller’s JWT claims. Enforce `USING (tenant_id = current_setting('app.current_tenant')::uuid)` or equivalent Postgres RLS policy.
- Partition ANN indices per tenant if the table becomes large; otherwise rely on filtered HNSW queries (`WHERE tenant_id = ...`).
- Prohibit cross-tenant vector reads by scoping search queries to `tenant_id`.  
  `SELECT id, (embedding <=> seed_vec) AS cosine_dist FROM leads WHERE tenant_id = :tenant_id AND id != :seed_id ORDER BY cosine_dist LIMIT :k;`

### Performance Considerations
- Use unit-normalized embeddings (`embedding / ||embedding||`) if working with cosine distance.
- For high-volume tenants, pre-compute candidate pools nightly and store within `lookalike_candidate`.  
- Add GIN indexes on `rules`, `metadata`, and `seed_set` when querying JSON fields.
- Track similarity deciles using `ntile(10)` for UX insights.

---

## REST API Contracts (FastAPI)

### Seed Management
| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| POST | `/v1/tenants/{tenant_id}/lookalike/seed` | `{ "lead_ids": [123, 456], "label": "Closed Deal" }` | `{ "seed_ids": ["..."] }` | Validates each `lead_id` belongs to tenant; flags `leads.is_seed = TRUE`. |
| GET | `/v1/tenants/{tenant_id}/lookalike/seed` | — | `{ "seeds": [...] }` | Returns seed metadata sorted by `created_at`. |
| DELETE | `/v1/tenants/{tenant_id}/lookalike/seed/{seed_id}` | — | `{}` | Soft delete recommended (set `is_seed = FALSE`). |

### Audience Lifecycle
| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| POST | `/v1/tenants/{tenant_id}/lookalike/audience` | `{ "name": "Lookalike A", "seed_ids": ["..."], "rules": {...} }` | `{ "audience_id": "...", "size_estimate": 1234 }` | Triggers Kestra flow to compute candidates. |
| GET | `/v1/tenants/{tenant_id}/lookalike/audience/{audience_id}` | — | `{ "audience": {...}, "members": [...] }` | Includes similarity scores, statuses, metadata. |
| POST | `/v1/tenants/{tenant_id}/lookalike/audience/{audience_id}/export` | `{ "platform": "facebook", "credentials": {...} }` | `{ "export_job_id": "..." }` | Dispatches export workflow (queued / async). |
| GET | `/v1/tenants/{tenant_id}/lookalike/audience/{audience_id}/performance` | — | `{ "metrics": {...}, "by_similarity_bucket": [...] }` | Aggregates data from `lookalike_conversion`. |
| POST | `/v1/tenants/{tenant_id}/lookalike/audience/{audience_id}/feedback` | `{ "candidate_id": "...", "event_type": "deal_closed", "metadata": {...} }` | `{}` | Stores conversion event and updates candidate status. |

### Ad-Hoc Similarity Search
| Method | Path | Query | Response | Notes |
| --- | --- | --- | --- | --- |
| GET | `/v1/tenants/{tenant_id}/leads/{lead_id}/similar` | `?k=10&min_score=0.8` | `[ { "lead_id": 789, "similarity_score": 0.91 }, ... ]` | Requires vector stored on requester’s tenant; fallback to embedding generation if missing. |

**Auth:** JWT or API key with tenant scope. Guard: `tenant_id` path param must equal authenticated tenant context. Reject mismatches with 403.

---

## Kestra Orchestration Blueprints

### Audience Build Flow (`lookalike-audience-build`)
1. **Trigger:** HTTP POST from API after `POST /lookalike/audience`.  
2. **Tasks:**
   - `mark-seeds` (`sql.Execute`): update `leads.is_seed`.  
   - `ensure-embeddings` (`python.Python`): backfill missing embeddings per seed (call embedding model microservice).  
   - `similarity-search` (`python.Python`): run pgvector queries per seed, batch insert into `lookalike_candidate`.  
   - `apply-filters` (`python.Python`): apply business rules (geography, existing CRM memberships, suppression lists).  
   - `write-audience-membership` (`sql.Execute`): populate `lookalike_audience_member`.  
   - `estimate-size` (`sql.Fetch`): compute count; store on `lookalike_audience.size_estimate`.  
   - `set-status` (`sql.Execute`): mark audience `status = 'draft'` or `published` depending on automation flag.
3. **Outputs:** `audience_id`, candidate counts, similarity threshold summary.

### Feedback Ingest (`lookalike-feedback-ingest`)
- **Trigger:** Kafka / Pulsar topic `lookalike_feedback`.
- Inserts conversions into `lookalike_conversion` and updates `lookalike_candidate.status = 'converted'`.
- Optionally push metrics to Prometheus or event bus for dashboards.

### Retraining / Threshold Tuning (`lookalike-retrain-weekly`)
- **Trigger:** Scheduled (e.g., CRON nightly).  
- Steps:
  - Fetch conversion data last N days.
  - Recompute similarity threshold curves.
  - Optionally retrain ranking model (e.g., LightGBM) and update model artifact path referenced in API.
  - Notify via Slack / PagerDuty on degradation or improved lift.

---

## Operational Guidelines

- **Embedding Generation:**  
  - Use service wrapper around embedding provider (OpenAI, internal model).  
  - Ensure deterministic dimension `D`. Store version in `metadata` to manage migrations.  
  - Normalize vectors before storage when using cosine distance.
- **Filtering Strategy:**  
  - Apply deterministic dedupe (`WHERE l.id != seed_id`).  
  - Integrate suppression lists (do-not-contact, legal opt-outs).  
  - Enforce business rules (territory, property type) via `rules jsonb`.
- **Export Connectors:**  
  - Maintain per-tenant credentials via Secrets Manager.  
  - Log export jobs and external IDs for reconciliation.  
  - Provide retry and failure handling (e.g., backoff).
- **Monitoring:**  
  - Metrics: similarity distribution, candidate acceptance, conversion rate per decile, export success/failure, pipeline latency.  
  - Alerts on significant drops in conversion or embedding coverage.
- **Compliance & Privacy:**  
  - Respect tenant data boundaries, ensure RLS policies are unit-tested.  
  - No raw embeddings are exposed externally; API returns similarity scores only.  
  - Mask PII in logged metadata.

---

## Phased Rollout Strategy

| Phase | Description | Primary Deliverables |
| --- | --- | --- |
| A — Vector MVP | Seed selection + vector similarity + candidate list in UI | Schema migrations, embedding backfill, basic Kestra flow, API read endpoints |
| B — Filtering & Export | Business rule filters, export automation | Audience registry, export connectors, status tracking |
| C — Feedback Loop | Capture conversions and performance metrics | Feedback API, ingestion flow, dashboards |
| D — Learned Ranking | Train ML model for re-ranking & threshold tuning | Model pipeline, stored feature weights, decile analytics |
| E — Continuous Optimization | Auto-refresh audiences, experimentation | Scheduled retraining, A/B tests, automated threshold adjustments |

---

## References & Further Reading
- [pgvector docs](https://github.com/pgvector/pgvector) — distance operators, HNSW setup.
- [Supabase pgvector guide](https://supabase.com/docs/guides/database/extensions/pgvector) — best practices. 
- [Kestra use cases](https://kestra.io/docs/use-cases/data-pipelines) — orchestration patterns.
- Adobe Real-Time CDP lookalike architecture — audience reach vs. precision curves.
- DPG Media lookalike modeling — continuous retraining from click feedback.


