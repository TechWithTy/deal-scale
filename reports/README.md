# Reporting Archive Overview

This repository stores recent tooling output inside `reports/`, and the Husky
pre-commit hook automatically snapshots the latest results for every commit.

## Lighthouse

- Latest files live in `reports/lighthouse/`.
- `pnpm run archive:reports` copies all files to
  `reports/history/<yyyy-mm-dd>/`, appending an ISO-like timestamp (for example:
  `prod.report-2025-11-14T03-42-11.html`).
- The pre-commit hook runs the archive script automatically and stages the
  copies.
- Manual usage: `pnpm run archive:reports`.

## Test Coverage

- Running `pnpm run test:coverage` (automatically executed on pre-commit)
  generates Vitest coverage in `coverage/`.
- `pnpm run archive:coverage` copies the entire coverage directory to
  `reports/tests/history/<yyyy-mm-dd>/coverage-<timestamp>/` and stages it.
- Details live in [`reports/tests/README.md`](./tests/README.md).

## Security Scans

- `pnpm run security:scan` executes the Snyk CLI (`security:snyk`) and an OWASP
  ZAP baseline scan (`security:owasp`). The Husky hook runs this command before
  archiving so reports are always fresh.
- Snyk output is written to `reports/security/snyk/latest-report.json` (raw
  JSON) and `latest-report.txt` (summary). The archive step copies these to
  `reports/security/history/<yyyy-mm-dd>/snyk-<timestamp>.{json,txt}`.
- OWASP ZAP output is written to `reports/security/owasp/latest-report.html`
  (HTML baseline report) and `latest-report.log` (console log when available).
  Archived copies live under `reports/security/history/<yyyy-mm-dd>/`.
- Use environment variables to customise the scans:
  - `SNYK_TOKEN` (required) and `SNYK_CMD`/`SNYK_PROJECT`
  - `OWASP_BASELINE_CMD`, `OWASP_TARGET`, and `OWASP_BASELINE_ARGS`

Both archive scripts exit gracefully when there is nothing to copy, so they do
not block commits when reports are absent.


