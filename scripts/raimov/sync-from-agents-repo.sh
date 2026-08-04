#!/usr/bin/env bash
# Compat wrapper → bidirectional sync (DEC-784).
# Historical name kept; direction is now both ways.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
echo "note: sync-from-agents-repo.sh now runs bidirectional sync (DEC-784)" >&2
exec bash "$ROOT/scripts/raimov/sync-agents-bidirectional.sh" "$@"
