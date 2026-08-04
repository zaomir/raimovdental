# docs/expert-clinic-reference.md — entry shim (Expert Dental / RAIMOV DENTAL)

**Not a second SSOT.** Do not paste catalogs here — link the canonical chain below (DEC-757 token economy).
Used as the pinned context source for the "Expert Dental / RAIMOV DENTAL" Claude Project.

Project id: `raimovdental` · domain: `healthcare-ecosystem` · repo: `zaomir/grainee-v2` · branch `main`.

## Cold start (run this first, every chat)

```bash
cd /var/www/grainee-v2 && git pull --ff-only origin main
node scripts/repo/agent-context.mjs raimovdental
```

Read only the `read_first` files it returns — do not open the full `docs/ssot/RAIMOV.md` catalog unless the task needs a specific row.

## If the script is unavailable, read directly (in order)

1. [`docs/projects/raimovdental/AGENTS.md`](docs/projects/raimovdental/AGENTS.md) — purpose, allowed paths, bans, Definition of Done
2. [`agents/manifests/raimovdental.yaml`](agents/manifests/raimovdental.yaml) — machine manifest: topics, protected paths, commands
3. [`docs/projects/raimovdental/ROUTER.md`](docs/projects/raimovdental/ROUTER.md) — routing to deeper docs

Deeper index (open on demand, not by default): [`docs/ssot/RAIMOV.md`](docs/ssot/RAIMOV.md) — master file map, statuses, gaps.

## Hard rules (do not violate regardless of task)

- `research/raimov-profile/evidence/**` — protected, rights/source-gated, do not edit without rights check
- `site-raimovdental/src/config/pricing.ts` — protected, no change without clinic written confirmation
- Clinic facts: only rows confirmed in [`research/raimov-profile/FACT_REGISTER.csv`](research/raimov-profile/FACT_REGISTER.csv); `pending_clinic_confirmation` = unknown — never invent
- No patient-identifiable data, no unlicensed media, no franchise/investment offer without legal gate (see `docs/ssot/RAIMOV_LEGAL_GATES.md`)

---

## Cursor Agents satellite (DEC-783)

- **Agents project (Mobile/Cloud):** [`zaomir/raimovdental`](https://github.com/zaomir/raimovdental) — open this repo in Cursor Agents for clinic-only chats.
- **Production SSOT:** this monorepo (`zaomir/grainee-v2`).
- **Sync into monorepo:** `bash scripts/raimov/sync-from-agents-repo.sh --apply --commit --push`
- **Re-seed Agents from monorepo:** `bash scripts/raimov/seed-agents-repo.sh --apply --push`
- Desktop IDE isolation without Cloud Agents: `raimovdental.code-workspace`

*Shim only — full catalog lives in `docs/ssot/RAIMOV.md` and `docs/projects/raimovdental/ROUTER.md`. Last updated 2026-08-04.*
