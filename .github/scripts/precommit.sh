#!/usr/bin/env bash
# Fast, toggleable pre-commit runner for DealScale
# - Skips heavy security tools (OWASP ZAP, Snyk, Trivy)
# - Lets contributors enable/disable checks via env vars, git config, or rc file
#
# Priority of config (highest first):
#  1) Environment variables
#  2) Git config (local/global): precommit.*
#  3) .precommitrc.json in repo root
#  4) Defaults (fast lint only)

set -euo pipefail

ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT_DIR"

# --- helpers ---
have() { command -v "$1" >/dev/null 2>&1; }

read_gitcfg() {
  git config --get "$1" 2>/dev/null || true
}

read_rc() {
  local key="$1"
  if [ -f .precommitrc.json ] && have node; then
    node -e "const c=require('./.precommitrc.json');console.log(c['$key'] ?? '')" 2>/dev/null || true
  fi
}

# --- config resolution ---
MODE=${PRECOMMIT_MODE:-$(read_gitcfg precommit.mode)}
[ -n "$MODE" ] || MODE=${PRECOMMIT_MODE:-$(read_rc mode)}
[ -n "$MODE" ] || MODE=fast

RUN_LINT=${PRECOMMIT_RUN_LINT:-$(read_gitcfg precommit.runLint)}
[ -n "$RUN_LINT" ] || RUN_LINT=${PRECOMMIT_RUN_LINT:-$(read_rc runLint)}
[ -n "$RUN_LINT" ] || RUN_LINT=true

RUN_TYPECHECK=${PRECOMMIT_RUN_TYPECHECK:-$(read_gitcfg precommit.runTypecheck)}
[ -n "$RUN_TYPECHECK" ] || RUN_TYPECHECK=${PRECOMMIT_RUN_TYPECHECK:-$(read_rc runTypecheck)}
[ -n "$RUN_TYPECHECK" ] || RUN_TYPECHECK=false

RUN_TESTS=${PRECOMMIT_RUN_TESTS:-$(read_gitcfg precommit.runTests)}
[ -n "$RUN_TESTS" ] || RUN_TESTS=${PRECOMMIT_RUN_TESTS:-$(read_rc runTests)}
[ -n "$RUN_TESTS" ] || RUN_TESTS=true

# Mode presets
if [ "$MODE" = "full" ]; then
  RUN_TYPECHECK=${RUN_TYPECHECK:-true}
  RUN_TESTS=${RUN_TESTS:-true}
fi

echo "[pre-commit] mode=$MODE lint=$RUN_LINT typecheck=$RUN_TYPECHECK tests=$RUN_TESTS"

# Collect staged files
STAGED=$(git diff --cached --name-only --diff-filter=ACMR | tr '\n' ' ')
if [ -z "$STAGED" ]; then
  echo "[pre-commit] No staged files; exiting"
  exit 0
fi

# Prefer pnpm via corepack, fallback to npx
if have corepack; then corepack enable >/dev/null 2>&1 || true; fi

# Lint staged JS/TS files
if [ "$RUN_LINT" = "true" ]; then
  FILES=$(echo "$STAGED" | tr ' ' '\n' | grep -E '\.(c|m)?(j|t)sx?$' || true)
  if [ -n "$FILES" ]; then
    echo "[pre-commit] Biome lint on staged files"
    if have pnpm; then
      pnpm dlx @biomejs/biome check $FILES || (echo "[pre-commit] Biome errors" && exit 1)
    else
      npx -y @biomejs/biome check $FILES || (echo "[pre-commit] Biome errors" && exit 1)
    fi
  fi
fi

# Typecheck (project-wide by default; skip on fast mode)
if [ "$RUN_TYPECHECK" = "true" ]; then
  if [ -f tsconfig.json ]; then
    echo "[pre-commit] TypeScript typecheck"
    if have pnpm; then
      pnpm dlx typescript tsc -p . --noEmit
    else
      npx -y typescript tsc -p . --noEmit
    fi
  fi
fi

"${CI:+true}" >/dev/null 2>&1 || true # silence shellcheck for unused CI var

# Unit tests: only run related tests to staged files if runner supports it
if [ "$RUN_TESTS" = "true" ]; then
  if [ -f package.json ]; then
    echo "[pre-commit] Running unit tests (related/staged)"
    # Prefer Jest findRelatedTests
    if jq -e '.devDependencies.jest // .dependencies.jest' package.json >/dev/null 2>&1; then
      npx -y jest --findRelatedTests $STAGED || (echo "[pre-commit] Tests failed" && exit 1)
    # Try Vitest related
    elif jq -e '.devDependencies.vitest // .dependencies.vitest' package.json >/dev/null 2>&1; then
      npx -y vitest related $STAGED || (echo "[pre-commit] Tests failed" && exit 1)
    # Custom staged test script
    elif jq -e '.scripts["test:staged"]' package.json >/dev/null 2>&1; then
      if have pnpm; then pnpm -s run test:staged; else npm run -s test:staged; fi
    else
      echo "[pre-commit] No related-test runner found; skipping tests to keep commits fast"
    fi
  fi
fi

echo "[pre-commit] Completed"
