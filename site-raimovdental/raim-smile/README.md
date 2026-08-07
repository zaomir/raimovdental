# raimsmile.com — RAIM SMILE SYSTEM landing

**Host:** `https://raimsmile.com/`  
**Canon:** `docs/ssot/RAIM_SMILE_SYSTEM.md` · DEC-801  
**Source:** `site-raimovdental/raim-smile/index.html`

## Deploy (from grainee-v2 only)

1. Point Cloudflare DNS `raimsmile.com` / `www` at the VDS (or Cloudflare Pages/static origin used for RAIMOV hosts).
2. Nginx/Fastpanel vhost document root → published `raim-smile/` dist (or symlink from release).
3. Until medical/legal gates close: keep `noindex` (already in `<meta robots>`).
4. After clinic + medical review: remove `noindex`, smoke HTTPS, WhatsApp CTA, links to Expert / raimovdental.com.

## Relationship

| Host | Role |
|---|---|
| raimsmile.com | Patient product surface for **RAIM SMILE SYSTEM** |
| raimovdental.com | Ecosystem / Atabek strategy (Stage B) |
| clinic.raimovdental.com → expertdental.kg | Operating clinic that works **by** the system |
