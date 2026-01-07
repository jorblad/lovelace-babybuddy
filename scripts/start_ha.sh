#!/usr/bin/env bash
set -euo pipefail

# Start Home Assistant with docker-compose (or docker fallback)
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if command -v docker-compose >/dev/null 2>&1; then
  docker-compose up -d
elif command -v docker >/dev/null 2>&1 && command -v docker compose >/dev/null 2>&1; then
  docker compose up -d
else
  echo "Neither docker-compose nor 'docker compose' available. Install Docker Desktop or docker-compose." >&2
  exit 1
fi

echo "Home Assistant started (or already running). Visit http://localhost:8123 after the server finishes setup." 
