---
owner: Engineering + Release
status: active — Stage B public cutover (DEC-772)
project: RAIMOVDENTAL
updated: 2026-07-31
standard: docs/ssot/WEBSITE_STUDIO_STANDARD.md
decisions:
  - docs/founder-notes/DEC-772_raimovdental-public-stage-b-cutover.md
  - docs/founder-notes/DEC-742_raimovdental-investor-first-website-strategy.md
scope: inventory of legacy patient-first URLs → Stage B public IA
---

# LEGACY_ROUTE_MAP — RAIMOV DENTAL public replacement

Patient-first catalog is replaced by compact Stage B (`/ru/`). Every former public URL has an explicit disposition. `/stage-a/` is unchanged (protected preview, not in this map as a migration target).

## Public Stage B targets

| URL | Disposition |
|---|---|
| `/` | 301 → `/ru/` |
| `/ru/` | Keep — new Stage B homepage (index,follow) |
| `/ru/privacy/` | Keep — privacy for lead forms |
| `/404.html` | Keep — branded 404 |
| `/stage-a/` | Preserve Basic Auth preview (separate webroot) |

## Inventory

| Current URL | New URL / action | Code | Reason | Smoke expectation |
|---|---|---|---:|---|
| `/` | `/ru/` | 301 | Canonical entry | Location `/ru/` |
| `/ru/` | `/ru/` | keep | Stage B home | 200, index,follow, new H1 |
| `/en/` | `/ru/` | 301 | RU-only v1 | 301 → `/ru/` |
| `/ru/ekosistema/` | `/ru/#trajectory` | 301 | Ecosystem story on home | 301 |
| `/en/ecosystem/` | `/ru/#trajectory` | 301 | EN legacy | 301 |
| `/ru/kompleksnaya-diagnostika/` | `/ru/` | 301 | Patient service deferred to Stage C | 301 |
| `/en/comprehensive-diagnostics/` | `/ru/` | 301 | EN legacy | 301 |
| `/ru/viniry/` | `/ru/` | 301 | Patient service deferred | 301 |
| `/en/veneers/` | `/ru/` | 301 | EN legacy | 301 |
| `/ru/implantaciya/` | `/ru/` | 301 | Patient service deferred | 301 |
| `/en/dental-implants/` | `/ru/` | 301 | EN legacy | 301 |
| `/ru/polnoe-vosstanovlenie-zubov/` | `/ru/` | 301 | Patient service deferred | 301 |
| `/en/full-mouth-reconstruction/` | `/ru/` | 301 | EN legacy | 301 |
| `/ru/ortodontiya-dlya-vzroslyh/` | `/ru/` | 301 | Patient service deferred | 301 |
| `/en/adult-orthodontics/` | `/ru/` | 301 | EN legacy | 301 |
| `/ru/atabek-raimov/` | `/ru/#role` | 301 | Role narrative on home | 301 |
| `/en/atabek-raimov/` | `/ru/#role` | 301 | EN legacy | 301 |
| `/ru/raimov-system/` | `/ru/#system` | 301 | System section on home | 301 |
| `/en/raimov-system/` | `/ru/#system` | 301 | EN legacy | 301 |
| `/ru/academy/` | `/ru/#academy` | 301 | Academy interest on home | 301 |
| `/en/academy/` | `/ru/#academy` | 301 | EN legacy | 301 |
| `/ru/mezhdunarodnym-pacientam/` | — | 410 | Medical tourism to Bishkek removed | 410 |
| `/en/international-patients/` | — | 410 | Medical tourism removed | 410 |
| `/ru/o-klinike/` | `/ru/#today` | 301 | Starting point on home | 301 |
| `/en/about/` | `/ru/#today` | 301 | EN legacy | 301 |
| `/ru/kontakty/` | `/ru/#cta` | 301 | Contact via strategic CTAs | 301 |
| `/en/contact/` | `/ru/#cta` | 301 | EN legacy | 301 |
| `/ru/privacy/` | `/ru/privacy/` | keep | New consent surface | 200 |
| `/stage-a/` | `/stage-a/` | keep | Protected Stage A | 401 without auth; 200 with auth |
| `/render/` | `/render/` | keep | Private admin UX | noindex |
| Unknown paths | `/404.html` | 404 | Branded not found | 404 body |

## Implementation

Nginx exact `location =` blocks in:

- `deploy/nginx/raimovdental.com.conf`
- `deploy/nginx/raimovdental.com.http.conf`

No blanket `/en/*` catch-all: only inventoried routes are redirected.

## Rollback

Restore previous webroot + previous nginx vhost from timestamped cutover backup. Redirect map rolls back with the vhost.
