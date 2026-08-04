# RAIMOV_PUBLIC_PROFILE — Codex-facing public facts only

**Path (canonical for Codex):** `research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md`  
**Branch:** `main` · repo `zaomir/grainee-v2`  
**Version:** 1.0 · **Date:** 2026-07-21  
**Audience:** Codex / agents that must not invent credentials  
**Living accumulation SSOT (broader):** `docs/ssot/RAIMOV_PUBLIC_PROFILE.md` (DEC-728)  
**Clinic gate carrier:** `evidence/clinic-packet/FOUNDER_ATTESTATION.md` (2026-07-21)  
**Rights (archive):** `RIGHTS_GRANT.md` — archive OK ≠ auto patient-site media publish  

## Rules

1. This file lists **only** clinic-allowed public wording that already has evidence + publication gate.
2. Written clinic confirmation is **not** a blanket license for every discovered URL or archived binary.
3. No row may be treated as `public_ready` without **Evidence** and **Publication gate**.
4. Forbidden here: private letters, ID scans, patient data, staff personal phones, passwords, tokens, who.ca-news DOB/PII, review bodies, case-count marketing («400+»).
5. Forbidden public brands: Saidov Dental · Saidov System · Saidov Academy · Atabek Saidov.

### Status keys used below

| Key | Meaning |
|---|---|
| `clinic_written_confirmation` | Founder attestation that clinic written OK exists (lawyer archive not ingested) |
| `medical_reviewed` | Clinical wording reviewed for patient-site (meta.medicalReviewer on doctor JSON) |
| `public_site_eligible` | May appear on `raimovdental.com` patient surfaces |
| `public_ready` | All required fields present **and** `public_site_eligible: true` |
| `archive_only` | May live in research pack; not patient-site |

---

## 1. Identity

### F-ID-001 — Full legal-style name (RU)

| Field | Content |
|---|---|
| Public wording (RU) | Раимов Атабек Саидович |
| Public wording (EN) | Atabek Raimov *(public short form; EN full patronymic not asserted)* |
| Evidence | https://www.expertdental.kg (doctor card) · `site-raimovdental/src/data/doctor.ru.json` `fullName` · `clinic_written_confirmation` 2026-07-21 |
| Review | n/a (identity string) |
| Publication gate | `public_site_eligible: true` |
| Media | n/a |
| Status | `public_ready` |

### F-ID-002 — Public display name

| Field | Content |
|---|---|
| Public wording (RU) | Атабек Раимов |
| Public wording (EN) | Atabek Raimov |
| Evidence | `doctor.ru.json` `publicName` · `site-raimovdental/src/config/site.ts` brand · `clinic_written_confirmation` 2026-07-21 |
| Review | n/a |
| Publication gate | `public_site_eligible: true` |
| Media | n/a |
| Status | `public_ready` |

---

## 2. Approved role & biography blocks

### F-ROLE-001 — Role title

| Field | Content |
|---|---|
| Public wording (RU) | Ортодонт-гнатолог, функциональный стоматолог · основатель RAIMOV DENTAL |
| Public wording (EN) | *(no separate EN title locked in this pack; use RU until EN copy is extracted)* |
| Evidence | `doctor.ru.json` `role` · Expertdental doctor-card wording · `clinic_written_confirmation` 2026-07-21 (`FOUNDER_ATTESTATION.md`) |
| Review | `medical_reviewed` (doctor meta `medicalReviewer: clinic_attested_2026-07-21`) |
| Publication gate | `public_site_eligible: true` |
| Media | n/a |
| Status | `public_ready` |

### F-ROLE-002 — Specializations (list)

| Field | Content |
|---|---|
| Public wording (RU) | Ортодонтия; Гнатология; Функциональная стоматология |
| Public wording (EN) | Orthodontics; Gnathology; Functional dentistry *(parallel labels; not a separate EN medical dossier)* |
| Evidence | `doctor.ru.json` `specializations.items` · expertdental.kg card · `clinic_written_confirmation` 2026-07-21 |
| Review | `medical_reviewed` |
| Publication gate | `public_site_eligible: true` |
| Media | n/a |
| Status | `public_ready` |

### F-BIO-001 — Clinical philosophy

| Field | Content |
|---|---|
| Public wording (RU) | Лечение строится на точной диагностике, междисциплинарном плане и долгосрочном наблюдении — без обещаний результата до осмотра. |
| Public wording (EN) | *(not locked)* |
| Evidence | `doctor.ru.json` `clinicalPhilosophy` · `clinic_written_confirmation` 2026-07-21 |
| Review | `medical_reviewed` |
| Publication gate | `public_site_eligible: true` |
| Media | n/a |
| Status | `public_ready` |

### F-BIO-002 — Focus areas (patient-facing directions)

