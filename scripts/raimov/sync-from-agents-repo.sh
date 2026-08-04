#!/usr/bin/env bash
# One-way sync: zaomir/raimovdental (Agents) → grainee-v2 (prod SSOT)
# DEC-783 / TASK-777
set -euo pipefail

GRAINEE="${GRAINEE_ROOT:-/var/www/grainee-v2}"
CLINIC_URL="${RAIMOV_AGENTS_REPO_URL:-https://github.com/zaomir/raimovdental.git}"
CLINIC_DIR="${RAIMOV_AGENTS_DIR:-/var/www/raimovdental}"
APPLY=0
COMMIT=0
PUSH=0
DELETE=0

usage() {
  cat <<'U'
Usage: bash scripts/raimov/sync-from-agents-repo.sh [--apply] [--commit] [--push] [--delete]

  (default)   dry-run rsync -n
  --apply     copy Agents satellite trees into grainee-v2
  --commit    git add mapped paths + commit in grainee-v2
  --push      git push origin main (implies --commit)
  --delete   rsync --delete (remove target files missing in satellite)
U
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply) APPLY=1 ;;
    --commit) COMMIT=1 ;;
    --push) PUSH=1; COMMIT=1 ;;
    --delete) DELETE=1 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 2 ;;
  esac
  shift
done

cd "$GRAINEE"
git fetch origin main -q
git pull --ff-only origin main

if [[ ! -d "$CLINIC_DIR/.git" ]]; then
  git clone "$CLINIC_URL" "$CLINIC_DIR"
else
  git -C "$CLINIC_DIR" fetch origin -q
  git -C "$CLINIC_DIR" checkout main
  git -C "$CLINIC_DIR" pull --ff-only origin main
fi

SOURCE_SHA=$(git -C "$CLINIC_DIR" rev-parse HEAD)
SOURCE_SHORT=$(git -C "$CLINIC_DIR" rev-parse --short HEAD)

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

RSYNC_FLAGS=(-a)
[[ "$APPLY" -eq 0 ]] && RSYNC_FLAGS+=(-n -i)
[[ "$DELETE" -eq 1 ]] && RSYNC_FLAGS+=(--delete)

EXCLUDES=(
  --exclude node_modules
  --exclude dist
  --exclude .baseline
  --exclude '.env'
  --exclude '.env.*'
  --exclude .DS_Store
  --exclude .git
)

echo "== Agents → grainee sync =="
echo "source: $CLINIC_URL @ $SOURCE_SHORT"
echo "target: $GRAINEE"
echo "mode: $([[ $APPLY -eq 1 ]] && echo APPLY || echo DRY-RUN)"

for p in "${TREES[@]}"; do
  if [[ ! -d "$CLINIC_DIR/$p" ]]; then
    echo "skip missing source tree: $p"
    continue
  fi
  mkdir -p "$GRAINEE/$p"
  rsync "${RSYNC_FLAGS[@]}" "${EXCLUDES[@]}" "$CLINIC_DIR/$p/" "$GRAINEE/$p/"
done

# Whitelisted SSOT files
mkdir -p "$GRAINEE/docs/ssot"
shopt -s nullglob
for f in "$CLINIC_DIR"/docs/ssot/RAIMOV*.md \
         "$CLINIC_DIR"/docs/ssot/EXPERT_DENTAL*.md \
         "$CLINIC_DIR"/docs/ssot/ELITE_DENTAL*.md; do
  base=$(basename "$f")
  rsync "${RSYNC_FLAGS[@]}" "$f" "$GRAINEE/docs/ssot/$base"
done
shopt -u nullglob

for f in docs/expert-clinic-reference.md agents/manifests/raimovdental.yaml; do
  if [[ -f "$CLINIC_DIR/$f" ]]; then
    mkdir -p "$GRAINEE/$(dirname "$f")"
    rsync "${RSYNC_FLAGS[@]}" "$CLINIC_DIR/$f" "$GRAINEE/$f"
  fi
done

MARKER="$GRAINEE/docs/raimov/AGENTS_REPO_SYNC.md"
if [[ "$APPLY" -eq 1 ]]; then
  cat > "$MARKER" <<M
# Agents repo sync marker

- **Source:** \`zaomir/raimovdental\`
- **Source SHA:** \`$SOURCE_SHA\`
- **Synced at (UTC):** $(date -u +%Y-%m-%dT%H:%M:%SZ)
- **Direction:** agents → grainee-v2 (prod SSOT)
- **Script:** \`scripts/raimov/sync-from-agents-repo.sh\`

Do not deploy from the Agents satellite. Ship from grainee-v2 after sync.
M
  echo "Wrote $MARKER"
fi

if [[ "$COMMIT" -eq 1 ]]; then
  cd "$GRAINEE"
  git add \
    site-raimovdental \
    research/raimov-profile \
    docs/projects/raimovdental \
    docs/projects/healthcare-ecosystem \
    docs/raimov \
    docs/copy/raimov \
    docs/legal/raimov \
    docs/legal-templates/raimov \
    docs/audits/raimov \
    docs/research/raimov \
    scripts/raimov \
    tests/raimov \
    tests/raimovdental \
    docs/ssot/RAIMOV*.md \
    docs/ssot/EXPERT_DENTAL*.md \
    docs/ssot/ELITE_DENTAL*.md \
    docs/expert-clinic-reference.md \
    agents/manifests/raimovdental.yaml \
    2>/dev/null || true
  if git diff --cached --quiet; then
    echo "No staged changes to commit."
  else
    git commit -m "$(cat <<MSG
sync(raimov): import Agents satellite @ ${SOURCE_SHORT}

MSG
)"
  fi
fi

if [[ "$PUSH" -eq 1 ]]; then
  git -C "$GRAINEE" push origin main
fi

echo "DONE source_sha=$SOURCE_SHORT apply=$APPLY"
