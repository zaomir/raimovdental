#!/usr/bin/env bash
# Bidirectional sync: zaomir/raimovdental ↔ grainee-v2 (DEC-784)
# Prefer this over one-way scripts for day-to-day use.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
exec python3 "$ROOT/scripts/raimov/sync_agents_bidirectional.py" "$@"
