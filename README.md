# raimovdental — Cursor Agents satellite

**Purpose:** Isolated GitHub project for Cursor Agents (Desktop/Mobile/Cloud) on Expert Dental / RAIMOV DENTAL.

**Production SSOT:** [`zaomir/grainee-v2`](https://github.com/zaomir/grainee-v2) at `/var/www/grainee-v2`.  
Deploy, DNS, forms and live site always ship from **grainee-v2** `main`.

## Flow

```
Cursor Agents (this repo)  --sync-->  grainee-v2  --deploy-->  raimovdental.com
```

Bidirectional sync (DEC-784) — runs on VDS (cron every 10 min) or manually:

```bash
cd /var/www/grainee-v2
bash scripts/raimov/sync-agents-bidirectional.sh                 # dry-run
bash scripts/raimov/sync-agents-bidirectional.sh --apply --commit --push
```

Edits in **either** repo sync to the other. Deploy still only from grainee-v2.

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
