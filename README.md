# raimovdental — Cursor Agents satellite

**Purpose:** Isolated GitHub project for Cursor Agents (Desktop/Mobile/Cloud) on Expert Dental / RAIMOV DENTAL.

**Production SSOT:** [`zaomir/grainee-v2`](https://github.com/zaomir/grainee-v2) at `/var/www/grainee-v2`.  
Deploy, DNS, forms and live site always ship from **grainee-v2** `main`.

## Flow

```
Cursor Agents (this repo)  --sync-->  grainee-v2  --deploy-->  raimovdental.com
```

One-way sync script (runs on VDS inside grainee-v2):

```bash
cd /var/www/grainee-v2
bash scripts/raimov/sync-from-agents-repo.sh          # dry preview
bash scripts/raimov/sync-from-agents-repo.sh --apply  # copy into monorepo
bash scripts/raimov/sync-from-agents-repo.sh --apply --commit --push
```

Re-seed this satellite from monorepo (when grainee is ahead):

```bash
bash scripts/raimov/seed-agents-repo.sh --apply --push
```

## Layout

Paths mirror grainee-v2 relative roots (see `SYNC_MANIFEST.yml`).

## Hard rules

- Do not put secrets, patient PII, or unlicensed media here.
- `research/raimov-profile/evidence/**` and `site-raimovdental/src/config/pricing.ts` are protected — same gates as grainee.
- Do not deploy from this repo. Sync → grainee → existing deploy channels.

## Cold start

1. Read `docs/expert-clinic-reference.md`
2. Read `docs/projects/raimovdental/AGENTS.md`
3. Read `agents/manifests/raimovdental.yaml`
