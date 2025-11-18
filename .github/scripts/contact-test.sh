#!/usr/bin/env bash
set -euo pipefail

CONTACT_URL="${CONTACT_TEST_URL:-https://dealscale.io/api/contact}"
PAYLOAD='{"email":"ci-bot@dealscale.io","message":"CI smoke test"}'

echo "Pinging contact endpoint at ${CONTACT_URL}..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${CONTACT_URL}" \
	-H "Content-Type: application/json" \
	-d "${PAYLOAD}")

if [[ "${STATUS}" -ge 200 && "${STATUS}" -lt 400 ]]; then
	echo "✅ Contact endpoint responded with status ${STATUS}"
else
	echo "❌ Contact endpoint responded with status ${STATUS}"
	exit 1
fi





