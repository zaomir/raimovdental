# SOURCE_REGISTER — RAIMOV profile (Commit 1)

**Rule:** listing a path/URL here does **not** make it publishable.  
**Elevated statuses forbidden until proven:** `official_source`, `clinic_confirmed`, `source_checked` without a live open.

| ID | Object | Source | Source type | Status | Public use |
|---|---|---|---|---|---|
| SRC-LOCAL-001 | RAIMOV DENTAL brand config | `site-raimovdental/src/config/site.ts` | Local configuration | `repo_reference_only` | No — until SSOT/clinic confirm |
| SRC-LOCAL-002 | Atabek profile draft | `site-raimovdental/src/data/doctor.ru.json` | Local draft patient-site data | `repo_reference_only` | No |
| SRC-LOCAL-003 | Team page draft | `site-raimovdental/src/data/team.ru.json` | Local draft (`members: []`) | `repo_reference_only` | No |
| SRC-LOCAL-004 | Expert Dental / Instagram / maps mentions | `docs/ssot/EXPERT_DENTAL_GROWTH_OFFER.md` | Internal commercial document | `clinic_confirmation_required` | No |
| SRC-LOCAL-005 | Draft map/social URLs | `site-rovlex/config/audits/expert-dental-bishkek.json` | Draft audit JSON | `needs_manual_validation` | No |
| SRC-LOCAL-006 | Historical portrait asset reference | `site-caesthetic/private/expert-dental/atabek-portrait.jpg` (+ caesthetic manifests) | Historical repo binary | `repo_reference_only` / `rights_pending` | No |

## Notes

- **Expert Dental Studio** = historical/local brand string found in Git and on `expertdental.kg` probes.
- **RAIMOV DENTAL** = brand + canonical host in `site.ts`.
- Relationship between the two brands = `clinic_confirmation_required` (not asserted here).
- `Raimov Academy` appears as a **brand token in config**, not as a verified operating education program.
- External URLs probed in `EXTERNAL_ACCESS_REPORT.md` remain **discovered / reachability-only** until Commit 2+ with excerpts and publish gates.

## Template

See `templates/SOURCE_REGISTER.template.md` for future rows.
