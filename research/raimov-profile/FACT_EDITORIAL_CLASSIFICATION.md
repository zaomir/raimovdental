# FACT_EDITORIAL_CLASSIFICATION — RAIMOV profile

**Date:** 2026-07-21  
**Basis:** Cursor/VDS research accepted in review of PR #471 + DEC-727 evidence gates  
**Merge SHA (PR #471):** `eaa9e61a1` · pack on `origin/main` under `research/raimov-profile/`  
**Rule:** editorial labels only — **no** transfer into `site-raimovdental/src/data/*` in this step.

## Legend

| Label | Meaning |
|---|---|
| `A` | Допустимо использовать **после письменного подтверждения клиники** (и SSOT update) |
| `B` | Нужен **первоисточник** (программа, лицензия, GBP Place ID, PDF сертификата и т.п.) |
| `C` | **Нельзя** использовать публично (PII, third-party bio, patient reviews, speculative brand merge) |
| `D` | Нужен **медицинский ревью** формулировки |
| `E` | Нужен **consent / usage-rights** (фото, кейсы, отзывы) |
| `reachability` | URL открывался (HTTP); не статус публикации |

Statuses below use **DEC-727 vocabulary** (`discovered`, `needs_manual_validation`, `clinic_confirmation_required`, `third_party_unverified`, `rights_pending`, `repo_reference_only`).  
Do **not** treat Cursor-era `official_source` / `source_checked` labels as publish gates.

---

## Batch 1 — External Cursor observations (18)

Recovered from pre–DEC-727 commit `5ffa49e53` for editorial triage. Re-labeled under DEC-727.

| Fact | Claim (short) | DEC-727 status | Labels | Next action |
|---|---|---|---|---|
| XF-001 | `expertdental.kg` publicly reachable as clinic site | `discovered` + reachability | A | Clinic: confirm if linkable from RAIMOV DENTAL |
| XF-002 | Address on clinic site: Бишкек, Киевская 88 (пер. Эркиндик) | `discovered` | A + B | Clinic: confirm canonical address + postal for patient site |
| XF-003 | Phone on clinic site: +996 555 255 455 | `discovered` | A | Clinic: confirm as public RAIMOV contact |
| XF-004 | Full name on clinic site: Раимов Атабек Саидович | `discovered` | A | Clinic: confirm display name RU/EN |
| XF-005 | Self-described role on clinic site: «Ортодонт - гнатолог, Функциональный стоматолог» | `clinic_confirmation_required` | A + D | **Not** a credential; medical review + clinic title OK |
| XF-006 | Clinic bio claims: DemMed speaker, ОртоКомьюнити, courses, «400+» works, founder of Expert brands | `unverified` / marketing | B + C (case count) + D | Split: speaking→B; OrthoCommunity→A; case count→**C** until verified |
| XF-007 | Instagram `@expert_dental_studio` reachable | `discovered` | A + E | Ownership + link policy |
| XF-008 | Instagram `@doctor_raimov` reachable (display «Атабек Саидович») | `clinic_confirmation_required` | A + E | Ownership of personal handle |
| XF-009 | Event listing: speaker Атабек Раимов @doctor_raimov, DemMed congress 2024, topic microimplants | `discovered` | A + B + D | Prefer DemMed primary program; clinic wording OK |
| XF-010 | 2GIS firm card Киевская 88 exists | `needs_manual_validation` | A + B | Clinic: confirm firm URL; **do not** publish rating |
| XF-011 | Yandex house URL used on raimovdental.com | `needs_manual_validation` | A + B | Clinic: org card URL |
| XF-012 | Google Maps search shell for Expert Dental + Kyivskaya 88 | `needs_manual_validation` | B | Need Place ID / GBP share link |
| XF-013 | YDoc directory workplace Expert Dental / Киевская 88 | `third_party_unverified` | C (reviews) / B | Directory OK for research; **no** review republication |
| XF-014 | who.ca-news.org bio / DOB | `third_party_unverified` | **C** | Exclude from patient site entirely |
| XF-015 | raimovdental.com shows RAIMOV DENTAL / Raimov System / Atabek name | `repo_reference_only` + reachability | A | Project site; medical fields still gated |
| XF-016 | Clinic `/price` shows public price examples | `discovered` | A + D | Do not copy into RAIMOV pricing without approved list |
| XF-017 | Clinic site lists named doctors (team) | `discovered` | A + E + D | Roster only after clinic consent per person |
| XF-018 | Tilda CDN images for clinic/doctors/works | `rights_pending` | **E** / C until rights | Metadata only; no Git binaries |

### Tallies (Batch 1)

| Label | Count (approx.) |
|---|---:|
| A (after clinic OK) | 14 candidates |
| B (need primary source) | 7 |
| C (never / exclude) | XF-014 + case-count part of XF-006 + review bodies |
| D (medical review) | XF-005, XF-006, XF-009, XF-016, XF-017 |
| E (rights/consent) | XF-007, XF-008, XF-017, XF-018 |
| `public_site_eligible` after this editorial | **still 0** |

---

## Batch 2 — Commit-1 local facts on `main` (8)

From current `FACT_REGISTER.csv` after DEC-727.

| Fact | Labels | Notes |
|---|---|---|
| F-001 local public name / null title | A + D | Aligns with XF-004/005 |
| F-002 Raimov System draft wording | A + D | Narrow draft; not protocol authorship proof |
| F-003 OrthoCommunity internal mention | B + A | Same as XF-006 affiliation slice |
| F-004 empty team | A + E | Same as XF-017 — keep empty until clinic |
| F-005 brand lock / Academy token | A + B | Academy program existence unproven |
| F-006 Expert Dental ↔ RAIMOV brand split | A + B | **Critical** clinic question |
| F-007 maps URLs needs_manual_validation | B | Same as XF-010–012 |
| F-008 photo rights_pending | E | Same as XF-018 / MED-001 |

---

## Hazardous materials (excluded from publication)

1. Patient review texts (clinic site, YDoc, GorodWiki).
2. DOB / age from aggregators (XF-014).
3. Outcome metrics («более 400 завершенных работ»), map ratings, follower counts as trust badges.
4. Unconfirmed personal IG as official CTA.
5. Any binary media without rights packet.
6. Asserting Expert Dental Studio **=** RAIMOV DENTAL as one legal entity without clinic writing.

---

## Gate to patient-site JSON

Transfer a fact into `site-raimovdental/src/data/*` **only if**:

1. Clinic written confirmation covers that fact ID, **and**
2. Medical review if clinical (D), **and**
3. Rights/consent if media/person (E), **and**
4. Explicit row status upgrade toward publishable in SSOT — not a bulk import of this archive.