| Field | Content |
|---|---|
| Public wording (RU) | Комплексная диагностика и планирование; Виниры и эстетика улыбки; Имплантация и протезирование; Ортодонтия для взрослых; Полное восстановление зубов |
| Public wording (EN) | *(not locked as separate EN medical list)* |
| Evidence | `doctor.ru.json` `focusAreas` · `clinic_written_confirmation` 2026-07-21 |
| Review | `medical_reviewed` |
| Publication gate | `public_site_eligible: true` |
| Media | n/a |
| Status | `public_ready` |

### F-BIO-003 — Raimov System (approved patient wording)

| Field | Content |
|---|---|
| Public wording (RU) | Raimov System — пациентская и клиническая система RAIMOV DENTAL: диагностика, проектирование результата, консилиум, поэтапный план и наблюдение. Без франшизы и коммерческих условий ELITE DENTAL. |
| Public wording (EN) | *(not locked)* |
| Evidence | `doctor.ru.json` `raimovSystemRole` · `clinic_written_confirmation` 2026-07-21 |
| Review | `medical_reviewed` |
| Publication gate | `public_site_eligible: true` |
| Media | n/a |
| Status | `public_ready` |

### Explicitly NOT public_ready (still blocked)

| Topic | Why | Gate |
|---|---|---|
| Education institution/year list | Lawyer archive not extracted | `public_site_eligible: false` |
| Certificate inventory / scans | Not ingested | `public_site_eligible: false` |
| Portrait / clinic photo on patient-site | Media rows `public_site_eligible: false` (archive OK only) | `public_site_eligible: false` |
| Outcome metrics («400+ работ») | Marketing / excluded | `public_site_eligible: false` |
| Legal entity registration numbers | Counsel archive only | `public_site_eligible: false` |
| Raimov Academy as running education program | Brand token only; no program proof | `public_site_eligible: false` for “program exists” claims |

---

## 3. Public team (patient-site)

### F-TEAM-001 — Lead doctor (only published roster row)

| Field | Content |
|---|---|
| Public wording (RU) | Атабек Раимов — Ортодонт-гнатолог, функциональный стоматолог · основатель RAIMOV DENTAL · профиль `/ru/atabek-raimov/` |
| Public wording (EN) | Atabek Raimov — lead doctor · `/en/atabek-raimov/` *(role EN not separately locked)* |
| Evidence | `site-raimovdental/src/data/team.ru.json` `leadDoctor` · `members: []` · `clinic_written_confirmation` 2026-07-21 |
| Review | `medical_reviewed` (role string) |
| Publication gate | `public_site_eligible: true` (lead only) |
| Media | photo = `null` · no asset ID published |
| Status | `public_ready` (lead card without photo) |

### F-TEAM-002 — Extended roster

| Field | Content |
|---|---|
| Public wording (RU) | Расширенный состав специалистов публикуется по мере извлечения персональных согласий из подтверждённого пакета клиники. |
| Evidence | `team.ru.json` `intro.body` · `FOUNDER_ATTESTATION.md` (named `members[]` blocked) |
| Review | n/a |
| Publication gate | `public_site_eligible: true` *(placeholder copy only)* |
| Media | n/a |
| Status | `public_ready` (empty roster statement) |

**Discovered on expertdental.kg but NOT public_site_eligible for RAIMOV DENTAL** (no per-person consent extract): TM-002…TM-008 — see `docs/ssot/RAIMOV_PUBLIC_PROFILE.md` §7.2 / research registers. Do not copy names into patient-site from this profile alone.

---

## 4. Official channels (patient-facing)

| ID | Channel | Public wording / URL | Evidence | Review | Publication gate | Status |
|---|---|---|---|---|---|---|
| F-CH-001 | Patient site | https://raimovdental.com | live site · `site.ts` `canonicalHost` | n/a | `public_site_eligible: true` | `public_ready` |
| F-CH-002 | Doctor profile | https://raimovdental.com/ru/atabek-raimov/ | doctor JSON `path` · live HTTP 200 | `medical_reviewed` | `public_site_eligible: true` | `public_ready` |
| F-CH-003 | Phone / WhatsApp | +996 555 255 455 · https://wa.me/996555255455 | `site.ts` contacts · expertdental.kg · `clinic_written_confirmation` | n/a | `public_site_eligible: true` | `public_ready` |
| F-CH-004 | Address | г. Бишкек, ул. Киевская, 88 / 88 Kyiv Street, Bishkek | `site.ts` · expertdental.kg · attestation | n/a | `public_site_eligible: true` | `public_ready` |
| F-CH-005 | Hours | По предварительной записи / By appointment | `site.ts` | n/a | `public_site_eligible: true` | `public_ready` |
| F-CH-006 | Telegram (site CTA) | https://t.me/doctor_raimov | `site.ts` `telegramDeepLink` · attestation unlocked contacts | n/a | `public_site_eligible: true` | `public_ready` |
| F-CH-007 | Maps (Yandex house) | URL in `site.ts` `mapsUrl` | `site.ts` · probe in `EXTERNAL_ACCESS_REPORT.md` | n/a | `public_site_eligible: true` | `public_ready` |
| F-CH-008 | Related brand site | Expert Dental Studio — https://www.expertdental.kg | expertdental.kg · attestation ENT-003 patient-facing brand link | n/a | `public_site_eligible: true` *(related brand link; not legal-entity identity claim)* | `public_ready` |
| F-CH-009 | Instagram clinic | https://www.instagram.com/expert_dental_studio/ | discovered + rights grant for research | n/a | `public_site_eligible: false` until brand-link policy row upgraded in patient JSON | **not** `public_ready` |
| F-CH-010 | Instagram doctor | https://www.instagram.com/doctor_raimov/ | discovered; speaking listing uses handle | n/a | `public_site_eligible: false` as ownership proof | **not** `public_ready` |
| F-CH-011 | 2GIS firm | https://2gis.kg/bishkek/firm/70000001089655879 | probe unstable via curl | n/a | `public_site_eligible: false` until manual card validation | **not** `public_ready` |

