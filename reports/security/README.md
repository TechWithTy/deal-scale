## Security Report Workflow

The pre-commit hook orchestrates Snyk and OWASP ZAP baseline scans to keep a
history of security output alongside other quality gates.

- `pnpm run security:snyk` runs the Snyk CLI and writes results to
  `reports/security/snyk/latest-report.json` and `latest-report.txt`.
  - Configure the CLI via `SNYK_TOKEN`. Optional overrides:
    - `SNYK_CMD` – custom Snyk binary path.
    - `SNYK_PROJECT` – working directory to pass to the CLI.
  - The command exits gracefully (without blocking commits) if the CLI is not
    installed or a token is missing.
- `pnpm run security:owasp` runs `zap-baseline.py` (OWASP ZAP) and writes the HTML
  report and scan log to `reports/security/owasp/latest-report.html` and
  `latest-report.log`.
  - Customise via:
    - `OWASP_BASELINE_CMD` – alternative executable (for Docker or wrapper scripts).
    - `OWASP_TARGET` – target URL (defaults to `http://localhost:3000`).
    - `OWASP_BASELINE_ARGS` – additional CLI args (space delimited).

After each scan the pre-commit hook executes `pnpm run archive:security`, which
copies the latest artefacts into dated folders under
`reports/security/history/<yyyy-mm-dd>/` with timestamped file names, then stages
the copies for commit.

