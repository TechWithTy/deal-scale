# Deal Scale CI/CD Setup Guide

This guide explains how to configure, run, and extend the Hetzner-based CI/CD pipeline that powers the Deal Scale main appand how to integrate additional services such as the Landi Gape backend, Slack incident routing, PagerDuty escalation, and Twilio/VAPI notifications.

---

## 1. Repository Structure Overview

```
.github/
  actions/
    notify-slack/
    pager-alert/
    twilio-vapi/
  workflows/
    deploy-main-app.yml
    subworkflows/
      code-quality.yml
      security.yml
      deploy.yml
docs/
  CI-CD_SETUP.md   # (this file)
```

- **Composite actions** under `.github/actions/` encapsulate Slack, PagerDuty, and Twilio/VAPI notifications.
- **Subworkflows** under `.github/workflows/subworkflows/` break the pipeline into reusable stages:
  - `code-quality.yml`: lint, type-check, unit tests.
  - `security.yml`: Trivy scans + artifact upload.
  - `deploy.yml`: build + push, OWASP ZAP DAST, Hetzner deploy, smoke/perf checks, Slack notification.
- **Main workflow** (`deploy-main-app.yml`) orchestrates the stages and serves as the entry point for `push` and `workflow_dispatch`.

---

## 2. Prerequisites

| Component | Requirement |
| --- | --- |
| Package manager | pnpm 9+ |
| Node.js | v20 |
| Docker | Buildx enabled; access to GHCR |
| Trivy | Available in CI runners (installed via `aquasecurity/trivy-action`) |
| OWASP ZAP | Pulled as Docker image (`ghcr.io/zaproxy/zaproxy:stable`) |
| Hetzner | SSH user with access to `/srv/dealscale` |
| Secrets | Listed below |

### Required GitHub Secrets

| Secret | Purpose |
| --- | --- |
| `HETZNER_HOST`, `HETZNER_USER`, `HETZNER_SSH_KEY` | SSH deployment to Hetzner |
| `OWASP_TARGET_URL` | Authenticated URL for ZAP baseline scan |
| `SLACK_WEBHOOK` (optional) | Slack notifications via `notify-slack` |
| `PAGER_ROUTING_KEY` (optional) | PagerDuty incidents via `pager-alert` |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`, `TWILIO_TO` (optional) | SMS/call alerts via `twilio-vapi` |

### Repository Variables

| Variable | Description |
| --- | --- |
| `CI_CD_ENABLED` | Legacy main toggle. Prefer `MAIN_CI_ENABLED`. |
| `MAIN_CI_ENABLED` | Set to `true` to allow the main (Hetzner) pipeline to run on pushes. Manual `workflow_dispatch` bypasses the toggle. |
| `MAIN_DEPLOY_ENABLED` | `true` to build/push image and deploy to Hetzner in the deploy job. |
| `MAIN_NOTIFY_ENABLED` | `true` to send Slack notifications from the deploy job. |
| `MAIN_LHCI_ENABLED` | `true` to run Lighthouse E2E SEO/Perf against a live URL. |
| `MAIN_LHCI_URL` | The public URL to test with Lighthouse (e.g., `https://app.leadorchestra.com`). |

Set variables under **Settings  Secrets and variables  Actions  Variables**.

---

## 3. Main Workflow (`deploy-main-app.yml`)

```yaml
name: Deal Scale Hetzner CI/CD

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  quality:
    if: ${{ github.event_name == 'workflow_dispatch' || vars.CI_CD_ENABLED == 'true' }}
    uses: ./.github/workflows/subworkflows/code-quality.yml

  security:
    needs: quality
    if: ${{ needs.quality.result == 'success' }}
    uses: ./.github/workflows/subworkflows/security.yml
    with:
      registry: ghcr.io
      image_name: dealscale/main-app
    secrets: inherit

  deploy:
    needs: security
    if: ${{ needs.security.result == 'success' }}
    uses: ./.github/workflows/subworkflows/deploy.yml
    with:
      registry: ghcr.io
      image_name: dealscale/main-app
      deploy_path: /srv/dealscale
      compose_file: infra/hetzner/docker-compose.yml
      deploy_enabled: ${{ vars.MAIN_DEPLOY_ENABLED }}
      notify_enabled: ${{ vars.MAIN_NOTIFY_ENABLED }}
      lhci_enabled: ${{ vars.MAIN_LHCI_ENABLED }}
      lhci_url: ${{ vars.MAIN_LHCI_URL }}
    secrets: inherit
```

