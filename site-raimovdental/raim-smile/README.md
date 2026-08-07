# raimsmile.com — RAIM SMILE SYSTEM (stage 1)

**Audience now:** Atabek Raimov only (private brief).  
**Goal:** obtain approval to develop / improve / change the system.  
**Not:** patient acquisition site, public marketing, or franchise offer.

## What ships

| Path | Role |
|---|---|
| `/` | Overview: essence, why (doctor / clinic / patient), 5-stage map, ask |
| `/diagnostics/` … `/follow-up/` | Deep page per stage: what / why / already / to develop |
| `styles.css` | Shared presentation styles |

## Access

- `noindex` + basic auth on origin nginx
- Credentials: same family as Stage A preview (`/etc/nginx/.htpasswd-raimsmile`, mirrored from stage-a unless rotated)
- Cloudflare may still proxy; origin enforces auth

## Deploy

```bash
# from grainee-v2 after sync
rsync -a --delete --exclude acme \
  site-raimovdental/raim-smile/ \
  /var/www/raimsmile.com/
# keep generator out of webroot if desired
rm -f /var/www/raimsmile.com/_page.js
nginx -t && systemctl reload nginx
```

## Canon

- `docs/ssot/RAIM_SMILE_SYSTEM.md`
- `docs/founder-notes/DEC-801_raim-smile-system.md`

After Atabek approval: medical review → public patient surface (separate cutover).
