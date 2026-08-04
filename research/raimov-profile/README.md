# RAIMOV profile research — evidence pack

**Status:** Commit-1 scaffold + **media/text archive after rights (2026-07-21)**.  
**Not:** automatic patient-site publish (medical/copy gates remain).  
**Brand lock (config):** RAIMOV DENTAL · Raimov System · Raimov Academy · Atabek Raimov · Раимов Атабек Саидович.  
**Forbidden public brands:** Saidov Dental · Saidov System · Saidov Academy · Atabek Saidov.  
**Rights:** `RIGHTS_GRANT.md` · media in `media/` · texts in `TEXTS_REGISTER.md` / `evidence/excerpts/` · speaking in `SPEAKING_REGISTER.md` · mentions in `MENTIONS_REGISTER.md`.

## Principles (no speculation)

1. Record **observations + sources**, never invented medical/professional facts.
2. A URL found in Git is **not** an `official_source`.
3. HTTP 200 is **reachability only** — not clinic confirmation, not rights clearance, not medical review.
4. Expert Dental Studio and RAIMOV DENTAL are **separate brand labels** until clinic confirms any legal/brand transition.
5. Empty team arrays, null titles, and `pending_clinic_confirmation` fields mean **unknown** — do not invent roster cards.
6. No automatic publication to `site-raimovdental/` from this pack.
7. Do not claim “N verified sources” or “N established facts” unless each row has independent evidence and an explicit publish gate.

## Allowed verification statuses

| Status | Meaning |
|---|---|
| `repo_reference_only` | Seen only in this repository / local draft |
| `discovered` | URL or string observed; not validated as authoritative |
| `needs_manual_validation` | Requires human check of the live card/page |
| `clinic_confirmation_required` | Needs written clinic confirmation |
| `third_party_unverified` | Aggregator / directory / news mirror |
| `unverified` | Claim exists somewhere; no primary source yet |
| `not independently checked` | Not opened/verified in this environment |
| `rights_pending` | Media/copyright/model-release not cleared |

**Forbidden in this pack until proven:** `official_source`, `clinic_confirmed`, `source_checked` (when URL was not opened), “подтверждается клиникой”, fabricated publication dates.

## Commit plan

| Commit | Contents |
|---|---|
| **1 (this)** | Structure, rules, templates, local `repo_reference_only` registers, honest `EXTERNAL_ACCESS_REPORT.md` |
| **2** | External observations only after live access + excerpts/artifacts; still non-publishable by default |
| **3** | Clinic-confirmed rights, team, medical facts, cases — only after written clinic reply + medical review |

## Layout

```text
research/raimov-profile/
  RAIMOV_PUBLIC_PROFILE.md  # Codex public-ready facts
  README.md
  EXTERNAL_ACCESS_REPORT.md
  RESEARCH_LOG.md
  PUBLIC_CHANNELS.md      # discovery list only — not verified official sources
  SOURCE_REGISTER.md
  FACT_REGISTER.csv
  FACT_EDITORIAL_CLASSIFICATION.md  # A/B/C/D/E triage after PR #471
  CLINIC_PENDING_PACKET.md          # compact written checklist for clinic
  TEAM_REGISTER.md
  MEDIA_MANIFEST.json
  pending-clinic-confirmation.md
  rights-and-consent.md
  queries/SEARCH_QUERIES.md
  templates/
  evidence/          # probe metadata; raw HTML only if explicitly added later
  media/             # no binary assets committed without rights
```

## Post-merge status (PR #471)

- Merged to `main`: `eaa9e61a1` (`docs(research): RAIMOV external source pack for Codex (#471)`).
- Editorial triage: `FACT_EDITORIAL_CLASSIFICATION.md`.
- Clinic ask list: `CLINIC_PENDING_PACKET.md`.
- Still **no** automatic publish into `site-raimovdental/src/data/*`.

## Living SSOT + Codex public profile

| Path | Role |
|---|---|
| **`research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md`** | **Codex canonical** — clinic-approved public wording only (evidence + gate per fact) |
| **`docs/ssot/RAIMOV_PUBLIC_PROFILE.md`** | Living accumulation SSOT (DEC-728) — broader discovery + statuses |
| **`evidence/CODEX_ACCESS_HANDOFF.md`** | How Codex reaches `main` without secrets |

Этот pack — evidence detail; не автопубликация в `site-raimovdental/`.

