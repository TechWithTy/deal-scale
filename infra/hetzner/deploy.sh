#!/usr/bin/env bash
set -euo pipefail

# Usage: IMAGE=registry/owner/name:tag bash deploy.sh
# Or: bash deploy.sh registry/owner/name:tag

if [[ -n "${1-}" ]]; then
  IMAGE="$1"
fi

if [[ -z "${IMAGE-}" ]]; then
  echo "ERROR: IMAGE env var or first argument must be provided" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

echo "Deploying image: $IMAGE"
export IMAGE

docker compose -f "$COMPOSE_FILE" pull || true
docker compose -f "$COMPOSE_FILE" up -d

echo "Deployment completed"

