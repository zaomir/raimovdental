# Content ↔ build contract (Lane A/B/C)

## Brand constants (never Saidov)
doctorFullRu = "Раимов Атабек Саидович"
doctorPublicRu = "Атабек Раимов"
doctorEn = "Atabek Raimov"
clinic = "RAIMOV DENTAL"
system = "RAIM SMILE SYSTEM"
academy = "Raimov Academy"

## Routes (emit both RU and EN)
See TASK brief. No /franchise, /elite-dental, /partners.

## Data files (Lane B)
- `src/data/routes.json` — path matrix + hreflang pairs
- `src/data/services.{ru,en}.json` — service pages
- `src/data/cases.{ru,en}.json` — only status verified + consentReference
- `src/data/doctor.{ru,en}.json`
- `src/data/system.{ru,en}.json`
- `src/data/home.{ru,en}.json`
- `src/data/faq.{ru,en}.json`
- `src/data/blog.{ru,en}.json` — draft OK; no fake facts
- `src/data/team.{ru,en}.json` — placeholders marked TBD
- `src/data/reviews.{ru,en}.json` — empty or verified only
- `src/content/i18n/{ru,en}.json` — UI chrome strings

## Templates (Lane A)
Must read JSON above; escape HTML; inject JSON-LD, canonical, hreflang, OG.
Home section order fixed in brief.
Palette tokens: --bg #F5F1EA, --surface #FFFDFC, --text #17211D, --green #1E4C3A, --gold #B79A67, --muted #66736D.
Fonts: Prata (display) + Manrope (body) local WOFF2 only.

## Forms (Lane C)
3-step lead → POST `/functions/v1/submit-raimovdental-lead`
Analytics: no name/phone/diagnosis/interest text to ad pixels.
Telegram: only `siteConfig.contacts.telegramDeepLink` + allowed sources.

## CTA copy

See `CTA_COPY_CONTRACT.md` — single booking phrase across hero/header/sticky/form.

## Patient-first home (2026-07-21)

Live `/` uses `home.{ru,en}.json` (not editorial home). Ecosystem content: `/ekosistema/`.

## Commercial home v2 (2026-07-21)

- Section schemas: `HOME_SECTIONS_SCHEMA.md`
- First visit product: `FIRST_VISIT_PRODUCT.md`
- Prices: only `src/config/pricing.ts` (band `first_visit` + existing bands; keep `status: "tbd"` until clinic confirms)
- Homepage keys (Lane A): `hero`, `patientGoals`, `cases`, `firstVisit`, `raimovSystem`, `doctor`, `flagshipServices`, `reviews`, `clinicGallery`, `faq`, `finalCta` — see schema file for shapes
- Case model fields: `problem`, `solution`, `stages`, `durationRange`, `result`, `beforeImages`, `afterImages`, `consentReference`, `medicalReviewer`, `reviewedAt`, `relatedServices`, `publishable`
- Review model fields: `platform`, `sourceUrl`, `publishable`
- Unpublished blocks: `publishable: false` → UI hides entirely (no TBD in user-visible copy)
- Status fields use `pending_clinic_confirmation` or `tbd` — never shown as visible copy
- AI routes remain only `/ru/text` and `/en/text`
- Indexability is **per-route** (D3 2026-07-21): patient routes `index,follow`; Academy + ecosystem stay `noindex` (see `CONTENT_REQUIRED_FROM_CLINIC.md`)

## Build
`node scripts/build-raimovdental.mjs` → `site-raimovdental/dist/`
Does NOT deploy to production.
