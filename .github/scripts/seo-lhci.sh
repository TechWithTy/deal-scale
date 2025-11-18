#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
	echo "pnpm is required to run Lighthouse CI."
	exit 1
fi

pnpm exec lhci autorun --config=.github/lighthouse.config.js





