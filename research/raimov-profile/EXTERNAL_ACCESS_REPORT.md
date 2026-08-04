# External access report — RAIMOV profile research

Checked at: **2026-07-21T13:16:48Z**  
Environment: Cursor on VDS `/var/www/grainee-v2`  
Method: `curl -L` with research UA (no VPN, no proxy secrets, no browser cookies stored in Git)

## Purpose

Distinguish:

- what Cursor **actually opened** over the public internet;
- what was **only copied from Git / local drafts**;
- what remains **`needs_manual_validation` / `clinic_confirmation_required`**.

**HTTP success ≠ official source.** Reachability does not authorize publication, brand merger claims, medical specialty claims, or photo rights.

## Probe table (Commit 1)

Machine-readable twin: `evidence/http-probes.csv`.

| Resource | URL | Access attempted | Result | Evidence saved | Notes |
|---|---|---:|---|---|---|
| RAIMOV DENTAL | https://raimovdental.com | yes | HTTP 200 (~23 KB) | no (metadata only) | Reachability only — **not** `official_source` |
| RAIMOV DENTAL RU | https://raimovdental.com/ru/ | yes | HTTP 200 | no | Same |
| Doctor page | https://raimovdental.com/ru/atabek-raimov/ | yes | HTTP 200 (~9.5 KB) | no | Page shell live; doctor JSON still largely `pending_clinic_confirmation` / `publishable: false` |
| Expert Dental | https://www.expertdental.kg | yes | HTTP 200 (~338 KB) | no | Historical/local brand site; link to RAIMOV DENTAL = `clinic_confirmation_required` |
| Expert Dental price | http://expertdental.kg/price | yes | HTTP 200 | no | Public price page probe |
| Instagram clinic | https://www.instagram.com/expert_dental_studio/ | yes | HTTP 200 | no | Handle discovered; ownership/rights not confirmed |
| Instagram doctor handle | https://www.instagram.com/doctor_raimov/ | yes | HTTP 200 | no | Ownership = `clinic_confirmation_required` |
| 2GIS firm ID | https://2gis.kg/bishkek/firm/70000001089655879 | yes | HTTP 200 this run (prior probe also saw 403) | no | Unstable via curl UA/geo → keep `needs_manual_validation` |
| Yandex Maps house | https://yandex.com/maps/10309/bishkek/house/Y00YcAdnTEQHQFpofXR2dX9qZA%3D%3D/ | yes | HTTP 200 | no | Present in local `site.ts` contacts — **not** `clinic_confirmed` |
| Google Maps search | https://www.google.com/maps/search/Expert+Dental+Studio+Kyivskaya+88+Bishkek | yes | HTTP 200 | no | Search shell only; Place ID / listing identity not asserted |
| YDoc | https://ydoc.kg/bishkek/vrach/48904-raimov/ | yes | HTTP 200 | no | Third-party directory — `third_party_unverified` |
| CA-News who | https://who.ca-news.org/people:62637 | yes | HTTP 200 | no | Aggregator bio — `third_party_unverified` |
| Congress listing | https://bishkek.events/event/stomatologicheskij-kongress/ | yes | HTTP 200 | no | Event listing only — not a credential proof |
| Telegram preview | https://t.me/s/doctor_raimov | yes | HTTP 200 | no | Preview page; ownership `clinic_confirmation_required` |

## Codex vs Cursor

| Environment | Typical failure | Implication |
|---|---|---|
| Codex sandbox | `web.run` 401; outbound `CONNECT 403`; DNS blocks | Cannot treat Codex-local “source_checked” as internet research |
| Cursor (this host) | Most public HTTP endpoints reachable | May record **reachability**; still must not invent clinic/medical confirmation |

## What this report does **not** claim

- No `official_source` / `clinic_confirmed` elevations.
- No confirmation that Expert Dental Studio **is** the same legal entity as RAIMOV DENTAL.
- No confirmation of ВНЧС specialization, OrthoCommunity affiliation, Academy program existence, protocol authorship, team roster, or photo rights.
- No statement that HTML bodies were archived into Git (Commit 1 stores probe metadata only).

## Safe alternatives if a platform later blocks

1. Prefer clinic-owned URLs and written clinic packets over scrapers.
2. Ask clinic for PDFs/screenshots of business profiles under their control.
3. Do **not** add VPN/proxy tokens, cookies, or Instagram login sessions to the repo.
4. Do **not** change production DNS/proxy/deploy env for research.

## Compliance

No secrets, cookies, API keys, CAPTCHA bypass, or private patient materials were stored. No portrait binaries committed into this pack.
