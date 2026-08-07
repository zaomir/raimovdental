# Healthcare Ecosystem — PROJECT_STATUS

**Last updated:** 2026-07-31  
**Status:** active  
**Phase:** RAIMOV Stage B public live (DEC-772); Stage A protected; Atabek public-model review next

## Summary

RAIMOV DENTAL Stage B public strategic platform is live at `https://raimovdental.com/ru/` (RU-only, investor → Academy hierarchy). Stage A remains protected at `/stage-a/`. Stage C patient contour is deferred.

Evidence: `docs/audits/raimov/releases/public-v1/PRODUCTION_CUTOVER.md`.

## Operating snapshot

| Brand / unit | Status |
|---|---|
| Expert Dental Studio | operating clinic in Bishkek |
| RAIMOV DENTAL | master brand; Stage B public live; Stage A protected |
| Atabek Raimov practice | current clinical foundation |
| RAIM SMILE SYSTEM | forming / being documented |
| Raimov Academy | next phase (interest form only) |
| Own RAIMOV DENTAL clinics | future growth line; strategic conversation CTA |
| International practice | five-year perspective; not operating product |
| ELITE DENTAL | future separate model; no public offer |
| Dmitry / ROVLEX / CAESTHETIC | strategy partner; not named on public Stage B |

## Decisions and gates

- DEC-742 fixed the future investor-first public direction.
- DEC-743 fixed Stage A as Dmitry's strategic presentation for Atabek.
- Gate 0A — CLOSED.
- Gate 1A — PASS: compact one-route Site Map.
- Gate 2A — PASS: design thesis, anti-attributes and strategic-axis visual signature.
- Gate 3A — PASS: `DESIGN.md`, tokens, components/states and QA Manifest.
- Gate 4A source — PASS: representative page, screenshots and automated evidence; score `94/100`.
- Protected preview access gate — PASS: Basic Auth, noindex/no-store, origin/edge smoke and rollback.
- Public Stage B — OPEN: separate Atabek decision, investor legal review and public proof.
- Patient Stage C — DEFERRED: case-level evidence, consent, medical review, CRM/SLA and capacity.
- Gate 6 public cutover — OPEN: migration, legal/privacy, SEO, security, forms and rollback.

## Stage A evidence

- `site-raimovdental/stage-a/`
- `site-raimovdental/DESIGN.md`
- `site-raimovdental/docs/SITE_MAP.md`
- `site-raimovdental/docs/QA_MANIFEST.md`
- `docs/audits/raimov/releases/stage-a/`
- `tests/raimov/stage-a-representative.mjs`
- `tests/raimov/stage-a-preview-package.mjs`
- `scripts/raimov/deploy-stage-a-preview.sh`

Source browser gate: Axe 0 violations, 0 KB client JS, 0 third-party requests, CLS `0.0478`, 320/390/reduced-motion PASS.

Protected delivery: `https://raimovdental.com/stage-a/`; unauthenticated `401`; authenticated page/assets `200`; public `/ru/` remains `200` without preview authentication.

## Next steps

1. Dmitry retrieves the credentials directly from the VDS administrative channel.
2. Present Stage A to Atabek.
3. Record `accept / change / defer` decisions.
4. Decide whether and how to proceed to public Stage B.
5. Keep patient/case work deferred until Stage C readiness.

## Explicit boundary

The protected preview does not authorise public investor forms, investment terms, patient case systems, Academy launch, sitemap/navigation inclusion, removal of authentication or public cutover. Existing public RU/EN content remains outside this Stage A delivery.

---

*Healthcare Ecosystem status · 2026-07-24 · protected Stage A ready for presentation; public release remains separately gated.*