- The **CI kill switch** is implemented via the `CI_CD_ENABLED` variable.
- Each job delegates to a subworkflow, keeping the main file declarative and modular.

---

## 4. Subworkflow Breakdown

### 4.1 Code Quality (`subworkflows/code-quality.yml`)
- Checks out the repo, installs dependencies, runs Biome lint and TypeScript checks, then unit tests (if present).

### 4.2 Security (`subworkflows/security.yml`)
- Runs filesystem Trivy scan (`pnpm run security:trivy`).
- Executes IaC scan via `aquasecurity/trivy-action`.
- Builds the project to stage a Docker image, then runs Trivy image scanning.
- Uploads `trivy-report.json` and `.sarif` artifacts for later review.

Optional: Embed Trivy in your Docker image
- See `Dockerfile.with-trivy` for a reference on installing Trivy inside a Debian/Ubuntu-based image using the official install script.
- You generally don’t need Trivy in the runtime image; prefer running scans in CI. Use embedded Trivy only for self-diagnostics in ephemeral environments.
- You can also scan a built image locally with `.github/scripts/trivy-in-container.sh`:
  - `IMAGE=ghcr.io/<owner>/<image>:<tag> bash .github/scripts/trivy-in-container.sh`

### 4.3 Deploy & Validation (`subworkflows/deploy.yml`)
- Builds and pushes the production image to GHCR.
- Runs OWASP ZAP baseline scan (Docker fallback).
- SSH deploy to Hetzner using `infra/hetzner/deploy.sh`, followed by smoke tests (`tsx` or `curl`) and Lighthouse performance checks.
- Triggers Slack notifications (and can be expanded to call PagerDuty/Twilio actions).

Toggles (via `deploy-main-app.yml` inputs and repo variables):
- `deploy_enabled`: gates image build/push and Hetzner SSH deploy.
- `notify_enabled`: gates Slack success/failure notifications.
- `lhci_enabled` + `lhci_url`: runs Lighthouse CI against `lhci_url` with default thresholds (SEO ≥0.90 error, Performance ≥0.70 warn).

---

## 5. Integrating Landi Gape Backend & Other Apps

1. **Add another subworkflow** (e.g., `subworkflows/backend.yml`) that handles Landi Gape deploy logic.
2. Update `deploy-main-app.yml` to insert a `backend` job:
   ```yaml
   backend:
     needs: security
     uses: ./.github/workflows/subworkflows/backend.yml
     with:
       registry: ghcr.io
       image_name: dealscale/backend
       deploy_path: /srv/dealscale-backend
       compose_file: infra/backend/docker-compose.yml
     secrets: inherit
   ```
3. Adjust `deploy` job dependencies (`needs: [security, backend]`) if the frontend should only deploy after the backend.
4. To integrate multiple apps (e.g., analytics worker, marketing site), create additional subworkflows or extend `deploy.yml` with conditional inputs that select which service to target.

---

## 6. Using Custom Actions

### Slack Alerts (`notify-slack`)
```yaml
- name: Slack notification
  uses: ./.github/actions/notify-slack
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK }}
    status: failure
    title: "Deploy failed"
    message: |
      Commit: ${{ github.sha }}
      Logs: ${{ github.run_url }}
```

### PagerDuty Incidents (`pager-alert`)
```yaml
- name: PagerDuty alert
  uses: ./.github/actions/pager-alert
  with:
    routing_key: ${{ secrets.PAGER_ROUTING_KEY }}
    summary: "Production deploy failure"
    source: "deal-scale-ci"
    severity: "error"
    custom_details: '{"workflow":"deploy-main-app","runId":"${{ github.run_id }}"}'
```

