#!/usr/bin/env bash
# Compat wrapper → bidirectional sync (DEC-784).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
echo "note: seed-agents-repo.sh now runs bidirectional sync (DEC-784)" >&2
exec bash "$ROOT/scripts/raimov/sync-agents-bidirectional.sh" "$@"