---

## 5. Allowed clinical / speaking formulations

### F-CLIN-001 — Specialization labels

Same as **F-ROLE-002**. Do not expand to ВНЧС outcome claims, “author of diagnostic protocol” beyond **F-BIO-003**, or Academy-as-program.

### F-SPK-001 — DemMed congress listing

| Field | Content |
|---|---|
| Public wording (RU) | Спикер: Атабек Раимов (@doctor_raimov). Тема: «Микроимпланты в ортодонтии (минивинты)». Событие: Стоматологический конгресс DemMed. Даты (как в listing): Ош 16.03.2024 / Бишкек 30.03.2024. |
| Public wording (EN) | Speaker listing Atabek Raimov — topic Microimplants in orthodontics (miniscrews); DemMed congress; dates as listed. |
| Evidence | https://bishkek.events/event/stomatologicheskij-kongress/ · `SPEAKING_REGISTER.md` SPK-001 · `evidence/excerpts/speaking-demmed-congress-2024.md` · `doctor.ru.json` `speaking` · `clinic_written_confirmation` 2026-07-21 |
| Review | `medical_reviewed` (topic string as published on patient site) |
| Publication gate | `public_site_eligible: true` |
| Media | n/a (listing URL only; primary PDF = SPK-002 not retrieved) |
| Status | `public_ready` |

---

## 6. Media & consent (no public_ready elevation without row)

Archive rights confirmed 2026-07-21 (`RIGHTS_GRANT.md`). **Patient-site photo remains gated.**

| Asset ID | Subject | Rights owner | Usage rights | Consent | `public_site_eligible` | Notes |
|---|---|---|---|---|---|---|
| MED-PORTRAIT-001…004 | claimed Atabek Raimov portraits / hero | `clinic_granted_via_founder_instruction` | `clinic_granted_2026-07-21` (archive) | model-release extract **not** in Git | **false** | `MEDIA_MANIFEST.json`; archive OK |
| MED-ED-* | clinic/team assets from expertdental / Tilda | same grant | archive | per-person consent extract **not** in Git | **false** | do not promote to patient-site |
| doctor.ru.json `photo` | — | — | — | — | **false** | `src: null` |

**Rule:** missing Evidence or gate → do **not** mark `public_ready`.

---

## 7. Source ID index (facts added in this file)

| Fact ID | Source IDs / carriers |
|---|---|
| F-ID-001…002 | SRC: expertdental.kg · doctor.ru.json · site.ts · FOUNDER_ATTESTATION |
| F-ROLE-001…002 | same + medical meta on doctor JSON |
| F-BIO-001…003 | doctor.ru.json · FOUNDER_ATTESTATION |
| F-TEAM-001…002 | team.ru.json · FOUNDER_ATTESTATION |
| F-CH-001…008 | site.ts · expertdental.kg · FOUNDER_ATTESTATION · EXTERNAL_ACCESS_REPORT |
| F-SPK-001 | SPEAKING_REGISTER SPK-001 · bishkek.events · doctor.ru.json speaking |
| Media table | MEDIA_MANIFEST.json · RIGHTS_GRANT.md |

Detail / discovery rows that are **not** public_ready remain in `docs/ssot/RAIMOV_PUBLIC_PROFILE.md` and the research registers.

---

## 8. How Codex should read this

```bash
git fetch origin main
git rev-parse origin/main
git show origin/main:research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md | head
```

If GitHub network is blocked in sandbox: use GitHub MCP `get_file_contents` with `ref=main` / `branch=main`, or evo.do SSOT snapshot when that path is included in the manifest. Do **not** request PATs, cookies, VPN, or production shell for this file.

Handoff matrix: `research/raimov-profile/evidence/CODEX_ACCESS_HANDOFF.md`.

---

*Codex public profile v1.0 · 2026-07-21 · clinic-attested subset only · not a dump of all discovered URLs*