### Twilio SMS / VAPI Calls (`twilio-vapi`)
```yaml
- name: Twilio emergency call
  uses: ./.github/actions/twilio-vapi
  with:
    account_sid: ${{ secrets.TWILIO_ACCOUNT_SID }}
    auth_token: ${{ secrets.TWILIO_AUTH_TOKEN }}
    from_number: ${{ secrets.TWILIO_FROM }}
    to_number: ${{ secrets.TWILIO_TO }}
    mode: call
    vapi_url: "https://vapi.dealscale.ai/callflows/pager"
```

These can be inserted into any workflow or subworkflow as needed to notify SREs or on-call engineers.

---

## 7. Local Testing & Dry Runs

- **Code Quality:** `pnpm exec biome check . && pnpm run typecheck && pnpm run test`
- **Security:** `pnpm run security:trivy`, `trivy config .`, build a local Docker image and run `trivy image`.
- **Deploy script:** from Hetzner host, run `bash infra/hetzner/deploy.sh` with exported env vars (or test via [`act`](https://github.com/nektos/act)).
- **OWASP:** ensure the app is running (`pnpm dev` or `pnpm start`) before running `pnpm run security:owasp`.

---

## 8. Extending the Pipeline

- Add new subworkflows for other environments (staging, preview).
- Introduce matrix builds by expanding `deploy-main-app.yml` with additional jobs keyed by environment.
- Use composite actions to wrap repeated logic (e.g., reusable smoke tests or database migrations).
- Tie into other monitoring systems by adding steps in `deploy.yml` for Grafana/Loki, or using additional secrets for Landi Gape-specific APIs.

---

## 9. Troubleshooting Checklist

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| Workflow not running on push | `CI_CD_ENABLED` not set to `'true'` | Set repo variable or trigger manually |
| Unrecognized named-value errors | Using `env`/`vars` in unsupported contexts | Use literals or pass values via `with` |
| ZAP cannot reach target | App not running / no host mapping | Start server, ensure `extra_hosts` + correct target URL |
| Trivy missing | Runner lacks Trivy | Ensure action installs or preinstall |
| SSH deploy fails | Secrets missing / wrong perm | Verify `HETZNER_*` secrets and key permissions |

---

## 10. Next Steps

- Add subworkflows for Landi Gape backend, analytics workers, and marketing site.
- Introduce PagerDuty + Twilio steps in `deploy.yml` for critical failures.
- Document environment-specific overrides (`CI_CD_ENABLED_STAGING`, etc.) if multiple pipelines are needed.

With this modular structure, the CI/CD system remains easy to extend while keeping each workflow concise and reusable. Update this guide whenever new subworkflows, services, or notification channels are introduced.

---

## Appendix: Optional Snyk Integration

- Enable Snyk by setting repo variable `SNYK_ENABLED` = `true` and adding secret `SNYK_TOKEN`.
- Security job options (variables):
  - `SNYK_SEVERITY` — `low|medium|high|critical` (defaults to `high`).
- What runs when enabled:
  - Open Source dependency scan across all projects via Dockerized CLI: `snyk/snyk:docker snyk test --all-projects` (outputs `snyk-os.sarif`).
  - Container scan for the built image: `snyk container test <image>` (outputs `snyk-container.json`).
  - Artifacts are uploaded for review; code-scanning upload can be added if desired.

---

## Appendix: Pre-commit Policy (Fast by default)

- Script: `.github/scripts/precommit.sh`
- Default behavior:
  - Runs Biome lint on staged JS/TS files.
  - Runs unit tests only if a related-test runner is available (Jest `--findRelatedTests`, Vitest `related`, or a `test:staged` script). Otherwise skips tests to keep commits fast.
  - Skips heavy tools in pre-commit (OWASP ZAP, Snyk, Trivy, Lighthouse E2E).
- Toggle controls:
  - Environment variables (highest priority): `PRECOMMIT_MODE`, `PRECOMMIT_RUN_LINT`, `PRECOMMIT_RUN_TYPECHECK`, `PRECOMMIT_RUN_TESTS`.
  - Git config: `precommit.mode`, `precommit.runLint`, `precommit.runTypecheck`, `precommit.runTests`.
  - `.precommitrc.json` at repo root provides defaults.
- Modes:
  - `MODE=fast` (default): lint + related tests (if supported); no typecheck.
  - `MODE=full`: enables typecheck and tests.
