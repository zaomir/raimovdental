# Public channels — discovery list (Commit 1)

**Status:** discovered / reachability-only.  
**Not:** an approved patient-site link list.  
Specialty words in third-party titles (e.g. «гнатолог») are **quoted page strings**, not verified credentials.

First / last probe batch: see `EXTERNAL_ACCESS_REPORT.md` and `evidence/http-probes.csv` (2026-07-21T13:16:48Z).

| ID | URL | Type | Status | Patient-site link? |
|---|---|---|---|---|
| CH-001 | https://www.expertdental.kg | Historical clinic website | `discovered` + `clinic_confirmation_required` for brand link to RAIMOV | No until clinic OK |
| CH-002 | https://raimovdental.com | Patient site | `discovered` (project site) | n/a |
| CH-003 | https://www.instagram.com/expert_dental_studio/ | Instagram handle | `discovered`; ownership rights pending | No until clinic OK |
| CH-004 | https://www.instagram.com/doctor_raimov/ | Instagram handle | `clinic_confirmation_required` | No |
| CH-005 | https://t.me/doctor_raimov | Telegram | `clinic_confirmation_required` | No until clinic OK |
| CH-006 | https://wa.me/996555255455 | WhatsApp deep link | `clinic_confirmation_required` (number in local config too) | No until clinic OK |
| CH-007 | https://2gis.kg/bishkek/firm/70000001089655879 | Maps firm URL | `needs_manual_validation` | No until clinic OK |
| CH-008 | Google Maps search query for Expert Dental + Kyivskaya 88 | Maps search | `needs_manual_validation` (no Place ID locked) | No |
| CH-009 | Yandex house URL from `site.ts` | Maps | `repo_reference_only` + live HTTP probe | No until clinic OK |
| CH-010 | https://ydoc.kg/bishkek/vrach/48904-raimov/ | Third-party directory | `third_party_unverified` | Reference only / no |
| CH-011 | https://who.ca-news.org/people:62637 | Aggregator bio | `third_party_unverified` | **No** (exclude PII/DOB) |
| CH-012 | https://bishkek.events/event/stomatologicheskij-kongress/ | Event listing | `discovered` | No until clinic + medical wording OK |
| CH-013 | GorodWiki reviews mirror | Third-party reviews | `third_party_unverified` | **No** |

Do not treat channel count as “N verified official sources”.
