#!/usr/bin/env bash
set -euo pipefail

# Scan a built image with Trivy using the official container.
# Usage: IMAGE=ghcr.io/owner/repo:sha .github/scripts/trivy-in-container.sh

IMAGE=${IMAGE:-}
if [ -z "$IMAGE" ]; then
  echo "Set IMAGE=registry/image:tag" >&2
  exit 1
fi

docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$HOME/.cache/trivy":/root/.cache/ \
  aquasec/trivy:0.67.2 image --ignore-unfixed --severity HIGH,CRITICAL "$IMAGE"

