#!/usr/bin/env bash
# Re-seed zaomir/raimovdental from grainee-v2 (monorepo → Agents satellite)
# Use when grainee is ahead and Agents repo should catch up.
# DEC-783 / TASK-777
set -euo pipefail

GRAINEE="${GRAINEE_ROOT:-/var/www/grainee-v2}"
CLINIC_URL="${RAIMOV_AGENTS_REPO_URL:-https://github.com/zaomir/raimovdental.git}"
CLINIC_DIR="${RAIMOV_AGENTS_DIR:-/var/www/raimovdental}"
APPLY=0
PUSH=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply) APPLY=1 ;;
    --push) PUSH=1; APPLY=1 ;;
    -h|--help)
      echo "Usage: bash scripts/raimov/seed-agents-repo.sh [--apply] [--push]"
      exit 0
      ;;
    *) echo "Unknown: $1" >&2; exit 2 ;;
  esac
  shift
done

cd "$GRAINEE"
git pull --ff-only origin main

if [[ ! -d "$CLINIC_DIR/.git" ]]; then
  git clone "$CLINIC_URL" "$CLINIC_DIR"
else
  git -C "$CLINIC_DIR" pull --ff-only origin main || true
fi

TREES=(
  site-raimovdental
  research/raimov-profile
  docs/projects/raimovdental
  docs/projects/healthcare-ecosystem
  docs/raimov
  docs/copy/raimov
  docs/legal/raimov
  docs/legal-templates/raimov
  docs/audits/raimov
  docs/research/raimov
  scripts/raimov
  tests/raimov
  tests/raimovdental
)

RSYNC_FLAGS=(-a --delete)
[[ "$APPLY" -eq 0 ]] && RSYNC_FLAGS+=(-n -i)
EXCLUDES=(
  --exclude node_modules
  --exclude dist
  --exclude .baseline
  --exclude '.env'
  --exclude '.env.*'
  --exclude .DS_Store
  --exclude .git
)

echo "== grainee → Agents seed =="
echo "mode: $([[ $APPLY -eq 1 ]] && echo APPLY || echo DRY-RUN)"

for p in "${TREES[@]}"; do
  [[ -d "$GRAINEE/$p" ]] || continue
  mkdir -p "$CLINIC_DIR/$p"
  rsync "${RSYNC_FLAGS[@]}" "${EXCLUDES[@]}" "$GRAINEE/$p/" "$CLINIC_DIR/$p/"
done

mkdir -p "$CLINIC_DIR/docs/ssot" "$CLINIC_DIR/agents/manifests"
shopt -s nullglob
for f in "$GRAINEE"/docs/ssot/RAIMOV*.md \
         "$GRAINEE"/docs/ssot/EXPERT_DENTAL*.md \
         "$GRAINEE"/docs/ssot/ELITE_DENTAL*.md; do
  rsync "${RSYNC_FLAGS[@]}" "$f" "$CLINIC_DIR/docs/ssot/$(basename "$f")"
done
shopt -u nullglob
[[ -f "$GRAINEE/docs/expert-clinic-reference.md" ]] && \
  rsync "${RSYNC_FLAGS[@]}" "$GRAINEE/docs/expert-clinic-reference.md" "$CLINIC_DIR/docs/expert-clinic-reference.md"
[[ -f "$GRAINEE/agents/manifests/raimovdental.yaml" ]] && \
  rsync "${RSYNC_FLAGS[@]}" "$GRAINEE/agents/manifests/raimovdental.yaml" "$CLINIC_DIR/agents/manifests/raimovdental.yaml"

# Keep satellite control files if present in clinic (don't wipe README/AGENTS/SYNC)
if [[ "$APPLY" -eq 1 ]]; then
  cd "$CLINIC_DIR"
  git add -A
  if git diff --cached --quiet; then
    echo "No changes in Agents repo."
  else
    SRC=$(git -C "$GRAINEE" rev-parse --short HEAD)
    git commit -m "seed: from grainee-v2 @ ${SRC}"
  fi
  if [[ "$PUSH" -eq 1 ]]; then
    git push -u origin main
  fi
fi

echo "DONE apply=$APPLY"
