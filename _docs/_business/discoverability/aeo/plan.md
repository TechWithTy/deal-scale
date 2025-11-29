# DealScale AEO Execution Plan

## Strategic Goals
1. Deliver authoritative, structured responses that AI agents can trust and cite.
2. Bridge public marketing content with private product context without exposing sensitive data.
3. Establish measurable feedback loops to iterate on conversational performance.

## Milestone Timeline

### Milestone 1 – Foundation & Governance (Weeks 1-2)
- Document AEO objectives, personas, and priority intents in `_docs/_business/aeo/brief.md` (to be authored after stakeholder review).
- Align with SEO infrastructure updates to reuse schema builders and analytics instrumentation.
- Define taxonomy for intents, response tones, and canonical CTAs.

### Milestone 2 – Schema & Content Enablement (Weeks 2-4)
- Extend schema utilities with FAQPage, HowTo, SoftwareApplication, and Person/Audience builders.
- Create reusable content snippets (short, medium, long summaries) for features, events, partners, and jobs.
- Map Zoho Recruit job fields to conversational answers (benefits, application process, hiring timeline).

### Milestone 3 – Conversational Surface Development (Weeks 4-6)
- Launch FAQ components on `/features` and `/pricing`, exposing structured Q&A data for assistants.
- Introduce a conversational landing section (accordion or chat-style) on `/events` with curated prompts.
- Prepare scripts and schema for Beehiiv blog posts to surface summary answers via `isPartOf` organization linkage.

### Milestone 4 – Private App Context Strategy (Weeks 6-7)
- Publish SoftwareApplication schema referencing app.dealscale.io with anonymized feature descriptions.
- Produce marketing collateral summarizing onboarding flows, safeguarding proprietary steps.
- Collaborate with product to define which in-app screenshots or diagrams can be publicly indexed.

### Milestone 5 – Validation & Monitoring (Weeks 7-8)
- Establish a recurring audit process capturing outputs from Google SGE, Bing Copilot, ChatGPT Browse, and Perplexity.
- Integrate PostHog events for `aeo_answer_served`, `intent_category`, and `assistant_source`.
- Log audit outcomes and remediation tasks in `_docs/_business/aeo/audit-log.md`.

### Milestone 6 – Continuous Improvement (Ongoing)
- Prioritize backlog experiments (voice skill prototype, conversational landing page) based on audit findings.
- Feed customer support insights into the Q&A content backlog monthly.
- Conduct quarterly cross-functional reviews to re-rank intents and update schema coverage.

## Dependencies
- Shared schema utility work tracked in SEO plan.
- Access to analytics platforms (PostHog, Plausible) with AEO-specific dashboards.
- Collaboration with content marketing, product, and customer success for Q&A sourcing.

## KPIs & Success Criteria
- Inclusion in top 3 responses for target queries across at least two AI assistant platforms.
- 100% coverage of priority intents with validated FAQ or HowTo schema.
- Demonstrated uplift in qualified pipeline influenced by assistant-driven touchpoints.
