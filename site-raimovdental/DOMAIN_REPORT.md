# Domain report: raimovdental.com

**Date:** 2026-07-20  
**Checked by:** Cursor (sequential phase before site build)  
**Action taken:** Domain NOT purchased. Production DNS/Cloudflare NOT changed.

## Verdict

| Check | Result |
|-------|--------|
| Registry WHOIS (VeriSign) | **No match** — domain appears **unregistered / available** |
| whois.vu API (2nd source) | `"available":"yes"` + same VeriSign “No match” body |
| DNS A / NS | Empty (no records) |
| HTTP / HTTPS probe | Connection failed (no live site) |
| Premium / aftermarket signal | No registrar premium flag observed; GoDaddy HTML probe returned 403 (inconclusive UI), not a sale listing |
| Brand conflict (live sites) | `saidovdental.com` / `raimov.com` probes returned no response in this environment |

**Conclusion:** `raimovdental.com` is suitable as the **planned canonical host** for config and SEO placeholders.  
**Do not buy / bind** until Total explicitly approves purchase. Site builds with `siteConfig.canonicalHost = "https://raimovdental.com"` as future target only.

## Wrong brand note

«Саидович» is a **patronymic**, not a surname. Forbidden brand strings: Saidov Dental, Saidov System, Saidov Academy, Atabek Saidov, saidovdental.com, saidovsystem.com, saidovacademy.com.

Correct: **RAIMOV DENTAL** · **RAIM SMILE SYSTEM** · **Raimov Academy** · **Atabek Raimov** · **Раимов Атабек Саидович**.

## Sources

1. `whois raimovdental.com` → VeriSign “No match for domain RAIMOVDENTAL.COM” (2026-07-20T20:12:34Z)
2. `https://api.whois.vu/?q=raimovdental.com` → `available: yes`
3. `dig` A/NS empty; curl http(s) failed
