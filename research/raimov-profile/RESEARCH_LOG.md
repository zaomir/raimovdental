# RESEARCH_LOG — RAIMOV profile (Commit 1)

## Meta

- Date (UTC): 2026-07-21
- Operator: Cursor (VDS `/var/www/grainee-v2`)
- Stage: **Commit 1 scaffold only**
- Goal: evidence structure + honest access report; **no** publishable medical biography
- Out of scope: filling `site-raimovdental/src/data/*.json`, claiming verified credentials, downloading media

## What was done

| Time (UTC) | Action | Result |
|---|---|---|
| earlier | Parallel external probes + HTML caches under `/tmp/raimov-research/` | Reachability evidence only |
| 13:16:48 | Re-probe matrix → `evidence/http-probes.csv` | HTTP codes logged; **not** elevated to official_source |
| 13:17+ | Rewrite pack per no-speculation verdict | Conservative registers only |

## Register tallies (Commit 1 — authoritative)

| Metric | Count |
|---|---:|
| SOURCE rows (`SRC-LOCAL-*`) | 6 |
| FACT rows | 8 (all `public_site_eligible=false`) |
| TEAM named roster members | **0** (`members: []`) |
| Media assets with rights cleared | **0** |
| Facts marked `official_source` / `clinic_confirmed` | **0** |

Any older draft claiming “18 facts” / “8 team persons” / “7 verified sources” is **superseded and invalid**.

## Explicit non-claims

- No ВНЧС / OrthoCommunity / Academy-program / protocol-authorship establishment
- No Expert Dental = RAIMOV DENTAL legal identity
- No photo publication rights
- HTTP 200 ≠ clinic confirmation

## Next

- **Commit 2:** optional careful external *observations* with excerpts (still non-publishable by default)
- **Commit 3:** only after written clinic packet + medical/rights gates (`pending-clinic-confirmation.md`)


## 2026-07-21 — Editorial classification (post PR #471)

- Review accepted Cursor/VDS research approach (`public_site_eligible: 0`, no media binaries).
- Merge confirmed: `eaa9e61a1` on `origin/main`; pack path `research/raimov-profile/`.
- Added `FACT_EDITORIAL_CLASSIFICATION.md` (A/B/C/D/E triage of 18 external + 8 local facts).
- Added `CLINIC_PENDING_PACKET.md` (C-01…C-27 for written clinic reply).
- **No** edits to `site-raimovdental/src/data/*`.


## 2026-07-21 — Commit-3 start (founder attestation)

- Canon: clinic confirmation accepted via founder chat text (lawyer archive holds full packet; not searched/ingested).
- Published: role, specializations, contacts, maps, related Expert Dental link, DemMed speaking, lead doctor role.
- Still pending extract: education rows, certificates, portrait/media, team members[], licenses.
- Evidence: `evidence/clinic-packet/FOUNDER_ATTESTATION.md`
