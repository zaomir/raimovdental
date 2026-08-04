# PRODUCTION CUTOVER — RAIMOV DENTAL Stage B public v1

UTC timestamp: **2026-07-31T13:15:08Z** (backup stamp) / deploy completed ~13:15:26Z

| Field | Value |
|---|---|
| Source / merge SHA | `75f74b5bd94b1f9f99498b7970c5b83f3748d739` |
| Deploy SHA | `75f74b5bd94b1f9f99498b7970c5b83f3748d739` (written to `/var/www/raimovdental.com/.deploy-sha`) |
| PR | https://github.com/zaomir/grainee-v2/pull/570 |
| Decision | DEC-772 |
| Backup path | `/root/raimovdental-cutover-backups/20260731T131508Z` |
| Rollback path | restore `$BACKUP/webroot/` → `/var/www/raimovdental.com/`; restore nginx vhost from `$BACKUP/nginx/`; restore Stage A snippet/htpasswd; `nginx -t && systemctl reload nginx` |

## Live routes

| Check | Result |
|---|---|
| `https://raimovdental.com/` | 301 → `/ru/` |
| `https://raimovdental.com/ru/` | 200, index,follow, new H1 |
| `https://raimovdental.com/ru/privacy/` | 200 |
| `/en/` | 301 → `/ru/` |
| `/ru/viniry/` | 301 → `/ru/` |
| `/ru/mezhdunarodnym-pacientam/` | 410 |
| `/ru/academy/` | 301 → `/ru/#academy` |

## Forms

| Lead type | Smoke id | Result |
|---|---|---|
| `investor_strategy` | `baf25d39-7f34-41e1-ab05-48fdc3aff8ef` | ok |
| `academy_interest` | `7d288531-8650-450c-9e6c-ecc0ab62b7f4` | ok |

EF: `submit-raimovdental-lead` redeployed. Migration `20260731140000_raimovdental_stage_b_leads.sql` applied.

## Stage A

| Check | Result |
|---|---|
| no auth | 401 + WWW-Authenticate |
| raimov / 0726 | 200 |
| wrong password | 401 |
| X-Robots-Tag | noindex, nofollow, noarchive, nosnippet |
| Cache-Control | private, no-store… |
| sitemap/nav | absent |

## robots / sitemap

Origin robots Disallow `/stage-a/`; sitemap contains only `/ru/` and `/ru/privacy/`. Cloudflare managed Content-Signal preamble may prepend; project rules remain.

## Guards (pre-merge)

- website-studio.mjs PASS
- check-project raimovdental PASS
- repo-check PASS
- npm run test:raimovdental PASS (axe included)

## Screenshots

`docs/audits/raimov/releases/public-v1/`
