#!/usr/bin/env bash
set -euo pipefail

URL="${CONTACT_URL:-https://dealscale.io/api/contact}"

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL" -H "Content-Type: application/json" -d '{"email":"test@deal.com"}')

if [ "$CODE" -ne 200 ]; then
  echo "Contact endpoint failing (status: $CODE)"
  exit 1
fi

echo "Contact endpoint working (status: $CODE)"
