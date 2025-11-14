#!/usr/bin/env bash
set -euo pipefail

npx lhci autorun \
  --config=./.github/lighthouse.config.js || exit 1

