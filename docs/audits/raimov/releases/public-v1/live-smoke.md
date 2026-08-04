# Live smoke — Stage B public cutover (2026-07-31)

## Public
- [x] `/` → 301 `/ru/`
- [x] `/ru/` → 200 edge+origin
- [x] H1: «От клинической практики — к системе, которая масштабирует качество.»
- [x] index,follow + canonical `/ru/`
- [x] no Dmitry / Stage A / patient-hero on public home
- [x] robots Allow `/ru/`, Disallow `/stage-a/`
- [x] sitemap only `/ru/`, `/ru/privacy/`

## Investor / Academy forms
- [x] EF investor_strategy → ok id baf25d39…
- [x] EF academy_interest → ok id 7d288531…
- [x] no investment promises on page (disclaimer present)

## Stage A
- [x] 401 without auth (origin + Cloudflare)
- [x] 200 with raimov/0726
- [x] 401 wrong password
- [x] noindex + private/no-store headers

## Redirects
- [x] `/en/` 301 `/ru/`
- [x] `/ru/viniry/` 301 `/ru/`
- [x] `/ru/mezhdunarodnym-pacientam/` 410
- [x] `/ru/academy/` 301 `/ru/#academy`

Deploy SHA: `75f74b5bd94b1f9f99498b7970c5b83f3748d739`
Backup: `/root/raimovdental-cutover-backups/20260731T131508Z`
