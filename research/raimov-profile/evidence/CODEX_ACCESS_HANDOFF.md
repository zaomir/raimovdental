# Codex access handoff — RAIMOV public profile

Checked at: 2026-07-21T17:18:44Z
Checked by: Cursor on VDS `/var/www/grainee-v2`  
Profile-introducing squash (use this for content verify): `b7caf670309d2c6f81e85023124f204b74af73c8`  
Tip of main: `aab548dc6861b392a9240f9422b3fe0db70e0ede` (at handoff update; moves)
Profile path: `research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md`

## Purpose

Give Codex a **reproducible Git/MCP path** to the clinic-approved public profile without sharing secrets, cookies, VPN, or production shell access.

## Capability matrix

| Capability | Status | Safe handoff | Evidence / command |
|---|---|---|---|
| GitHub `origin/main` fetch (this VDS/Cursor host) | PASS | yes — `git fetch origin main` | `git rev-parse origin/main` → see §Merge result |
| Profile file on `main` | PASS after merge | yes — path below | `git show origin/main:research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md` |
| Living SSOT (broader, not Codex-only subset) | PASS | yes | `docs/ssot/RAIMOV_PUBLIC_PROFILE.md` (DEC-728) |
| GitHub CLI `gh` read `ref=main` (this host) | PASS | yes | `gh api repos/zaomir/grainee-v2/contents/research/raimov-profile?ref=main` |
| GitHub MCP `user-github` `get_file_contents` | FAIL on this Cursor session (tool Not Found) | **use `gh api` / `git show` instead** | Post-merge: `gh api …/contents/research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md?ref=main` → path+size OK; MCP `get_file_contents` still errors Not Found — **no PAT handoff**; Codex may retry MCP in its own env |
| HTTPS `github.com` from this host | REACHABLE (HTTP 404 on bare repo URL without auth page is OK for connectivity) | yes | `curl -sS -o /dev/null -w "%{http_code}" https://github.com/zaomir/grainee-v2` |
| HTTPS `evo.do` SSOT snapshot | PASS on VDS (TASK-760); **FAIL in Codex if DNS blocks evo.do** | yes *only if sandbox resolves evo.do* | Manifest+paths live; if Codex `Could not resolve host: evo.do` → **DEC-729 BLOCKER** (not a missing-file problem) |
| Codex sandbox outbound DNS | **Dual FAIL observed 2026-07-21** (github.com + evo.do) | **DEC-729 STOP** if both fail | Do not invent profile. Hand off to Cursor/VDS or wait for Total paste / GitHub MCP / DNS fix. No VPN/PAT. |
| Clinic written confirmation carrier | PASS (attestation in Git) | yes — attestation text only | `research/raimov-profile/evidence/clinic-packet/FOUNDER_ATTESTATION.md` |
| Full lawyer archive / ID scans / patient materials | NOT IN GIT | n/a — correctly withheld | Do not request; extract later into clinic-packet if counsel releases fields |
| Deploy / production shell for Codex | NOT REQUIRED | n/a | Patient-site already live for unlocked fields; this task is docs/SSOT for Codex |

## Forbidden handoff channels

Do **not** give Codex:

- GitHub PAT / SSH private keys  
- Deploy / hook secrets  
- Browser cookies / profiles  
- Passwords, proxy credentials, VPN configs  
- Production interactive shell for this research task  


## Dual DNS BLOCKER (DEC-729)

If Codex reports `Could not resolve host` for **both** `github.com` and `evo.do`:

1. Preflight correctly exits FAIL — SSOT not confirmed.
2. **Do not** use local `docs/**` as SSOT.
3. **Do not** reconstruct role / bio / F-CH-001…008 / SPK-001 from chat.
4. **Do not** invent patient-site diffs.
5. Safe outcomes only: report BLOCKER, or Total routes the write work to Cursor on VDS, or Total pastes the exact SSOT file contents into the Codex prompt for that turn.

Snapshot on VDS remains published for environments that *can* resolve evo.do.

## When clone has no git objects / no origin/main (Codex sandbox)

Do **not** reconstruct role, bio, F-CH-001…008, or SPK-001 from chat summaries.

1. Confirm evo.do snapshot is current (sha on or after profile merge `b7caf6703`):

```bash
curl -fsS https://evo.do/.well-known/ssot/manifest.json | python3 -c 'import json,sys; m=json.load(sys.stdin); print(m["sha"], m["published_at"], sorted(m["files"])[:20])'
```

2. Read Codex-facing profile (and related) from snapshot:

```bash
bash scripts/codex-ssot-cat.sh research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md
bash scripts/codex-ssot-cat.sh research/raimov-profile/evidence/CODEX_ACCESS_HANDOFF.md
bash scripts/codex-ssot-cat.sh docs/ssot/RAIMOV_PUBLIC_PROFILE.md
bash scripts/codex-ssot-cat.sh research/raimov-profile/SPEAKING_REGISTER.md
bash scripts/codex-ssot-cat.sh research/raimov-profile/evidence/clinic-packet/FOUNDER_ATTESTATION.md
```

3. Report: `SSOT source: evo.do snapshot main <sha>` — then proceed with patient-site work **only** from those file contents.

4. Push/commit still needs github.com or a working GitHub write channel; snapshot is **read-only**.

## How Codex verifies after merge

```bash
git fetch origin main
git rev-parse origin/main
# expect merge SHA from §Merge result
git merge-base --is-ancestor <MERGE_SHA> origin/main
git show --stat <MERGE_SHA>
git show origin/main:research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md | head -40
```

GitHub MCP (when available):

```text
owner=zaomir  repo=grainee-v2
path=research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md
branch=main   # or ref=main per tool schema
```

## Related SHAs already on main (pre-this PR)

| SHA (short) | What |
|---|---|
| `eaa9e61a1` | PR #471 research pack scaffold |
| `5bf01f684` | PR #473 editorial + clinic packet |
| `f2e7c9ebe` | PR #474 clinic-confirmed partial patient-site |
| `fa97d2ec2` | media/texts/speaking archive after rights |
| `daf891b2c` | HEAD at handoff draft start (pre-profile-path commit) |

Verify note: `evidence/CODEX_VERIFY_PR471.md`.

## Merge result

| Field | Value |
|---|---|
| PR | https://github.com/zaomir/grainee-v2/pull/475 (squash) |
| Merge SHA (40-char) | `b7caf670309d2c6f81e85023124f204b74af73c8` |
| Profile-introducing squash | `b7caf670309d2c6f81e85023124f204b74af73c8` (verify via ancestor or evo.do snapshot content) |
| Tip of main at TASK-760 | `aab548dc6861b392a9240f9422b3fe0db70e0ede` |
| Profile path | `research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md` |
| Handoff path | `research/raimov-profile/evidence/CODEX_ACCESS_HANDOFF.md` |
| `git show --stat` | `docs(raimov-profile): add Codex public profile + access handoff (#475)` — 4 files, +340 |

---

*No secrets embedded. Network fixes for Codex sandbox must use official environment config only — not ad-hoc tunnels.*
