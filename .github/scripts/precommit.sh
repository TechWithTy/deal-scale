#!/usr/bin/env bash
# Fast, toggleable pre-commit runner for DealScale
# - Skips heavy security tools (OWASP ZAP, Snyk, Trivy, Lighthouse)
# - Keeps commits fast; avoids Windows "command line too long" errors via chunking

set -euo pipefail

ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT_DIR"

# --- helpers ---
have() { command -v "$1" >/dev/null 2>&1; }

read_gitcfg() { git config --get "$1" 2>/dev/null || true; }

read_rc() {
  local key="$1"
  if [ -f .precommitrc.json ] && have node; then
    node -e "const c=require('./.precommitrc.json');console.log(c['$key'] ?? '')" 2>/dev/null || true
  fi
}

chunk_run() {
  local tool="$1"; shift
  local -a files=("$@")
  local chunk_size=40
  local i=0
  while [ $i -lt ${#files[@]} ]; do
    local chunk=("${files[@]:i:chunk_size}")
    if [ "$tool" = "biome" ]; then
      if have pnpm; then pnpm dlx @biomejs/biome check "${chunk[@]}"; else npx -y @biomejs/biome check "${chunk[@]}"; fi
    fi
    i=$((i + chunk_size))
  done
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
[ -n "$RUN_TESTS" ] || RUN_TESTS=false

if [ "$MODE" = "full" ]; then
  RUN_TYPECHECK=${RUN_TYPECHECK:-true}
  RUN_TESTS=${RUN_TESTS:-true}
fi

echo "[pre-commit] mode=$MODE lint=$RUN_LINT typecheck=$RUN_TYPECHECK tests=$RUN_TESTS"

# Keep commit scopes in sync with repo structure (best-effort)
if have pnpm && [ -f "tools/commitlint/sync-scopes.ts" ]; then
  echo "[pre-commit] Syncing commit scopes"
  pnpm -s exec tsx tools/commitlint/sync-scopes.ts || true
fi

# Collect staged files (null-separated to handle spaces)
mapfile -d '' -t STAGED_ARR < <(git diff --cached --name-only -z --diff-filter=ACMR)
if [ ${#STAGED_ARR[@]} -eq 0 ]; then
  echo "[pre-commit] No staged files; exiting"
  exit 0
fi

# Prefer pnpm via corepack, fallback to npx
if have corepack; then corepack enable >/dev/null 2>&1 || true; fi

# 1) Biome lint (staged JS/TS only, chunked)
if [ "$RUN_LINT" = "true" ]; then
  FILES=()
  for f in "${STAGED_ARR[@]}"; do
    case "$f" in
      *.js|*.cjs|*.mjs|*.ts|*.cts|*.mts|*.jsx|*.tsx) FILES+=("$f") ;;
    esac
  done
  if [ ${#FILES[@]} -gt 0 ]; then
    echo "[pre-commit] Biome lint on staged files (${#FILES[@]})"
    chunk_run biome "${FILES[@]}" || (echo "[pre-commit] Biome errors" && exit 1)
  fi
fi

"${CI:+true}" >/dev/null 2>&1 || true

# 2) Optional typecheck (project-wide)
if [ "$RUN_TYPECHECK" = "true" ] && [ -f tsconfig.json ]; then
  echo "[pre-commit] TypeScript typecheck"
  if have pnpm; then pnpm dlx typescript tsc -p . --noEmit; else npx -y typescript tsc -p . --noEmit; fi
fi

# 3) Optional related tests (Jest/Vitest) only
if [ "$RUN_TESTS" = "true" ] && [ -f package.json ]; then
  echo "[pre-commit] Running unit tests (related/staged)"
  if jq -e '.devDependencies.jest // .dependencies.jest' package.json >/dev/null 2>&1; then
    npx -y jest --findRelatedTests "${STAGED_ARR[@]}" || (echo "[pre-commit] Tests failed" && exit 1)
  elif jq -e '.devDependencies.vitest // .dependencies.vitest' package.json >/dev/null 2>&1; then
    npx -y vitest related "${STAGED_ARR[@]}" || (echo "[pre-commit] Tests failed" && exit 1)
  elif jq -e '.scripts["test:staged"]' package.json >/dev/null 2>&1; then
    if have pnpm; then pnpm -s run test:staged; else npm run -s test:staged; fi
  else
    echo "[pre-commit] No related-test runner found; skipping tests to keep commits fast"
  fi
fi

echo "[pre-commit] Completed"
