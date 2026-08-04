# AGENTS.md — raimovdental Agents satellite

This repository is the **Cursor Agents** surface for the clinic.

- Knowledge domain: `healthcare-ecosystem`
- Runtime production: `zaomir/grainee-v2` → `site-raimovdental/` → raimovdental.com
- Sync: one-way into grainee-v2 via `scripts/raimov/sync-from-agents-repo.sh` (lives in monorepo)

## Read first

1. `docs/expert-clinic-reference.md`
2. `docs/projects/raimovdental/AGENTS.md`
3. `agents/manifests/raimovdental.yaml`

## Do not

- Deploy from this repo
- Invent clinic facts not in `research/raimov-profile/FACT_REGISTER.csv`
- Edit protected evidence/pricing without gates
