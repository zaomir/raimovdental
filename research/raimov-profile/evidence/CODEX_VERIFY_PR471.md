# Codex verify note — PR #471 SHAs (no GitHub required)

**Written:** 2026-07-21 by Cursor on VDS `/var/www/grainee-v2`  
**Purpose:** unblock Codex sandbox that cannot `git show 2b2b1f50c` / reach GitHub.

## Short answer

| What Codex tried | Result | Correct target |
|---|---|---|
| `git show 2b2b1f50c` | May be **missing** in a shallow/old clone; also **not an ancestor of `main`** after squash | Use merge commit on `main` |
| PR #471 tip / probe commit | Branch tip before squash | **`eaa9e61a1`** on `origin/main` |

**Canonical verification SHA for PR #471 content on `main`:**

```text
eaa9e61a1db97d500b5352e0782b9302f5d6f6cf
Subject: docs(research): RAIMOV external source pack for Codex (#471)
```

Later related SHAs (also on `main`):

| SHA (short) | What |
|---|---|
| `eaa9e61a1` | PR **#471** squash merge — research pack + DEC-727 scaffold |
| `5bf01f684` | PR **#473** — editorial classification + clinic packet |
| `f2e7c9ebe` | PR **#474** — clinic-confirmed partial patient-site publish |
| `bcac76fc5` | LAST_SYNC note after #474 deploy |

`HEAD` at write time of this note may move; always prefer `git rev-parse origin/main` or evo.do snapshot `sha`.

## Why `2b2b1f50c` is the wrong check

1. `2b2b1f50c` = intermediate commit on branch `research/raimov-external-sources-2026-07-21`  
   (`docs(research): complete RAIMOV HTTP probe evidence CSV`).
2. PR #471 was **squash-merged** → GitHub created **`eaa9e61a1`** on `main`.
3. Squash means branch tip commits (`5ffa49e53`, `2b2b1f50c`, `17c13ac37`) are **not** ancestors of `main` (`merge-base --is-ancestor … origin/main` → NO).
4. Codex without `git fetch` / GitHub network will not have dangling PR objects — that is expected, not a failure of the PR.

## How Codex should verify (ordered)

### A — If `git fetch origin main` works

```bash
git fetch origin main
git rev-parse origin/main
git merge-base --is-ancestor eaa9e61a1 origin/main   # expect exit 0
git show --stat --oneline --no-renames eaa9e61a1
git ls-tree -r --name-only origin/main research/raimov-profile/
```

### B — If GitHub DNS / CONNECT 403 (Codex sandbox)

Use evo.do SSOT snapshot (DEC-539):

```bash
curl -fsS https://evo.do/.well-known/ssot/manifest.json
# or: bash scripts/codex-ssot-cat.sh research/raimov-profile/README.md
```

Manifest field `sha` is the published main tip at snapshot time (may lag slightly behind GitHub).

### C — Offline files already in working tree after any successful sync

Minimum pack paths:

```text
research/raimov-profile/README.md
research/raimov-profile/EXTERNAL_ACCESS_REPORT.md
research/raimov-profile/evidence/http-probes.csv
research/raimov-profile/evidence/CODEX_VERIFY_PR471.md   # this file
docs/founder-notes/DEC-727_raimov-profile-research-evidence-gates.md
```

## Foreign dirty file

`cabinet-app/pnpm-lock.yaml` (or other unrelated dirt) — **do not touch, commit, or revert** as part of Raimov work. Leave it alone.

## Compliance

This note does not re-open medical publish gates. Patient-site publish status remains as of PR #474 / FOUNDER_ATTESTATION.
