# Commit Workflow Helpers

This project includes scripts and hook tweaks that keep commits fast while still
running the important checks.

## Stage & Lint Shortcut

- Run `pnpm commit:stage` to stage changes (excluding `coverage/` and `reports/`)
  and execute `lint-staged`.
- If you need to stage coverage or report artifacts manually, add them after
  running the shortcut.

## Pre-Commit Hook Behavior

- Coverage tests (`pnpm run test:coverage`) execute on every commit, but failures
  only emit a warning so you can keep moving when the suite is flaky.
- Security scans (`pnpm run security:scan`) behave the same way—warnings, no
  commit block. The scan currently runs Trivy, Opengrep, and OWASP baseline.
- Coverage and security results are archived automatically; the directories are
  ignored via `.gitignore` so historical reports stay out of the repo.

## Lint-Staged & Husky Notes

- `lint-staged` runs after the archive steps. It now invokes
  `pnpm exec biome format --write` on staged files; keep Biome installed
  (`@biomejs/biome` as a dev dependency) so the command resolves.
- The `.husky/pre-commit` hook must NOT include the legacy shebang and
  `husky.sh`; removing them prevents Husky v10 from overwriting the custom
  script logic.
- The `.husky/commit-msg` hook runs `commitlint` using the conventional config
  (`commitlint.config.cjs`). Follow `<type>(<scope>): <subject>` using the
  provided FE-oriented type/scope lists.


