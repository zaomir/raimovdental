# raimovdental — Cursor Agents satellite

**Purpose:** Isolated GitHub project for Cursor Agents (Desktop/Mobile/Cloud) on Expert Dental / RAIMOV DENTAL.

**Production SSOT:** [`zaomir/grainee-v2`](https://github.com/zaomir/grainee-v2) at `/var/www/grainee-v2`.  
Deploy, DNS, forms and live site always ship from **grainee-v2** `main`.

## Cursor setup (one-time)

See **[`docs/raimov/CURSOR_AGENTS_SETUP.md`](docs/raimov/CURSOR_AGENTS_SETUP.md)**.

Short version: create a Cloud Agents Environment for **`zaomir/raimovdental`**, then always pick project **raimovdental** for clinic chats.

## Flow

```
Cursor Agents (this repo)  ↔sync↔  grainee-v2  --deploy-->  raimovdental.com
```

Bidirectional sync (DEC-784) — VDS cron every 10 min or:

```bash
cd /var/www/grainee-v2
bash scripts/raimov/sync-agents-bidirectional.sh                 # dry-run
bash scripts/raimov/sync-agents-bidirectional.sh --apply --commit --push
```

## Layout

Paths mirror grainee-v2 relative roots (see `SYNC_MANIFEST.yml`).

## Hard rules

- Do not put secrets, patient PII, or unlicensed media here.
- `research/raimov-profile/evidence/**` and `site-raimovdental/src/config/pricing.ts` are protected — same gates as grainee.
- Do not deploy from this repo. Sync → grainee → existing deploy channels.

## Cold start

1. `START.md`
2. `AGENTS.md`
3. `docs/expert-clinic-reference.md`
4. `docs/projects/raimovdental/AGENTS.md`
5. `agents/manifests/raimovdental.yaml`
